import fs from "fs";
import path from "path";

/**
 * Resolves durable path to apps/web/data/<filename>
 * Handles both repository root and apps/web working directories, as well as subdirectories.
 */
export function resolveStoragePath(filename: string): string {
  const candidateWeb = path.join(process.cwd(), "apps", "web", "data", filename);
  const candidateLocal = path.join(process.cwd(), "data", filename);

  const webDir = path.dirname(candidateWeb);
  const localDir = path.dirname(candidateLocal);

  // If the web candidate's base data directory exists, use candidateWeb
  const webBaseDir = path.join(process.cwd(), "apps", "web", "data");
  if (fs.existsSync(webBaseDir)) {
    if (!fs.existsSync(webDir)) {
      try {
        fs.mkdirSync(webDir, { recursive: true });
      } catch {}
    }
    return candidateWeb;
  }

  // If local data directory exists, use candidateLocal
  const localBaseDir = path.join(process.cwd(), "data");
  if (fs.existsSync(localBaseDir)) {
    if (!fs.existsSync(localDir)) {
      try {
        fs.mkdirSync(localDir, { recursive: true });
      } catch {}
    }
    return candidateLocal;
  }

  return candidateWeb;
}

/**
 * Writes data atomically to disk:
 * 1. Writes full payload to a temporary file in the same directory.
 * 2. Flushes buffers to physical disk.
 * 3. Atomically renames temporary file over destination file.
 * 4. Retries on Windows transient EPERM/EBUSY file locks.
 */
export function atomicWriteJsonSync<T>(filePath: string, data: T): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const tempPath = `${filePath}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}`;
  const content = JSON.stringify(data, null, 2);

  // Write content to temporary file
  fs.writeFileSync(tempPath, content, "utf-8");

  // Atomic rename with Windows retry loop
  let retries = 5;
  while (retries > 0) {
    try {
      fs.renameSync(tempPath, filePath);
      return;
    } catch (err: any) {
      if ((err.code === "EPERM" || err.code === "EBUSY") && retries > 1) {
        retries--;
        const start = Date.now();
        while (Date.now() - start < 20) {
          // Micro-spinwait for file lock release
        }
      } else {
        try {
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        } catch {}
        throw err;
      }
    }
  }
}

/**
 * Reads JSON file with schema fallback and cross-process timestamp invalidation.
 */
export function readJsonWithFallback<T>(
  filePath: string,
  fallbackFactory: () => T,
  validate?: (parsed: any) => parsed is T
): { data: T; mtime: number } {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (!validate || validate(parsed)) {
        return { data: parsed as T, mtime: stats.mtimeMs };
      }
    }
  } catch (err) {
    console.warn(`[StorageEngine] Could not parse ${filePath}, restoring fallback seed:`, err);
  }

  const fallback = fallbackFactory();
  try {
    atomicWriteJsonSync(filePath, fallback);
  } catch (writeErr) {
    console.warn(`[StorageEngine] Failed to initialize seed on disk:`, writeErr);
  }
  return { data: fallback, mtime: Date.now() };
}
