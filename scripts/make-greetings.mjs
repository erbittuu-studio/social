import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(new URL("../../faststore/package.json", import.meta.url))("sharp");

const W = 1080;
const H = 1350;
const out = new URL("../images/greetings/", import.meta.url);
const icon = (id) => new URL(`../images/icons/${id}.png`, import.meta.url).pathname;
const esc = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/'/g, "&#8217;");

const SERIF = "Baskerville, Georgia, serif";
const SANS = "Futura, 'Avenir Next', sans-serif";

const decor = {
  diya: (c) => `
    <ellipse cx="540" cy="560" rx="260" ry="260" fill="url(#glow)"/>
    <path d="M360 600q180 190 360 0q-20 70-180 90q-160 -20 -180 -90z" fill="${c.accent}"/>
    <path d="M340 596h400" stroke="${c.accent}" stroke-width="14" stroke-linecap="round"/>
    <path d="M540 380q70 90 0 170q-70 -80 0 -170z" fill="#ffe27a"/>
    <path d="M540 430q30 50 0 100q-30 -50 0 -100z" fill="#fff6c8"/>
    <g fill="#ffe27a"><circle cx="250" cy="330" r="9"/><circle cx="830" cy="360" r="12"/><circle cx="170" cy="560" r="7"/><circle cx="910" cy="600" r="9"/><circle cx="330" cy="200" r="6"/><circle cx="760" cy="210" r="8"/></g>`,
  sun: (c) => `
    <ellipse cx="540" cy="520" rx="320" ry="320" fill="url(#glow)"/>
    <g stroke="${c.accent}" stroke-width="16" stroke-linecap="round">${Array.from({ length: 16 }, (_, i) => {
      const a = (i * Math.PI) / 8;
      return `<path d="M${540 + Math.cos(a) * 175} ${520 + Math.sin(a) * 175}L${540 + Math.cos(a) * 235} ${520 + Math.sin(a) * 235}"/>`;
    }).join("")}</g>
    <circle cx="540" cy="520" r="135" fill="${c.accent}"/>
    <circle cx="540" cy="520" r="100" fill="#fff3b0" opacity="0.7"/>`,
  leaves: (c) => `
    <ellipse cx="540" cy="540" rx="300" ry="300" fill="url(#glow)"/>
    <g fill="${c.accent}">
      <path d="M540 700q-150 -90 -120 -280q150 60 120 280z"/>
      <path d="M540 700q150 -90 120 -280q-150 60 -120 280z"/>
      <path d="M540 700q-20 -170 0 -330q20 160 0 330z" opacity="0.85"/>
    </g>
    <path d="M540 700v60" stroke="${c.accent}" stroke-width="14" stroke-linecap="round"/>
    <g fill="#ffffff" opacity="0.8"><circle cx="270" cy="330" r="8"/><circle cx="820" cy="420" r="10"/><circle cx="220" cy="600" r="6"/><circle cx="880" cy="640" r="7"/></g>`,
  rings: (c) => `
    <ellipse cx="540" cy="540" rx="320" ry="320" fill="url(#glow)"/>
    <g fill="none" stroke="${c.accent}" stroke-width="10">
      <circle cx="540" cy="540" r="65"/><circle cx="540" cy="540" r="120" opacity="0.8"/><circle cx="540" cy="540" r="175" opacity="0.6"/><circle cx="540" cy="540" r="230" opacity="0.4"/>
    </g>
    <circle cx="540" cy="540" r="36" fill="${c.accent}"/>
    <g fill="#ffe9a8"><circle cx="250" cy="260" r="7"/><circle cx="850" cy="300" r="9"/><circle cx="200" cy="780" r="6"/><circle cx="890" cy="770" r="8"/></g>`,
  balloons: () => `
    <g transform="translate(0 -120)">
      <path d="M300 760q-6 40 12 80" stroke="#7a3000" stroke-width="5" fill="none"/>
      <path d="M540 705q0 50 -8 100" stroke="#7a3000" stroke-width="5" fill="none"/>
      <path d="M790 770q10 40 -10 80" stroke="#7a3000" stroke-width="5" fill="none"/>
      <ellipse cx="300" cy="610" rx="120" ry="150" fill="#ff5a6e"/><ellipse cx="540" cy="540" rx="135" ry="165" fill="#ffc83d"/><ellipse cx="790" cy="620" rx="120" ry="150" fill="#2f9bff"/>
      <ellipse cx="260" cy="560" rx="30" ry="48" fill="#fff" opacity="0.35"/><ellipse cx="495" cy="480" rx="34" ry="52" fill="#fff" opacity="0.35"/><ellipse cx="750" cy="570" rx="30" ry="48" fill="#fff" opacity="0.35"/>
    </g>
    <g transform="translate(0 -60)"><rect x="170" y="330" width="26" height="26" rx="6" fill="#34c58a" transform="rotate(20 183 343)"/><rect x="900" y="360" width="30" height="30" rx="6" fill="#ff8a1f" transform="rotate(-18 915 375)"/><circle cx="130" cy="560" r="12" fill="#ff5a6e"/><circle cx="960" cy="590" r="14" fill="#7a5cff"/></g>`,
  confetti: () => `
    <g>${Array.from({ length: 34 }, (_, i) => {
      const x = 90 + ((i * 197) % 900);
      const y = 230 + ((i * 131) % 520);
      const colors = ["#ff5a6e", "#ffc83d", "#2f9bff", "#34c58a", "#7a5cff", "#ff8a1f"];
      return `<rect x="${x}" y="${y}" width="${16 + (i % 3) * 6}" height="${16 + (i % 4) * 4}" rx="5" fill="${colors[i % 6]}" transform="rotate(${(i * 37) % 90} ${x} ${y})"/>`;
    }).join("")}</g>`,
};

