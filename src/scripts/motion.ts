// Scroll story: GSAP + ScrollTrigger with Lenis smooth scrolling.
// Rules: animate only transform and opacity, pin at most two sections
// (the tokenizer word and the release timeline), and do nothing at all when
// the visitor prefers reduced motion. Elements are only hidden for animation
// here, after this script has loaded, so the page reads fine without it.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

const isShown = (el: HTMLElement) => el.getClientRects().length > 0;

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function smoothScroll() {
  const lenis = new Lenis({ lerp: 0.12 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  $$<HTMLAnchorElement>("a[data-scroll-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = $(link.hash);
      if (!target) return;
      event.preventDefault();
      lenis.resize();
      lenis.scrollTo(target, { offset: -24 });
    });
  });
}

// Chapter 1: three layers of letters. Back is slowest, front is fastest.
function opening() {
  const field = $("#opening-letters");
  const section = field?.closest("section");
  if (!field || !section) return;

  const travel: Record<string, number> = { back: 6, mid: 16, front: 30 };
  $$("[data-depth]", field).forEach((layer) => {
    gsap.to(layer, {
      yPercent: -(travel[layer.dataset.depth ?? "mid"] ?? 10),
      ease: "none",
      scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
    });
  });

  const float = gsap.timeline({ paused: true });
  $$(".glyph", field)
    .filter(isShown)
    .forEach((glyph) => {
      float.to(
        glyph,
        {
          y: gsap.utils.random(-14, 14),
          x: gsap.utils.random(-8, 8),
          duration: gsap.utils.random(4, 7),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        },
        gsap.utils.random(0, 3),
      );
    });
  ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? float.play() : float.pause()),
  });
}

// Chapter 2 (pinned): the word breaks into tokenizer pieces, then joins again.
function tokenStory() {
  const pin = $("[data-reading-pin]");
  const word = pin && $("[data-tok-word]", pin);
  if (!pin || !word) return;

  const pieces = $$("[data-tok-piece]", word);
  const backgrounds = $$("[data-tok-bg]", word);
  const whole = $("[data-tok-whole]", word);
  const capSplit = $('[data-tok-caption="split"]', pin);
  const capWhole = $('[data-tok-caption="whole"]', pin);
  const countSplit = $('[data-tok-count="split"]', pin);
  const countWhole = $('[data-tok-count="whole"]', pin);
  const n = pieces.length;
  const GAP = 0.3; // em between pieces when split

  // Shrinks the word on narrow screens so the split version still fits.
  const fit = () => {
    word.style.fontSize = "";
    const fontSize = parseFloat(getComputedStyle(word).fontSize);
    const available = (word.parentElement?.clientWidth ?? window.innerWidth) * 0.94;
    const needed = word.scrollWidth + (n - 1) * GAP * fontSize;
    if (needed > available) word.style.fontSize = `${(fontSize * available) / needed}px`;
  };
  fit();
  ScrollTrigger.addEventListener("refreshInit", fit);
  const em = () => parseFloat(getComputedStyle(word).fontSize);

  gsap.set(backgrounds, { opacity: 0 });
  gsap.set(whole, { opacity: 0, scale: 0.97 });
  gsap.set([capSplit, capWhole, countSplit, countWhole], { opacity: 0, y: 12 });

  gsap
    .timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    })
    .to({}, { duration: 0.2 })
    .to(pieces, {
      x: (i) => (i - (n - 1) / 2) * GAP * em(),
      y: (i) => (i % 2 ? 1 : -1) * 0.14 * em(),
      rotation: (i) => (i % 2 ? 2.5 : -2.5),
      duration: 1,
    })
    .to(backgrounds, { opacity: 1, duration: 0.6 }, "<0.2")
    .to([capSplit, countSplit], { opacity: 1, y: 0, duration: 0.5 }, "<0.2")
    .to({}, { duration: 0.8 })
    .addLabel("merge")
    .to(pieces, { x: 0, y: 0, rotation: 0, duration: 1 }, "merge")
    .to([capSplit, countSplit], { opacity: 0, y: -12, duration: 0.4 }, "merge")
    .to(backgrounds, { opacity: 0, duration: 0.5 }, "merge+=0.45")
    .to(whole, { opacity: 1, scale: 1, duration: 0.5 }, "merge+=0.55")
    .to([capWhole, countWhole], { opacity: 1, y: 0, duration: 0.5 }, "merge+=0.6")
    .to({}, { duration: 0.6 });
}

