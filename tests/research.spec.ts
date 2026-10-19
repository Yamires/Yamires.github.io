import { expect, test } from "@playwright/test";

test("Work keeps its project listing with a short research introduction and no Research navigation", async ({ page }) => {
  await page.goto("/work/");
  await expect(page.getByRole("heading", { name: "Work", exact: true })).toBeVisible();
  await expect(page.locator(".page-masthead")).toContainText("changing domain knowledge");
  await expect(page.locator(".project-row")).toHaveCount(1);
  await expect(page.locator(".research-entry")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Main navigation", exact: true }).getByRole("link", { name: "Research", exact: true })).toHaveCount(0);
  await page.locator(".project-row .row-action").click();
  await expect(page).toHaveURL(/\/research\/covasim\/$/);
  await page.getByRole("link", { name: "Back to Work", exact: false }).click();
  await expect(page).toHaveURL(/\/work\/$/);
});

test("the retired Research overview redirects to Work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/research/");
  await expect(page).toHaveURL(/\/work\/$/);
  await expect(page.locator(".project-row")).toBeVisible();
  await context.close();
});
