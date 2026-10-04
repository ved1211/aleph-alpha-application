// TypeScript port of the HAT splitting rule from
// https://github.com/Aleph-Alpha-Research/hat-splitter (src/split.rs).
//
// Steps, in the same order as the Rust code:
// 1. Split on Unicode word boundaries (UAX #29). Rust uses the
//    unicode-segmentation crate; here we use Intl.Segmenter, which follows
//    the same standard but may differ on rare edge cases.
// 2. Split after every punctuation character.
// 3. Split camelCase between a lowercase and an uppercase letter.
// 4. Merge runs of single spaces.
// 5. Group: a space joins the following word, and punctuation joins the
//    preceding space, word or punctuation.
// 6. Optionally cut words longer than a byte limit (the released models use
//    max_word_size = 100 in config.json).

type Kind = "word" | "punctuation" | "whitespace" | "space";

const PUNCT = /\p{P}/gu;
const CAMEL = /\p{Ll}\p{Lu}/gu;
const ONLY_WHITESPACE = /^\s+$/u;
const ONLY_PUNCT = /^\p{P}$/u;

let segmenter: Intl.Segmenter | undefined;

function unicodeWordSplit(input: string): string[] {
  segmenter ??= new Intl.Segmenter(undefined, { granularity: "word" });
  return Array.from(segmenter.segment(input), (s) => s.segment);
}

// Splits right after the first character of every match, like split_at_matches.
function splitAtMatches(s: string, re: RegExp): string[] {
  const result: string[] = [];
  let start = 0;
  re.lastIndex = 0;
  for (const match of s.matchAll(re)) {
    const first = String.fromCodePoint(match[0].codePointAt(0)!);
    const end = match.index! + first.length;
    result.push(s.slice(start, end));
    start = end;
  }
  if (start < s.length) result.push(s.slice(start));
  return result;
}

function combineSpaces(parts: string[]): string[] {
  const out: string[] = [];
  for (const part of parts) {
    const last = out[out.length - 1];
    if (part === " " && last !== undefined && /^ +$/.test(last)) {
      out[out.length - 1] = last + " ";
    } else {
      out.push(part);
    }
  }
  return out;
}

function kindOf(s: string): Kind {
  if (s === " ") return "space";
  if (ONLY_WHITESPACE.test(s)) return "whitespace";
  if (ONLY_PUNCT.test(s)) return "punctuation";
  return "word";
}

export function hatSplit(input: string): string[] {
  const lexed = combineSpaces(
    unicodeWordSplit(input)
      .flatMap((s) => splitAtMatches(s, PUNCT))
      .flatMap((s) => splitAtMatches(s, CAMEL)),
  ).map((text) => ({ text, kind: kindOf(text) }));

  const groups: { text: string; last: Kind }[] = [];
  for (const token of lexed) {
    const group = groups[groups.length - 1];
    const append =
      group !== undefined &&
      ((group.last === "space" && token.kind === "word") ||
        (group.last !== "whitespace" && token.kind === "punctuation"));
    if (append) {
      group.text += token.text;
      group.last = token.kind;
    } else {
      groups.push({ text: token.text, last: token.kind });
    }
  }
  return groups.map((g) => g.text);
}

const encoder = new TextEncoder();

// Cuts words longer than maxBytes at character boundaries, like split_with_limit.
export function hatSplitWithLimit(input: string, maxBytes = 100): string[] {
  return hatSplit(input).flatMap((word) => {
    if (encoder.encode(word).length <= maxBytes) return [word];
    const pieces: string[] = [];
    let current = "";
    for (const ch of word) {
      if (encoder.encode(current + ch).length > maxBytes && current) {
        pieces.push(current);
        current = "";
      }
      current += ch;
    }
    if (current) pieces.push(current);
    return pieces;
  });
}
