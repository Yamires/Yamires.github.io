# Yamir Alejandro Poldo Silva — personal portfolio

A static, poster-inspired portfolio. The established warm canvas, green typography, numbered sections, ruled document layouts, and responsive behavior are shared by the About page, CV, and projects.

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

- Identity, contact links, Profile, Education, expected graduation, research/teaching/professional entries, and skills: `src/data/profile.ts`.
- Who Am I prose: `src/pages/index.astro`.
- Selected CV projects: Markdown files in `src/content/projects/`.
- Research evidence: the `evidence` collection in `src/data/profile.ts` and the archived poster PDF.

The CV has eight sections: Profile; Education; Research Experience; Teaching Experience; Professional Experience; Selected Projects; Technical Skills; Posters & Research Outputs. Profile, Education, Skills, and the poster citation stay visible. Other entries are native disclosures, with optional section filtering, stable anchors, browser-history support, and print/PDF export. The existing `cv/#covasim-research` link remains valid.

The English portfolio follows the latest French CV for experience, dates, and reported results, while retaining the confirmed ongoing graduate research. Keep introductions brief and place detailed contributions in CV disclosures or project pages. The CV page links to the French PDF at `public/artifacts/cv_alejandro_poldo_silva_.pdf`. Replace that published file to update the download. The original local source copy remains excluded from Git.

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
| `destination`            | Optional internal destination for the project title and “Read case study” links. Covasim uses `artifacts/covasim-poster.pdf`; other projects default to their generated case-study page. |
| `topics`, `technologies` | Brief context in project rows and CV summaries                                                                                                                                |
| `links`                  | Array of `label`, `url`, and optional `description`                                                                                                                           |

The work index contains all published projects, with Civilium followed by Covasim. Both appear in homepage Selected Work; Civilium also appears in CV Selected Projects. Project entries keep stable CV anchors for shared URLs, without displaying entry-permalink or related-CV-entry links. Covasim is not duplicated under Selected Projects.

GraphHopper and Kaggle are retained as **unpublished optional examples**, based on the supplied CV. They do not fix the public selection. Edit, replace, or publish them as you choose. `project-starter.md` is an unpublished blank example. Drafts are excluded in every build, including development.

Use these exact headings to retain the existing numbered layout and contextual navigation:

```markdown
## 01 Context

## 02 Problem

## 03 Approach

## 04 Result
```

Ordinary Markdown paragraphs, lists, emphasis, and images work inside these sections. Astro's official Unified Markdown processor applies the shared layout and asset base paths at build time; it adds no browser JavaScript.

## Add photography

1. Export web-sized images with camera/GPS metadata removed, then put only those web copies in `public/images/photography/`. Keep camera originals outside `public/`.
2. Copy `templates/photograph.md` into `src/content/photography/` with a unique filename.
3. Reference the image using Markdown, then fill in title, location, year, optional caption, and order.
4. Set `draft: false` when ready.

```markdown
![A specific description of the photograph.](/images/photography/my-photo.jpg)
```

Keep `year` quoted, for example `year: "2026"`. Empty location/year/caption fields are omitted. Use public image paths starting `/images/`; the build adds the GitHub Pages repository base path automatically. You may also wrap the image in an ordinary Markdown link to its full-size file.

The current selection contains eleven travel photographs with descriptive titles and alt text; location, year, and caption fields are left empty until confirmed. Original JPEG/RAW files are preserved locally in `.local/photography-originals/`, ignored by Git and outside the published site. The RAW photograph uses its full-size embedded JPEG preview, with the original camera orientation applied. WebP exports preserve the framing and use a maximum dimension of 1600px. Markdown images load lazily and decode asynchronously.

The About page shows up to twelve published photographs, ordered by `display_order`. Start with a considered selection of six. One clearly labeled neutral placeholder is shown until a real photograph is published; it then disappears automatically. No locations, years, or captions are invented.

## Research figure

The Covasim findings figure is extracted from the supplied poster. Verified text includes the 85.3% finding, 128/150 count, representative commits, interpretations, historical comparison, and caveats. Exact bin values and historical series were not supplied, so no numerical chart data has been reconstructed. A linked numerical chart remains deferred until verified source data is available.

### Poster PDF

