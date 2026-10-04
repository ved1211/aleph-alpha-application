// Counts visible words in the built page, as the brief defines them:
// everything a visitor can see, except the collapsed "Details and sources"
// section and the demo labels. Decorative single letters, hidden dialogs,
// screen-reader-only text and <noscript> fallbacks are not counted.
// Run after `npm run build`: npm run count-words
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
let body = html.slice(html.indexOf("<body"), html.lastIndexOf("</body>"));

// Removes whole elements, including nested children with the same tag name.
function removeElements(source, openPattern) {
  let out = source;
  for (;;) {
    const match = openPattern.exec(out);
    if (!match) return out;
    const tag = match[1];
    const start = match.index;
    const tagRe = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    tagRe.lastIndex = start;
    let depth = 0;
    let end = out.length;
    for (let m; (m = tagRe.exec(out)); ) {
      if (m[0].endsWith("/>")) continue;
      depth += m[1] ? -1 : 1;
      if (depth === 0) {
        end = m.index + m[0].length;
        break;
      }
    }
    out = out.slice(0, start) + " " + out.slice(end);
  }
}

for (const tag of ["script", "style", "noscript", "dialog", "details", "svg"]) {
  body = removeElements(body, new RegExp(`<(${tag})\\b[^>]*>`, "i"));
}
body = removeElements(body, /<(\w+)\b[^>]*data-wordcount-exclude[^>]*>/i);
// Count the normal experience (JavaScript on): fallbacks shown only without
// JavaScript are removed. Pass --no-js to count the fallback view instead.
const noJs = process.argv.includes("--no-js");
body = removeElements(body, noJs ? /<(\w+)\b[^>]*data-js-only[^>]*>/i : /<(\w+)\b[^>]*data-static-only[^>]*>/i);
body = removeElements(body, /<(\w+)\b[^>]*data-letters[^>]*>/i);
body = removeElements(body, /<(\w+)\b[^>]*class="[^"]*\bsr-only\b[^"]*"[^>]*>/i);
body = removeElements(body, /<(a)\b[^>]*class="skip-link"[^>]*>/i);

// The animated word and the "Let's talk" heading are single words built from
// one span per piece or letter, so join those without spaces first.
function joinElements(source, openPattern) {
  let out = source;
  let from = 0;
  for (;;) {
    openPattern.lastIndex = from;
    const match = openPattern.exec(out);
    if (!match) return out;
    const tag = match[1];
    const tagRe = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    tagRe.lastIndex = match.index;
    let depth = 0;
    let end = out.length;
    for (let m; (m = tagRe.exec(out)); ) {
      depth += m[1] ? -1 : 1;
      if (depth === 0) {
        end = m.index + m[0].length;
        break;
      }
    }
    const joined = " " + out.slice(match.index, end).replace(/<[^>]+>/g, "") + " ";
    out = out.slice(0, match.index) + joined + out.slice(end);
    from = match.index + joined.length;
  }
}
body = joinElements(body, /<(\w+)\b[^>]*data-wc-join[^>]*>/gi);

const text = body
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&#39;|&rsquo;/g, "’")
  .replace(/&[a-z#0-9]+;/gi, " ");
const words = text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
console.log(`Visible words (${noJs ? "JavaScript off" : "JavaScript on"}): ${words.length} (limit 300)`);
if (process.argv.includes("--list")) console.log(words.join(" "));
