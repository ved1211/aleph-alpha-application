// Highlights the section menu link for the section currently in view.
(function () {
  var nav = document.querySelector(".toc");
  if (!nav || !("IntersectionObserver" in window)) return;

  var links = Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']"));
  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  function setCurrent(id) {
    links.forEach(function (link) {
      var isCurrent = link.getAttribute("href") === "#" + id;
      if (isCurrent) {
        link.setAttribute("aria-current", "true");
        // Keep the active link visible in the horizontal menu on small screens.
        var list = link.closest("ul");
        if (list && list.scrollWidth > list.clientWidth) {
          var left = link.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2;
          list.scrollTo({ left: left, behavior: "smooth" });
        }
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  var visible = {};
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      visible[entry.target.id] = entry.isIntersecting;
    });
    for (var i = 0; i < sections.length; i++) {
      if (visible[sections[i].id]) {
        setCurrent(sections[i].id);
        return;
      }
    }
  }, { rootMargin: "-20% 0px -70% 0px" });

  sections.forEach(function (section) { observer.observe(section); });
})();
