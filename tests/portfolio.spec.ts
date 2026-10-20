import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Covasim titles and Read case study links open the poster page", async ({
  page,
}) => {
  for (const route of ["/work/", "/"]) {
    for (const selector of [".project-row .row-action", ".project-row h3 a"]) {
      await page.goto(route);
      await page.locator(selector).click();
      await expect(page).toHaveURL(/\/research\/covasim\/$/);
      await expect(page.locator("#original-poster summary")).toContainText(
        "View original poster",
      );
    }
  }
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
  for (const route of ["/", "/cv/", "/work/covasim/", "/work/", "/research/covasim/"]) {
    await page.goto(route);
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

test("evidence selection is shareable and preserves the scientific caveat", async ({
  page,
}) => {
  await page.goto("/research/covasim/");
  await page.getByRole("button", { name: "Bin 2", exact: true }).click();
  await expect(page).toHaveURL(/#bin-2$/);
  await expect(page.locator("#bin-2")).toHaveAttribute("data-selected", "true");
  await expect(
    page.getByText(
      "One retrospective Covasim episode; no causal or general claim.",
      { exact: true },
    ),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Bin 2", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await expect(page.locator('[data-selected="true"]')).toHaveCount(0);
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
  await page.goto("/research/covasim/");
  await expect(page.locator("#bin-1")).toBeVisible();
  await expect(page.locator("#bin-2")).toBeVisible();
  await expect(page.locator("#bin-3")).toBeVisible();
  await context.close();
});

test("representative pages reflow and mobile navigation works", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of ["/", "/cv/", "/work/covasim/", "/work/", "/research/covasim/"]) {
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
      "/research/covasim/",
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
}) => {
  await page.goto("/cv/");
  await expect(
    page.getByRole("heading", {
      name: "Yamir Alejandro Poldo Silva",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator("#education")).toContainText(
    "M.Sc. in Programming and Software Engineering",
  );
  await expect(page.locator("#education")).toContainText(
    "2026–2027 · Expected completion",
  );
  await expect(page.locator("#education")).toContainText("3.56 / 4.3");
  await expect(page.locator("#ift1227")).toContainText("2023–present");
  await page.locator("#covasim-research summary").click();
  await expect(page.locator("#covasim-research")).toContainText(
    "Current graduate research",
  );
  await expect(page.locator("#covasim-research")).toContainText("Summer 2026");
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
  const photographs = page.locator("#photography .photograph");
  expect(await photographs.count()).toBeGreaterThan(0);
  expect(await photographs.count()).toBeLessThanOrEqual(12);
  await expect(page.locator("#photography")).not.toContainText("Photograph forthcoming");
  for (const photograph of await photographs.all()) {
    const image = photograph.locator("img");
    await expect(image).toHaveAttribute("src", /images\/photography\/.+\.webp$/);
    await expect(image).toHaveAttribute("alt", /.+/);
    await expect(image).toHaveAttribute("loading", "lazy");
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect(photograph.locator("a")).toHaveAttribute("href", await image.getAttribute("src") || "");
  }
  await page.goto("/work/");
  await expect(page.locator(".project-row")).toHaveCount(1);
  for (const id of [
    "project-starter",
    "graphhopper",
    "civilium-structurium",
    "kaggle-classification",
  ]) {
    expect((await request.get(`/work/${id}/`)).status()).toBe(404);
  }
  await page.goto("/cv/");
  await expect(page.locator("#projects")).not.toContainText("GraphHopper");
  await expect(page.locator("#posters")).toContainText("Research poster");
});

test("CV describes exploratory research without causal claims or entry-link UI", async ({ page }) => {
  await page.goto("/cv/#covasim-research");
  const entry = page.locator("#covasim-research");
  await expect(entry).toHaveAttribute("open", "");
  await expect(entry).toContainText("PELT, Interrupted Time Series, Difference-in-Differences");
  await expect(entry).toContainText("did not provide sufficient evidence to establish causality");
  await expect(entry).toContainText("exploratory pseudo-event study");
  await expect(entry).toContainText("historical pseudo-events from the same repository");
  await expect(entry).toContainText("without making causal claims");
  await expect(entry).toContainText("Cohen’s kappa");
  for (const route of ["/cv/", "/work/covasim/", "/research/covasim/"]) {
    await page.goto(route);
    await expect(page.getByRole("link", { name: /Link to this entry|Related research entry|Research in the CV|Back to the CV entry/i })).toHaveCount(0);
    await expect(page.locator(".linked-label, .entry-permalink")).toHaveCount(0);
  }
});