Work, homepage Selected Work, and CV poster links open `public/artifacts/covasim-poster.pdf` directly. Replace that file to update the poster while preserving links. The retired `/research/covasim/` address redirects to the PDF. The separate text case study remains at `/work/covasim/`; review its findings and the figure whenever the research changes.

## Test

```sh
npx playwright install chromium
npm test
```

The authoring integration test builds an isolated temporary copy with synthetic projects and photographs, checking draft exclusion, independent homepage/CV selection, generic project sections, CV anchors, metadata, and repository-subpath image URLs. It never changes your authored files. Browser tests build a fresh production site on port 4322 and cover deep links, filtering/history, expansion, confirmed content, mobile reflow, keyboard and print behavior, no-JavaScript access, and automated accessibility checks. Browser tests also verify direct poster PDF links, retired-route redirects, and the embedded calculator. Run `BASE_PATH=/portfolio-test npx playwright test tests/civilium.spec.ts` to exercise calculator calculations, workers, persistence, PDF links, and redirects under a repository subpath.

## GitHub Pages

The site is hosted at **https://yamires.github.io** from **Yamires/Yamires.github.io**. Deployments are manual: pushes run checks but do not publish. Enable Pages with **GitHub Actions** as the publishing source, then manually run **Deploy portfolio** in the destination repository. Its site URL and base path come from GitHub's Pages configuration.

For a local repository-subpath build:

```sh
SITE_URL=https://example.github.io BASE_PATH=/myWebsite npm run build
BASE_PATH=/myWebsite npm run preview
```

`example.github.io` is a configuration placeholder. Set `SITE_URL` and `BASE_PATH` for builds outside Actions. No runtime APIs, analytics, or third-party font requests are required. The supplied Civilium demo uses browser workers and local storage; its service worker is scoped to the calculator directory.

