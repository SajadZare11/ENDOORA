/**
 * Grapheme-to-Phoneme (G2P) Dictionary & Tokenizer for Spectrogram Neural GOP
 * Provides CMUDict ARPAbet phoneme breakdowns, IPA mappings, and a rule-based English G2P fallback.
 */

export interface TargetWordPhonemes {
  word: string;
  ipa: string;
  phonemes: string[]; // ARPAbet tokens e.g. ['DH', 'IH', 'S']
}

export const PHONEME_VOCAB: string[] = [
  '<blank>', 'AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'B', 'CH', 'D',
  'DH', 'EH', 'ER', 'EY', 'F', 'G', 'HH', 'IH', 'IY', 'JH',
  'K', 'L', 'M', 'N', 'NG', 'OW', 'OY', 'P', 'R', 'S',
  'SH', 'T', 'TH', 'UH', 'UW', 'V', 'W', 'Y', 'Z', 'ZH'
];

export const ARPABET_TO_IPA: Record<string, string> = {
  AA: 'ɑː', AE: 'æ', AH: 'ʌ', AO: 'ɔː', AW: 'aʊ', AY: 'aɪ',
  B: 'b', CH: 'tʃ', D: 'd', DH: 'ð', EH: 'e', ER: 'ɜːr',
  EY: 'eɪ', F: 'f', G: 'ɡ', HH: 'h', IH: 'ɪ', IY: 'iː',
  JH: 'dʒ', K: 'k', L: 'l', M: 'm', N: 'n', NG: 'ŋ',
  OW: 'oʊ', OY: 'ɔɪ', P: 'p', R: 'ɹ', S: 's', SH: 'ʃ',
  T: 't', TH: 'θ', UH: 'ʊ', UW: 'uː', V: 'v', W: 'w',
  Y: 'j', Z: 'z', ZH: 'ʒ'
};

export const IPA_TO_ARPABET: Record<string, string> = Object.entries(ARPABET_TO_IPA).reduce(
  (acc, [arpa, ipa]) => {
    acc[ipa] = arpa;
    return acc;
  },
  {} as Record<string, string>
);

