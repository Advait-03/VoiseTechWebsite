#!/usr/bin/env node
/**
 * Builds responsive WebP variants for every raster image referenced in src/
 * and writes src/data/image-manifest.json ({ path: { w, h, variants } }), which
 * the <Img> component uses for width/height (no layout shift) and srcset.
 *
 * Originals stay untouched in public/wp-content/uploads (legacy URLs keep
 * working); variants go to public/_img/ mirroring the original path.
 */
import { mkdir, writeFile, access, readFile } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { referencedAssets } from './fetch-assets.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WIDTHS = [320, 640, 960, 1280, 1920];
const MANIFEST = join(ROOT, 'src', 'data', 'image-manifest.json');
const exists = (p) => access(p).then(() => true, () => false);

const previous = (await exists(MANIFEST)) ? JSON.parse(await readFile(MANIFEST, 'utf8')) : {};
const manifest = {};
let built = 0, skipped = 0;
const missing = [];

// Logos get an extra whitespace-trimmed variant (artwork untouched) so logo walls
// can size marks by optical area instead of by their inconsistent canvas padding.
const logoSources = (await Promise.all(['src/data/logos.ts', 'src/data/people.ts'].map((f) => readFile(join(ROOT, f), 'utf8')))).join('\n');
const isLogo = (ref) => /Case-Study-Logos/.test(ref) || (logoSources.includes(ref) && !/Employee|Photos|Gyan|Vic\.png|yum-|Akanksha|Untitled|Pallavi|Anushree|kelly|2025\/12\/4\.png/.test(ref));
const LOGO_WIDTHS = [160, 320, 480];

async function trimmed(ref, src, ext) {
  const { data, info } = await sharp(src).trim({ threshold: 18 }).toBuffer({ resolveWithObject: true });
  const variants = [];
  for (const target of LOGO_WIDTHS.filter((x) => x < info.width).concat(Math.min(info.width, 640))) {
    const out = `/_img${ref.slice(0, -ext.length)}-trim-${target}.webp`;
    const file = join(ROOT, 'public', out);
    if (!(await exists(file))) {
      await mkdir(dirname(file), { recursive: true });
      await sharp(data).resize({ width: target, withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 100 }).toFile(file);
      built++;
    } else skipped++;
    variants.push({ w: target, src: out });
  }
  return { w: info.width, h: info.height, variants };
}

for (const ref of [...(await referencedAssets())].sort()) {
  const ext = extname(ref).toLowerCase();
  const src = join(ROOT, 'public', ref);
  if (!(await exists(src))) { missing.push(ref); continue; }
  if (ext === '.svg') {
    const svg = await readFile(src, 'utf8');
    const vb = svg.match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/);
    const w = Number(svg.match(/\swidth="([\d.]+)/)?.[1] ?? vb?.[1] ?? 0);
    const h = Number(svg.match(/\sheight="([\d.]+)/)?.[1] ?? vb?.[2] ?? 0);
    manifest[ref] = { w: Math.round(w), h: Math.round(h), variants: [] };
    continue;
  }
  if (!['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) continue;

  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  const variants = [];
  for (const target of WIDTHS.filter((x) => x < w).concat(w)) {
    const out = `/_img${ref.slice(0, -ext.length)}-${target}.webp`;
    const file = join(ROOT, 'public', out);
    if (!(await exists(file))) {
      await mkdir(dirname(file), { recursive: true });
      await sharp(src).resize({ width: target, withoutEnlargement: true }).webp({ quality: ext === '.png' ? 82 : 76, effort: 5 }).toFile(file);
      built++;
    } else skipped++;
    variants.push({ w: target, src: out });
  }
  manifest[ref] = { w, h, variants };
  if (isLogo(ref)) manifest[ref].trim = await trimmed(ref, src, ext);
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 0).replace(/},"/g, '},\n"'));
const added = Object.keys(manifest).filter((k) => !previous[k]).length;
console.log(`Images: ${Object.keys(manifest).length} (new ${added}) · variants built ${built}, reused ${skipped}`);
if (missing.length) console.warn(`Missing originals — run \`npm run assets:fetch\`:\n  ${missing.join('\n  ')}`);