Official references: [Markdown in Astro](https://docs.astro.build/en/guides/markdown-content/), [content collections](https://docs.astro.build/en/guides/content-collections/), and [GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/).


### Security and deployment controls

- No server, authentication, forms, analytics, or runtime secrets. Fonts and figures are local. The calculator runs locally inside a same-origin iframe.
- Build-generated Content Security Policy hashes permit the site's scripts/styles, reject inline handlers and styles, and limit frames to the same origin. A no-referrer policy limits outgoing link metadata. GitHub Pages controls HTTP response headers; CSP is delivered using HTML metadata, so header-only controls such as `frame-ancestors` cannot be configured here.
- npm lifecycle scripts are disabled in `.npmrc` and CI. Dependency installation uses the lockfile; the workflows audit dependencies and pin actions to immutable commits. Dependabot proposes weekly dependency/action updates without automatic merging.
- The build job has read-only repository access and checkout does not persist credentials. Only the deployment job receives short-lived Pages/OIDC write permissions. No personal access token is stored in this repository or required by its workflows.
- Only `dist/` is deployed. Draft content is excluded from the site but remains visible in the public source repository. Never put confidential content in draft Markdown. The original combined CV/application and local poster source copy are ignored; only the intended archived poster PDF is public.
- To publish: run **Deploy portfolio** from Actions on `main` after **Check portfolio** passes. To roll back: revert the unwanted change, let checks pass, and run the deployment again. To take the site offline: unpublish it in Settings → Pages.


## Research navigation

Work contains a short introduction to the research direction and the existing project listing. There is no separate Research overview in navigation; the old `/research/` address redirects to `/work/`. The old `/research/covasim/` address redirects to the archived poster PDF. Work and homepage poster links open that PDF directly.


## Page-by-page editing guide

Use the table to find the source for the change you want to make. Edit source files rather than `dist/`, which is regenerated on every build.

| Page / area | Source to edit | Structure to follow |
| --- | --- | --- |
| About `/` | `src/pages/index.astro` | Intro → Who am I → Selected work → Experience & skills → Photographs → Contact. Edit prose inside the existing sections; keep their IDs for navigation. |
| Identity and contacts | `src/data/profile.ts` | Update the exported profile values once; About, CV, navigation, and footer reuse them. The shared `expectedGraduation` and `updated` values also supply the displayed graduation year and footer date. |
| CV `/cv/` | `src/data/profile.ts`; `src/pages/cv/index.astro` | Put experience, education, and skills in the data file. Use the Astro file for section layout and poster citation. Keep entry IDs stable for shared links. |
| Work `/work/` | `src/pages/work/index.astro`; `src/content/projects/*.md` | Edit the page introduction in Astro. Edit each project's title, summary, date, topics, destination, and order in Markdown metadata. |
| Standard project `/work/<filename>/` | `src/content/projects/<filename>.md` | Copy `templates/project.md`; complete Context → Problem → Approach → Result. Artifacts are generated from `links`. Layout lives in `src/pages/work/[id].astro`. |
| Civilium `/work/civilium-structurium/` | `src/content/projects/civilium-structurium.md`; `src/pages/work/civilium-structurium.astro` | The Markdown metadata supplies its listing and description. The dedicated Astro page supplies the title, iframe, and separate-tab link. It replaces the generic project page for this slug. |
| Poster PDF | `public/artifacts/covasim-poster.pdf` | Replace the PDF at the same path. Update the citation in the CV and research metadata if its title or authors change. |
| Photography on About | `src/content/photography/*.md`; `public/images/photography/` | Copy `templates/photograph.md`, add a web-sized image, write descriptive alt text, set order, then publish with `draft: false`. |
| French CV PDF | `public/artifacts/cv_alejandro_poldo_silva_.pdf` | Replace the PDF at the same path to preserve the CV download link. |
| Navigation and footer | `src/layouts/Base.astro` | Edit the shared links, “Y.” header mark, and footer here; all pages inherit them. Contact links lead to the About contact section. |
| Appearance | `src/styles/global.css`, `content.css`, `research.css`, `responsive.css` | Use shared colors/type/layout rules, content rules, research presentation, and responsive overrides respectively. Calculator frame styles are local to its Astro page. |
| Not-found page | `src/pages/404.astro` | Edit the message and recovery links while retaining the shared layout. |

### Project metadata example

```yaml
title: My project
summary: One sentence describing the problem and contribution.
date_display: "2026"
category: Software
draft: false
featured: false
include_in_cv: false
display_order: 2
links:
  - label: Repository
    url: https://github.com/owner/project
```

`draft: false` publishes the project in Work. `featured: true` selects it for About (up to three projects); `include_in_cv: true` selects it for CV. Lower `display_order` values appear first. Keep a published filename stable because it defines the URL.

For a listing that opens an artifact instead of its case study, add:

```yaml
destination: artifacts/my-poster.pdf
action_label: View poster · PDF
```

Use site-relative paths without the repository prefix in metadata. Astro links should use `href()` from `src/lib/paths.ts`, which includes `BASE_URL`; never hard-code a deployment subfolder. Ordinary project links default to “Read case study”. Civilium uses “Open calculator”.

### Replace the Civilium calculator

The complete supplied export is preserved in `embedded_CivS/`. The published copy is `public/civilium/`; edits to the source folder alone do not update the deployed calculator.

1. Export a new complete embedded build from the calculator project using relative asset URLs.
2. Replace the contents of `public/civilium/` with the complete export, including `index.html`, `assets/`, images, manifest, service-worker files, and license. Remove obsolete files from the previous export as part of the replacement.
3. Keep its service worker scoped to `./` so it controls only the calculator directory.
4. Preview `/work/civilium-structurium/` and `/civilium/index.html`. Check calculations, configuration persistence, and the separate-tab link. Check with a fresh browser context as well as an existing service-worker installation.

The calculator is available at viewport widths of 768px and above. Smaller screens show a tablet/desktop message and do not load the calculator bundle. The portfolio page creates its iframe only at eligible widths; `public/civilium/screen-gate.js` also gates the separate calculator address. When replacing the export, preserve this screen gate and its message/styles in `index.html`, and update the service-worker precache revisions for changed files.

The iframe URL uses the existing `BASE_URL`-aware helper. Its styles belong in CSS because the portfolio's CSP rejects inline style attributes. The exported calculator runs independently of Astro's generated page CSP. The published copy has one accessibility correction: the profile results grid always defines its four standard columns, even before a calculation. Its service-worker precache revision is updated for that modified asset. The original `embedded_CivS/` export is unchanged. When replacing the demo, retain that behavior in the upstream source or verify the new export passes the accessibility test.

### Verify an edit

```sh
npm run dev
npm run check
npm test
npm run build
npm run preview
```

Review the affected page at desktop and mobile widths. For a repository deployment, also build and preview with `BASE_PATH=/myWebsite` as shown above. No deployment occurs until the manual GitHub Pages workflow is run.
