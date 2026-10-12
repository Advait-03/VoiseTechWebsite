#!/usr/bin/env node
/** One-off migration: converts the WordPress privacy policy page (Word-exported HTML) to Markdown.
 *   node scripts/convert-legal-page.mjs .wp-cache/html/privacy-policy.html src/content/legal/privacy-policy.md */
import { readFile, writeFile } from 'node:fs/promises';
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';
const [src, out] = process.argv.slice(2);
const doc = parse(await readFile(src, 'utf8'));
const root = doc.querySelector('[data-elementor-type="wp-page"]') || doc.querySelector('main') || doc.querySelector('.entry-content') || doc.querySelector('body');
root.querySelectorAll('script,style,header,footer,.elementor-location-header,.elementor-location-footer,.elementor-widget-breadcrumbs').forEach((n) => n.remove());
// drop the theme's breadcrumb/banner and any "Download Brochure" modal
root.querySelectorAll('*').forEach((n) => { if (/Download Brochure|Contact form not found/.test(n.text) && n.text.length < 200) n.remove(); });
const h1 = root.querySelector('h1');
const title = h1 ? h1.text.replace(/\s+/g, ' ').trim() : 'Privacy Policy';
h1?.remove();
// normalise headings: shallowest becomes h2
const hs = root.querySelectorAll('h1,h2,h3,h4,h5,h6');
const min = Math.min(...hs.map((h) => +h.tagName[1]));
hs.forEach((h) => h.replaceWith(`<h${+h.tagName[1] - min + 2}>${h.text.replace(/\s+/g, ' ').trim()}</h${+h.tagName[1] - min + 2}>`));
const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' });
let md = td.turndown(root.innerHTML)
  .replace(/ /g, ' ')
  .replace(/[ \t]+\n/g, '\n');
// join hard-wrapped lines inside paragraphs (Word export wraps at ~70 chars)
md = md.split(/\n{2,}/).map((block) => /^(#|- |\d+\.)/.test(block) ? block : block.replace(/\n(?!\n)/g, ' ')).join('\n\n');
// "· item" paragraphs → list items
md = md.replace(/^\s*[·•]\s*/gm, '- ').replace(/(^- .*)\n\n(?=- )/gm, '$1\n');
md = md.replace(/\*\*\s+\*\*/g, ' ').replace(/ {2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
const eff = md.match(/Effective\s*Date:\s*([A-Za-z]+ \d{1,2}, \d{4})/i)?.[1];
const upd = md.match(/Last Updated:\s*([A-Za-z]+ \d{1,2}, \d{4})/i)?.[1];
await writeFile(out, `---\ntitle: ${JSON.stringify(title.replace(/\s+/g,' '))}\ndescription: "How Voise Tech Ltd collects, uses, discloses and protects personal data across its website and programmatic advertising services."\neffective: ${JSON.stringify(eff)}\nupdated: ${JSON.stringify(upd)}\n---\n${md}\n`);
console.log(title, eff, upd, md.length);
