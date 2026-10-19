import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Research navigation opens the overview; entries expand independently and retain poster links", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: "Research", exact: true })
    .click();
  await expect(page).toHaveURL(/\/research\/$/);
  await expect(page.locator("#direction")).toContainText("domain knowledge");
  const project = page.locator("#research-covasim");
  const manuscript = page.locator("#research-manuscript");
  await expect(project).not.toHaveAttribute("open", "");
  await expect(project.locator("summary")).toContainText("Ongoing");
  await project.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(project).toHaveAttribute("open", "");
  await manuscript.locator("summary").click();
  await expect(manuscript).toHaveAttribute("open", "");
  await expect(project).toHaveAttribute("open", "");
  await expect(manuscript).toContainText(
    "No publication or accepted submission is claimed",
  );
  await project
    .getByRole("link", { name: "Explore the Covasim web poster", exact: false })
    .click();
  await expect(page).toHaveURL(/\/research\/covasim\/$/);
  await page
    .getByRole("link", { name: "Back to the research project", exact: false })
    .click();
  await expect(page).toHaveURL(/\/research\/#research-covasim$/);
  await expect(project).toHaveAttribute("open", "");
  await expect(project).toHaveAttribute("data-linked", "true");
});

test("research entry deep links and browser history open their targets", async ({
  page,
}) => {
  await page.goto("/research/#research-manuscript");
  const manuscript = page.locator("#research-manuscript");
  await expect(manuscript).toHaveAttribute("open", "");
  await page.locator("#research-covasim summary").click();
  await page
    .locator("#research-covasim")
    .getByRole("link", { name: "Link to this entry" })
    .click();
  await expect(page.locator("#research-covasim")).toHaveAttribute(
    "data-linked",
    "true",
  );
  await page.goBack();
  await expect(manuscript).toHaveAttribute("data-linked", "true");
  await expect(page.locator("#research-covasim")).not.toHaveAttribute(
    "data-linked",
    "true",
  );
});

test("research overview reflows and remains accessible with entries open", async ({
  page,
}, testInfo) => {
  for (const width of [1440, 768, 375, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/research/");
    for (const summary of await page.locator(".research-entry > summary").all())
      await summary.click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`research-${width}.png`),
      fullPage: true,
    });
  }
});

test("research disclosures and links work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/research/");
  await page.locator("#research-covasim summary").click();
  await expect(page.locator("#research-covasim .cv-body")).toBeVisible();
  await page
    .getByRole("link", { name: "Explore the Covasim web poster", exact: false })
    .click();
  await expect(page).toHaveURL(/\/research\/covasim\/$/);
  await context.close();
});
