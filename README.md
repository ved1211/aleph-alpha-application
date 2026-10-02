# Tokenizer-free AI, explained

A one-page application project by Ved Gawade for the Intern/WS to Chief of Staff (f/m/d) role at Aleph Alpha.

**Independent application project. Not affiliated with or endorsed by Aleph Alpha.**

Live page: https://ved1211.github.io/aleph-alpha-proposal/

## What is on the page

1. A plain-English explainer of the March 2026 report "A Family of LLMs Liberated from Static Vocabularies" (arXiv 2603.15953).
2. A sample release kit: LinkedIn post, conference talk abstract and a 5-slide outline.
3. Public reach numbers for Aleph Alpha Research, examples from other labs and ideas to test.
4. A draft model release checklist.
5. About me and contact details.
6. Sources, all checked on 2 October 2026.

Every fact and number is listed with its source in [research-notes.md](research-notes.md).

## Files

- `index.html`: the page
- `styles.css`: layout and colours (light and dark mode)
- `script.js`: highlights the current section in the menu
- `og-image.png`: 1200x630 preview image for link sharing
- `research-notes.md`: facts, sources and check dates

No framework and no build step. It runs on GitHub Pages as it is.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in a browser.
