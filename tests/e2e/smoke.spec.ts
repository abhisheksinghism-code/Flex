import { expect, test } from "@playwright/test";

test("home -> search -> compare -> AI summary -> merchant redirect", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Flex the best deal/i })).toBeVisible();

  await page.getByRole("link", { name: "Sony WH-1000XM6" }).click();
  await page.waitForURL(/\/compare\//);

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Sony");
  await expect(page.getByText("Flex AI Review")).toBeVisible();

  const [newTab] = await Promise.all([
    page.context().waitForEvent("page"),
    page.getByRole("link", { name: "View Deal" }).first().click(),
  ]);
  await newTab.waitForLoadState("domcontentloaded");
  expect(newTab.url()).toMatch(/amazon\.in|flipkart\.com|myntra\.com/);
});

test("a merchant with no listing shows as Not Available, not a broken row", async ({ page }) => {
  await page.goto("/search?q=iPhone%2017%20Pro%20256GB");
  await page.waitForURL(/\/compare\//);

  await expect(page.getByRole("cell", { name: "Myntra" })).toBeVisible();
  await expect(page.getByText("Not Available")).toBeVisible();
  // Amazon and Flipkart both have a listing and a real "Best Price" badge on one of them.
  await expect(page.getByText("Best Price")).toBeVisible();
});

test("an ambiguous match lets the user disambiguate, then compares the chosen variant", async ({
  page,
}) => {
  await page.goto("/search?q=Nike%20Air%20Max%2090");
  await expect(page.getByRole("heading", { name: "Which one did you mean?" })).toBeVisible();

  const options = page.getByRole("link").filter({ hasText: "Nike" });
  await expect(options).toHaveCount(2);

  await options.first().click();
  await page.waitForURL(/\/compare\//);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Nike");
});
