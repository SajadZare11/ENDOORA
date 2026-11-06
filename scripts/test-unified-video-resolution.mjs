import fs from "fs";
import path from "path";

console.log("=== Testing Dual-Track Video File Locations on Disk ===");

const UNIFIED_STORAGE_BASE = "E:\\0\\Work\\Website\\The General Website\\Speakout and AEF Videos";

// 1. Check AEF Files
const aefA1Dir = path.join(UNIFIED_STORAGE_BASE, "AEF", "A1 level");
const aefA1Files = fs.readdirSync(aefA1Dir).filter(f => f.endsWith(".mp4"));
console.log(`\n[AEF A1] Found ${aefA1Files.length} MP4 files in ${aefA1Dir}:`);
for (const f of aefA1Files.slice(0, 5)) {
  console.log(`  - ${f}`);
}
console.log(`  ... and ${aefA1Files.length - 5} more files.`);

const aefA2Dir = path.join(UNIFIED_STORAGE_BASE, "AEF", "A2 level");
const aefA2Files = fs.readdirSync(aefA2Dir).filter(f => f.endsWith(".mp4"));
console.log(`\n[AEF A2] Found ${aefA2Files.length} MP4 files in ${aefA2Dir}:`);
for (const f of aefA2Files.slice(0, 5)) {
  console.log(`  - ${f}`);
}
console.log(`  ... and ${aefA2Files.length - 5} more files.`);

// 2. Check Speakout Files
const soA1Dir = path.join(UNIFIED_STORAGE_BASE, "Speakout Videos", "SpeakOut A1 3rd SB Video");
const soA1Files = fs.readdirSync(soA1Dir).filter(f => f.endsWith(".mp4"));
console.log(`\n[Speakout A1] Found ${soA1Files.length} MP4 files in ${soA1Dir}:`);
for (const f of soA1Files.slice(0, 5)) {
  console.log(`  - ${f}`);
}
console.log(`  ... and ${soA1Files.length - 5} more files.`);

const soA2Dir = path.join(UNIFIED_STORAGE_BASE, "Speakout Videos", "SpeakOut A2 3rd Video");
const soA2Files = fs.readdirSync(soA2Dir).filter(f => f.endsWith(".mp4"));
console.log(`\n[Speakout A2] Found ${soA2Files.length} MP4 files in ${soA2Dir}:`);
for (const f of soA2Files.slice(0, 5)) {
  console.log(`  - ${f}`);
}
console.log(`  ... and ${soA2Files.length - 5} more files.`);

console.log("\n=== Dual-Track Video File Locations Verified Successfully! ===");
