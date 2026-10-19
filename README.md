# Yamir Alejandro Poldo Silva — personal portfolio

A static, poster-inspired portfolio. The established warm canvas, green typography, numbered sections, ruled document layouts, and responsive behavior are shared by the About page, CV, projects, and research narrative.

## Run locally

Use Node 22.22+ or a newer supported release.

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run build
npm run preview
```

## Edit the CV and About

- Identity, contact links, Profile, Education, research/teaching/professional entries, and skills: `src/data/profile.ts`.
- Who Am I prose: `src/pages/index.astro`.
- Selected CV projects: Markdown files in `src/content/projects/`.
- Research evidence: the `evidence` collection in `src/data/profile.ts` and the dedicated research page.

The CV has eight sections: Profile; Education; Research Experience; Teaching Experience; Professional Experience; Selected Projects; Technical Skills; Posters & Research Outputs. Profile, Education, Skills, and the poster citation stay visible. Other entries are native disclosures, with optional section filtering, stable anchors, browser-history support, and print/PDF export. The existing `cv/#covasim-research` link remains valid.

The current research continues at GEODES after the summer 2026 internship that helped frame it. The manuscript is in progress, with venue TBD; no publication or accepted submission is claimed. Education and dates follow the owner's confirmed information. The original combined Deloitte application PDF is source material only, is ignored by Git, and is not a public CV download. Print/PDF export creates a CV-only document from the web page.

## Add any number of projects

1. Copy `templates/project.md` into `src/content/projects/` and choose a unique filename, such as `my-project.md`.
2. Fill in the metadata and the four Markdown narrative sections.
3. Add 2–3 strings to `cv_highlights` for the expanded CV entry. Add real artifact URLs to `links`; omit unknown destinations.
4. Set `draft: false` when ready to publish.

The filename becomes `/work/my-project/`. Keep filenames stable after publishing so shared links keep working. The `05 Artifacts / links` section is generated from the frontmatter; you do not need to write HTML.

| Field                    | Behavior                                                                                                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `draft: true`            | Excluded from every listing and from generated project routes, regardless of other settings                                                                                   |
| `featured: true`         | Appears in homepage Selected Work, up to three published projects                                                                                                             |
| `include_in_cv: true`    | Appears in CV Selected Projects, with expandable highlights and artifacts                                                                                                     |
| `display_order`          | Lower numbers appear first; titles break ties                                                                                                                                 |
| `cv_entry`               | Optional existing CV anchor for work already represented by an experience entry                                                                                               |
| `date_display`           | Human-readable date/year range; no invented precision                                                                                                                         |
| `destination`            | Optional internal destination for the project title and “Read case study” links. Covasim uses `research/covasim/`; other projects default to their generated case-study page. |
| `topics`, `technologies` | Brief context in project rows and CV summaries                                                                                                                                |
| `links`                  | Array of `label`, `url`, and optional `description`                                                                                                                           |

The work index contains all published projects. Default project return links lead to `cv/#project-my-project` when included in the CV. Covasim instead returns to its research entry and is not duplicated under Selected Projects.

GraphHopper, Civilium Structurium, and Kaggle are retained as **unpublished optional examples**, based on the supplied CV. They do not fix the public selection. Edit, replace, or publish them as you choose. `project-starter.md` is an unpublished blank example. Drafts are excluded in every build, including development.

Use these exact headings to retain the existing numbered layout and contextual navigation:

```markdown
## 01 Context

## 02 Problem

## 03 Approach

## 04 Result
```

Ordinary Markdown paragraphs, lists, emphasis, and images work inside these sections. Astro's official Unified Markdown processor applies the shared layout and asset base paths at build time; it adds no browser JavaScript.

## Add photography

1. Put image files in `public/images/photography/`.
2. Copy `templates/photograph.md` into `src/content/photography/` with a unique filename.
3. Reference the image using Markdown, then fill in title, location, year, optional caption, and order.
4. Set `draft: false` when ready.

```markdown
![A specific description of the photograph.](/images/photography/my-photo.jpg)
```

Keep `year` quoted, for example `year: "2026"`. Empty location/year/caption fields are omitted. Use public image paths starting `/images/`; the build adds the GitHub Pages repository base path automatically. You may also wrap the image in an ordinary Markdown link to its full-size file.

The About page shows up to twelve published photographs, ordered by `display_order`. Start with a considered selection of six. One clearly labeled neutral placeholder is shown until a real photograph is published; it then disappears automatically. No locations, years, or captions are invented.

## Research figure

