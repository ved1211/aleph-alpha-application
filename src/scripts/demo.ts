// "Try it yourself" demo. The left side runs the real Llama 3.1 tokenizer in
// the browser with transformers.js; the right side runs the HAT splitting rule.
// The tokenizer (about 9 MB) only loads when the demo is close to the screen
// or when someone interacts with it.
import { hatSplitWithLimit } from "../lib/hat-split";
import { chipParts } from "../lib/chips";
import { tokenText } from "../lib/byte-level";
import { TOKENIZER_ID } from "../config";

type Tokenizer = {
  tokenize: (text: string, options: { add_special_tokens: boolean }) => string[];
};

const MESSAGES = {
  loading: "Loading the Llama 3.1 tokenizer (about 9 MB, only once)…",
  error: "The tokenizer could not load right now, so the left side is empty. The word splitter on the right still works. Please try again later.",
};

function renderChips(container: HTMLElement, pieces: string[], hat: boolean) {
  const fragment = document.createDocumentFragment();
  pieces.forEach((piece, i) => {
    const { space, text } = chipParts(piece);
    const chip = document.createElement("span");
    chip.className = hat ? "chip chip--hat" : "chip";
    if (!hat) chip.style.setProperty("--chip", `var(--chip-${(i % 7) + 1})`);
    if (space) {
      const dots = document.createElement("span");
      dots.className = "chip__space";
      dots.textContent = space;
      chip.append(dots);
    }
    chip.append(text);
    fragment.append(chip);
  });
  container.replaceChildren(fragment);
}

export function initDemo() {
  const root = document.querySelector<HTMLElement>("[data-demo]");
  if (!root) return;

  const input = root.querySelector<HTMLTextAreaElement>("[data-demo-input]")!;
  const presets = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-preset]"));
  const tokChips = root.querySelector<HTMLElement>('[data-chips="tok"]')!;
  const hatChips = root.querySelector<HTMLElement>('[data-chips="hat"]')!;
  const tokCount = root.querySelector<HTMLElement>('[data-count="tok"]')!;
  const hatCount = root.querySelector<HTMLElement>('[data-count="hat"]')!;
  const status = root.querySelector<HTMLElement>("[data-status]")!;

  let tokenizer: Tokenizer | null = null;
  let loading: Promise<void> | null = null;

  function update() {
    const text = input.value;
    const words = text ? hatSplitWithLimit(text) : [];
    renderChips(hatChips, words, true);
    hatCount.textContent = String(words.length);

    if (tokenizer) {
      const pieces = text ? tokenizer.tokenize(text, { add_special_tokens: false }).map(tokenText) : [];
      renderChips(tokChips, pieces, false);
      tokCount.textContent = String(pieces.length);
    } else {
      // Never show a count that the live tokenizer did not produce.
      tokChips.replaceChildren();
      tokCount.textContent = "–";
    }
  }

  function load() {
    loading ??= (async () => {
      status.textContent = MESSAGES.loading;
      try {
        const { AutoTokenizer, env } = await import("@huggingface/transformers");
        env.allowLocalModels = false;
        tokenizer = (await AutoTokenizer.from_pretrained(TOKENIZER_ID)) as unknown as Tokenizer;
        status.textContent = "";
      } catch (error) {
        status.textContent = MESSAGES.error;
        console.warn("Tokenizer failed to load", error);
      }
      update();
    })();
    return loading;
  }

  let timer: number | undefined;
  input.addEventListener("input", () => {
    presets.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.preset === input.value)));
    window.clearTimeout(timer);
    timer = window.setTimeout(update, 120);
    void load();
  });
  input.addEventListener("focus", () => void load(), { once: true });

  presets.forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.preset ?? "";
      presets.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      update();
      void load();
    });
  });

  // The server-rendered example stays visible until the live tokenizer is ready.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          void load();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(root);
  } else {
    void load();
  }
}
