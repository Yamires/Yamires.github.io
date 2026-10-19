const root = document.querySelector<HTMLElement>("[data-cv]");
if (root) {
  const sections = [...root.querySelectorAll<HTMLElement>("[data-cv-section]")];
  const entries = [...root.querySelectorAll<HTMLDetailsElement>(".cv-entry")];
  const selects = [
    ...root.querySelectorAll<HTMLSelectElement>("[data-category-select]"),
  ];
  const count = root.querySelector<HTMLElement>("[data-filter-count]");
  const categories = new Set(["all", "research", "professional", "projects"]);
  let category = "all";

  function applyFilter(value: string) {
    category = categories.has(value) ? value : "all";
    let total = 0;
    for (const section of sections) {
      section.hidden =
        category !== "all" && section.dataset.category !== category;
      if (!section.hidden)
        total += section.querySelectorAll(".cv-entry").length;
      const id = section.querySelector("section")?.id;
      root
        ?.querySelectorAll<HTMLAnchorElement>(`[data-section-link="${id}"]`)
        .forEach((link) => (link.hidden = section.hidden));
    }
    selects.forEach((select) => (select.value = category));
    if (count) {
      count.hidden = category === "all";
      count.textContent = `Showing ${total} expandable ${total === 1 ? "entry" : "entries"}. Profile, education, skills, and research outputs remain visible.`;
    }
    root
      ?.querySelectorAll<HTMLElement>("[data-reset]")
      .forEach((button) => (button.hidden = category === "all"));
  }

  function revealTarget() {
    let id: string;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    // Old section links continue to locate the renamed skills section.
    if (id === "methods") document.getElementById("skills")?.scrollIntoView();
    const target = document.getElementById(id);
    if (target?.closest<HTMLElement>("[data-cv-section]")?.hidden) {
      applyFilter("all");
      const url = new URL(location.href);
      url.searchParams.delete("category");
      history.replaceState(null, "", url);
    }
    const entry = entries.find((item) => item.id === id);
    entries.forEach((item) => {
      if (item !== entry) delete item.dataset.linked;
    });
    if (!entry) return;
    entry.open = true;
    entry.dataset.linked = "true";
    requestAnimationFrame(() =>
      entry.scrollIntoView({ block: "start", behavior: "instant" }),
    );
  }

  function restore() {
    applyFilter(new URL(location.href).searchParams.get("category") || "all");
    revealTarget();
  }
  function setCategory(value: string) {
    applyFilter(value);
    const url = new URL(location.href);
    if (category === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", category);
    url.hash = "";
    entries.forEach((entry) => delete entry.dataset.linked);
    history.pushState(null, "", url);
  }
  selects.forEach((select) =>
    select.addEventListener("change", () => setCategory(select.value)),
  );
  root
    .querySelectorAll("[data-reset]")
    .forEach((button) =>
      button.addEventListener("click", () => setCategory("all")),
    );
  root.querySelector("[data-expand-all]")?.addEventListener("click", () =>
    entries.forEach((entry) => {
      if (!entry.closest<HTMLElement>("[data-cv-section]")?.hidden)
        entry.open = true;
    }),
  );
  root
    .querySelector("[data-collapse-all]")
    ?.addEventListener("click", () =>
      entries.forEach((entry) => (entry.open = false)),
    );
  window.addEventListener("hashchange", revealTarget);
  window.addEventListener("popstate", restore);
  restore();
  root
    .querySelectorAll<HTMLElement>("[data-filter-controls],[data-cv-utilities]")
    .forEach((element) => (element.hidden = false));
  const printButton = document.querySelector<HTMLButtonElement>("[data-print]");
  if (printButton) {
    printButton.hidden = false;
    printButton.addEventListener("click", () => window.print());
  }
  let printState: boolean[] = [];
  window.addEventListener("beforeprint", () => {
    printState = entries.map((entry) => entry.open);
    entries.forEach((entry) => (entry.open = true));
  });
  window.addEventListener("afterprint", () =>
    entries.forEach(
      (entry, index) => (entry.open = printState[index] ?? false),
    ),
  );
}
