// Computes the Llama 3.1 tokenizer split for the word animated in chapter 2
// and for the demo presets (shown only when JavaScript is off).
// Run with `npm run tokens`. With JavaScript on, the demo runs the same
// tokenizer live in the browser.
import { readFile, writeFile } from "node:fs/promises";
import { AutoTokenizer } from "@huggingface/transformers";
import { tokenText as toText } from "../src/lib/byte-level.ts";

const TOKENIZER_ID = "Xenova/Meta-Llama-3.1-Tokenizer";
const presets = JSON.parse(await readFile(new URL("../src/data/presets.json", import.meta.url), "utf8"));
const WORDS = [...new Set(["Datenschutzgrundverordnung", ...presets.map((p) => p.text)])];


const tokenizer = await AutoTokenizer.from_pretrained(TOKENIZER_ID);
const out = { tokenizer: TOKENIZER_ID, computedAt: new Date().toISOString(), words: {} };
for (const word of WORDS) {
  const ids = tokenizer.encode(word, { add_special_tokens: false });
  const pieces = tokenizer.tokenize(word, { add_special_tokens: false }).map(toText);
  if (pieces.length !== ids.length) throw new Error("tokenize() and encode() disagree");
  if (pieces.join("") !== word) throw new Error(`Pieces do not rebuild "${word}": ${pieces.join("|")}`);
  out.words[word] = { ids, pieces };
  console.log(word, "->", pieces.join(" | "), `(${pieces.length} pieces)`);
}
await writeFile(new URL("../src/data/token-splits.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
