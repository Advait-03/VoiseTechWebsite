/**
 * Renders the static globe used by <GlobePresence /> (public/brand/globe.svg)
 * and prints the projected pin positions to paste into the component.
 * Run: node scripts/make-globe.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from 'd3-geo';
import { feature } from 'topojson-client';

const topo = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/land-110m.json', import.meta.url)));
const land = feature(topo, topo.objects.land);

const SIZE = 1000;
const center = [8, 28]; // lon, lat facing the viewer: keeps USA, UK, UAE and India on the visible side
const projection = geoOrthographic().rotate([-center[0], -center[1]]).scale(SIZE / 2 - 4).translate([SIZE / 2, SIZE / 2]).precision(0.3);
const path = geoPath(projection);
const r = (d) => d.replace(/(\d+\.\d{1})\d+/g, '$1'); // trim coordinates to 0.1px

// Country-level pin points (no city implied).
const offices = [
  { name: 'USA', at: [-82, 38] },
  { name: 'UK', at: [-1.5, 52.5] },
  { name: 'UAE', at: [54.4, 24] },
  { name: 'India', at: [78, 21] },
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">
<defs>
<radialGradient id="o" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#e3f1fb"/><stop offset=".6" stop-color="#a9cdea"/><stop offset="1" stop-color="#5f93c4"/></radialGradient>
<radialGradient id="l" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#d9f5e6"/><stop offset=".65" stop-color="#9edcbc"/><stop offset="1" stop-color="#4fae86"/></radialGradient>
<radialGradient id="s" cx="38%" cy="30%" r="72%"><stop offset=".55" stop-color="#0b2545" stop-opacity="0"/><stop offset="1" stop-color="#0b2545" stop-opacity=".35"/></radialGradient>
</defs>
<circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2 - 4}" fill="url(#o)"/>
<path d="${r(path(geoGraticule10()))}" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="1"/>
<path d="${r(path(land))}" fill="url(#l)" stroke="#ffffff" stroke-opacity=".6" stroke-width="1.2"/>
<circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2 - 4}" fill="url(#s)"/>
</svg>`;

writeFileSync(new URL('../public/brand/globe.svg', import.meta.url), svg);
console.log(`globe.svg ${(svg.length / 1024).toFixed(0)} KB`);
for (const o of offices) {
  const visible = geoDistance(o.at, center) < Math.PI / 2;
  const [x, y] = projection(o.at);
  console.log(`{ name: '${o.name}', x: ${(x / 10).toFixed(2)}, y: ${(y / 10).toFixed(2)} },${visible ? '' : ' // HIDDEN'}`);
}
