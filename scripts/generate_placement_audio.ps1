# PowerShell Audio Generation Engine for Endoora Placement System
Add-Type -AssemblyName System.Speech

$repoRoot = Split-Path -Parent $PSScriptRoot
$coreItemsPath = Join-Path $repoRoot "data\placement\core-items.json"
$audioDir = Join-Path $repoRoot "apps\web\public\audio\placement"

if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir -Force | Out-Null
}

if (-not (Test-Path $coreItemsPath)) {
    Write-Error "core-items.json not found at $coreItemsPath"
    exit 1
}

$rawJson = Get-Content -Path $coreItemsPath -Raw -Encoding utf8
$items = ConvertFrom-Json $rawJson

$listeningItems = $items | Where-Object { $_.section -eq "listening" }
Write-Host "Found $($listeningItems.Count) listening items to process."

$format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(
    44100, 
    [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, 
    [System.Speech.AudioFormat.AudioChannel]::Mono
)

$count = 0
foreach ($item in $listeningItems) {
    $count++
    $id = $item.id
    $cefr = $item.cefr_level
    $transcript = $item.transcript
    
    # Alternate voices: odd sequence -> Zira (Female), even sequence -> David (Male)
    $voice = if ($count % 2 -eq 1) { "Microsoft Zira Desktop" } else { "Microsoft David Desktop" }
    
    # Rate: deliberate (-1) for beginner levels A1/A2, standard (0) for B1-C2
    $rate = if ($cefr -in @("A1", "A2")) { -1 } else { 0 }
    
    $wavFile = "$id.wav"
    $wavPath = Join-Path $audioDir $wavFile
    
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    try {
        $synth.SelectVoice($voice)
    } catch {
        # Fallback to default voice if specific desktop voice unavailable
    }
    $synth.Rate = $rate
    $synth.SetOutputToWaveFile($wavPath, $format)
    $synth.Speak($transcript)
    $synth.Dispose()
    
    Write-Host "[$count/42] Generated $id ($voice, rate=$rate) -> WAV"
}

Write-Host "SUCCESS: Generated all $($listeningItems.Count) listening audio assets in $audioDir"
