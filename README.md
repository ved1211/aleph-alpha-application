# Tokenizer-free AI, explained

A scroll-driven work sample by Ved Gawade for the Intern/WS to Chief of Staff (f/m/d) role at Aleph Alpha. It explains Aleph Alpha Research's March 2026 paper on tokenizer-free models ([arXiv 2603.15953](https://arxiv.org/abs/2603.15953)) in plain English.

**Independent application project. Not affiliated with or endorsed by Aleph Alpha.**

Live address: https://ved1211.github.io/aleph-alpha-application/

## Chapters

1. Opening: floating letters from German, Finnish, English and Devanagari in three depth layers.
2. How most AI reads: "Datenschutzgrundverordnung" splits into real Llama 3.1 tokenizer pieces, then joins back into one word. Then a live demo: the Llama 3.1 tokenizer (via transformers.js) next to a port of Aleph Alpha Research's hat-splitter rule.
3. The research: three numbers from the paper, over a line drawing of Heidelberg's Old Bridge and castle.
4. From research to people: a network that draws itself, and a release timeline (pinned sideways scroll on wide screens).
5. Who I am: a journey line from Mumbai to Neu-Ulm to Heidelberg.
6. Ending: the letters spell "Let's talk", then availability, languages, links and a collapsed "Details and sources" section.

Every fact and number is listed with its source and check date in [research-notes.md](research-notes.md).

## Commands

```bash
npm install            # install dependencies
npm run dev            # local dev server
npm run build          # static build into dist/
npm run preview        # serve the build at http://localhost:4321/aleph-alpha-application/
npm run count-words    # count visible words in the build (limit 400)
npm run tokens         # recompute the stored tokenizer splits (needs internet)
```

Other scripts:

- `node scripts/subset-devanagari.mjs` rebuilds the 2 KB Devanagari font used for the letters.
- `node scripts/make-og-image.mjs` rebuilds `public/og-image.png` (needs Google Chrome, or set `CHROME_PATH`).

## Things you can change

- **Photo:** put `photo.jpg` in this folder and rebuild. It appears in chapter 5.
- **Address:** `site` and `base` in `astro.config.mjs` must match the GitHub Pages address. For a repository with another name, change `base`.

## How it is built

- Astro with TypeScript and static output, Tailwind CSS 4.
- GSAP ScrollTrigger and Lenis. Only `transform` and `opacity` are animated, with two pinned sections. With reduced motion turned on, nothing animates and every chapter shows its final state. Without JavaScript, all text is still readable.
- The demo loads transformers.js and the 9 MB tokenizer only when the demo gets close to the screen. The site uses the tokenizer only, so the ONNX model runtime is replaced by a small stub in the build (`src/lib/ort-stub.js`).
- Fonts: Newsreader and Instrument Sans (self-hosted) and a subset of Noto Sans Devanagari.

## Deploying

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`. In the repository settings, set **Pages > Build and deployment > Source** to **GitHub Actions**.
