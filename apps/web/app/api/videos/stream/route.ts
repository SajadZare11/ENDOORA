import { errorMessage } from "../../../../lib/error-message.ts";
import { NextRequest, NextResponse } from "next/server.js";
import fs from "fs";
import path from "path";

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

/**
 * Returns candidate root directories for local/container video assets (F25).
 * Honors ENDOORA_VIDEO_STORAGE_PATH / VIDEO_STORAGE_PATH across deployment environments.
 */
function getVideoStorageBases(): string[] {
  const envPath =
    process.env.ENDOORA_VIDEO_STORAGE_PATH || process.env.VIDEO_STORAGE_PATH;
  const bases: string[] = [];

  if (envPath) {
    bases.push(envPath);
  }

  // Standard container & production mount paths
  bases.push("/var/www/endoora/videos");
  bases.push(path.join(process.cwd(), "public", "videos"));
  bases.push(path.join(process.cwd(), "videos"));

  // Development fallbacks
  bases.push("E:\\0\\Work\\Website\\The General Website\\Speakout and AEF Videos");
  bases.push("E:\\0\\Work\\Website\\The General Website\\Speakout Videos");
  bases.push("E:\\0\\Work\\Website\\The General Website\\Books and CEFR\\AEF\\Starter\\Files");

  return bases;
}

/**
 * Resolves domestic CDN, object storage, or failsafe cloud release URL.
 */
