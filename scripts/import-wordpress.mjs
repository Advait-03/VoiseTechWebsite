#!/usr/bin/env node
/**
 * Imports blog posts, case studies and events from the live WordPress site
 * (www.voisetech.com) into Markdown content collections.
 *
 *   node scripts/import-wordpress.mjs            # fetch from the live site
 *   node scripts/import-wordpress.mjs --offline  # reuse .wp-cache/ only
 *
 * - Metadata (slug, dates, tags, SEO fields, featured image) comes from the
 *   WP REST API; body content comes from the rendered page, because the
 *   posts are built with Elementor shortcodes the REST API does not expand.
 * - Every referenced /wp-content/uploads/ asset is mirrored into
 *   public/wp-content/uploads/ at the same path, so existing image URLs keep
 *   resolving after the migration.
 * - Re-running is safe: files are overwritten, existing downloads are kept.
 */
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://www.voisetech.com';
const CACHE = join(ROOT, '.wp-cache');
const OFFLINE = process.argv.includes('--offline');
const UA = 'Mozilla/5.0 (compatible; VoiseTech-site-importer/1.0)';

const exists = (p) => access(p).then(() => true, () => false);

async function cached(key, fetcher) {
  const file = join(CACHE, key);
  if (await exists(file)) return readFile(file, 'utf8');
  if (OFFLINE) throw new Error(`Offline and not cached: ${key}`);
  const body = await fetcher();
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, body);
  return body;
}

async function getText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function restAll(type) {
  const out = [];
  for (let page = 1; page < 20; page++) {
    const body = await cached(`rest/${type}-${page}.json`, () =>
      getText(`${ORIGIN}/wp-json/wp/v2/${type}?per_page=100&page=${page}`).catch((e) =>
        e.message.startsWith('400') ? '[]' : Promise.reject(e),
      ),
    );
    const items = JSON.parse(body);
    if (!Array.isArray(items) || items.length === 0) break;
    out.push(...items);
    if (items.length < 100) break;
  }
  return out;
}

const pageHtml = (link) =>
  cached(`html/${new URL(link).pathname.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'home'}.html`, () => getText(link));

/* ---------------------------------------------------------------- helpers */

const decode = (s = '') =>
  parse(`<p>${s}</p>`).text.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

const toLocal = (url = '') =>
  url.replace(/^https?:\/\/(www\.)?voisetech\.com\/+/i, '/').replace(/^\/\/(www\.)?voisetech\.com\/+/i, '/');

const assets = new Set();
function trackAsset(url) {
  const local = toLocal(url);
  if (local.startsWith('/wp-content/uploads/')) assets.add(local.split('?')[0]);
  return local;
}

function imgSrc(img) {
  const src = img.getAttribute('data-src') || img.getAttribute('src') || '';
  return src.startsWith('data:') ? '' : src;
}

const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced', emDelimiter: '_' });
turndown.addRule('dropEmpty', { filter: (n) => ['SPAN', 'DIV', 'SECTION'].includes(n.nodeName) && !n.textContent.trim() && !n.querySelector('img'), replacement: () => '' });

/** Shift headings so the shallowest body heading is an h2 (the page title is the only h1). */
function normaliseHeadings(root) {
  const hs = root.querySelectorAll('h1,h2,h3,h4,h5,h6');
  if (!hs.length) return;
  const min = Math.min(...hs.map((h) => Number(h.tagName[1])));
  for (const h of hs) {
    const level = Math.min(6, Number(h.tagName[1]) - min + 2);
    h.replaceWith(`<h${level}>${h.text.replace(/\s+/g, ' ').trim()}</h${level}>`);
  }
}

