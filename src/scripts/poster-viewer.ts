document
  .querySelectorAll<HTMLDetailsElement>("[data-poster-viewer]")
  .forEach((disclosure) => {
    const container = disclosure.querySelector<HTMLElement>(
      "[data-poster-frame]",
    );
    const embedUrl = disclosure.dataset.embedUrl;
    if (!container || !embedUrl) return;

    const loadViewer = () => {
      if (!disclosure.open || container.querySelector("iframe")) return;
      const frame = document.createElement("iframe");
      frame.title =
        disclosure.dataset.viewerTitle || "Original research poster";
      frame.src = embedUrl;
      frame.allowFullscreen = true;
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      container.append(frame);
      container.hidden = false;
    };
    disclosure.addEventListener("toggle", loadViewer);
    loadViewer();
  });
