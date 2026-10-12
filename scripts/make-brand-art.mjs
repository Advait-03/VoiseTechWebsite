/**
 * Draws the brand illustrations in public/brand/art/ (1120 × 840, 4:3) that replace
 * stock photos on About, Solutions, Products, Login and GAM 360.
 * Deliberately free of figures and partner names: they illustrate, they don't claim.
 * Run: node scripts/make-brand-art.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = new URL('../public/brand/art/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const SANS = `font-family="Inter, 'Segoe UI', Roboto, Arial, sans-serif"`;
const MONO = `font-family="'JetBrains Mono', Consolas, 'Courier New', monospace"`;
const BLUE = '#3a9bf0', GREEN = '#2fd27a', RED = '#ff5d6c', MUTED = '#b9c8dc';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const t = (x, y, size, text, { fill = '#fff', weight = 500, mono = false, anchor = 'start', op = 1, ls = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" fill-opacity="${op}" text-anchor="${anchor}" letter-spacing="${ls}" ${mono ? MONO : SANS}>${esc(text)}</text>`;
const card = (x, y, w, h, r = 22, op = 0.06) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#fff" fill-opacity="${op}" stroke="#fff" stroke-opacity=".14" stroke-width="1.5"/>`;
const check = (cx, cy, r = 14, color = GREEN) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/><path d="M${cx - r * 0.42} ${cy}l${r * 0.3} ${r * 0.3} ${r * 0.55}-${r * 0.6}" fill="none" stroke="#06172e" stroke-width="${r * 0.22}" stroke-linecap="round" stroke-linejoin="round"/>`;
const chip = (x, y, label, on = true, size = 22) => {
  const w = Math.round(label.length * size * 0.58 + 40);
  return { w, svg: `<rect x="${x}" y="${y}" width="${w}" height="${size * 2}" rx="${size}" fill="${on ? BLUE : '#fff'}" fill-opacity="${on ? 0.9 : 0.04}" stroke="#fff" stroke-opacity="${on ? 0 : 0.25}" stroke-width="1.5"/>${t(x + w / 2, y + size * 1.36, size, label, { anchor: 'middle', weight: 600, fill: on ? '#fff' : MUTED })}` };
};
const chips = (x, y, labels, gap = 12, size = 22, onFn = () => true) => {
  let cx = x;
  return labels.map((l, i) => { const c = chip(cx, y, l, onFn(i), size); cx += c.w + gap; return c.svg; }).join('');
};
const eyebrow = (x, y, text) => `<circle cx="${x + 6}" cy="${y - 8}" r="6" fill="${GREEN}"/>${t(x + 22, y, 22, text.toUpperCase(), { mono: true, fill: MUTED, ls: 2.5 })}`;

const frame = (body, css = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 840" width="1120" height="840">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#06172e"/><stop offset="1" stop-color="#0a2b57"/></linearGradient>
<radialGradient id="gb" cx="12%" cy="8%" r="65%"><stop offset="0" stop-color="#0870c7" stop-opacity=".55"/><stop offset="1" stop-color="#0870c7" stop-opacity="0"/></radialGradient>
<radialGradient id="gg" cx="92%" cy="96%" r="55%"><stop offset="0" stop-color="#0eb151" stop-opacity=".38"/><stop offset="1" stop-color="#0eb151" stop-opacity="0"/></radialGradient>
<pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="#fff" fill-opacity=".07"/></pattern>
<linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0870c7"/><stop offset="1" stop-color="#0eb151"/></linearGradient>
<linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GREEN}" stop-opacity=".45"/><stop offset="1" stop-color="${GREEN}" stop-opacity="0"/></linearGradient>
</defs>
<style>
.flow{stroke-dasharray:8 12;animation:flow 1.4s linear infinite}
@keyframes flow{to{stroke-dashoffset:-40}}
.pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.6s ease-out infinite}
@keyframes pulse{0%{transform:scale(.7);opacity:.7}100%{transform:scale(2.3);opacity:0}}
${css}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
<rect width="1120" height="840" fill="url(#bg)"/><rect width="1120" height="840" fill="url(#gb)"/><rect width="1120" height="840" fill="url(#gg)"/><rect width="1120" height="840" fill="url(#dots)"/>
${body}
</svg>`;

const art = {};

/* Publishers: inventory → real-time auction → ad served */
art.publishers = frame(`
${card(60, 230, 270, 380)}
${eyebrow(88, 285, 'Inventory')}
<rect x="88" y="315" width="214" height="16" rx="8" fill="#fff" fill-opacity=".18"/>
<rect x="88" y="345" width="160" height="16" rx="8" fill="#fff" fill-opacity=".12"/>
<rect x="88" y="385" width="214" height="120" rx="14" fill="${GREEN}" fill-opacity=".1" stroke="${GREEN}" stroke-width="2.5" stroke-dasharray="10 8"/>
${t(195, 455, 24, 'Ad slot', { anchor: 'middle', weight: 600, fill: GREEN })}
<rect x="88" y="530" width="214" height="16" rx="8" fill="#fff" fill-opacity=".12"/>
<rect x="88" y="560" width="130" height="16" rx="8" fill="#fff" fill-opacity=".12"/>
<path d="M330 420 H 400" stroke="${BLUE}" stroke-width="4" class="flow"/>
${card(400, 120, 360, 600)}
${eyebrow(430, 178, 'Live auction')}
<circle cx="722" cy="170" r="8" fill="${GREEN}"/><circle cx="722" cy="170" r="8" fill="${GREEN}" class="pulse"/>
${[['Demand partner A', 0.92, true], ['Demand partner B', 0.74], ['Demand partner C', 0.58], ['Demand partner D', 0.41], ['Demand partner E', 0.3]].map(([name, v, win], i) => {
  const y = 230 + i * 92;
  return `${t(430, y, 22, name, { fill: win ? '#fff' : MUTED, weight: win ? 600 : 500 })}
<rect x="430" y="${y + 18}" width="300" height="26" rx="13" fill="#fff" fill-opacity=".06"/>
<rect x="430" y="${y + 18}" width="${300 * v}" height="26" rx="13" fill="${win ? 'url(#brand)' : BLUE}" fill-opacity="${win ? 1 : 0.55}" class="bar" style="animation-delay:${i * 0.12}s"/>
${win ? check(712, y - 8, 15) : ''}`;
}).join('')}
<path d="M540 215 V 690" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-dasharray="6 8"/>
${t(548, 700, 18, 'FLOOR', { mono: true, fill: MUTED, ls: 1.5 })}
<path d="M760 420 H 830" stroke="${GREEN}" stroke-width="4" class="flow"/>
${card(830, 260, 240, 320)}
${eyebrow(856, 312, 'Ad served')}
<rect x="856" y="340" width="188" height="140" rx="14" fill="url(#brand)" fill-opacity=".85"/>
<path d="M930 385 l40 25 -40 25z" fill="#fff" fill-opacity=".9"/>
${check(950, 530, 22)}
`, `.bar{transform-box:fill-box;transform-origin:left;animation:grow 3.2s ease-in-out infinite alternate}@keyframes grow{from{transform:scaleX(.82)}to{transform:scaleX(1)}}`);

