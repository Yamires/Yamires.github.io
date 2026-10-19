import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import remarkContent from "./src/lib/remark-content";

const base = process.env.BASE_PATH || "/";

export default defineConfig({
  output: "static",
  site: process.env.SITE_URL || "https://yamires.github.io",
  base,
  markdown: {
    processor: unified({ remarkPlugins: [[remarkContent, { base }]] }),
  },
  security: {
    csp: {
      scriptDirective: { resources: [{ resource: "'none'", kind: "attribute" }] },
      styleDirective: { resources: [{ resource: "'none'", kind: "attribute" }] },
      directives: [
        "default-src 'self'",
        "base-uri 'none'",
        "object-src 'none'",
        "form-action 'none'",
        "frame-src https://www.canva.com",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "upgrade-insecure-requests",
      ],
    },
  },
  trailingSlash: "always",
  devToolbar: { enabled: false },
});
