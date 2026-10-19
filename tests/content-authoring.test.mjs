import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

test("Markdown projects publish independently to homepage, work and CV; photos resolve under a repository base path", () => {
  const fixture = realpathSync(
    mkdtempSync(join(tmpdir(), "portfolio-authoring-")),
  );
  try {
    for (const path of [
      "src",
      "public",
      "package.json",
      "astro.config.mjs",
      "tsconfig.json",
    ])
      cpSync(path, join(fixture, path), { recursive: true });
    symlinkSync(resolve("node_modules"), join(fixture, "node_modules"), "dir");
    const makeProject = (title, flags) =>
      `---\ntitle: ${title}\nsummary: An authoring fixture, never deployed.\ndate_display: "2026"\ncontext: Test fixture\ncv_highlights: [A verified fixture contribution]\n${flags}\n---\n\n## 01 Context\n\nFixture context.\n\n## 02 Problem\n\nFixture problem.\n\n## 03 Approach\n\nFixture approach.\n\n## 04 Result\n\nFixture result.\n`;
    const projectDir = join(fixture, "src/content/projects");
    writeFileSync(
      join(projectDir, "alpha-project.md"),
      makeProject(
        "CV-only fixture",
        "draft: false\nfeatured: false\ninclude_in_cv: true",
      ),
    );
    writeFileSync(
      join(projectDir, "featured-project.md"),
      makeProject(
        "Homepage fixture",
        "draft: false\nfeatured: true\ninclude_in_cv: false",
      ),
    );
    writeFileSync(
      join(projectDir, "hidden-project.md"),
      makeProject(
        "Hidden fixture",
        "draft: true\nfeatured: true\ninclude_in_cv: true",
      ),
    );
    mkdirSync(join(fixture, "public/images/photography"), { recursive: true });
    cpSync(
      "public/images/photography/placeholder.svg",
      join(fixture, "public/images/photography/test-image.svg"),
    );
    writeFileSync(
      join(fixture, "src/content/photography/test-photo.md"),
      '---\ntitle: Authored photo\nlocation: Fixture location\nyear: "2025"\ncaption: A fixture caption\ndraft: false\n---\n\n![A test image.](/images/photography/test-image.svg)\n',
    );
    writeFileSync(
      join(fixture, "src/content/photography/hidden-photo.md"),
      "---\ntitle: Hidden photo\ndraft: true\n---\n\n![Draft image.](/images/photography/placeholder.svg)\n",
    );
    execFileSync(
      process.execPath,
      [resolve("node_modules/astro/bin/astro.mjs"), "build", "--root", fixture],
      {
        cwd: fixture,
        env: {
          ...process.env,
          BASE_PATH: "/portfolio-test",
          SITE_URL: "https://example.github.io",
        },
        stdio: "pipe",
        timeout: 60000,
      },
    );
    const html = (path) => readFileSync(join(fixture, "dist", path), "utf8");
    const home = html("index.html"),
      cv = html("cv/index.html"),
      work = html("work/index.html"),
      project = html("work/alpha-project/index.html");
    assert.match(home, /Homepage fixture/);
    assert.doesNotMatch(
      home,
      /CV-only fixture|Hidden fixture|Hidden photo|Photograph forthcoming/,
    );
    assert.match(work, /CV-only fixture/);
    assert.match(work, /Homepage fixture/);
    assert.match(work, /href="\/portfolio-test\/research\/covasim\/"/);
    assert.match(work, /href="\/portfolio-test\/work\/alpha-project\/"/);
    assert.doesNotMatch(work, /Hidden fixture/);
    assert.match(cv, /CV-only fixture/);
    assert.match(cv, /A verified fixture contribution/);
    assert.doesNotMatch(cv, /Homepage fixture|Hidden fixture/);
    assert.equal(
      existsSync(join(fixture, "dist/work/hidden-project/index.html")),
      false,
    );
    for (const id of ["context", "problem", "approach", "result", "artifacts"])
      assert.match(project, new RegExp(`id="${id}"`));
    assert.match(
      project,
      /href="\/portfolio-test\/cv\/#project-alpha-project"/,
    );
    assert.match(
      home,
      /src="\/portfolio-test\/images\/photography\/test-image.svg"/,
    );
    assert.match(home, /Fixture location · 2025/);
    assert.match(home, /A fixture caption/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
