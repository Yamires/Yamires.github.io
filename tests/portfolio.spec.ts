import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Covasim titles and actions link directly to the poster PDF", async ({
  page,
  request,
}) => {
  for (const route of ["/work/", "/"]) {
    await page.goto(route);
    const poster = page
      .locator(".project-row")
      .filter({ hasText: "Domain-relevant software evolution" });
    for (const selector of [".row-action", "h3 a"]) {
      await expect(poster.locator(selector)).toHaveAttribute(
        "href",
        "/artifacts/covasim-poster.pdf",
      );
    }
    await expect(poster.locator(".row-action")).toContainText(
      "View poster · PDF",
    );
  }
  expect(
    (await request.get("/artifacts/covasim-poster.pdf")).headers()[
      "content-type"
    ],
  ).toContain("application/pdf");
});

test("representative pages have no serious accessibility violations or runtime errors", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  for (const route of [
    "/",
    "/cv/",
    "/work/covasim/",
    "/work/",
    "/work/civilium-structurium/",
  ]) {
    await page.goto(route);
    await expect(page.locator(".site-header .site-name")).toHaveText("Y.");
    await page.screenshot({
      path: testInfo.outputPath(`${route.replaceAll("/", "-")}-desktop.png`),
      fullPage: true,
    });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("CV deep links reveal entries, reset incompatible filters, and support history", async ({
  page,
}) => {
  await page.goto("/cv/?category=professional#covasim-research");
  const entry = page.locator("#covasim-research");
  await expect(entry).toHaveAttribute("open", "");
  await expect(entry).toBeVisible();
  await expect(page.locator("[data-category-select]").first()).toHaveValue(
    "all",
  );
  await page
    .locator(".desktop-contents [data-filter-controls] summary")
    .click();
  await page
    .locator(".desktop-contents [data-category-select]")
    .selectOption("professional");
  await expect(entry).toBeHidden();
  await expect(page.locator("#education")).toBeVisible();
  await page.goBack();
  await expect(entry).toBeVisible();
  await entry.getByRole("link", { name: "Covasim case study" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Domain-relevant software evolution",
  );
  await expect(page.locator("#result .findings-panel")).toBeVisible();
});

test("CV filters and disclosure utilities are usable", async ({ page }) => {
  await page.goto("/cv/");
  await page
    .locator(".desktop-contents [data-filter-controls] summary")
    .click();
  await page
    .locator(".desktop-contents [data-category-select]")
    .selectOption("research");
  await page.getByRole("button", { name: "Expand all" }).click();
  await expect(page.locator("#covasim-research")).toHaveAttribute("open", "");
  await page.getByRole("button", { name: "Collapse all" }).click();
  await expect(page.locator("#covasim-research")).not.toHaveAttribute(
    "open",
    "",
  );
});

test("important content and native navigation remain accessible without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/cv/");
  await expect(page.locator("[data-filter-controls]").first()).toBeHidden();
  await page.locator("#covasim-research summary").click();
  await expect(
    page.getByRole("link", { name: "Covasim case study" }),
  ).toBeVisible();
  await page.goto("/work/");
  await expect(
    page.getByRole("link", { name: /View poster · PDF:/ }),
  ).toBeVisible();
  await page.goto("/work/civilium-structurium/");
  await expect(
    page.getByRole("link", { name: "Open the calculator in a separate tab" }),
  ).toBeVisible();
  await context.close();
});

test("representative pages reflow and mobile navigation works", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of [
    "/",
    "/cv/",
    "/work/covasim/",
    "/work/",
    "/work/civilium-structurium/",
  ]) {
    await page.goto(route);
    await page.screenshot({
      path: testInfo.outputPath(`${route.replaceAll("/", "-")}-mobile.png`),
      fullPage: true,
    });
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.locator(".mobile-menu summary").click();
  await page
    .locator(".mobile-menu")
    .getByRole("link", { name: "CV", exact: true })
    .click();
  await expect(page).toHaveURL(/\/cv\/$/);
});

test("pages reflow at narrow, tablet, and desktop sizes with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/cv/",
      "/work/",
      "/work/covasim/",
      "/work/civilium-structurium/",
      "/404.html",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  }
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});

test("CV disclosures are keyboard-operable and print exposes all entries", async ({
  page,
}) => {
  await page.goto("/cv/");
  const summary = page.locator("#covasim-research summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#covasim-research")).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(page.locator("#covasim-research")).not.toHaveAttribute(
    "open",
    "",
  );
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("#ift1227 .cv-body")).toBeVisible();
});

