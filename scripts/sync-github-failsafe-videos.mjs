/**
 * GitHub Failsafe Video Sync Script
 * Uses GitHub CLI (gh) to create a release in SajadZare11/ENDOORA and upload video assets.
 * 
 * Usage:
 *   node scripts/sync-github-failsafe-videos.mjs --level a1
 *   node scripts/sync-github-failsafe-videos.mjs --level a2
 *   node scripts/sync-github-failsafe-videos.mjs --all
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const REPO = "SajadZare11/ENDOORA";
const RELEASE_TAG = "v1.0.0-real-life-media";
const LOCAL_STORAGE_BASE = "E:\\0\\Work\\Website\\The General Website\\Speakout Videos";

const TIER_DIRECTORY_MAP = {
  a1: "SpeakOut A1 3rd SB Video",
  a2: "SpeakOut A2 3rd Video",
  a2_plus: "SpeakOut A2+ 3rd SB Video",
  b1: "SpeakOut B1 3rd Video",
  b1_plus: "SpeakOut B1+ 3rd SB Video",
  b2: "SpeakOut B2 3rd Video",
  b2_plus: "SpeakOut B2+ 3rd SB Video",
  c1_c2: "Speakout С1-С2 3rd SB Video",
};

const args = process.argv.slice(2);
let targetLevels = ["a1", "a2"];

if (args.includes("--all")) {
  targetLevels = Object.keys(TIER_DIRECTORY_MAP);
} else {
  const levelIdx = args.indexOf("--level");
  if (levelIdx !== -1 && args[levelIdx + 1]) {
    targetLevels = [args[levelIdx + 1].toLowerCase()];
  }
}

console.log(`=== Starting GitHub Failsafe Video Upload to ${REPO} [${RELEASE_TAG}] ===`);
console.log(`Target levels: ${targetLevels.join(", ")}`);

// 1. Ensure release exists
try {
  const checkRelease = execSync(`gh release view ${RELEASE_TAG} --repo ${REPO}`, { stdio: "pipe" }).toString();
  console.log(`Release ${RELEASE_TAG} already exists.`);
} catch (err) {
  console.log(`Creating release ${RELEASE_TAG}...`);
  try {
    execSync(
      `gh release create ${RELEASE_TAG} --repo ${REPO} --title "Real-Life Practical English Video Media" --notes "Failsafe CDN assets for Speakout 3rd Edition videos in Endoora"`,
      { stdio: "inherit" }
    );
    console.log(`Release ${RELEASE_TAG} created successfully!`);
  } catch (createErr) {
    console.error("Failed to create release:", createErr.message);
    process.exit(1);
  }
}

// 2. Upload video files for each target level
for (const level of targetLevels) {
  const folderName = TIER_DIRECTORY_MAP[level];
  if (!folderName) {
    console.warn(`Unknown level: ${level}`);
    continue;
  }

  const dirPath = path.join(LOCAL_STORAGE_BASE, folderName);
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    continue;
  }

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mp4"));
  console.log(`\n--- Uploading ${files.length} videos for level [${level.toUpperCase()}] ---`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fullPath = path.join(dirPath, file);
    // Standardize asset name with level prefix so files in release never collide
    const assetName = `${level}-${file.replace(/ /g, "-")}`;

    console.log(`[${i + 1}/${files.length}] Uploading ${file} as ${assetName}...`);
    try {
      // Use gh release upload with clobber to overwrite if updated
      execSync(`gh release upload ${RELEASE_TAG} "${fullPath}#${assetName}" --repo ${REPO} --clobber`, {
        stdio: "inherit",
      });
      console.log(`  ✓ Successfully uploaded ${assetName}`);
    } catch (uploadErr) {
      console.error(`  ✗ Failed to upload ${file}:`, uploadErr.message);
    }
  }
}

console.log("\n=== GitHub Failsafe Video Upload Process Completed! ===");
console.log(`Direct asset URL pattern: https://github.com/${REPO}/releases/download/${RELEASE_TAG}/{level}-{filename}`);