const cards = [
  { key: "diwali", apps: ["1597899453"], bg: ["#3b0a1f", "#b3261e"], glow: "#ff8a1f", accent: "#ff8a1f", ink: "#fff3df", font: SERIF, decor: "diya", kicker: "Dhanteras to Bhai Dooj", head: ["Happy", "Diwali"], sub: "6 to 11 November. Puja dates and the Lakshmi Aarti in one place." },
  { key: "tulasi-vivah", apps: ["1597899453"], bg: ["#0f3b2a", "#2c8a5a"], glow: "#8be0a8", accent: "#c9f2a8", ink: "#f2fff4", font: SERIF, decor: "leaves", lift: -70, kicker: "21 November", head: ["Tulasi", "Vivah"], sub: "The start of the wedding season. Read the vivah puja and set a reminder." },
  { key: "gita-jayanti", apps: ["1597899453"], bg: ["#1b1446", "#5a3fb0"], glow: "#ffd36b", accent: "#ffd36b", ink: "#fff8e6", font: SERIF, decor: "rings", lift: -70, kicker: "20 December", head: ["Gita", "Jayanti"], sub: "The day the Gita was spoken. Read the Krishna Chalisa and Achyutam Keshavam." },
  { key: "makar-sankranti", apps: ["1597899453"], bg: ["#6b2a00", "#ff9a1f"], glow: "#fff0a8", accent: "#fff0a8", ink: "#fffaf0", font: SERIF, decor: "sun", lift: -70, kicker: "15 January", head: ["Makar", "Sankranti"], sub: "Also Pongal and Uttarayan. Read the Gayatri Mantra for the sunrise offering." },
  { key: "childrens-day", apps: ["1597789030", "1597421237"], bg: ["#fff1c9", "#ffd1dc"], glow: "#ffffff", accent: "#ff5a6e", ink: "#7a3000", font: SANS, decor: "balloons", kicker: "12 to 20 November", head: ["Happy", "Children’s Day"], sub: "Pages to color and picture cards that talk. No ads." },
  { key: "new-year", apps: ["1597421237"], bg: ["#ffe8b8", "#ffc7a8"], glow: "#ffffff", accent: "#f26a00", ink: "#7a3000", font: SANS, decor: "confetti", kicker: "1 to 15 January", head: ["Happy", "New Year"], sub: "Start the year with five packs of letters, numbers, shapes and words." },
];

function wrap(text, width) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && `${line} ${word}`.length > width) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}

const names = { 1597899453: "Prarthana", 1597789030: "Colorful", 1597421237: "ABC Learning", 1547752865: "Drawing Pad" };

async function roundedIcon(id, size) {
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.225}"/></svg>`);
  return sharp(icon(id)).resize(size, size).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

async function make(card) {
  const size = 130;
  const gap = 40;
  const total = card.apps.length * size + (card.apps.length - 1) * gap;
  const startX = (W - total) / 2;
  const y = 1130;
  const lines = card.head.map((line, i) => `<text x="540" y="${800 + i * 124}" text-anchor="middle" font-family="${card.font}" font-size="${card.head.length > 1 ? 118 : 130}" font-weight="700" fill="${card.ink}" letter-spacing="-2">${esc(line)}</text>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${card.bg[0]}"/><stop offset="1" stop-color="${card.bg[1]}"/></linearGradient>
      <radialGradient id="glow"><stop offset="0" stop-color="${card.glow}" stop-opacity="0.9"/><stop offset="1" stop-color="${card.glow}" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <text x="540" y="150" text-anchor="middle" font-family="${SANS}" font-size="40" font-weight="600" letter-spacing="8" fill="${card.ink}" opacity="0.85">${esc(card.kicker.toUpperCase())}</text>
    <g transform="translate(0 ${card.lift ?? 0})">${decor[card.decor](card)}</g>
    ${lines}
    ${wrap(card.sub, 40).map((line, i) => `<text x="540" y="${800 + (card.head.length - 1) * 124 + 72 + i * 46}" text-anchor="middle" font-family="${SANS}" font-size="34" fill="${card.ink}" opacity="0.92">${esc(line)}</text>`).join("")}
    ${card.apps.map((id, i) => `<text x="${startX + i * (size + gap) + size / 2}" y="${y + size + 46}" text-anchor="middle" font-family="${SANS}" font-size="30" font-weight="600" fill="${card.ink}">${esc(names[id])}</text>`).join("")}
  </svg>`;
  const layers = [];
  for (const [i, id] of card.apps.entries()) layers.push({ input: await roundedIcon(id, size), left: Math.round(startX + i * (size + gap)), top: y });
  await sharp(Buffer.from(svg)).composite(layers).jpeg({ quality: 88 }).toFile(new URL(`${card.key}.jpg`, out).pathname);
}

mkdirSync(out.pathname, { recursive: true });
for (const card of cards) await make(card);
console.log(`made ${cards.length} pictures`);
