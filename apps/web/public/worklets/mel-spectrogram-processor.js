// public/worklets/mel-spectrogram-processor.js
/**
 * Real-Time 80-Bin Log-Mel Spectrogram & F0 Pitch Extractor
 * Runs inside Web Audio API AudioWorkletGlobalScope (Zero Main-Thread Blocking)
 * Sample Rate: 16000 Hz | Frame Length: 25ms (400 samples) | Hop Length: 10ms (160 samples) | FFT: 512
 */

class MelSpectrogramProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.sampleRateHz = 16000;
    this.frameLength = 400; // 25ms at 16kHz
    this.hopLength = 160;   // 10ms at 16kHz
    this.fftSize = 512;
    this.numMelBins = 80;
    this.preEmphasis = 0.97;

    this.ringBuffer = new Float32Array(this.fftSize * 4);
    this.writeIndex = 0;
    this.bufferedSamples = 0;
    this.prevSample = 0;

    this.hannWindow = this.createHannWindow(this.frameLength);
    this.melFilterbank = this.createMelFilterbank(
      this.fftSize,
      this.sampleRateHz,
      this.numMelBins,
      80.0,
      7600.0
    );

    // Batch frames before posting to Worker to minimize postMessage overhead (every 8 frames = 80ms)
    this.batchSize = 8;
    this.melBatch = new Float32Array(this.batchSize * this.numMelBins);
    this.pitchBatch = new Float32Array(this.batchSize);
    this.rmsBatch = new Float32Array(this.batchSize);
    this.currentBatchCount = 0;
  }

  createHannWindow(length) {
    const win = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      win[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (length - 1)));
    }
    return win;
  }

  hzToMel(hz) {
    return 2595.0 * Math.log10(1.0 + hz / 700.0);
  }

  melToHz(mel) {
    return 700.0 * (Math.pow(10.0, mel / 2595.0) - 1.0);
  }

  createMelFilterbank(fftSize, sampleRate, numBins, fMin, fMax) {
    const numFftBins = Math.floor(fftSize / 2) + 1;
    const melMin = this.hzToMel(fMin);
    const melMax = this.hzToMel(fMax);
    const melPoints = new Float32Array(numBins + 2);

    for (let i = 0; i < numBins + 2; i++) {
      melPoints[i] = melMin + ((melMax - melMin) * i) / (numBins + 1);
    }

    const binFreqs = new Int32Array(numBins + 2);
    for (let i = 0; i < numBins + 2; i++) {
      const hz = this.melToHz(melPoints[i]);
      binFreqs[i] = Math.floor(((fftSize + 1) * hz) / sampleRate);
    }

    const filters = [];
    for (let m = 1; m <= numBins; m++) {
      const filter = new Float32Array(numFftBins);
      const fLeft = binFreqs[m - 1];
      const fCenter = binFreqs[m];
      const fRight = binFreqs[m + 1];

      for (let k = fLeft; k < fCenter; k++) {
        if (k >= 0 && k < numFftBins && fCenter > fLeft) {
          filter[k] = (k - fLeft) / (fCenter - fLeft);
        }
      }
      for (let k = fCenter; k <= fRight; k++) {
        if (k >= 0 && k < numFftBins && fRight > fCenter) {
          filter[k] = (fRight - k) / (fRight - fCenter);
        }
      }
      filters.push(filter);
    }
    return filters;
  }

  // In-place Radix-2 Cooley-Tukey FFT
  computeFFT(real, imag) {
    const n = real.length;
    let j = 0;
    for (let i = 0; i < n; i++) {
      if (i < j) {
        const tr = real[j];
        const ti = imag[j];
        real[j] = real[i];
        imag[j] = imag[i];
        real[i] = tr;
        imag[i] = ti;
      }
      let m = n >> 1;
      while (m >= 1 && j >= m) {
        j -= m;
        m >>= 1;
      }
      j += m;
    }

    for (let s = 1; (1 << s) <= n; s++) {
      const m = 1 << s;
      const halfM = m >> 1;
      const theta = (-2 * Math.PI) / m;
      const wStepReal = Math.cos(theta);
      const wStepImag = Math.sin(theta);

      for (let k = 0; k < n; k += m) {
        let wReal = 1.0;
        let wImag = 0.0;
        for (let mIdx = 0; mIdx < halfM; mIdx++) {
          const tReal =
            wReal * real[k + mIdx + halfM] - wImag * imag[k + mIdx + halfM];
          const tImag =
            wReal * imag[k + mIdx + halfM] + wImag * real[k + mIdx + halfM];
          const uReal = real[k + mIdx];
          const uImag = imag[k + mIdx];

          real[k + mIdx] = uReal + tReal;
          imag[k + mIdx] = uImag + tImag;
          real[k + mIdx + halfM] = uReal - tReal;
          imag[k + mIdx + halfM] = uImag - tImag;

          const nextWReal = wReal * wStepReal - wImag * wStepImag;
          wImag = wReal * wStepImag + wImag * wStepReal;
          wReal = nextWReal;
        }
      }
    }
  }

  // Autocorrelation F0 Pitch Estimation (75 Hz - 450 Hz human voice range)
  estimatePitchF0(frame, rms) {
    if (rms < 0.012) return 0; // Unvoiced / Silence
    const minLag = Math.floor(this.sampleRateHz / 450);
    const maxLag = Math.floor(this.sampleRateHz / 75);

    let maxCorr = 0;
    let bestLag = 0;

    for (let lag = minLag; lag <= maxLag; lag++) {
      let sum = 0;
      for (let i = 0; i < frame.length - lag; i++) {
        sum += frame[i] * frame[i + lag];
      }
      if (sum > maxCorr) {
        maxCorr = sum;
        bestLag = lag;
      }
    }

    return bestLag > 0 ? this.sampleRateHz / bestLag : 0;
  }

  processFrame(rawFrame) {
    const real = new Float32Array(this.fftSize);
    const imag = new Float32Array(this.fftSize);

    let sumSquares = 0;
    for (let i = 0; i < this.frameLength; i++) {
      const sample = rawFrame[i];
      sumSquares += sample * sample;
      // Apply Pre-emphasis + Hann Window
      const emphasized = sample - this.preEmphasis * this.prevSample;
      this.prevSample = sample;
      real[i] = emphasized * this.hannWindow[i];
    }
    const rms = Math.sqrt(sumSquares / this.frameLength);
    const pitchHz = this.estimatePitchF0(rawFrame, rms);

    this.computeFFT(real, imag);

    const numFftBins = Math.floor(this.fftSize / 2) + 1;
    const powerSpectrum = new Float32Array(numFftBins);
    for (let k = 0; k < numFftBins; k++) {
      powerSpectrum[k] =
        (real[k] * real[k] + imag[k] * imag[k]) / this.fftSize;
    }

    const offset = this.currentBatchCount * this.numMelBins;
    for (let m = 0; m < this.numMelBins; m++) {
      const filter = this.melFilterbank[m];
      let energy = 0.0;
      for (let k = 0; k < numFftBins; k++) {
        energy += powerSpectrum[k] * filter[k];
      }
      this.melBatch[offset + m] = Math.log(Math.max(energy, 1e-10));
    }

    this.pitchBatch[this.currentBatchCount] = pitchHz;
    this.rmsBatch[this.currentBatchCount] = rms;
    this.currentBatchCount++;

    if (this.currentBatchCount >= this.batchSize) {
      const melOut = new Float32Array(this.melBatch);
      const pitchOut = new Float32Array(this.pitchBatch);
      const rmsOut = new Float32Array(this.rmsBatch);

      this.port.postMessage(
        {
          type: 'SPECTROGRAM_CHUNK',
          melFrames: melOut,
          pitchFrames: pitchOut,
          rmsFrames: rmsOut,
          frameCount: this.batchSize,
          numBins: this.numMelBins,
        },
        [melOut.buffer, pitchOut.buffer, rmsOut.buffer]
      );
      this.currentBatchCount = 0;
    }
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    const channelData = input[0];

    for (let i = 0; i < channelData.length; i++) {
      this.ringBuffer[this.writeIndex] = channelData[i];
      this.writeIndex = (this.writeIndex + 1) % this.ringBuffer.length;
      this.bufferedSamples++;

      if (this.bufferedSamples >= this.frameLength) {
        const frame = new Float32Array(this.frameLength);
        const startIdx =
          (this.writeIndex - this.frameLength + this.ringBuffer.length) %
          this.ringBuffer.length;
        for (let j = 0; j < this.frameLength; j++) {
          frame[j] = this.ringBuffer[(startIdx + j) % this.ringBuffer.length];
        }
        this.processFrame(frame);
        this.bufferedSamples -= this.hopLength;
      }
    }
    return true;
  }
}

registerProcessor('mel-spectrogram-processor', MelSpectrogramProcessor);
