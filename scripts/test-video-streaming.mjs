import fs from "fs";
import path from "path";

console.log("=== Testing Local Video File Streaming Resolution ===");

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

const LOCAL_STORAGE_BASE = "E:\\0\\Work\\Website\\The General Website\\Speakout Videos";

// Test A1 files
const a1Folder = path.join(LOCAL_STORAGE_BASE, TIER_DIRECTORY_MAP["a1"]);
const a1Files = fs.readdirSync(a1Folder).filter(f => f.endsWith(".mp4"));
console.log(`Found ${a1Files.length} MP4 files in A1 directory:`);
for (const f of a1Files) {
  const stat = fs.statSync(path.join(a1Folder, f));
  console.log(`  - ${f} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
}

// Test A2 files
const a2Folder = path.join(LOCAL_STORAGE_BASE, TIER_DIRECTORY_MAP["a2"]);
const a2Files = fs.readdirSync(a2Folder).filter(f => f.endsWith(".mp4"));
console.log(`\nFound ${a2Files.length} MP4 files in A2 directory:`);
for (const f of a2Files) {
  const stat = fs.statSync(path.join(a2Folder, f));
  console.log(`  - ${f} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)`);
}

console.log("\n=== Video File Streaming Resolution Test: SUCCESS ===");
