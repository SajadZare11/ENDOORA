import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Unified storage base directory
const UNIFIED_STORAGE_BASE = "E:\\0\\Work\\Website\\The General Website\\Speakout and AEF Videos";
const LEGACY_SPEAKOUT_BASE = "E:\\0\\Work\\Website\\The General Website\\Speakout Videos";

// Speakout folder mapping
const SPEAKOUT_DIR_MAP: Record<string, string> = {
  a1: "SpeakOut A1 3rd SB Video",
  a2: "SpeakOut A2 3rd Video",
  a2_plus: "SpeakOut A2+ 3rd SB Video",
  b1: "SpeakOut B1 3rd Video",
  b1_plus: "SpeakOut B1+ 3rd SB Video",
  b2: "SpeakOut B2 3rd Video",
  b2_plus: "SpeakOut B2+ 3rd SB Video",
  c1_c2: "Speakout С1-С2 3rd SB Video",
  c1: "Speakout С1-С2 3rd SB Video",
  c2: "Speakout С1-С2 3rd SB Video",
};

// AEF folder mapping
const AEF_DIR_MAP: Record<string, string> = {
  a1: "A1 level",
  a2: "A2 level",
  b1: "B1 level",
  b2: "B2",
  c1: "C1 level",
  c2: "C1 level",
};

// Structured GitHub release CDN fallback
function getGitHubReleaseUrl(isAef: boolean, rawLevel: string, fileName: string): string {
  const cleanLevel = rawLevel.toLowerCase().replace("+", "_plus").replace("-", "_");
  const releaseTag = isAef ? `media-aef-${cleanLevel}` : `media-so-${cleanLevel}`;
  const repoBase = process.env.NEXT_PUBLIC_VIDEO_REPO || "SajadZare11/ENDOORA";
  const cdnBase = process.env.NEXT_PUBLIC_VIDEO_CDN_URL;
  // GitHub replaces spaces, apostrophes, and ampersands with dots in release asset filenames
  const assetName = fileName.replace(/[\s'&]+/g, ".");
  if (cdnBase) {
    return `${cdnBase}/${releaseTag}/${encodeURIComponent(assetName)}`;
  }
  return `https://github.com/${repoBase}/releases/download/${releaseTag}/${encodeURIComponent(assetName)}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawSeries = (searchParams.get("series") || "").toLowerCase().trim();
  const rawLevel = (searchParams.get("level") || "").toLowerCase().trim();
  const rawFile = (searchParams.get("file") || "").trim();

  if (!rawLevel || !rawFile) {
    return new NextResponse("Missing level or file parameter", { status: 400 });
  }

  // Sanitize file name to prevent directory traversal
  const sanitizedFileName = path.basename(rawFile);
  if (!sanitizedFileName.endsWith(".mp4") && !sanitizedFileName.endsWith(".webm")) {
    return new NextResponse("Invalid file format", { status: 400 });
  }

  // Determine series: "aef" vs "speakout" (auto-detected if rawSeries not provided)
  const isAef = rawSeries === "aef" || sanitizedFileName.toUpperCase().startsWith("AEF");
  const seriesFolder = isAef ? "AEF" : "Speakout Videos";
  const subFolderMap = isAef ? AEF_DIR_MAP : SPEAKOUT_DIR_MAP;
  const targetSubFolder = subFolderMap[rawLevel];

  if (!targetSubFolder) {
    return new NextResponse(`Invalid level '${rawLevel}' for series`, { status: 400 });
  }

  // 1. Try unified base path: Speakout and AEF Videos/{series}/{subfolder}/{file}
  let localFilePath = path.join(UNIFIED_STORAGE_BASE, seriesFolder, targetSubFolder, sanitizedFileName);

  // 2. Fallback check for legacy Speakout location if not found
  if (!fs.existsSync(localFilePath) && !isAef) {
    const legacyPath = path.join(LEGACY_SPEAKOUT_BASE, targetSubFolder, sanitizedFileName);
    if (fs.existsSync(legacyPath)) {
      localFilePath = legacyPath;
    }
  }

  // 3. Fallback check for root AEF location
  if (!fs.existsSync(localFilePath) && isAef) {
    const legacyAefPath = path.join(
      "E:\\0\\Work\\Website\\The General Website\\Books and CEFR\\AEF\\Starter\\Files",
      sanitizedFileName
    );
    if (fs.existsSync(legacyAefPath)) {
      localFilePath = legacyAefPath;
    }
  }

  // If file exists locally on disk, stream with HTTP 206 Range support
  if (fs.existsSync(localFilePath)) {
    try {
      const stat = fs.statSync(localFilePath);
      const fileSize = stat.size;
      const rangeHeader = request.headers.get("range");

      if (rangeHeader) {
        const parts = rangeHeader.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize || start > end) {
          return new NextResponse("Requested range not satisfiable", {
            status: 416,
            headers: { "Content-Range": `bytes */${fileSize}` },
          });
        }

        const chunkSize = end - start + 1;
        const fileStream = fs.createReadStream(localFilePath, { start, end });

        const webStream = new ReadableStream({
          start(controller) {
            fileStream.on("data", (chunk) => controller.enqueue(chunk));
            fileStream.on("end", () => controller.close());
            fileStream.on("error", (err) => controller.error(err));
          },
          cancel() {
            fileStream.destroy();
          },
        });

        return new NextResponse(webStream, {
          status: 206,
          headers: {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize.toString(),
            "Content-Type": "video/mp4",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      } else {
        const fileStream = fs.createReadStream(localFilePath);
        const webStream = new ReadableStream({
          start(controller) {
            fileStream.on("data", (chunk) => controller.enqueue(chunk));
            fileStream.on("end", () => controller.close());
            fileStream.on("error", (err) => controller.error(err));
          },
          cancel() {
            fileStream.destroy();
          },
        });

        return new NextResponse(webStream, {
          status: 200,
          headers: {
            "Content-Length": fileSize.toString(),
            "Content-Type": "video/mp4",
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    } catch (err) {
      console.error("Local video streaming error:", err);
    }
  }

  // Fallback to Failsafe Cloud / GitHub CDN Release
  const fallbackUrl = getGitHubReleaseUrl(isAef, rawLevel, sanitizedFileName);
  return NextResponse.redirect(fallbackUrl, 307);
}