function getVideoDeliveryUrl(
  isAef: boolean,
  rawLevel: string,
  fileName: string
): string {
  const cleanLevel = rawLevel.toLowerCase().replace("+", "_plus").replace("-", "_");
  const releaseTag = isAef ? `media-aef-${cleanLevel}` : `media-so-${cleanLevel}`;
  const assetName = fileName.replace(/[\s'&]+/g, ".");

  // Configured domestic CDN / Object storage (ArvanCloud, Parspack, private S3)
  const cdnBase =
    process.env.ENDOORA_MEDIA_CDN_URL ||
    process.env.VIDEO_CDN_URL ||
    process.env.NEXT_PUBLIC_VIDEO_CDN_URL;

  if (cdnBase) {
    const trimmed = cdnBase.replace(/\/+$/, "");
    return `${trimmed}/${releaseTag}/${encodeURIComponent(assetName)}`;
  }

  // Failsafe GitHub Release CDN
  const repoBase = process.env.NEXT_PUBLIC_VIDEO_REPO || "SajadZare11/ENDOORA";
  return `https://github.com/${repoBase}/releases/download/${releaseTag}/${encodeURIComponent(assetName)}`;
}

/**
 * Locates the requested video file on local storage or mounted volume.
 */
function locateLocalVideoFile(
  isAef: boolean,
  targetSubFolder: string,
  sanitizedFileName: string
): string | null {
  const bases = getVideoStorageBases();
  const seriesFolder = isAef ? "AEF" : "Speakout Videos";

  for (const base of bases) {
    if (!fs.existsSync(base)) continue;

    // Pattern A: {base}/{seriesFolder}/{targetSubFolder}/{fileName}
    const pathA = path.join(base, seriesFolder, targetSubFolder, sanitizedFileName);
    if (fs.existsSync(pathA)) return pathA;

    // Pattern B: {base}/{targetSubFolder}/{fileName}
    const pathB = path.join(base, targetSubFolder, sanitizedFileName);
    if (fs.existsSync(pathB)) return pathB;

    // Pattern C: {base}/{fileName}
    const pathC = path.join(base, sanitizedFileName);
    if (fs.existsSync(pathC)) return pathC;
  }

  return null;
}

export async function HEAD(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawSeries = (searchParams.get("series") || "").toLowerCase().trim();
  const rawLevel = (searchParams.get("level") || "").toLowerCase().trim();
  const rawFile = (searchParams.get("file") || "").trim();

  if (!rawLevel || !rawFile) {
    return new NextResponse(null, { status: 400 });
  }

  const sanitizedFileName = path.basename(rawFile);
  const isAef = rawSeries === "aef" || sanitizedFileName.toUpperCase().startsWith("AEF");
  const subFolderMap = isAef ? AEF_DIR_MAP : SPEAKOUT_DIR_MAP;
  const targetSubFolder = subFolderMap[rawLevel];

  if (!targetSubFolder) {
    return new NextResponse(null, { status: 400 });
  }

  const localPath = locateLocalVideoFile(isAef, targetSubFolder, sanitizedFileName);
  if (localPath) {
    try {
      const stat = fs.statSync(/*turbopackIgnore: true*/ localPath);
      const isWebm = sanitizedFileName.endsWith(".webm");
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Accept-Ranges": "bytes",
          "Content-Length": stat.size.toString(),
          "Content-Type": isWebm ? "video/webm" : "video/mp4",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch {
      // fallback
    }
  }

  const fallbackUrl = getVideoDeliveryUrl(isAef, rawLevel, sanitizedFileName);
  return NextResponse.redirect(fallbackUrl, 307);
}

export async function GET(request: NextRequest) {
  try {
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

    const isWebm = sanitizedFileName.endsWith(".webm");
    const contentType = isWebm ? "video/webm" : "video/mp4";

    // Determine series
    const isAef = rawSeries === "aef" || sanitizedFileName.toUpperCase().startsWith("AEF");
    const subFolderMap = isAef ? AEF_DIR_MAP : SPEAKOUT_DIR_MAP;
    const targetSubFolder = subFolderMap[rawLevel];

    if (!targetSubFolder) {
      return new NextResponse(`Invalid level '${rawLevel}' for series`, { status: 400 });
    }

    // Resolve local file path across configurable bases
    const localFilePath = locateLocalVideoFile(isAef, targetSubFolder, sanitizedFileName);

    // If file exists locally on disk or volume, stream with HTTP 206 Range support
    if (localFilePath) {
      try {
        const stat = fs.statSync(/*turbopackIgnore: true*/ localFilePath);
        const fileSize = stat.size;
        const rangeHeader = request.headers.get("range");

        if (rangeHeader) {
          // Standard byte-range parsing (including suffix range bytes=-500)
          const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
          if (match) {
            let start = match[1] ? parseInt(match[1], 10) : NaN;
            let end = match[2] ? parseInt(match[2], 10) : NaN;

            if (isNaN(start) && !isNaN(end)) {
              // Suffix byte range: e.g. bytes=-500
              start = Math.max(0, fileSize - end);
              end = fileSize - 1;
            } else if (!isNaN(start) && isNaN(end)) {
              // Open-ended range: e.g. bytes=1000-
              end = fileSize - 1;
            }

            if (
              isNaN(start) ||
              isNaN(end) ||
              start >= fileSize ||
              end >= fileSize ||
              start > end
            ) {
              return new NextResponse("Requested range not satisfiable", {
                status: 416,
                headers: { "Content-Range": `bytes */${fileSize}` },
              });
            }

            const chunkSize = end - start + 1;
            const fileStream = fs.createReadStream(/*turbopackIgnore: true*/ localFilePath, { start, end });

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
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
              },
            });
          }
        }

        // Full content delivery (HTTP 200) with Accept-Ranges declared
        const fileStream = fs.createReadStream(/*turbopackIgnore: true*/ localFilePath);
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
            "Content-Type": contentType,
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=3600",
          },
        });
      } catch (err) {
        console.error("Local video streaming error:", err);
      }
    }

    // Fallback to Domestic CDN / S3 / GitHub Release
    const fallbackUrl = getVideoDeliveryUrl(isAef, rawLevel, sanitizedFileName);
    return NextResponse.redirect(fallbackUrl, 307);
  } catch (globalErr: unknown) {
    console.error("[VIDEO_STREAM_API] Global unhandled error:", globalErr);
    return new NextResponse(`Streaming error: ${errorMessage(globalErr) || globalErr}`, {
      status: 500,
    });
  }
}
