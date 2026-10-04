// Builds the floating letters used in the opening and the ending.
// Positions come from a seeded random generator, so every build renders the
// same layout and nothing jumps when the page loads.

export type Glyph = {
  char: string;
  script: "latin" | "deva";
  x: number; // percent of the field width
  y: number; // percent of the field height
  size: number; // rem
  rotate: number; // degrees
  tone: "ink" | "amber";
  desktopOnly: boolean;
  bytes: string; // UTF-8 bytes in hex, e.g. "c3 a4" for ä
};

const encoder = new TextEncoder();
const toBytes = (char: string) =>
  Array.from(encoder.encode(char), (b) => b.toString(16).padStart(2, "0")).join(" ");

const GERMAN = ["ä", "ö", "ü", "ß", "Ä", "Ü", "z", "W"];
const FINNISH = ["y", "j", "k", "v", "ä", "ö", "i", "e"];
const ENGLISH = ["a", "e", "r", "t", "h", "w", "g", "Q"];
const DEVANAGARI = ["क", "ग", "ज", "न", "म", "र", "स", "ह", "अ", "आ", "ई", "ष"];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type LayerSpec = { count: number; mobileCount: number; size: [number, number]; avoidCenter: boolean };

export const LAYERS: Record<"back" | "mid" | "front", LayerSpec> = {
  back: { count: 14, mobileCount: 6, size: [1.6, 2.4], avoidCenter: false },
  mid: { count: 12, mobileCount: 6, size: [2.4, 3.6], avoidCenter: true },
  front: { count: 8, mobileCount: 4, size: [3.4, 5], avoidCenter: true },
};

export function buildLayer(layer: keyof typeof LAYERS, seed: number): Glyph[] {
  const spec = LAYERS[layer];
  const rand = mulberry32(seed);
  const pools = [GERMAN, FINNISH, ENGLISH, DEVANAGARI];
  const glyphs: Glyph[] = [];
  for (let i = 0; i < spec.count; i++) {
    const pool = pools[i % pools.length];
    const char = pool[Math.floor(rand() * pool.length)];
    let x = 4 + rand() * 88;
    let y = 6 + rand() * 84;
    // Keep the larger letters away from the title in the middle. Letters that
    // also show on phones stay above or below it, because there the title
    // fills the whole width.
    const mobile = i < spec.mobileCount;
    const overTitle = mobile ? y > 26 && y < 74 : x > 22 && x < 78 && y > 28 && y < 72;
    if (spec.avoidCenter && overTitle) {
      y = y < 50 ? 6 + rand() * 18 : 76 + rand() * 16;
    }
    glyphs.push({
      char,
      script: pool === DEVANAGARI ? "deva" : "latin",
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      size: Math.round((spec.size[0] + rand() * (spec.size[1] - spec.size[0])) * 100) / 100,
      rotate: Math.round((rand() - 0.5) * 24),
      tone: rand() < 0.22 ? "amber" : "ink",
      desktopOnly: i >= spec.mobileCount,
      bytes: toBytes(char),
    });
  }
  return glyphs;
}
