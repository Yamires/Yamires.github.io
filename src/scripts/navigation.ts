const sectionLinks = [
  ...document.querySelectorAll<HTMLAnchorElement>("[data-section-link]"),
];
const sections = [
  ...document.querySelectorAll<HTMLElement>(".numbered-section"),
];

if (sectionLinks.length && "IntersectionObserver" in window) {
  const visible = new Set<string>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      const current = sections.find((section) => visible.has(section.id));
      if (!current) return;
      for (const link of sectionLinks) {
        if (link.dataset.sectionLink === current.id)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    },
    { rootMargin: "-24px 0px -55% 0px", threshold: 0 },
  );
  sections.forEach((section) => observer.observe(section));
}

document
  .querySelectorAll<HTMLAnchorElement>(".mobile-contents a")
  .forEach((link) => {
    link.addEventListener("click", () => {
      const disclosure = link.closest("details");
      if (disclosure) disclosure.open = false;
      const section = document.getElementById(link.dataset.sectionLink || "");
      section?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    });
  });

document
  .querySelectorAll<HTMLAnchorElement>(".mobile-menu a")
  .forEach((link) => {
    link.addEventListener("click", () => {
      const menu = link.closest("details");
      if (menu) menu.open = false;
    });
  });