function cleanBody(root) {
  root.querySelectorAll('script,style,noscript,svg,form,iframe').forEach((n) => n.remove());
  for (const img of root.querySelectorAll('img')) {
    const src = imgSrc(img);
    if (!src) { img.remove(); continue; }
    const attrs = { src: trackAsset(src), alt: img.getAttribute('alt') || '' };
    img.replaceWith(`<img src="${attrs.src}" alt="${attrs.alt.replace(/"/g, '&quot;')}">`);
  }
  for (const a of root.querySelectorAll('a')) {
    const href = a.getAttribute('href') || '';
    a.setAttribute('href', /voisetech\.com\/wp-content\//.test(href) ? trackAsset(href) : toLocal(href));
    for (const attr of Object.keys(a.attributes)) if (!['href'].includes(attr)) a.removeAttribute(attr);
  }
  normaliseHeadings(root);
  let md = turndown.turndown(root.innerHTML);
  return md
    .replace(/ /g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\*\*\s*\*\*$/gm, '')
    .trim();
}

/** Pull the post container out of a rendered Elementor page. */
function postContainer(html) {
  const doc = parse(html);
  const root = doc.querySelector('[data-elementor-type="wp-post"]');
  if (!root) throw new Error('No Elementor post container');
  return { doc, root };
}

const linkLabel = (a) => a.text.replace(/\s+/g, ' ').trim().replace(/^(.+) \1$/, '$1');

/** Button widgets and the theme's "label + arrow image" links become structured CTAs. */
function extractCtas(root) {
  const ctas = [];
  for (const w of root.querySelectorAll('.elementor-widget-button')) {
    const a = w.querySelector('a');
    if (a) ctas.push({ label: linkLabel(a), href: toLocal(a.getAttribute('href') || '') });
    w.remove();
  }
  for (const a of root.querySelectorAll('a')) {
    if (!a.querySelector('img[src*="slider-arrow"],img[data-src*="slider-arrow"],img[src*="arrow-next"],img[data-src*="arrow-next"]')) continue;
    const label = linkLabel(a);
    if (label) ctas.push({ label, href: toLocal(a.getAttribute('href') || '') });
    a.remove();
  }
  return ctas;
}

/** "Image Gallery" sections become a structured gallery (full-size image preferred over Elementor thumbs). */
function extractGallery(root, title) {
  const heading = root.querySelectorAll('h1,h2,h3,h4').find((h) => /gallery/i.test(h.text));
  if (!heading) return [];
  const gallery = [];
  const imgs = (heading.closest('.elementor-widget')?.parentNode || root).querySelectorAll('img');
  let i = 0;
  for (const img of imgs) {
    const thumb = imgSrc(img);
    if (!thumb || /slider-arrow|arrow-next/.test(thumb)) continue;
    const href = img.closest('a')?.getAttribute('href') || '';
    const full = /\/wp-content\/uploads\/.+\.(jpe?g|png|webp)$/i.test(href) ? href : thumb;
    const raw = (img.getAttribute('alt') || '').trim();
    const meaningful = raw && !/^[0-9a-f-]{20,}$|^(img|dsc|image)[-_ ]?\d+$/i.test(raw);
    gallery.push({ src: trackAsset(full), alt: meaningful ? raw : `${title} — photo ${++i}` });
    (img.closest('a') || img).remove();
  }
  heading.remove();
  return gallery;
}

/** Hand-curated entries (frontmatter `manual: true`) are never overwritten. */
async function isManual(dir, slug) {
  const file = join(ROOT, 'src/content', dir, `${slug}.md`);
  return (await exists(file)) && /^manual: true$/m.test(await readFile(file, 'utf8'));
}

/** First in-page banner image (1181×400 artwork used at the top of articles). */
function extractBanner(root) {
  const img = root.querySelectorAll('img').find((i) => /in-?page|1181/i.test(imgSrc(i)) || i.getAttribute('width') === '1181');
  if (!img) return undefined;
  const banner = { src: trackAsset(imgSrc(img)), width: Number(img.getAttribute('width')) || 1181, height: Number(img.getAttribute('height')) || 400 };
  (img.closest('.elementor-widget-image') || img).remove();
  return banner;
}

function seoFrom(item) {
  const y = item.yoast_head_json || {};
  const og = (y.og_image || [])[0];
  return {
    seoTitle: decode(y.title || item.title.rendered),
    description: decode(y.description || y.og_description || ''),
    image: og ? { src: trackAsset(og.url), width: og.width || 551, height: og.height || 355 } : undefined,
  };
}

/** Entries are named after the public permalink, which can differ from the REST slug (custom permalinks). */
const urlSlug = (item) => new URL(item.link).pathname.split('/').filter(Boolean).pop() || item.slug;

const excerpt = (item) => decode(item.excerpt?.rendered || '').replace(/\s*\[…\]$|\s*\[&hellip;\]$/, '…').slice(0, 320);

function frontmatter(data) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null || (Array.isArray(v) && !v.length)) continue;
    lines.push(`${k}: ${JSON.stringify(v)}`);
  }
  lines.push('---', '');
  return lines.join('\n');
}

async function writeEntry(dir, slug, data, body) {
  const file = join(ROOT, 'src/content', dir, `${slug}.md`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, frontmatter(data) + body + '\n');
}

