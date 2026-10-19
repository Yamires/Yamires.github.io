import type { Root, RootContent, Nodes } from "mdast";

const sections = new Map([
  ["01 Context", { id: "context", number: "01", title: "Context" }],
  ["02 Problem", { id: "problem", number: "02", title: "Problem" }],
  ["03 Approach", { id: "approach", number: "03", title: "Approach" }],
  ["04 Result", { id: "result", number: "04", title: "Result" }],
]);

// Keep the document's established section anatomy while authors write plain Markdown.
export default function remarkContent({ base = "/" }: { base?: string } = {}) {
  const prefix = base.replace(/\/$/, "");
  return (tree: Root) => {
    function resolveAssets(node: Nodes) {
      if (
        (node.type === "image" || node.type === "link") &&
        node.url.startsWith("/") &&
        !node.url.startsWith("//") &&
        prefix &&
        !node.url.startsWith(`${prefix}/`)
      ) {
        node.url = `${prefix}${node.url}`;
      }
      if ("children" in node) node.children.forEach(resolveAssets);
    }
    resolveAssets(tree);
    const children: RootContent[] = [];
    let open = false;
    for (const node of tree.children) {
      const text =
        node.type === "heading" && node.depth === 2
          ? node.children
              .map((child) => (child.type === "text" ? child.value : ""))
              .join("")
          : "";
      const section = sections.get(text);
      if (section) {
        if (open) children.push({ type: "html", value: "</section>" });
        const { id, number, title } = section;
        children.push({
          type: "html",
          value: `<section id="${id}" class="numbered-section" aria-labelledby="${id}-heading"><h2 id="${id}-heading" tabindex="-1"><span class="section-number">${number}</span><span>${title}</span><a class="heading-anchor" href="#${id}" aria-label="Link to ${title}">#</a></h2>`,
        });
        open = true;
      } else children.push(node);
    }
    if (open) children.push({ type: "html", value: "</section>" });
    tree.children = children;
  };
}
