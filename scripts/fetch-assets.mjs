#!/usr/bin/env node
/**
 * Mirrors every /wp-content/uploads/ file referenced in src/ from the live site
 * into public/ at the same path, so legacy image URLs keep working.
 *
 *   node scripts/fetch-assets.mjs           # download missing files
 *   node scripts/fetch-assets.mjs --prune   # also delete mirrored files nothing references
 */
import { readdir, readFile, writeFile, mkdir, access, rm } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://www.voisetech.com';
const UPLOADS = join(ROOT, 'public', 'wp-content', 'uploads');
const exists = (p) => access(p).then(() => true, () => false);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

export async function referencedAssets() {
  const refs = new Set();
  for await (const file of walk(join(ROOT, 'src'))) {
    if (!['.astro', '.ts', '.js', '.json', '.md', '.mdx', '.css'].includes(extname(file))) continue;
    if (file.endsWith('image-manifest.json')) continue;
    const text = await readFile(file, 'utf8');
    // Root-relative paths only: "iab.com/wp-content/uploads/…" in an external link is not ours.
    for (const m of text.matchAll(/(?<![\w.-])\/wp-content\/uploads\/[^"'`)\s,]+?\.(?:png|jpe?g|webp|gif|svg|mp4|pdf)/gi)) refs.add(decodeURI(m[0]));
  }
  return refs;
}

// Run only when invoked directly (optimize-images.mjs imports referencedAssets()).
if (process.argv[1]?.endsWith('fetch-assets.mjs')) {
  const refs = await referencedAssets();
  const missing = [];
  for (const ref of refs) if (!(await exists(join(ROOT, 'public', ref)))) missing.push(ref);

  let ok = 0;
  const failed = [];
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (missing.length) {
      const ref = missing.shift();
      try {
        const res = await fetch(ORIGIN + encodeURI(ref), { headers: { 'User-Agent': 'Mozilla/5.0 (VoiseTech asset mirror)' } });
        if (!res.ok) throw new Error(String(res.status));
        const file = join(ROOT, 'public', ref);
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file, Buffer.from(await res.arrayBuffer()));
        ok++;
      } catch (e) {
        failed.push(`${ref} (${e.message})`);
      }
    }
  }));

  let pruned = 0;
  if (process.argv.includes('--prune') && (await exists(UPLOADS))) {
    for await (const file of walk(UPLOADS)) {
      const ref = '/' + file.slice(join(ROOT, 'public').length + 1).replace(/\\/g, '/');
      if (!refs.has(ref)) { await rm(file); pruned++; }
    }
  }

  console.log(`Referenced: ${refs.size} · downloaded: ${ok} · pruned: ${pruned}`);
  if (failed.length) {
    console.error(`Failed (${failed.length}):\n  ${failed.join('\n  ')}`);
    process.exitCode = 1;
  }
}
