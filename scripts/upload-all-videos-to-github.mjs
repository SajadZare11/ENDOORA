#!/usr/bin/env node
/**
 * Resumable Video Uploader for GitHub Releases (SajadZare11/ENDOORA)
 * Uploads all 213 video lessons across 13 dedicated release tags.
 * Idempotent: checks existing release assets before upload to allow safe resumes.
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawnSync } from 'child_process';

const REPO = process.env.GITHUB_REPO || 'SajadZare11/ENDOORA';
const BASE_DIR = 'E:/0/Work/Website/The General Website/Speakout and AEF Videos';

const RELEASE_TARGETS = [
  // AEF Releases
  { tag: 'media-aef-a1', folder: 'AEF/A1 level', title: 'AEF Level 1 Videos (A1)', series: 'aef', level: 'a1' },
  { tag: 'media-aef-a2', folder: 'AEF/A2 level', title: 'AEF Level 2 Videos (A2)', series: 'aef', level: 'a2' },
  { tag: 'media-aef-b1', folder: 'AEF/B1 level', title: 'AEF Level 3 Videos (B1)', series: 'aef', level: 'b1' },
  { tag: 'media-aef-b2', folder: 'AEF/B2', title: 'AEF Level 4 Videos (B2)', series: 'aef', level: 'b2' },
  { tag: 'media-aef-c1', folder: 'AEF/C1 level', title: 'AEF Level 5 Videos (C1)', series: 'aef', level: 'c1' },

  // Speakout Releases
  { tag: 'media-so-a1', folder: 'Speakout Videos/SpeakOut A1 3rd SB Video', title: 'Speakout 3rd Edition Videos (A1)', series: 'so', level: 'a1' },
  { tag: 'media-so-a2', folder: 'Speakout Videos/SpeakOut A2 3rd Video', title: 'Speakout 3rd Edition Videos (A2)', series: 'so', level: 'a2' },
  { tag: 'media-so-a2_plus', folder: 'Speakout Videos/SpeakOut A2+ 3rd SB Video', title: 'Speakout 3rd Edition Videos (A2+)', series: 'so', level: 'a2_plus' },
  { tag: 'media-so-b1', folder: 'Speakout Videos/SpeakOut B1 3rd Video', title: 'Speakout 3rd Edition Videos (B1)', series: 'so', level: 'b1' },
  { tag: 'media-so-b1_plus', folder: 'Speakout Videos/SpeakOut B1+ 3rd SB Video', title: 'Speakout 3rd Edition Videos (B1+)', series: 'so', level: 'b1_plus' },
  { tag: 'media-so-b2', folder: 'Speakout Videos/SpeakOut B2 3rd Video', title: 'Speakout 3rd Edition Videos (B2)', series: 'so', level: 'b2' },
  { tag: 'media-so-b2_plus', folder: 'Speakout Videos/SpeakOut B2+ 3rd SB Video', title: 'Speakout 3rd Edition Videos (B2+)', series: 'so', level: 'b2_plus' },
  { tag: 'media-so-c1_c2', folder: 'Speakout Videos/Speakout \u04211-\u04212 3rd SB Video', title: 'Speakout 3rd Edition Videos (C1-C2)', series: 'so', level: 'c1_c2' },
];

function getExistingAssets(tag) {
  try {
    const res = spawnSync('gh', ['release', 'view', tag, '--repo', REPO, '--json', 'assets'], {
      encoding: 'utf-8',
    });
    if (res.status === 0 && res.stdout) {
      const data = JSON.parse(res.stdout);
      const set = new Set();
      for (const a of data.assets || []) {
        set.add(a.name);
        set.add(a.name.toLowerCase());
      }
      return set;
    }
  } catch (e) {}
  return null;
}

function ensureReleaseExists(target) {
  const existing = getExistingAssets(target.tag);
  if (existing !== null) {
    return existing;
  }

  console.log(`[INIT] Creating release ${target.tag} on ${REPO}...`);
  const res = spawnSync('gh', [
    'release', 'create', target.tag,
    '--repo', REPO,
    '--title', target.title,
    '--notes', `Automated video assets for Endoora Video Learning (${target.title}).`,
  ], { encoding: 'utf-8' });

  if (res.status !== 0) {
    console.error(`[ERROR] Failed to create release ${target.tag}:`, res.stderr);
    return new Set();
  }
  return new Set();
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const targetTag = args.find((a) => a.startsWith('--tag='))?.split('=')[1];

  console.log(`=== Endoora GitHub Video Upload Pipeline ===`);
  console.log(`Repository: ${REPO}`);
  console.log(`Dry Run Mode: ${dryRun ? 'YES (Simulated)' : 'NO (Live Upload)'}`);
  if (targetTag) console.log(`Filter Tag: ${targetTag}`);

  let totalFiles = 0;
  let totalUploaded = 0;
  let totalSkipped = 0;
  let totalSizeUploadedBytes = 0;

  for (const target of RELEASE_TARGETS) {
    if (targetTag && target.tag !== targetTag) continue;

    const fullDirPath = path.join(BASE_DIR, target.folder);
    if (!fs.existsSync(fullDirPath)) {
      console.warn(`[WARN] Folder not found: ${fullDirPath}`);
      continue;
    }

    const files = fs.readdirSync(fullDirPath).filter((f) => f.endsWith('.mp4'));
    console.log(`\n------------------------------------------------------------`);
    console.log(`[TARGET] ${target.tag} -> ${files.length} videos in ${target.folder}`);

    const existingAssets = dryRun ? new Set() : ensureReleaseExists(target);

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      const filePath = path.join(fullDirPath, fileName);
      const stat = fs.statSync(filePath);
      const sizeMB = (stat.size / (1024 * 1024)).toFixed(1);
      totalFiles++;

      const dotName = fileName.replace(/\s+/g, '.');
      if (
        existingAssets.has(fileName) ||
        existingAssets.has(dotName) ||
        existingAssets.has(dotName.toLowerCase())
      ) {
        console.log(`  [SKIP (${i + 1}/${files.length})] Already uploaded: ${fileName} (${sizeMB} MB)`);
        totalSkipped++;
        continue;
      }

      console.log(`  [UPLOAD (${i + 1}/${files.length})] Uploading: ${fileName} (${sizeMB} MB)...`);

      if (!dryRun) {
        let attempts = 0;
        let success = false;
        while (attempts < 3 && !success) {
          attempts++;
          const up = spawnSync('gh', [
            'release', 'upload', target.tag, filePath,
            '--repo', REPO,
            '--clobber'
          ], { encoding: 'utf-8', stdio: 'inherit' });

          if (up.status === 0) {
            success = true;
            totalUploaded++;
            totalSizeUploadedBytes += stat.size;
            console.log(`    ✓ Uploaded successfully`);
          } else {
            console.warn(`    ⚠️ Upload attempt ${attempts} failed. Retrying in 5 seconds...`);
            spawnSync('node', ['-e', 'setTimeout(()=>{}, 5000)']);
          }
        }
        if (!success) {
          console.error(`    ❌ FAILED uploading ${fileName} after 3 attempts.`);
        }
      } else {
        totalUploaded++;
      }
    }
  }

  console.log(`\n============================================================`);
  console.log(`Upload pipeline finished.`);
  console.log(`Total video files scanned: ${totalFiles}`);
  console.log(`Already in releases (skipped): ${totalSkipped}`);
  console.log(`Uploaded in this session: ${totalUploaded}`);
  console.log(`Data transferred: ${(totalSizeUploadedBytes / (1024 * 1024)).toFixed(1)} MB`);
  console.log(`============================================================`);
}

main().catch(console.error);