/* Buyers: targeting dashboard */
art.buyers = frame(`
${card(70, 90, 980, 660, 26)}
${eyebrow(110, 152, 'Campaign planner')}
<rect x="890" y="122" width="120" height="44" rx="22" fill="${GREEN}" fill-opacity=".16" stroke="${GREEN}" stroke-width="1.5"/>
<circle cx="918" cy="144" r="7" fill="${GREEN}"/><circle cx="918" cy="144" r="7" fill="${GREEN}" class="pulse"/>
${t(962, 152, 22, 'Live', { anchor: 'middle', weight: 600, fill: GREEN })}
${t(110, 222, 22, 'Audiences', { fill: MUTED })}
${chips(110, 240, ['Auto intenders', 'Sports fans'], 12, 20, (i) => i === 0)}
${chips(110, 300, ['Travel planners', 'Parents'], 12, 20, (i) => i === 0)}
${t(110, 400, 22, 'Channels', { fill: MUTED })}
${['CTV', 'Mobile', 'Web', 'DOOH'].map((c, i) => {
  const y = 430 + i * 70, on = i !== 3;
  return `${card(110, y, 360, 56, 14, 0.04)}${t(134, y + 36, 24, c, { weight: 600 })}
<rect x="390" y="${y + 14}" width="56" height="28" rx="14" fill="${on ? GREEN : '#fff'}" fill-opacity="${on ? 1 : 0.15}"/><circle cx="${on ? 432 : 404}" cy="${y + 28}" r="10" fill="#fff"/>`;
}).join('')}
${card(510, 200, 500, 300, 18, 0.04)}
${t(540, 245, 22, 'Reach', { fill: MUTED })}
<path d="M540 470 C 620 460, 660 330, 760 300 S 920 250, 980 240 V 470 Z" fill="url(#area)"/>
<path d="M540 470 C 620 460, 660 330, 760 300 S 920 250, 980 240" fill="none" stroke="${GREEN}" stroke-width="4" class="draw"/>
<path d="M540 470 H 980" stroke="#fff" stroke-opacity=".2" stroke-width="1.5"/>
<circle cx="760" cy="300" r="9" fill="#fff" stroke="${GREEN}" stroke-width="4"/>
${card(510, 530, 240, 190, 18, 0.04)}
<g transform="translate(590 625)">
<circle r="48" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="20"/>
<circle r="48" fill="none" stroke="${BLUE}" stroke-width="20" stroke-dasharray="140 302" transform="rotate(-90)"/>
<circle r="48" fill="none" stroke="${GREEN}" stroke-width="20" stroke-dasharray="95 302" stroke-dashoffset="-140" transform="rotate(-90)"/>
<circle r="48" fill="none" stroke="#9ec9f5" stroke-width="20" stroke-dasharray="67 302" stroke-dashoffset="-235" transform="rotate(-90)"/>
</g>
${[['CTV', BLUE], ['Mobile', GREEN], ['Web', '#9ec9f5']].map(([l, c], i) => `<circle cx="672" cy="${588 + i * 36}" r="7" fill="${c}"/>${t(686, 596 + i * 36, 20, l, { fill: MUTED })}`).join('')}
${card(770, 530, 240, 190, 18, 0.04)}
${t(796, 580, 22, 'Brand safety', { fill: MUTED })}
${[0, 1, 2].map((i) => `${check(812, 620 + i * 36, 11)}<rect x="834" y="${612 + i * 36}" width="${[140, 110, 150][i]}" height="14" rx="7" fill="#fff" fill-opacity=".16"/>`).join('')}
`, `.draw{stroke-dasharray:620;animation:draw 4s ease-in-out infinite alternate}@keyframes draw{from{stroke-dashoffset:620}40%{stroke-dashoffset:0}to{stroke-dashoffset:0}}`);

