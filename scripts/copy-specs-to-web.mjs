import fs from 'node:fs';
import path from 'node:path';

const tiers = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

for (const tier of tiers) {
  const srcPath = path.resolve(`scripts/grammar-specs/${tier}.mjs`);
  const destPath = path.resolve(`apps/web/data/skills/games/specs/${tier}-specs.ts`);
  
  let content = fs.readFileSync(srcPath, 'utf-8');
  
  // Replace export const XX_SPECS = { with import and typed export
  const exportConstRegex = new RegExp(`export const ${tier.toUpperCase()}_SPECS = {`);
  const typedExport = `import type { TierSpecMap } from './spec-types.ts';\n\nexport const ${tier.toUpperCase()}_SPECS: TierSpecMap = {`;
  
  content = content.replace(exportConstRegex, typedExport);
  
  fs.writeFileSync(destPath, content, 'utf-8');
  console.log(`Copied and typed ${tier} to ${destPath}`);
}
console.log('All 6 spec modules copied to apps/web/data/skills/games/specs/');
