// Renders public/og-image.png (1200x630): the opening letters and the title.
// Uses the same letter generator as the site and a local Chrome or Chromium.
// Run with: node scripts/make-og-image.mjs
import { writeFile, mkdtemp } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildLayer } from "../src/lib/letters.ts";

const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const root = new URL("../", import.meta.url);
const file = (p) => new URL(p, root).href;

const layers = [
  ["back", 0.16],
  ["mid", 0.24],
  ["front", 0.34],
].map(([name, opacity], i) =>
  buildLayer(name, 11 + i * 101)
    // Keep the bottom strip clear for the disclaimer line.
    .filter((g) => g.y < 80)
    .map(
      (g) =>
        `<span class="g" style="left:${g.x}%;top:${g.y}%"><span style="font-size:${g.size * 1.15}rem;rotate:${g.rotate}deg;opacity:${opacity};color:${g.tone === "amber" ? "#c8811d" : "#1f1b16"}">${g.char}</span>${name === "front" ? `<b>${g.bytes}</b>` : ""}</span>`,
    )
    .join(""),
);

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Serif; src: url("${file("node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2")}"); font-weight: 200 800; }
@font-face { font-family: Sans; src: url("${file("node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2")}"); font-weight: 400 700; }
@font-face { font-family: Deva; src: url("${file("src/assets/fonts/noto-sans-devanagari-letters.woff2")}"); unicode-range: U+0900-097F; }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #f8f4ec; }
.letters .g { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.letters .g > span { font-family: Serif, Deva; line-height: 1; }
.letters b { font: 400 13px ui-monospace, Menlo, monospace; color: #5a5148; }
.title { position: absolute; inset: 0; display: grid; place-content: center; text-align: center; }
h1 { margin: 0; font: 450 96px/1.02 Serif; letter-spacing: -0.025em; color: #1f1b16; }
p { margin: 26px 0 0; font: 400 26px/1.35 Sans; color: #5a5148; }
.foot { position: absolute; left: 0; right: 0; bottom: 26px; text-align: center; font: 500 17px Sans; color: #5a5148; }
</style></head><body>
<div class="letters">${layers.join("")}</div>
<div class="title"><h1>Tokenizer-free AI,<br>explained</h1><p>A work sample by Ved Gawade</p></div>
<div class="foot">Independent application project. Not affiliated with or endorsed by Aleph Alpha.</div>
</body></html>`;

const dir = await mkdtemp(join(tmpdir(), "og-"));
const page = join(dir, "og.html");
await writeFile(page, html);
const out = fileURLToPath(new URL("public/og-image.png", root));
execFileSync(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--allow-file-access-from-files",
  "--window-size=1200,630",
  "--virtual-time-budget=2000",
  `--screenshot=${out}`,
  `file://${page}`,
], { stdio: "ignore" });
console.log(`Wrote ${out}`);
