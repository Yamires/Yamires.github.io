const entries = [
  ...document.querySelectorAll<HTMLDetailsElement>(".research-entry"),
];
function revealResearchEntry() {
  let id: string;
  try {
    id = decodeURIComponent(location.hash.slice(1));
  } catch {
    return;
  }
  const target = document
    .getElementById(id)
    ?.closest<HTMLDetailsElement>(".research-entry");
  entries.forEach((entry) => {
    if (entry !== target) delete entry.dataset.linked;
  });
  if (!target) return;
  target.open = true;
  target.dataset.linked = "true";
  requestAnimationFrame(() =>
    target.scrollIntoView({ block: "start", behavior: "instant" }),
  );
}
revealResearchEntry();
window.addEventListener("hashchange", revealResearchEntry);
window.addEventListener("popstate", revealResearchEntry);