/* ------------------------------------------------------------ importers */

async function importPosts(tagsById) {
  const posts = await restAll('posts');
  for (const p of posts) {
    const slug = urlSlug(p);
    if (await isManual('blog', slug)) continue;
    const { root } = postContainer(await pageHtml(p.link));
    root.querySelectorAll('.blog_title,.blog_date_location_wrap').forEach((n) => n.remove());
    const ctas = extractCtas(root);
    const banner = extractBanner(root);
    const body = cleanBody(root);
    // The WordPress author is an admin account name, so it is deliberately not imported.
    await writeEntry('blog', slug, {
      title: decode(p.title.rendered),
      ...seoFrom(p),
      excerpt: excerpt(p),
      date: p.date,
      updated: p.modified,
      tags: (p.tags || []).map((id) => tagsById.get(id)).filter(Boolean),
      banner,
      cta: ctas[0],
      wpId: p.id,
    }, body);
  }
  return posts.length;
}

function parseMetric(line) {
  const m = line.match(/^([A-Za-z][A-Za-z .&/]*?)\s*(?:[–—-]\s*|\s+(?=\d))(.+)$/);
  return m ? { label: m[1].trim(), value: m[2].trim() } : { label: '', value: line.trim() };
}

/** Split Markdown into `## ` sections so named sections can be lifted into structured data. */
function takeSection(md, pattern) {
  const m = md.match(new RegExp(`^## (${pattern})\\s*$`, 'im'));
  if (!m) return { before: md, after: '', section: null };
  const rest = md.slice(m.index + m[0].length);
  const next = rest.search(/^## /m);
  return {
    before: md.slice(0, m.index),
    after: next === -1 ? '' : rest.slice(next),
    section: { heading: m[1], content: (next === -1 ? rest : rest.slice(0, next)).trim() },
  };
}

async function importCaseStudies() {
  const items = await restAll('cb_casestudypost');
  for (const c of items) {
    const slug = urlSlug(c);
    if (await isManual('case-studies', slug)) continue;
    const { root } = postContainer(await pageHtml(c.link));
    const ctas = extractCtas(root);
    const banner = extractBanner(root);
    let body = cleanBody(root);

    // "Publishers" logos and "Metric Results" become structured data.
    let publishers = [];
    let metrics = [];
    let s = takeSection(body, 'Publishers');
    if (s.section) {
      publishers = [...s.section.content.matchAll(/\]\((\/wp-content\/uploads\/[^)\s]+\.(?:png|jpe?g|webp|svg))\)/gi)].map((m) => m[1]);
      body = s.before + s.after;
    }
    s = takeSection(body, 'Metric Results?');
    if (s.section) {
      const lines = s.section.content.split('\n');
      const isItem = (l) => /^\s*[-*]\s+/.test(l);
      metrics = lines.filter(isItem).map((l) => parseMetric(l.replace(/^\s*[-*]\s+/, '').replace(/\*\*/g, '')));
      // Any narrative under "Metric Results" stays in the body, in place.
      const note = lines.filter((l) => !isItem(l)).join('\n').trim();
      body = s.before + (note ? `## ${s.section.heading}\n\n${note}\n\n` : '') + s.after;
    }
    await writeEntry('case-studies', slug, {
      title: decode(c.title.rendered),
      ...seoFrom(c),
      excerpt: excerpt(c),
      date: c.date,
      updated: c.modified,
      banner,
      metrics,
      publishers: [...new Set(publishers)],
      cta: ctas[0],
      wpId: c.id,
    }, body.replace(/\n{3,}/g, '\n\n'));
  }
  return items.length;
}

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

/**
 * Event date text → ISO start/end dates. Handles the formats used on the site:
 * "1st April 2025 - 3rd April 2025", "5th - 6th March 2025", "May 19-21, 2026", "19th December, 2025".
 * Each day takes the month written right after it, else the nearest month before it, else the next one.
 */
