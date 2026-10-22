import { expect, test } from "@playwright/test";

test("Work keeps its project listing with a short research introduction and no Research navigation", async ({
  page,
}) => {
  await page.goto("/work/");
  await expect(
    page.getByRole("heading", { name: "Work", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".page-masthead")).toContainText(
    "changing domain knowledge",
  );
  await expect(page.locator(".project-row")).toHaveCount(2);
  await expect(page.locator(".research-entry")).toHaveCount(0);
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation", exact: true })
      .getByRole("link", { name: "Research", exact: true }),
  ).toHaveCount(0);
  const poster = page
    .locator(".project-row")
    .filter({ hasText: "Domain-relevant software evolution" });
  await expect(poster.locator(".row-action")).toHaveAttribute(
    "href",
    "/artifacts/covasim-poster.pdf",
  );
  await expect(poster.locator(".row-action")).toContainText(
    "View poster · PDF",
  );
  const calculator = page
    .locator(".project-row")
    .filter({ hasText: "Civilium Structurium" });
  await calculator.locator(".row-action").click();
  await expect(page).toHaveURL(/\/work\/civilium-structurium\/$/);
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    "/civilium/index.html",
  );
  await expect(
    page.getByRole("link", { name: "Open the calculator in a separate tab" }),
  ).toHaveAttribute("href", "/civilium/index.html");
});

test("the retired Research overview redirects to Work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/research/");
  await expect(page).toHaveURL(/\/work\/$/);
  await expect(page.locator(".project-row")).toHaveCount(2);
  await context.close();
});

test("retired poster address redirects to the PDF without JavaScript", async ({
  request,
}) => {
  const response = await request.get("/research/covasim/");
  expect(await response.text()).toMatch(/url=\/artifacts\/covasim-poster\.pdf/);
  const pdf = await request.get("/artifacts/covasim-poster.pdf");
  expect(pdf.ok()).toBe(true);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
});