test("confirmed CV identity, education, research continuity and contacts are present", async ({
  page,
  request,
}) => {
  await page.goto("/cv/");
  const pdfLink = page.getByRole("link", { name: "CV · PDF (French)" });
  await expect(pdfLink).toHaveAttribute(
    "href",
    "/artifacts/cv_alejandro_poldo_silva_.pdf",
  );
  const pdf = await request.get("/artifacts/cv_alejandro_poldo_silva_.pdf");
  expect(pdf.ok()).toBe(true);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  await expect(
    page.getByRole("heading", {
      name: "Curriculum vitae",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator("#education")).toContainText(
    "M.Sc. in Programming and Software Engineering",
  );
  await expect(page.locator("#education")).toContainText(
    "2026–2028 · Expected completion",
  );
  await expect(page.locator("#education")).toContainText("3.56 / 4.3");
  await expect(page.locator("#ift1227")).toContainText("2023–present");
  await page.locator("#covasim-research summary").click();
  await expect(page.locator("#covasim-research")).toContainText(
    "Current graduate research",
  );
  await expect(page.locator("#covasim-research")).toContainText(
    "May–August 2026",
  );
  await expect(page.locator("#covasim-research")).toContainText(
    "Manuscript in progress",
  );
  await expect(page.locator("main")).not.toContainText("education-draft");
  for (const address of ["poldosiy@iro.umontreal.ca", "alej.poldo@gmail.com"]) {
    await expect(
      page.locator(`main a[href="mailto:${address}"]`),
    ).toBeVisible();
  }
});

test("project drafts stay unpublished and Markdown-authored travel photographs replace the placeholder", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator("#about")).toContainText(
    "travelling and photography",
  );
  const portrait = page.locator(".intro-portrait img");
  await expect(portrait).toHaveAttribute(
    "alt",
    "Portrait of Yamir Alejandro Poldo Silva",
  );
  await expect
    .poll(() =>
      portrait.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(page.locator(".intro-portrait figcaption")).toHaveText(
    "Yamir Alejandro Poldo Silva",
  );
  await expect(
    page.getByRole("heading", {
      name: "Yamir Alejandro Poldo Silva",
      exact: true,
    }),
  ).toHaveCount(0);

  const photographs = page.locator("#photography .photograph");
  expect(await photographs.count()).toBeGreaterThan(0);
  expect(await photographs.count()).toBeLessThanOrEqual(12);
  await expect(page.locator("#photography")).not.toContainText(
    "Photograph forthcoming",
  );
  for (const photograph of await photographs.all()) {
    const image = photograph.locator("img");
    await expect(image).toHaveAttribute(
      "src",
      /images\/photography\/.+\.webp$/,
    );
    await expect(image).toHaveAttribute("alt", /.+/);
    await expect(image).toHaveAttribute("loading", "lazy");
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(photograph.locator("a")).toHaveAttribute(
      "href",
      (await image.getAttribute("src")) || "",
    );
  }
  await page.goto("/work/");
  await expect(page.locator(".project-row")).toHaveCount(2);
  for (const id of [
    "project-starter",
    "graphhopper",
    "kaggle-classification",
  ]) {
    expect((await request.get(`/work/${id}/`)).status()).toBe(404);
  }
  await page.goto("/cv/");
  await expect(page.locator("#projects")).not.toContainText("GraphHopper");
  await expect(page.locator("#posters")).toContainText("Research poster");
});

test("CV describes exploratory research without causal claims or entry-link UI", async ({
  page,
}) => {
  await page.goto("/cv/#covasim-research");
  const entry = page.locator("#covasim-research");
  await expect(entry).toHaveAttribute("open", "");
  for (const fact of [
    "8,500 commits",
    "330 commits",
    "Cohen’s kappa: 0.764",
    "79.0% accuracy",
    "F1: 0.755",
    "85.3%",
    "do not establish causality",
  ]) {
    await expect(entry).toContainText(fact);
  }
  for (const route of [
    "/cv/",
    "/work/covasim/",
    "/work/civilium-structurium/",
  ]) {
    await page.goto(route);
    await expect(
      page.getByRole("link", {
        name: /Link to this entry|Related research entry|Research in the CV|Back to the CV entry/i,
      }),
    ).toHaveCount(0);
    await expect(page.locator(".linked-label, .entry-permalink")).toHaveCount(
      0,
    );
  }
});

test("Civilium is featured across About, Work and CV with scoped engineering results", async ({
  page,
}) => {
  for (const route of ["/", "/work/"]) {
    await page.goto(route);
    await expect(page.locator(".project-row")).toHaveCount(2);
    await expect(page.locator(".project-row").first()).toContainText(
      "Civilium Structurium",
    );
  }
  await page.goto("/cv/#project-civilium-structurium");
  const project = page.locator("#project-civilium-structurium");
  await expect(project).toHaveAttribute("open", "");
  for (const fact of [
    "YAML",
    "15 automated tests",
    "1,000 iterations",
    "17 ms",
    "original calculation pipeline",
  ]) {
    await expect(project).toContainText(fact);
  }
  await expect(
    project.getByRole("link", { name: "Open calculator" }),
  ).toHaveAttribute("href", "/work/civilium-structurium/");
  await expect(page.locator("#ift1227")).toContainText("IFT1215 / IFT1227");
  await page.locator("#ift1227 summary").click();
  await expect(page.locator("#ift1227")).toContainText("120 students");
  await page.locator("#beneva summary").click();
  await expect(page.locator("#beneva")).toContainText("Top 10");
  await expect(page.locator("#skills")).toContainText(
    "French, English, Spanish",
  );
});
