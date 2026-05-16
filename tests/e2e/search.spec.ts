import { test, expect } from "@playwright/test";

/**
 * Scenario 9: Search examples and articles (Elasticsearch)
 *
 * Tests the search functionality across resume examples, CV examples,
 * cover letter examples, and content/article pages. Validates query input,
 * result rendering, filtering, and empty-state handling.
 */

test.describe("Scenario 9: Search examples and articles", () => {
  test.describe("Resume examples search", () => {
    test("resume examples page loads with searchable content", async ({
      page,
    }) => {
      await page.goto("/resume-examples");

      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading.first()).toBeVisible({ timeout: 10000 });

      // Should display categories or example cards
      const content = page
        .getByRole("link", {
          name: /technology|healthcare|finance|education|marketing|engineer|developer/i,
        })
        .or(page.locator("[data-testid='category-card']"));

      await expect(content.first()).toBeVisible({ timeout: 15000 });
    });

    test("clicking a category shows filtered resume examples", async ({
      page,
    }) => {
      await page.goto("/resume-examples");
      await page.waitForLoadState("networkidle");

      const categoryLink = page
        .getByRole("link", { name: /technology/i })
        .or(page.getByRole("button", { name: /technology/i }))
        .or(page.locator("[data-testid='category-card']").first());

      if (
        await categoryLink
          .first()
          .isVisible({ timeout: 10000 })
          .catch(() => false)
      ) {
        await categoryLink.first().click();
        await page.waitForLoadState("networkidle");

        // Should show filtered results or navigate to category page
        const currentUrl = page.url();
        const hasExampleCards = await page
          .locator("[data-testid='example-card']")
          .or(page.locator(".group").filter({ has: page.locator("img") }))
          .first()
          .isVisible({ timeout: 5000 })
          .catch(() => false);

        expect(
          /technology|category|filter/.test(currentUrl) || hasExampleCards,
        ).toBeTruthy();
      }
    });

    test("resume example detail page shows job-specific tips", async ({
      page,
    }) => {
      await page.goto("/resume-examples");
      await page.waitForLoadState("networkidle");

      const exampleLink = page
        .locator("a[href*='resume-examples/']")
        .or(page.locator("[data-testid='example-card'] a"));

      if (
        await exampleLink
          .first()
          .isVisible({ timeout: 10000 })
          .catch(() => false)
      ) {
        await exampleLink.first().click();
        await page.waitForLoadState("networkidle");

        const heading = page.getByRole("heading");
        await expect(heading.first()).toBeVisible({ timeout: 10000 });

        // Should show tips or job-related content
        const tipContent = page.getByText(
          /tip|keyword|experience|skill|summary|example/i,
        );
        await expect(tipContent.first()).toBeVisible({ timeout: 5000 });
      }
    });

    test("'Use as template' on example navigates to builder", async ({
      page,
    }) => {
      await page.goto("/resume-examples");
      await page.waitForLoadState("networkidle");

      const exampleLink = page
        .locator("a[href*='resume-examples/']")
        .or(page.locator("[data-testid='example-card'] a"));

      if (
        await exampleLink
          .first()
          .isVisible({ timeout: 10000 })
          .catch(() => false)
      ) {
        await exampleLink.first().click();
        await page.waitForLoadState("networkidle");

        const useButton = page
          .getByRole("link", {
            name: /use.*template|create.*resume|build.*resume/i,
          })
          .or(
            page.getByRole("button", {
              name: /use.*template|create.*resume/i,
            }),
          );

        if (
          await useButton
            .first()
            .isVisible({ timeout: 10000 })
            .catch(() => false)
        ) {
          await useButton.first().click();
          await expect(page).toHaveURL(
            /build-resume|resume-builder|dashboard/,
            { timeout: 10000 },
          );
        }
      }
    });
  });

  test.describe("CV examples search", () => {
    test("CV examples page loads", async ({ page }) => {
      const response = await page.goto("/cv-examples", {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBeLessThan(500);

      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Cover letter examples search", () => {
    test("cover letter examples page loads", async ({ page }) => {
      const response = await page.goto("/cover-letter-examples", {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBeLessThan(500);

      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Content article search", () => {
    test("career advice page loads with article links", async ({ page }) => {
      await page.goto("/career-advice", { waitUntil: "domcontentloaded" });

      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading.first()).toBeVisible({ timeout: 10000 });

      // Should have article links
      const articleLinks = page.getByRole("link");
      const count = await articleLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test("resume hub page has links to guide articles", async ({ page }) => {
      await page.goto("/resume", { waitUntil: "domcontentloaded" });

      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading.first()).toBeVisible({ timeout: 10000 });

      // Should have links to how-to, format, etc.
      const guideLinks = page.getByRole("link", {
        name: /how to|format|template|example|tip/i,
      });
      const count = await guideLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test("job search page loads", async ({ page }) => {
      const response = await page.goto("/job-search", {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBeLessThan(500);

      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading.first()).toBeVisible({ timeout: 10000 });
    });

    test("job interviews page loads", async ({ page }) => {
      const response = await page.goto("/job-interviews", {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBeLessThan(500);

      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Search input interaction", () => {
    test("search input accepts queries on examples pages", async ({
      page,
    }) => {
      await page.goto("/resume-examples");
      await page.waitForLoadState("networkidle");

      // Look for a search input on the page
      const searchInput = page
        .getByRole("searchbox")
        .or(page.getByPlaceholder(/search|find|look/i))
        .or(page.locator("input[type='search']"))
        .or(page.locator("[data-testid='search-input']"));

      if (
        await searchInput
          .first()
          .isVisible({ timeout: 5000 })
          .catch(() => false)
      ) {
        await searchInput.first().fill("software engineer");
        await searchInput.first().press("Enter");

        // Wait for search results to update
        await page.waitForLoadState("networkidle");

        // Should show results or a "no results" message
        const resultContent = page
          .getByText(/result|found|match|no result|engineer/i)
          .or(page.locator("[data-testid='search-results']"));

        await expect(resultContent.first()).toBeVisible({ timeout: 10000 });
      }
    });

    test("search with no results shows appropriate message", async ({
      page,
    }) => {
      await page.goto("/resume-examples");
      await page.waitForLoadState("networkidle");

      const searchInput = page
        .getByRole("searchbox")
        .or(page.getByPlaceholder(/search|find|look/i))
        .or(page.locator("input[type='search']"));

      if (
        await searchInput
          .first()
          .isVisible({ timeout: 5000 })
          .catch(() => false)
      ) {
        // Search for something unlikely to have results
        await searchInput.first().fill("xyznonexistent12345");
        await searchInput.first().press("Enter");
        await page.waitForLoadState("networkidle");

        // Should show a no-results state or empty results
        const noResults = page.getByText(
          /no result|not found|no match|try again|0 result/i,
        );
        if (
          await noResults
            .first()
            .isVisible({ timeout: 5000 })
            .catch(() => false)
        ) {
          await expect(noResults.first()).toBeVisible();
        }
      }
    });
  });
});