/* Responsibility: traffic through a shield, invalid traffic filtered out */
const lanes = [330, 380, 430, 480, 530];
const inDots = lanes.flatMap((y, i) => [0, 1].map((k) => {
  const bad = (i + k) % 3 === 0;
  return `<circle cx="80" cy="${y}" r="9" fill="${bad ? RED : '#e6efff'}" class="in" style="animation-delay:-${(i * 0.55 + k * 1.5).toFixed(2)}s"/>`;
})).join('');
const outDots = lanes.flatMap((y, i) => [0, 1].map((k) => `<circle cx="760" cy="${y}" r="9" fill="${GREEN}" class="out" style="animation-delay:-${(i * 0.5 + k * 1.4).toFixed(2)}s"/>`)).join('');
art.responsibility = frame(`
${t(80, 110, 22, 'INCOMING TRAFFIC', { mono: true, fill: MUTED, ls: 2 })}
${t(1040, 110, 22, 'VERIFIED', { mono: true, fill: MUTED, ls: 2, anchor: 'end' })}
${inDots}${outDots}
<circle cx="560" cy="430" r="150" fill="${BLUE}" fill-opacity=".08" class="pulse"/>
<path d="M560 230 L700 285 V420 C700 520 640 590 560 630 C480 590 420 520 420 420 V285 Z" fill="#0a2b57" stroke="url(#brand)" stroke-width="8" stroke-linejoin="round"/>
<path d="M560 262 L672 306 V420 C672 500 624 560 560 594 C496 560 448 500 448 420 V306 Z" fill="url(#brand)" fill-opacity=".18"/>
<rect x="520" y="420" width="80" height="66" rx="12" fill="#fff"/>
<path d="M534 420 V398 a26 26 0 0 1 52 0 V420" fill="none" stroke="#fff" stroke-width="10"/>
<circle cx="560" cy="447" r="9" fill="#0a2b57"/><rect x="556" y="450" width="8" height="20" rx="4" fill="#0a2b57"/>
<circle cx="560" cy="650" r="9" fill="${RED}" class="drop"/><circle cx="560" cy="650" r="9" fill="${RED}" class="drop" style="animation-delay:-1.3s"/>
${card(440, 700, 240, 70, 35, 0.05)}
<circle cx="476" cy="735" r="12" fill="${RED}"/><path d="M470 729l12 12M482 729l-12 12" stroke="#06172e" stroke-width="3" stroke-linecap="round"/>
${t(500, 743, 22, 'Invalid traffic', { weight: 600 })}
${chips(80, 610, ['Consent signals', 'Data privacy'], 12, 20, () => false)}
${chips(690, 610, ['IVT filtering', 'Brand safety'], 12, 20, () => false)}
`, `.in{transform-box:fill-box;animation:in 3s linear infinite}@keyframes in{0%{transform:translateX(0);opacity:0}10%{opacity:1}85%{opacity:1}100%{transform:translateX(330px);opacity:0}}
.out{transform-box:fill-box;animation:out 3s linear infinite}@keyframes out{0%{transform:translateX(0);opacity:0}15%{opacity:1}90%{opacity:1}100%{transform:translateX(290px);opacity:0}}
.drop{transform-box:fill-box;animation:drop 2.6s ease-in infinite}@keyframes drop{0%{transform:translateY(-20px);opacity:0}20%{opacity:1}100%{transform:translateY(40px);opacity:0}}`);

