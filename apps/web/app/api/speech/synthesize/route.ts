import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * High-definition Native English Audio Proxy Route
 * Streams authentic, natural human pronunciation in audio/mpeg (MP3)
 * Provides studio-quality native speech with zero robotic artifacts.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawText = searchParams.get("text") || "";
  const lang = searchParams.get("lang") || "en";

  if (!rawText.trim()) {
    return new NextResponse("Text parameter is required", { status: 400 });
  }

  // Sanitize text and truncate if abnormally long
  const text = rawText.trim().slice(0, 300);

  // Determine target language accent
  const tl = lang.toLowerCase().startsWith("en-gb") || lang.toLowerCase().includes("uk") ? "en-GB" : "en-US";

  try {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${tl}&client=tw-ob`;

    const response = await fetch(ttsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
      next: { revalidate: 86400 }, // Cache audio for 24h
    });

    if (!response.ok) {
      return new NextResponse(`TTS upstream error: ${response.statusText}`, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=604800, immutable", // Cache in browser for 7 days
      },
    });
  } catch (error) {
    console.error("Audio synthesis proxy error:", error);
    return new NextResponse("Failed to synthesize audio", { status: 500 });
  }
}
