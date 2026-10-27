import { expect, test } from "@playwright/test";

// Pin the default context to light so the toggle test has a known start.
test.use({ colorScheme: "light" });

test("theme defaults to the visitor's system preference", async ({ browser }) => {
  const darkCtx = await browser.newContext({ colorScheme: "dark" });
  const darkPage = await darkCtx.newPage();
  await darkPage.goto("/");
  await expect(darkPage.locator("html")).toHaveClass(/dark/);
  await darkCtx.close();

  const lightCtx = await browser.newContext({ colorScheme: "light" });
  const lightPage = await lightCtx.newPage();
  await lightPage.goto("/");
  await expect(lightPage.locator("html")).not.toHaveClass(/dark/);
  await lightCtx.close();
});

test("theme toggles both ways and the choice survives navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  // The preference should persist across a page load, not reset.
  await page.goto("/privacy");
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});