/* Vision: one hub, every screen */
const sats = [['CTV', -90], ['Mobile', -30], ['Web', 30], ['DOOH', 90], ['Audio', 150], ['In-App', 210]];
art.vision = frame(`
${[120, 200, 280].map((ry) => `<ellipse cx="560" cy="420" rx="${ry * 1.55}" ry="${ry}" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="1.5"/>`).join('')}
${sats.map(([label, deg], i) => {
  const a = (deg * Math.PI) / 180, x = 560 + Math.cos(a) * 380, y = 420 + Math.sin(a) * 260;
  return `<path d="M560 420 L${x.toFixed(0)} ${y.toFixed(0)}" stroke="${i % 2 ? GREEN : BLUE}" stroke-width="3" class="flow" style="animation-delay:-${i * 0.2}s"/>
${card(x - 80, y - 34, 160, 68, 34, 0.1)}<circle cx="${x - 50}" cy="${y}" r="9" fill="${i % 2 ? GREEN : BLUE}"/>${t(x + 10, y + 8, 22, label, { anchor: 'middle', weight: 600 })}`;
}).join('')}
<circle cx="560" cy="420" r="96" fill="url(#brand)" fill-opacity=".25" class="pulse"/>
<circle cx="560" cy="420" r="96" fill="url(#brand)" fill-opacity=".25" class="pulse" style="animation-delay:-1.3s"/>
<circle cx="560" cy="420" r="92" fill="url(#brand)"/>
${t(560, 412, 30, 'Voise', { anchor: 'middle', weight: 700 })}${t(560, 448, 30, 'Tech', { anchor: 'middle', weight: 700 })}
${eyebrow(70, 90, 'Omnichannel')}
`);

/* Mission: every impression traceable */
art.mission = frame(`
${card(70, 110, 500, 620)}
${eyebrow(104, 168, 'Impression path')}
<path d="M138 246 V 640" stroke="#fff" stroke-opacity=".15" stroke-width="3"/>
<path d="M138 246 V 640" stroke="${GREEN}" stroke-width="3" class="trace"/>
${['Ad request', 'Auction cleared', 'Quality verified', 'Impression delivered'].map((s, i) => {
  const y = 246 + i * 131;
  return `${check(138, y, 20)}${t(178, y + 8, 26, s, { weight: 600 })}<rect x="178" y="${y + 28}" width="${[220, 180, 240, 200][i]}" height="14" rx="7" fill="#fff" fill-opacity=".12"/>`;
}).join('')}
${card(610, 110, 440, 300)}
${eyebrow(642, 168, 'Spend visibility')}
${(() => {
  let x = 642, lx = 650, svg = '';
  for (const [l, v, c] of [['Media', 0.68, BLUE], ['Platform', 0.2, GREEN], ['Data', 0.12, '#9ec9f5']]) {
    svg += `<rect x="${x}" y="210" width="${376 * v - 4}" height="56" rx="10" fill="${c}"/><circle cx="${lx}" cy="320" r="8" fill="${c}"/>${t(lx + 16, 328, 22, l, { fill: MUTED })}`;
    x += 376 * v; lx += l.length * 14 + 50;
  }
  return svg;
})()}
${card(610, 440, 440, 290)}
<circle cx="760" cy="570" r="70" fill="none" stroke="#fff" stroke-width="12"/>
<path d="M810 620 L880 690" stroke="#fff" stroke-width="18" stroke-linecap="round"/>
<path d="M728 570 h64 M728 548 h40 M728 592 h52" stroke="${GREEN}" stroke-width="8" stroke-linecap="round"/>
${t(920, 560, 26, 'Every bid,', { weight: 600, anchor: 'middle' })}${t(920, 596, 26, 'visible.', { weight: 600, anchor: 'middle', fill: GREEN })}
`, `.trace{stroke-dasharray:394;animation:trace 5s ease-in-out infinite}@keyframes trace{from{stroke-dashoffset:394}60%{stroke-dashoffset:0}to{stroke-dashoffset:0}}`);