function parseDateRange(text = '') {
  const year = [...text.matchAll(/\b(\d{4})\b/g)].map((m) => Number(m[1])).pop();
  if (!year) return {};
  const tokens = [...text.matchAll(/\b(\d{1,2})(?:st|nd|rd|th)?\b|\b([A-Za-z]{3,})\b/g)]
    .map((m) => (m[1] ? { day: Number(m[1]) } : { month: MONTHS.findIndex((x) => x.startsWith(m[2].toLowerCase().slice(0, 3)) && m[2].length <= x.length) }))
    .filter((t) => t.day || t.month >= 0);
  const days = [];
  tokens.forEach((t, i) => {
    if (!t.day) return;
    const after = tokens.slice(i + 1).find((x) => x.day || x.month >= 0);
    const before = tokens.slice(0, i).reverse().find((x) => x.month >= 0);
    const later = tokens.slice(i + 1).find((x) => x.month >= 0);
    const month = after?.month >= 0 ? after.month : before ? before.month : later?.month;
    if (month >= 0) days.push({ d: t.day, mo: month });
  });
  if (!days.length) return {};
  const iso = (x) => `${year}-${String(x.mo + 1).padStart(2, '0')}-${String(x.d).padStart(2, '0')}`;
  return { start: iso(days[0]), end: iso(days[days.length - 1]) };
}

async function importEvents() {
  const items = await restAll('cb_eventpost');
  for (const e of items) {
    const slug = urlSlug(e);
    if (await isManual('events', slug)) continue;
    const html = await pageHtml(e.link);
    const { root } = postContainer(html);
    const wrap = root.querySelector('.blog_date_location_wrap');
    const parts = wrap ? wrap.childNodes.map((n) => n.text?.replace(/\s+/g, ' ').trim()).filter(Boolean) : [];
    const countdownTarget = (html.match(/targetDate\s*=\s*new Date\(['"]([^'"]+)['"]\)/) || [])[1];
    const countdown = root.querySelector('.countdown-timer-section');
    const countdownHeading = countdown?.querySelector('h1,h2,h3,h4')?.text.trim();
    (countdown?.closest('.elementor-widget') || countdown)?.remove();
    root.querySelectorAll('.blog_title,.blog_date_location_wrap').forEach((n) => n.remove());

    // External buttons (meeting scheduler, event website) become actions.
    const actions = extractCtas(root);
    for (const a of root.querySelectorAll('a')) {
      const href = a.getAttribute('href') || '';
      const label = a.text.replace(/\s+/g, ' ').trim().replace(/^(.+) \1$/, '$1');
      if (/^https?:/.test(href) && !/voisetech\.com/.test(href) && label && /schedule|website|register|book|visit|meet/i.test(label)) {
        actions.push({ label, href });
        a.remove();
      }
    }
    const banner = extractBanner(root);
    const title = decode(e.title.rendered);
    const gallery = extractGallery(root, title);
    const body = cleanBody(root);
    const range = parseDateRange(parts[0]);
    await writeEntry('events', slug, {
      title,
      ...seoFrom(e),
      excerpt: excerpt(e),
      date: e.date,
      updated: e.modified,
      dateText: parts[0],
      location: parts[1],
      startDate: range.start,
      endDate: range.end,
      startsAt: countdownTarget,
      countdownHeading,
      banner,
      actions: actions.filter((a, i) => actions.findIndex((b) => b.href === a.href) === i),
      gallery,
      wpId: e.id,
    }, body);
  }
  return items.length;
}

/* -------------------------------------------------------------- assets */

async function downloadAssets() {
  const queue = [...assets];
  let fetched = 0, failed = [];
  const worker = async () => {
    while (queue.length) {
      const path = queue.shift();
      const file = join(ROOT, 'public', decodeURIComponent(path));
      if (await exists(file)) continue;
      if (OFFLINE) { failed.push(path); continue; }
      try {
        const res = await fetch(ORIGIN + path, { headers: { 'User-Agent': UA } });
        if (!res.ok) throw new Error(String(res.status));
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file, Buffer.from(await res.arrayBuffer()));
        fetched++;
      } catch (err) {
        failed.push(`${path} (${err.message})`);
      }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return { fetched, failed };
}

/* ---------------------------------------------------------------- main */

const tags = await restAll('tags');
const tagsById = new Map(tags.map((t) => [t.id, { name: decode(t.name), slug: t.slug }]));
const counts = {
  posts: await importPosts(tagsById),
  caseStudies: await importCaseStudies(),
  events: await importEvents(),
};
const { fetched, failed } = await downloadAssets();
console.log(`Imported ${counts.posts} posts, ${counts.caseStudies} case studies, ${counts.events} events.`);
console.log(`Assets referenced: ${assets.size}, downloaded now: ${fetched}.`);
if (failed.length) {
  console.warn(`Failed assets (${failed.length}):\n  ${failed.join('\n  ')}`);
  process.exitCode = 1;
}
