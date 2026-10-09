/**
 * Opaque-Box Codebase Static & Dynamic Scanner
 * Inspects items data, backend placement code, frontend runner, HUD, and media components.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();

export const PATHS = {
  coreItems: path.join(rootDir, "data", "placement", "core-items.json"),
  backendPlacementDir: path.join(rootDir, "apps", "api", "placement"),
  backendScoring: path.join(rootDir, "apps", "api", "placement", "scoring.py"),
  backendModels: path.join(rootDir, "apps", "api", "placement", "models.py"),
  backendViews: path.join(rootDir, "apps", "api", "placement", "views.py"),
  backendSerializers: path.join(rootDir, "apps", "api", "placement", "serializers.py"),
  frontendRunner: path.join(rootDir, "apps", "web", "components", "placement", "PlacementRunner.tsx"),
  frontendAdaptiveEngine: path.join(rootDir, "apps", "web", "lib", "adaptive-engine.ts"),
  frontendReportPage: path.join(rootDir, "apps", "web", "app", "(learner)", "placement", "report", "page.tsx"),
  frontendLandingPage: path.join(rootDir, "apps", "web", "app", "(learner)", "placement", "page.tsx"),
  frontendDemoPage: path.join(rootDir, "apps", "web", "app", "(learner)", "placement", "demo", "page.tsx"),
  frontendAudioPlayer: path.join(rootDir, "apps", "web", "components", "placement", "AudioWaveformPlayer.tsx"),
  frontendAudioRecorder: path.join(rootDir, "apps", "web", "components", "placement", "AudioRecorder.tsx"),
  frontendWritingEditor: path.join(rootDir, "apps", "web", "components", "placement", "WritingEditor.tsx"),
  frontendLearnerTwin: path.join(rootDir, "apps", "web", "components", "placement", "LearnerTwinPreview.tsx"),
  audioDir: path.join(rootDir, "apps", "web", "public", "audio", "placement"),
};

/**
 * Loads and parses data/placement/core-items.json, automatically handling BOM if present.
 */
export function loadCoreItemsData() {
  if (!fs.existsSync(PATHS.coreItems)) {
    return { exists: false, items: [], count: 0, error: "File not found" };
  }

  try {
    const raw = fs.readFileSync(PATHS.coreItems, "utf8").replace(/^\uFEFF/, "");
    const items = JSON.parse(raw);
    return {
      exists: true,
      items: Array.isArray(items) ? items : [],
      count: Array.isArray(items) ? items.length : 0,
      error: null,
    };
  } catch (err) {
    return { exists: true, items: [], count: 0, error: err.message };
  }
}

/**
 * Reads a text file safely
 */
export function readFileSafe(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}

/**
 * Searches for forbidden tokens (case-insensitive) in a file or string.
 * Returns array of matches with line numbers.
 */
export function scanForbiddenTokens(content, tokens = ["efset", "ef set", "ef_set"]) {
  if (!content) return [];
  const lines = content.split("\n");
  const matches = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    for (const token of tokens) {
      const regex = new RegExp(`\\b${token.replace(/\s+/g, "\\s+")}\\b`, "i");
      if (regex.test(line)) {
        matches.push({
          line: idx + 1,
          content: line.trim(),
          token,
        });
      }
    }
  }

  return matches;
}

/**
 * Scans a directory recursively for files matching extensions and checks for forbidden tokens.
 */
export function scanDirectoryForForbiddenTokens(dirPath, extensions = [".ts", ".tsx", ".py", ".json"], tokens = ["efset", "ef set"]) {
  const violations = [];
  if (!fs.existsSync(dirPath)) return violations;

  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(current, ent.name);
      if (ent.isDirectory()) {
        if (ent.name !== "node_modules" && ent.name !== ".git" && ent.name !== "__pycache__") {
          walk(fullPath);
        }
      } else if (ent.isFile()) {
        const ext = path.extname(ent.name).toLowerCase();
        if (extensions.includes(ext)) {
          const content = fs.readFileSync(fullPath, "utf8");
          const matches = scanForbiddenTokens(content, tokens);
          if (matches.length > 0) {
            violations.push({
              file: path.relative(rootDir, fullPath),
              matches,
            });
          }
        }
      }
    }
  }

  walk(dirPath);
  return violations;
}
