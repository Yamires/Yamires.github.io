import { getCollection, type CollectionEntry } from "astro:content";

export async function publishedProjects() {
  return (await getCollection("projects", ({ data }) => !data.draft)).sort(
    (a, b) =>
      a.data.display_order - b.data.display_order ||
      a.data.title.localeCompare(b.data.title),
  );
}

export function projectCVAnchor(project: CollectionEntry<"projects">) {
  return project.data.cv_entry || `project-${project.id}`;
}