The Covasim findings figure is extracted from the supplied poster. Verified text includes the 85.3% finding, 128/150 count, representative commits, interpretations, historical comparison, and caveats. Exact bin values and historical series were not supplied, so no numerical chart data has been reconstructed. A linked numerical chart remains deferred until verified source data is available.

### Original Canva poster

The research introduction includes a collapsed **View original poster · Canva** disclosure. Its iframe is created only on first opening; closing and reopening retains the same frame. There are no Canva requests before opening it and no Canva SDK loaded on the parent page. The external Canva link and PDF download remain available without JavaScript or when Canva is unavailable. The viewer is omitted from print output.

`src/data/research-poster.ts` stores the public view URL, generated iframe URL, original-poster PDF reference, and viewer dimensions. The iframe URL was obtained from the oEmbed metadata advertised by the public Canva page on 2026-10-19; the generated dimensions are 1536 × 2304 (2:3). Use the generated URL, not the ordinary share URL, for the iframe. When replacing the design, obtain its current HTML from **Share → See all → Embed**, copy the iframe `src`, update the dimensions and the matching `.poster-viewer-frame` aspect ratio in `src/styles/research.css`, and check it in a logged-out browser before publishing. This integration does not change Canva sharing settings.

The embedded design follows edits made in Canva, as described in [Canva’s embedding documentation](https://www.canva.com/help/embed-designs/). The native research narrative, chart image, and archived PDF are maintained separately: review all three when scientific content changes. The iframe does not provide numerical chart data or synchronize with the commit-bin controls.

## Test

```sh
npx playwright install chromium
npm test
```

The authoring integration test builds an isolated temporary copy with synthetic projects and photographs, checking draft exclusion, independent homepage/CV selection, generic project sections, CV return links, metadata, and repository-subpath image URLs. It never changes your authored files. Browser tests build a fresh production site on port 4322 and cover deep links, filtering/history, expansion, confirmed content, mobile reflow, keyboard and print behavior, no-JavaScript access, and automated accessibility checks. Poster-viewer tests intercept Canva requests with a controlled response or simulated failure, verifying no requests before activation, one retained frame, accessible labeling, portrait proportions, and working fallbacks. They do not assert that Canva is always reachable.

## GitHub Pages

The site is hosted at **https://yamires.github.io** from **Yamires/Yamires.github.io**. Deployments are manual: pushes run checks but do not publish. Enable Pages with **GitHub Actions** as the publishing source, then manually run **Deploy portfolio** in the destination repository. Its site URL and base path come from GitHub's Pages configuration.

For a local repository-subpath build:

```sh
SITE_URL=https://example.github.io BASE_PATH=/myWebsite npm run build
BASE_PATH=/myWebsite npm run preview
```

`example.github.io` is a configuration placeholder. Set `SITE_URL` and `BASE_PATH` for builds outside Actions. No runtime APIs, analytics, or third-party font requests are required.

Official references: [Markdown in Astro](https://docs.astro.build/en/guides/markdown-content/), [content collections](https://docs.astro.build/en/guides/content-collections/), and [GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/).


### Security and deployment controls

- No server, authentication, forms, analytics, or runtime secrets. Fonts and figures are local. Canva loads only after opening the poster viewer.
- Build-generated Content Security Policy hashes permit the site's scripts/styles, reject inline handlers and styles, and limit frames to Canva. A no-referrer policy limits outgoing link metadata. GitHub Pages controls HTTP response headers; CSP is delivered using HTML metadata, so header-only controls such as `frame-ancestors` cannot be configured here.
- npm lifecycle scripts are disabled in `.npmrc` and CI. Dependency installation uses the lockfile; the workflows audit dependencies and pin actions to immutable commits. Dependabot proposes weekly dependency/action updates without automatic merging.
- The build job has read-only repository access and checkout does not persist credentials. Only the deployment job receives short-lived Pages/OIDC write permissions. No personal access token is stored in this repository or required by its workflows.
- Only `dist/` is deployed. Draft content is excluded from the site but remains visible in the public source repository. Never put confidential content in draft Markdown. The original combined CV/application and local poster source copy are ignored; only the intended archived poster PDF is public.
- To publish: run **Deploy portfolio** from Actions on `main` after **Check portfolio** passes. To roll back: revert the unwanted change, let checks pass, and run the deployment again. To take the site offline: unpublish it in Settings → Pages.


## Research navigation

Work contains a short introduction to the research direction and the existing project listing. There is no separate Research overview in navigation; the old `/research/` address redirects to `/work/`. The Covasim poster remains at `/research/covasim/` with its existing Work and homepage links.
