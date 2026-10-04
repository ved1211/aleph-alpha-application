// Makes a tiny Devanagari font with only the letters used in the floating
// letters (src/lib/letters.ts). Noto Sans Devanagari is licensed under the
// SIL Open Font License, which allows subsetting.
// Run with: node scripts/subset-devanagari.mjs
import { readFile, writeFile } from "node:fs/promises";
import subsetFont from "subset-font";

const source = new URL(
  "../node_modules/@fontsource-variable/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-wght-normal.woff2",
  import.meta.url,
);
const letters = await readFile(new URL("../src/lib/letters.ts", import.meta.url), "utf8");
const chars = [...new Set(letters.match(/[ऀ-ॿ]/gu))].join("");

const subset = await subsetFont(await readFile(source), chars, {
  targetFormat: "woff2",
  variationAxes: { wght: 400 },
});
await writeFile(new URL("../src/assets/fonts/noto-sans-devanagari-letters.woff2", import.meta.url), subset);
console.log(`Subset ${chars.length} letters (${chars}) into ${subset.length} bytes`);
