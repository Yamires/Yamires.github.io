import { expect, test } from "@playwright/test";

test("production pages enforce CSP without blocking their own resources", async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).policyViolations = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      (window as any).policyViolations.push(event.violatedDirective);
    });
  });
  for (const path of ["/", "/cv/", "/work/covasim/", "/research/covasim/"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const policy = await page.locator('meta[http-equiv="content-security-policy"]').getAttribute("content");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("frame-src https://www.canva.com");
    expect(policy).toContain("script-src-attr 'none'");
    expect(policy).not.toContain("unsafe-inline");
    expect(policy).not.toContain("unsafe-eval");
    expect(await page.evaluate(() => (window as any).policyViolations)).toEqual([]);
  }
  await page.evaluate(() => {
    const script = document.createElement("script");
    script.textContent = "window.injectedScriptRan = true";
    document.body.append(script);
  });
  expect(await page.evaluate(() => (window as any).injectedScriptRan)).toBeUndefined();
  await expect.poll(() => page.evaluate(() => (window as any).policyViolations.length)).toBeGreaterThan(0);
});
