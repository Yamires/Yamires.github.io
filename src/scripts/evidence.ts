const root = document.querySelector<HTMLElement>("[data-evidence]");
if (root) {
  const groups = [...root.querySelectorAll<HTMLElement>(".evidence-group")];
  const buttons = [
    ...root.querySelectorAll<HTMLButtonElement>("button[data-bin]"),
  ];
  const status = root.querySelector<HTMLElement>("[data-evidence-status]");
  const goLink = root.querySelector<HTMLAnchorElement>("[data-go-evidence]");

  function select(id: string) {
    const selected = groups.find((group) => group.id === id);
    groups.forEach((group) => {
      delete group.dataset.preview;
      if (group === selected) group.dataset.selected = "true";
      else delete group.dataset.selected;
    });
    buttons.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.bin === (selected?.id || "overview")),
      ),
    );
    if (status) {
      status.hidden = !selected;
      status.textContent = selected
        ? `${selected.querySelector("h4")?.textContent}. All evidence remains visible.`
        : "";
    }
    if (goLink) {
      goLink.hidden = !selected;
      goLink.href = selected ? `#${selected.id}` : "#findings";
    }
  }

  function restore() {
    select(location.hash.slice(1));
  }
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.bin || "overview";
      select(id);
      const url = new URL(location.href);
      url.hash = id === "overview" ? "findings" : id;
      history.pushState(null, "", url);
    });
    const preview = () =>
      groups.forEach((group) => {
        if (group.id === button.dataset.bin) group.dataset.preview = "true";
        else delete group.dataset.preview;
      });
    const clear = () => groups.forEach((group) => delete group.dataset.preview);
    button.addEventListener("pointerenter", preview);
    button.addEventListener("focus", preview);
    button.addEventListener("pointerleave", clear);
    button.addEventListener("blur", clear);
  });
  goLink?.addEventListener("click", () =>
    groups
      .find((group) => group.dataset.selected === "true")
      ?.focus({ preventScroll: true }),
  );
  window.addEventListener("hashchange", restore);
  window.addEventListener("popstate", restore);
  root.querySelector<HTMLElement>(".evidence-selector")!.hidden = false;
  restore();
}