/* GAM 360: managed ad stack, yield trending up */
art.gam = frame(`
${card(70, 100, 520, 640)}
${eyebrow(104, 160, 'Ad Manager setup')}
${['Ad units', 'Line items', 'Header bidding', 'Unified pricing rules', 'Yield groups', 'Reporting'].map((s, i) => {
  const y = 200 + i * 86;
  return `${card(104, y, 452, 66, 14, 0.04)}${t(132, y + 42, 24, s, { weight: 600 })}
<rect x="476" y="${y + 19}" width="56" height="28" rx="14" fill="${GREEN}"/><circle cx="518" cy="${y + 33}" r="10" fill="#fff"/>`;
}).join('')}
${card(630, 100, 420, 400)}
${eyebrow(662, 160, 'Yield')}
<path d="M662 450 L740 410 L800 425 L870 350 L930 330 L1010 240 V450Z" fill="url(#area)"/>
<path d="M662 450 L740 410 L800 425 L870 350 L930 330 L1010 240" fill="none" stroke="${GREEN}" stroke-width="5" stroke-linejoin="round" class="draw"/>
<path d="M985 240 h25 v25" fill="none" stroke="${GREEN}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M662 450 H1010" stroke="#fff" stroke-opacity=".2" stroke-width="1.5"/>
${card(630, 530, 420, 210)}
${eyebrow(662, 590, 'Managed for you')}
${chips(662, 620, ['Setup', 'Optimisation'], 12, 22, () => false)}
${chips(662, 680, ['Support', 'Compliance'], 12, 22, () => false)}
`, `.draw{stroke-dasharray:520;animation:draw 4s ease-in-out infinite alternate}@keyframes draw{from{stroke-dashoffset:520}50%{stroke-dashoffset:0}to{stroke-dashoffset:0}}`);

/* Authorized Buyer: buyers → verified gateway → premium inventory */
art.authorized = frame(`
${card(60, 200, 280, 440)}
${eyebrow(90, 258, 'Buyers')}
${['Agencies', 'Brands', 'Trading desks'].map((s, i) => `${card(90, 290 + i * 100, 220, 72, 14, 0.05)}<circle cx="124" cy="${326 + i * 100}" r="12" fill="${BLUE}"/>${t(148, 334 + i * 100, 23, s, { weight: 600 })}`).join('')}
<path d="M340 420 H470" stroke="${BLUE}" stroke-width="4" class="flow"/>
<rect x="470" y="250" width="180" height="340" rx="90" fill="#0a2b57" stroke="url(#brand)" stroke-width="6"/>
<circle cx="560" cy="420" r="70" fill="url(#brand)" fill-opacity=".25" class="pulse"/>
<rect x="526" y="410" width="68" height="56" rx="10" fill="#fff"/>
<path d="M538 410 V392 a22 22 0 0 1 44 0 V410" fill="none" stroke="#fff" stroke-width="9"/>
${check(560, 438, 15)}
${t(560, 630, 20, 'AUTHORIZED', { anchor: 'middle', mono: true, fill: MUTED, ls: 2 })}
<path d="M650 420 H760" stroke="${GREEN}" stroke-width="4" class="flow"/>
${card(760, 140, 300, 560)}
${eyebrow(790, 198, 'Premium supply')}
${['CTV', 'Video', 'In-App', 'Web', 'Audio', 'DOOH'].map((s, i) => {
  const x = 790 + (i % 2) * 125, y = 230 + Math.floor(i / 2) * 150;
  return `${card(x, y, 112, 128, 16, 0.07)}<rect x="${x + 18}" y="${y + 20}" width="76" height="46" rx="8" fill="url(#brand)" fill-opacity=".7"/>${t(x + 56, y + 100, 21, s, { anchor: 'middle', weight: 600 })}${check(x + 100, y + 14, 12)}`;
}).join('')}
`);

for (const [name, svg] of Object.entries(art)) {
  writeFileSync(new URL(`${name}.svg`, OUT), svg);
  console.log(`${name}.svg ${(svg.length / 1024).toFixed(1)} KB`);
}