// High-frequency dictionary covering AEF, Speakout, IELTS, and essential English vocabulary
export const DICTIONARY_ARPABET: Record<string, { ipa: string; phonemes: string[] }> = {
  // Pronouns, auxiliaries, common function words
  the: { ipa: 'ðə', phonemes: ['DH', 'AH'] },
  this: { ipa: 'ðɪs', phonemes: ['DH', 'IH', 'S'] },
  that: { ipa: 'ðæt', phonemes: ['DH', 'AE', 'T'] },
  these: { ipa: 'ðiːz', phonemes: ['DH', 'IY', 'Z'] },
  those: { ipa: 'ðoʊz', phonemes: ['DH', 'OW', 'Z'] },
  there: { ipa: 'ðer', phonemes: ['DH', 'EH', 'R'] },
  their: { ipa: 'ðer', phonemes: ['DH', 'EH', 'R'] },
  they: { ipa: 'ðeɪ', phonemes: ['DH', 'EY'] },
  them: { ipa: 'ðem', phonemes: ['DH', 'EH', 'M'] },
  with: { ipa: 'wɪð', phonemes: ['W', 'IH', 'DH'] },
  think: { ipa: 'θɪŋk', phonemes: ['TH', 'IH', 'NG', 'K'] },
  thank: { ipa: 'θæŋk', phonemes: ['TH', 'AE', 'NG', 'K'] },
  thanks: { ipa: 'θæŋks', phonemes: ['TH', 'AE', 'NG', 'K', 'S'] },
  thing: { ipa: 'θɪŋ', phonemes: ['TH', 'IH', 'NG'] },
  things: { ipa: 'θɪŋz', phonemes: ['TH', 'IH', 'NG', 'Z'] },
  three: { ipa: 'θriː', phonemes: ['TH', 'R', 'IY'] },
  thin: { ipa: 'θɪn', phonemes: ['TH', 'IH', 'N'] },
  thick: { ipa: 'θɪk', phonemes: ['TH', 'IH', 'K'] },
  path: { ipa: 'pæθ', phonemes: ['P', 'AE', 'TH'] },
  bath: { ipa: 'bæθ', phonemes: ['B', 'AE', 'TH'] },
  breath: { ipa: 'breθ', phonemes: ['B', 'R', 'EH', 'TH'] },
  breathe: { ipa: 'briːð', phonemes: ['B', 'R', 'IY', 'DH'] },
  weather: { ipa: 'ˈweðər', phonemes: ['W', 'EH', 'DH', 'ER'] },
  mother: { ipa: 'ˈmʌðər', phonemes: ['M', 'AH', 'DH', 'ER'] },
  father: { ipa: 'ˈfɑːðər', phonemes: ['F', 'AA', 'DH', 'ER'] },
  brother: { ipa: 'ˈbrʌðər', phonemes: ['B', 'R', 'AH', 'DH', 'ER'] },
  smooth: { ipa: 'smuːð', phonemes: ['S', 'M', 'UW', 'DH'] },

  // W vs V contrast pairs
  very: { ipa: 'ˈveri', phonemes: ['V', 'EH', 'R', 'IY'] },
  wary: { ipa: 'ˈweri', phonemes: ['W', 'EH', 'R', 'IY'] },
  vine: { ipa: 'vaɪn', phonemes: ['V', 'AY', 'N'] },
  wine: { ipa: 'waɪn', phonemes: ['W', 'AY', 'N'] },
  vest: { ipa: 'vest', phonemes: ['V', 'EH', 'S', 'T'] },
  west: { ipa: 'west', phonemes: ['W', 'EH', 'S', 'T'] },
  vet: { ipa: 'vet', phonemes: ['V', 'EH', 'T'] },
  wet: { ipa: 'wet', phonemes: ['W', 'EH', 'T'] },
  voice: { ipa: 'vɔɪs', phonemes: ['V', 'OY', 'S'] },
  water: { ipa: 'ˈwɔːtər', phonemes: ['W', 'AO', 'T', 'ER'] },
  world: { ipa: 'wɜːrld', phonemes: ['W', 'ER', 'L', 'D'] },
  what: { ipa: 'wʌt', phonemes: ['W', 'AH', 'T'] },
  when: { ipa: 'wen', phonemes: ['W', 'EH', 'N'] },
  where: { ipa: 'wer', phonemes: ['W', 'EH', 'R'] },
  why: { ipa: 'waɪ', phonemes: ['W', 'AY'] },
  will: { ipa: 'wɪl', phonemes: ['W', 'IH', 'L'] },
  would: { ipa: 'wʊd', phonemes: ['W', 'UH', 'D'] },
  view: { ipa: 'vjuː', phonemes: ['V', 'Y', 'UW'] },
  visit: { ipa: 'ˈvɪzɪt', phonemes: ['V', 'IH', 'Z', 'IH', 'T'] },
  travel: { ipa: 'ˈtrævl', phonemes: ['T', 'R', 'AE', 'V', 'L'] },

  // Short vs Long Vowels (IH vs IY)
  ship: { ipa: 'ʃɪp', phonemes: ['SH', 'IH', 'P'] },
  sheep: { ipa: 'ʃiːp', phonemes: ['SH', 'IY', 'P'] },
  fit: { ipa: 'fɪt', phonemes: ['F', 'IH', 'T'] },
  feet: { ipa: 'fiːt', phonemes: ['F', 'IY', 'T'] },
  live: { ipa: 'lɪv', phonemes: ['L', 'IH', 'V'] },
  leave: { ipa: 'liːv', phonemes: ['L', 'IY', 'V'] },
  hit: { ipa: 'hɪt', phonemes: ['H', 'IH', 'T'] },
  heat: { ipa: 'hiːt', phonemes: ['H', 'IY', 'T'] },
  sit: { ipa: 'sɪt', phonemes: ['S', 'IH', 'T'] },
  seat: { ipa: 'siːt', phonemes: ['S', 'IY', 'T'] },
  bitch: { ipa: 'bɪtʃ', phonemes: ['B', 'IH', 'CH'] },
  beach: { ipa: 'biːtʃ', phonemes: ['B', 'IY', 'CH'] },

  // Consonant clusters (avoiding Persian epenthetic /e/)
  speak: { ipa: 'spiːk', phonemes: ['S', 'P', 'IY', 'K'] },
  sport: { ipa: 'spɔːrt', phonemes: ['S', 'P', 'AO', 'R', 'T'] },
  stay: { ipa: 'steɪ', phonemes: ['S', 'T', 'EY'] },
  study: { ipa: 'ˈstʌdi', phonemes: ['S', 'T', 'AH', 'D', 'IY'] },
  start: { ipa: 'stɑːrt', phonemes: ['S', 'T', 'AA', 'R', 'T'] },
  school: { ipa: 'skuːl', phonemes: ['S', 'K', 'UW', 'L'] },
  skill: { ipa: 'skɪl', phonemes: ['S', 'K', 'IH', 'L'] },
  street: { ipa: 'striːt', phonemes: ['S', 'T', 'R', 'IY', 'T'] },

  // Velar nasal -ing (/ŋ/)
  sing: { ipa: 'sɪŋ', phonemes: ['S', 'IH', 'NG'] },
  singer: { ipa: 'ˈsɪŋər', phonemes: ['S', 'IH', 'NG', 'ER'] },
  ringing: { ipa: 'ˈrɪŋɪŋ', phonemes: ['R', 'IH', 'NG', 'IH', 'NG'] },
  morning: { ipa: 'ˈmɔːrnɪŋ', phonemes: ['M', 'AO', 'R', 'N', 'IH', 'NG'] },
  learning: { ipa: 'ˈlɜːrnɪŋ', phonemes: ['L', 'ER', 'N', 'IH', 'NG'] },
  speaking: { ipa: 'ˈspiːkɪŋ', phonemes: ['S', 'P', 'IY', 'K', 'IH', 'NG'] },
  working: { ipa: 'ˈwɜːrkɪŋ', phonemes: ['W', 'ER', 'K', 'IH', 'NG'] },

  // Common AEF & Speakout dialogues
  hello: { ipa: 'həˈloʊ', phonemes: ['HH', 'AH', 'L', 'OW'] },
  good: { ipa: 'ɡʊd', phonemes: ['G', 'UH', 'D'] },
  how: { ipa: 'haʊ', phonemes: ['HH', 'AW'] },
  are: { ipa: 'ɑːr', phonemes: ['AA', 'R'] },
  you: { ipa: 'juː', phonemes: ['Y', 'UW'] },
  fine: { ipa: 'faɪn', phonemes: ['F', 'AY', 'N'] },
  nice: { ipa: 'naɪs', phonemes: ['N', 'AY', 'S'] },
  to: { ipa: 'tuː', phonemes: ['T', 'UW'] },
  meet: { ipa: 'miːt', phonemes: ['M', 'IY', 'T'] },
  can: { ipa: 'kæn', phonemes: ['K', 'AE', 'N'] },
  help: { ipa: 'help', phonemes: ['HH', 'EH', 'L', 'P'] },
  please: { ipa: 'pliːz', phonemes: ['P', 'L', 'IY', 'Z'] },
  have: { ipa: 'hæv', phonemes: ['HH', 'AE', 'V'] },
  a: { ipa: 'ə', phonemes: ['AH'] },
  an: { ipa: 'æn', phonemes: ['AE', 'N'] },
  reservation: { ipa: 'ˌrezərˈveɪʃn', phonemes: ['R', 'EH', 'Z', 'ER', 'V', 'EY', 'SH', 'AH', 'N'] },
  single: { ipa: 'ˈsɪŋɡl', phonemes: ['S', 'IH', 'NG', 'G', 'L'] },
  room: { ipa: 'ruːm', phonemes: ['R', 'UW', 'M'] },
  for: { ipa: 'fɔːr', phonemes: ['F', 'AO', 'R'] },
  two: { ipa: 'tuː', phonemes: ['T', 'UW'] },
  nights: { ipa: 'naɪts', phonemes: ['N', 'AY', 'T', 'S'] },
  here: { ipa: 'hɪr', phonemes: ['HH', 'IH', 'R'] },
  is: { ipa: 'ɪz', phonemes: ['IH', 'Z'] },
  your: { ipa: 'jɔːr', phonemes: ['Y', 'AO', 'R'] },
  key: { ipa: 'kiː', phonemes: ['K', 'IY'] },
  coffee: { ipa: 'ˈkɔːfi', phonemes: ['K', 'AO', 'F', 'IY'] },
  like: { ipa: 'laɪk', phonemes: ['L', 'AY', 'K'] },
  some: { ipa: 'sʌm', phonemes: ['S', 'AH', 'M'] },
  sugar: { ipa: 'ˈʃʊɡər', phonemes: ['SH', 'UH', 'G', 'ER'] },
  milk: { ipa: 'mɪlk', phonemes: ['M', 'IH', 'L', 'K'] },
  yes: { ipa: 'jes', phonemes: ['Y', 'EH', 'S'] },
  no: { ipa: 'noʊ', phonemes: ['N', 'OW'] },
  check: { ipa: 'tʃek', phonemes: ['CH', 'EH', 'K'] },
  in: { ipa: 'ɪn', phonemes: ['IH', 'N'] },
  out: { ipa: 'aʊt', phonemes: ['AW', 'T'] },
  excuse: { ipa: 'ɪkˈskjuːs', phonemes: ['IH', 'K', 'S', 'K', 'Y', 'UW', 'S'] },
  me: { ipa: 'miː', phonemes: ['M', 'IY'] },

  // IELTS High-frequency words
  describe: { ipa: 'dɪˈskraɪb', phonemes: ['D', 'IH', 'S', 'K', 'R', 'AY', 'B'] },
  hometown: { ipa: 'ˈhoʊmtaʊn', phonemes: ['HH', 'OW', 'M', 'T', 'AW', 'N'] },
  education: { ipa: 'ˌedʒuˈkeɪʃn', phonemes: ['EH', 'JH', 'AH', 'K', 'EY', 'SH', 'AH', 'N'] },
  technology: { ipa: 'tekˈnɑːlədʒi', phonemes: ['T', 'EH', 'K', 'N', 'AA', 'L', 'AH', 'JH', 'IY'] },
  important: { ipa: 'ɪmˈpɔːrtnt', phonemes: ['IH', 'M', 'P', 'AO', 'R', 'T', 'AH', 'N', 'T'] },
  opinion: { ipa: 'əˈpɪnjən', phonemes: ['AH', 'P', 'IH', 'N', 'Y', 'AH', 'N'] },
  believe: { ipa: 'bɪˈliːv', phonemes: ['B', 'IH', 'L', 'IY', 'V'] },
  future: { ipa: 'ˈfjuːtʃər', phonemes: ['F', 'Y', 'UW', 'T', 'CH', 'ER'] },
  environment: { ipa: 'ɪnˈvaɪrənmənt', phonemes: ['IH', 'N', 'V', 'AY', 'R', 'AH', 'N', 'M', 'AH', 'N', 'T'] },
  opportunity: { ipa: 'ˌɑːpərˈtuːnəti', phonemes: ['AA', 'P', 'ER', 'T', 'UW', 'N', 'AH', 'T', 'IY'] },
  challenge: { ipa: 'ˈtʃælɪndʒ', phonemes: ['CH', 'AE', 'L', 'AH', 'N', 'JH'] },
  culture: { ipa: 'ˈkʌltʃər', phonemes: ['K', 'AH', 'L', 'T', 'CH', 'ER'] },
  people: { ipa: 'ˈpiːpl', phonemes: ['P', 'IY', 'P', 'L'] },
  society: { ipa: 'səˈsaɪəti', phonemes: ['S', 'AH', 'S', 'AY', 'AH', 'T', 'IY'] },
  development: { ipa: 'dɪˈveləpmənt', phonemes: ['D', 'IH', 'V', 'EH', 'L', 'AH', 'P', 'M', 'AH', 'N', 'T'] },
  experience: { ipa: 'ɪkˈspɪriəns', phonemes: ['IH', 'K', 'S', 'P', 'IH', 'R', 'IY', 'AH', 'N', 'S'] }
};

