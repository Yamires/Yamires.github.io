import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const design =
  "https://www.canva.com/design/DAHXzmfH3CQ/EYSeUrbNlyHDHiVUECEvhQ/view";

test("poster viewer loads only on opening and reuses its iframe", async ({
  page,
}) => {
  let requests = 0;
  await page.route("https://www.canva.com/**", (route) => {
    requests++;
    return route.fulfill({
      contentType: "text/html",
      body: '<!doctype html><html lang="en"><head><title>Poster test viewer</title></head><body>Poster test viewer</body></html>',
    });
  });
  await page.goto("/research/covasim/");
  const viewer = page.locator("#original-poster");
  await expect(viewer).not.toHaveAttribute("open", "");
  await expect(viewer.locator("iframe")).toHaveCount(0);
  expect(requests).toBe(0);
  await expect(
    page.getByRole("link", { name: "Open in Canva", exact: false }),
  ).toHaveAttribute("href", design);
  await expect(
    page.getByRole("link", { name: "Download poster · PDF", exact: false }),
  ).toHaveAttribute("href", /\/artifacts\/covasim-poster\.pdf$/);
  await viewer.locator("summary").focus();
  await page.keyboard.press("Enter");
  const frame = viewer.locator("iframe");
  await expect(frame).toHaveCount(1);
  await expect(frame).toHaveAttribute("src", `${design}?embed&meta`);
  await expect(frame).toHaveAttribute(
    "title",
    "Original research poster — Domain-Relevant Software Evolution: A Case Study of Covasim",
  );
  await expect.poll(() => requests).toBe(1);
  await page
    .frameLocator("#original-poster iframe")
    .locator("body")
    .evaluate((body) => (body.dataset.testState = "retained"));
  await viewer.locator("summary").click();
  await expect(frame).toBeHidden();
  await viewer.locator("summary").click();
  await expect(frame).toBeVisible();
  await expect(
    page.frameLocator("#original-poster iframe").locator("body"),
  ).toHaveAttribute("data-test-state", "retained");
  expect(requests).toBe(1);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("blocked Canva leaves fallback links and the complete narrative available", async ({
  page,
}) => {
  await page.route("https://www.canva.com/**", (route) => route.abort());
  await page.goto("/research/covasim/");
  await page.locator("#original-poster summary").click();
  await expect(
    page.getByRole("link", { name: "Open in Canva", exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Download poster · PDF", exact: false }),
  ).toBeVisible();
  for (const id of ["motivation", "approach", "findings", "next-steps"])
    await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator("#findings")).toContainText(
    "no causal or general claim",
  );
});

test("poster links work without JavaScript and Canva is never requested", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  let requests = 0;
  await page.route("https://www.canva.com/**", (route) => {
    requests++;
    return route.abort();
  });
  await page.goto("/research/covasim/");
  await page.locator("#original-poster summary").click();
  await expect(page.locator("#original-poster iframe")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Open in Canva", exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Download poster · PDF", exact: false }),
  ).toBeVisible();
  expect(requests).toBe(0);
  await context.close();
});

test("expanded poster preserves portrait proportions and reflows on mobile", async ({
  page,
}, testInfo) => {
  await page.route("https://www.canva.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<!doctype html><html lang="en"><head><title>Poster preview</title></head><body>Original poster viewer</body></html>',
    }),
  );
  for (const width of [1440, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/research/covasim/");
    await page.locator("#original-poster summary").click();
    const box = await page.locator("#original-poster iframe").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(760);
    expect(box!.height / box!.width).toBeCloseTo(2304 / 1536, 2);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`poster-open-${width}.png`),
    });
  }
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("#original-poster")).toBeHidden();
  await expect(
    page.getByRole("link", { name: "Download poster · PDF", exact: false }),
  ).toBeVisible();
});
