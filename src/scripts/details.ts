// Links like "See sample drafts" point inside the collapsed "Details and
// sources" section. Open the section first so the browser (or Lenis) can
// scroll to the target. Runs with or without the motion script.
export function openDetailsAround(target: Element | null) {
  const details = target?.closest("details");
  if (details && !details.open) details.open = true;
}

export function initDetailsLinks() {
  document.addEventListener(
    "click",
    (event) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (link?.hash) openDetailsAround(document.querySelector(link.hash));
    },
    true,
  );
  if (location.hash) openDetailsAround(document.querySelector(location.hash));
}