/**
 * Rule-based fallback Grapheme-to-Phoneme converter for words not in DICTIONARY_ARPABET.
 * Decomposes English letter patterns into ARPAbet tokens and corresponding IPA.
 */
export function ruleBasedG2P(rawWord: string): { ipa: string; phonemes: string[] } {
  const word = rawWord.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) {
    return { ipa: 'ə', phonemes: ['AH'] };
  }

  const phonemes: string[] = [];
  let i = 0;
  const n = word.length;

  while (i < n) {
    const two = word.slice(i, i + 2);
    const three = word.slice(i, i + 3);

    // Tri-graphs
    if (three === 'igh') {
      phonemes.push('AY');
      i += 3;
      continue;
    }
    if (three === 'tch') {
      phonemes.push('CH');
      i += 3;
      continue;
    }
    if (three === 'tion' || three === 'sion') {
      phonemes.push('SH', 'AH', 'N');
      i += 4;
      continue;
    }

    // Digraphs
    if (two === 'th') {
      // Voiced vs voiceless heuristic: initial function words voiced, otherwise voiceless
      if (['the', 'this', 'that', 'then', 'they', 'them', 'there', 'with'].includes(word)) {
        phonemes.push('DH');
      } else {
        phonemes.push('TH');
      }
      i += 2;
      continue;
    }
    if (two === 'sh') {
      phonemes.push('SH');
      i += 2;
      continue;
    }
    if (two === 'ch') {
      phonemes.push('CH');
      i += 2;
      continue;
    }
    if (two === 'ph') {
      phonemes.push('F');
      i += 2;
      continue;
    }
    if (two === 'ng') {
      phonemes.push('NG');
      i += 2;
      continue;
    }
    if (two === 'ck') {
      phonemes.push('K');
      i += 2;
      continue;
    }
    if (two === 'wh') {
      phonemes.push('W');
      i += 2;
      continue;
    }
    if (two === 'qu') {
      phonemes.push('K', 'W');
      i += 2;
      continue;
    }
    if (two === 'wr' && i === 0) {
      phonemes.push('R');
      i += 2;
      continue;
    }
    if (two === 'kn' && i === 0) {
      phonemes.push('N');
      i += 2;
      continue;
    }

    // Vowel digraphs
    if (two === 'ee' || two === 'ea') {
      phonemes.push('IY');
      i += 2;
      continue;
    }
    if (two === 'oo') {
      phonemes.push('UW');
      i += 2;
      continue;
    }
    if (two === 'ou' || two === 'ow') {
      phonemes.push('AW');
      i += 2;
      continue;
    }
    if (two === 'oi' || two === 'oy') {
      phonemes.push('OY');
      i += 2;
      continue;
    }
    if (two === 'ai' || two === 'ay') {
      phonemes.push('EY');
      i += 2;
      continue;
    }
    if (two === 'oa') {
      phonemes.push('OW');
      i += 2;
      continue;
    }
    if (two === 'er' || two === 'ir' || two === 'ur') {
      phonemes.push('ER');
      i += 2;
      continue;
    }
    if (two === 'ar') {
      phonemes.push('AA', 'R');
      i += 2;
      continue;
    }
    if (two === 'or') {
      phonemes.push('AO', 'R');
      i += 2;
      continue;
    }

    const c = word[i];
    // Consonants
    if (c === 'b') phonemes.push('B');
    else if (c === 'c') {
      const next = word[i + 1];
      if (next === 'e' || next === 'i' || next === 'y') phonemes.push('S');
      else phonemes.push('K');
    } else if (c === 'd') phonemes.push('D');
    else if (c === 'f') phonemes.push('F');
    else if (c === 'g') {
      const next = word[i + 1];
      if (next === 'e' || next === 'i' || next === 'y') phonemes.push('JH');
      else phonemes.push('G');
    } else if (c === 'h') phonemes.push('HH');
    else if (c === 'j') phonemes.push('JH');
    else if (c === 'k') phonemes.push('K');
    else if (c === 'l') phonemes.push('L');
    else if (c === 'm') phonemes.push('M');
    else if (c === 'n') phonemes.push('N');
    else if (c === 'p') phonemes.push('P');
    else if (c === 'r') phonemes.push('R');
    else if (c === 's') phonemes.push('S');
    else if (c === 't') phonemes.push('T');
    else if (c === 'v') phonemes.push('V');
    else if (c === 'w') phonemes.push('W');
    else if (c === 'x') phonemes.push('K', 'S');
    else if (c === 'y') {
      if (i === 0) phonemes.push('Y');
      else phonemes.push('IY');
    } else if (c === 'z') phonemes.push('Z');
    // Short Vowels
    else if (c === 'a') phonemes.push('AE');
    else if (c === 'e') {
      // Silent e at end
      if (i === n - 1 && n > 2) {
        // skipped silent e
      } else {
        phonemes.push('EH');
      }
    } else if (c === 'i') phonemes.push('IH');
    else if (c === 'o') phonemes.push('AO');
    else if (c === 'u') phonemes.push('AH');

    i++;
  }

  const validPhonemes = phonemes.filter((p) => PHONEME_VOCAB.includes(p));
  if (validPhonemes.length === 0) {
    validPhonemes.push('AH');
  }

  const ipa = validPhonemes.map((p) => ARPABET_TO_IPA[p] || p).join('');
  return { ipa, phonemes: validPhonemes };
}

