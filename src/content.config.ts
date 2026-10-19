import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    destination: z.string().optional(),
    category: z.enum(["Research", "Software", "Other"]).default("Software"),
    status: z.string().default(""),
    date_display: z.string(),
    context: z.string().default(""),
    organization: z.string().default(""),
    role: z.string().default(""),
    collaborators: z.string().default(""),
    topics: z.array(z.string()).default([]),
    technologies: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
    featured: z.boolean().default(false),
    include_in_cv: z.boolean().default(false),
    display_order: z.number().default(100),
    cv_entry: z.string().optional(),
    cv_highlights: z.array(z.string()).default([]),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().min(1),
          description: z.string().default(""),
        }),
      )
      .default([]),
  }),
});
const photography = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/photography" }),
  schema: z.object({
    title: z.string(),
    location: z.string().default(""),
    year: z.string().default(""),
    caption: z.string().default(""),
    display_order: z.number().default(100),
    draft: z.boolean().default(true),
    placeholder: z.boolean().default(false),
  }),
});
export const collections = { projects, photography };
