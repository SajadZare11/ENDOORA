import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readdir, stat, symlink, unlink } from "node:fs/promises";
import path from "node:path";

// Build-stage only. Relative links keep every public URL valid in the runtime image.
const root = path.resolve("apps/web/public");
const bySize = new Map();
async function visit(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await visit(file);
    if (!entry.isFile()) continue;
    const {size} = await stat(file);
    if (!bySize.has(size)) bySize.set(size, []);
    bySize.get(size).push(file);
  }
}
await visit(root);
for (const files of bySize.values()) {
  if (files.length < 2) continue;
  const digests = new Map();
  for (const file of files.sort()) {
    const hash = createHash("sha256");
    for await (const chunk of createReadStream(file)) hash.update(chunk);
    const digest = hash.digest("hex");
    const first = digests.get(digest);
    if (first) {
      await unlink(file);
      await symlink(path.relative(path.dirname(file),first),file);
    } else digests.set(digest,file);
  }
}