/**
 * Converts a raw English sentence or phrase into structured TargetWordPhonemes
 * ready for the Spectrogram Neural GOP AudioWorklet and Web Worker.
 */
export function sentenceToTargetWords(sentence: string): TargetWordPhonemes[] {
  if (!sentence || !sentence.trim()) return [];

  // Match words, preserving contractions like "don't", "i'm"
  const tokens = sentence
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);

  return tokens.map((rawWord) => {
    const cleanWord = rawWord.toLowerCase();
    const entry = DICTIONARY_ARPABET[cleanWord];
    if (entry) {
      return {
        word: rawWord,
        ipa: entry.ipa,
        phonemes: [...entry.phonemes]
      };
    }
    const computed = ruleBasedG2P(cleanWord);
    return {
      word: rawWord,
      ipa: computed.ipa,
      phonemes: computed.phonemes
    };
  });
}

// Curated sentence bundles for quick practice in each module
export const CURATED_PRACTICE_UTTERANCES = {
  AEF_Practical_English: [
    {
      id: 'aef_hotel_checkin',
      titleFa: 'ورود به هتل و تحویل کلید',
      sentence: 'Good evening. I have a reservation for a single room with a bath.',
      cefr: 'A2' as const
    },
    {
      id: 'aef_cafe_order',
      titleFa: 'سفارش قهوه در کافه',
      sentence: 'Can I have a double espresso and a bottle of mineral water, please?',
      cefr: 'A1' as const
    },
    {
      id: 'aef_street_directions',
      titleFa: 'پرسیدن آدرس در خیابان',
      sentence: 'Excuse me, could you tell me where the nearest subway station is?',
      cefr: 'B1' as const
    }
  ],
  Speakout_BBC: [
    {
      id: 'speakout_city_life',
      titleFa: 'مصاحبه بی‌بی‌سی درباره زندگی شهری',
      sentence: 'Living in a bustling capital gives you endless cultural opportunities and events.',
      cefr: 'B2' as const
    },
    {
      id: 'speakout_technology_interview',
      titleFa: 'دیدگاه شهروندان پیرامون هوش مصنوعی',
      sentence: 'I think modern technology will reshape how future generations work and communicate.',
      cefr: 'C1' as const
    }
  ],
  IELTS_Speaking: [
    {
      id: 'ielts_part1_hometown',
      titleFa: 'اسپیکینگ پارت ۱: توصیف زادگاه',
      sentence: 'My hometown is famous for its warm weather and friendly hospitable people.',
      cefr: 'B2' as const
    },
    {
      id: 'ielts_part2_challenge',
      titleFa: 'اسپیکینگ پارت ۲: تجربه غلبه بر چالش',
      sentence: 'That experience taught me how to stay calm and solve unexpected problems under pressure.',
      cefr: 'B2' as const
    },
    {
      id: 'ielts_part3_environment',
      titleFa: 'اسپیکینگ پارت ۳: حفاظت از محیط زیست',
      sentence: 'Governments should invest heavily in renewable energy to protect our vulnerable planet.',
      cefr: 'C1' as const
    }
  ],
  Persian_L1_Contrasts: [
    {
      id: 'p_th_voiceless',
      titleFa: 'تمایز /θ/ از /s/ و /t/',
      sentence: 'Think carefully about the three thin paths through the forest.',
      cefr: 'B1' as const
    },
    {
      id: 'p_dh_voiced',
      titleFa: 'تمایز /ð/ از /d/ و /z/',
      sentence: 'This smooth leather is better than that other coat over there.',
      cefr: 'B1' as const
    },
    {
      id: 'p_wv_contrast',
      titleFa: 'تمایز جفت /w/ و /v/',
      sentence: 'Be very wary of cold winter winds when visiting the west valley.',
      cefr: 'A2' as const
    },
    {
      id: 'p_clusters_sp_st',
      titleFa: 'خوشه صوتی ابتدایی بدون کسره (/sp/, /st/, /sk/)',
      sentence: 'Students start to speak Spanish and study special sport skills.',
      cefr: 'A2' as const
    },
    {
      id: 'p_ng_nasal',
      titleFa: 'صدای خیشومی /ŋ/ بدون رها کردن گ یا ک',
      sentence: 'The young singer is singing a charming English song this morning.',
      cefr: 'B1' as const
    }
  ]
};