// Chapter 3: slow far layer, numbers that count up once.
function research() {
  $$("[data-count-to]").forEach((el) => {
    const target = Number(el.dataset.countTo);
    const counter = { value: 0 };
    el.textContent = "0";
    gsap.to(counter, {
      value: target,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = String(Math.round(counter.value));
      },
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  });

  gsap.from($$("[data-stat]"), {
    opacity: 0,
    y: 36,
    duration: 0.9,
    ease: "power2.out",
    stagger: 0.15,
    scrollTrigger: { trigger: "[data-stat]", start: "top 85%", once: true },
  });
}

function drawings() {
  $$('[data-parallax="far"]').forEach((layer) => {
    gsap.fromTo(
      layer,
      { yPercent: 10 },
      {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: layer.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
}

// Chapter 4: lines draw from "Research" out to the four outputs.
function network() {
  const net = $("[data-net]");
  if (!net) return;
  const lines = $$<SVGLineElement>("[data-net-line]", net);
  const nodes = $$("[data-net-node]", net).slice(1);

  lines.forEach((line) => gsap.set(line, { scale: 0, transformOrigin: line.dataset.origin }));
  gsap.set(nodes, { opacity: 0, scale: 0.9 });

  gsap
    .timeline({ scrollTrigger: { trigger: net, start: "top 80%", end: "center 50%", scrub: 0.6 } })
    .to(lines, { scale: 1, duration: 1, stagger: 0.15, ease: "none" })
    .to(nodes, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.15 }, 0.6);
}

// Chapter 4 (pinned on wide screens): the release timeline scrolls sideways.
function timeline(wide: boolean) {
  const root = $("[data-timeline]");
  const track = root && $("[data-timeline-track]", root);
  if (!root || !track) return;

  if (!wide) {
    gsap.from($$("[data-timeline-panel]", root), {
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: root, start: "top 80%", once: true },
    });
    return;
  }

  const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
  gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: root,
      start: "center center",
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });
}

// Chapter 5: the journey line draws as you scroll; cards fade in beside it.
function journey() {
  const wrap = $("[data-journey]");
  const line = wrap && $("[data-journey-line]", wrap);
  if (!wrap || !line) return;

  gsap.fromTo(
    line,
    { scaleY: 0 },
    {
      scaleY: 1,
      transformOrigin: "50% 0%",
      ease: "none",
      scrollTrigger: { trigger: wrap, start: "top 70%", end: "bottom 70%", scrub: 0.5 },
    },
  );

  $$("[data-journey-item]", wrap).forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      x: 24,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: item, start: "top 82%", once: true },
    });
  });
}

// Chapter 6: scattered letters fly together to spell the heading.
function ending() {
  const stage = $("[data-ending] .ending__stage");
  if (!stage) return;
  const chars = $$("[data-char]", stage);
  const field = $("#ending-letters", stage);
  const rand = seeded(42);
  const spread = () => ({ x: stage.clientWidth * 0.42, y: stage.clientHeight * 0.32 });

  const offsets = chars.map(() => ({ x: rand() * 2 - 1, y: rand() * 2 - 1, r: (rand() * 2 - 1) * 40 }));
  gsap
    .timeline({
      scrollTrigger: { trigger: stage, start: "top 85%", end: "center 55%", scrub: 0.8, invalidateOnRefresh: true },
    })
    .fromTo(
      chars,
      {
        x: (i) => offsets[i].x * spread().x,
        y: (i) => offsets[i].y * spread().y,
        rotation: (i) => offsets[i].r,
        opacity: 0.2,
      },
      { x: 0, y: 0, rotation: 0, opacity: 1, ease: "power2.out", stagger: 0.04 },
    )
    .to(field, { opacity: 0.35, ease: "none" }, 0);
}

export function initMotion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("motion");
  smoothScroll();

  // Created in page order so later triggers account for the pinned space.
  opening();
  tokenStory();
  research();
  drawings();
  network();
  gsap.matchMedia().add({ wide: "(min-width: 900px)", narrow: "(max-width: 899px)" }, (context) => {
    timeline(Boolean(context.conditions?.wide));
  });
  journey();
  ending();
  ScrollTrigger.sort();

  // Fonts change text widths, so measure again once they are ready.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
