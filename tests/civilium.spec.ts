import { expect, test } from "@playwright/test";

const base = (process.env.BASE_PATH || "").replace(/\/$/, "");

test("embedded calculator runs a worker calculation and preserves configuration", async ({
  page,
}) => {
  const errors: string[] = [];
  const workers: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("worker", (worker) => workers.push(worker.url()));
  await page.goto(`${base}/work/civilium-structurium/`);
  const calculator = page.frameLocator(
    'iframe[title="Civilium Structurium calculator"]',
  );
  await calculator
    .getByRole("combobox", { name: "Choisir une méthode" })
    .click();
  await calculator
    .getByRole("option", {
      name: "Poutre simple - Charge Uniformement Distribuée",
      exact: true,
    })
    .click();
  for (const [name, value] of Object.entries({
    x: "3",
    l: "6",
    lt: "2",
    cv: "3",
    cm: "2",
  })) {
    await calculator.locator(`input[name="${name}"]`).fill(value);
  }
  await calculator
    .getByRole("button", { name: "Calculer", exact: true })
    .click();
  const moment = calculator.getByRole("row").filter({ hasText: "M.F. (kN.m)" });
  await expect(moment.getByRole("cell").nth(1)).toHaveText("63");
  expect(workers.some((url) => /calculation\.worker-/.test(url))).toBe(true);

  await page.locator("iframe").scrollIntoViewIfNeeded();
  await calculator
    .getByRole("button", { name: "Configuration", exact: true })
    .click();
  await calculator
    .getByRole("dialog")
    .getByRole("textbox", { name: "phi", exact: true })
    .fill("0.85");
  await calculator
    .getByRole("button", { name: "Enregistrer", exact: true })
    .click();
  await expect(calculator.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  await calculator
    .getByRole("button", { name: "Configuration", exact: true })
    .click();
  await expect(
    calculator
      .getByRole("dialog")
      .getByRole("textbox", { name: "phi", exact: true }),
  ).toHaveValue("0.85");
  await calculator
    .getByRole("button", { name: "Annuler", exact: true })
    .click();

  const popupPromise = page.waitForEvent("popup");
  const openLink = page.getByRole("link", {
    name: "Open the calculator in a separate tab",
  });
  await openLink.focus();
  await page.keyboard.press("Enter");
  const popup = await popupPromise;
  await expect(popup).toHaveURL(/\/civilium\/index\.html$/);
  await expect(
    popup.getByRole("combobox", { name: "Choisir une méthode" }),
  ).toBeVisible();
  const scope = await popup.evaluate(
    async () => (await navigator.serviceWorker.ready).scope,
  );
  expect(new URL(scope).pathname).toBe(`${base}/civilium/`);
  expect(errors).toEqual([]);
});

test("poster and calculator links resolve with the configured base path", async ({
  page,
  request,
}) => {
  await page.goto(`${base}/work/`);
  const poster = page
    .locator(".project-row")
    .filter({ hasText: "Domain-relevant software evolution" });
  await expect(poster.locator("h3 a")).toHaveAttribute(
    "href",
    `${base}/artifacts/covasim-poster.pdf`,
  );
  await expect(poster.locator(".row-action")).toHaveAttribute(
    "href",
    `${base}/artifacts/covasim-poster.pdf`,
  );
  const retired = await request.get(`${base}/research/covasim/`);
  expect(await retired.text()).toContain(
    `url=${base}/artifacts/covasim-poster.pdf`,
  );
  const pdf = await request.get(`${base}/artifacts/covasim-poster.pdf`);
  expect(pdf.ok()).toBe(true);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  await page
    .locator(".project-row")
    .filter({ hasText: "Civilium Structurium" })
    .locator(".row-action")
    .click();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    `${base}/civilium/index.html`,
  );
});

test("phones show a device notice without loading the calculator; tablets can use it", async ({
  page,
}) => {
  const calculatorRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes(`${base}/civilium/`))
      calculatorRequests.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/work/civilium-structurium/`);
  await expect(
    page.getByRole("heading", { name: "Open on a tablet or desktop" }),
  ).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Open the calculator in a separate tab" }),
  ).toBeHidden();
  expect(calculatorRequests).toEqual([]);
  await page.setViewportSize({ width: 767, height: 900 });
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(
    page
      .frameLocator("iframe")
      .getByRole("combobox", { name: "Choisir une méthode" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Open on a tablet or desktop" }),
  ).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Open on a tablet or desktop" }),
  ).toBeVisible();
});

test("the separate calculator address also blocks phone-sized screens", async ({
  page,
}) => {
  const bundles: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/assets/")) bundles.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/civilium/index.html`);
  await expect(
    page.getByRole("heading", { name: "Open on a tablet or desktop" }),
  ).toBeVisible();
  expect(bundles).toEqual([]);
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(
    page.getByRole("combobox", { name: "Choisir une méthode" }),
  ).toBeVisible();
});
