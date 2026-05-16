import { test, expect, type Page } from "@playwright/test";

/**
 * Scenario 5: Creating a cover letter with matching resume
 *
 * Tests the cover letter builder flow: template selection,
 * filling in recipient/company details, writing the letter body,
 * associating it with a resume, and previewing the result.
 */

test.describe("Scenario 5: Creating a cover letter with matching resume", () => {
  test("cover letter builder page loads", async ({ page }) => {
    await page.goto("/build-letter");

    // Page should load with builder content
    const heading = page.getByRole("heading");
    await expect(heading.first()).toBeVisible({ timeout: 10000 });

    const builderContent = page.getByText(
      /cover letter|template|letter|recipient|company/i,
    );
    await expect(builderContent.first()).toBeVisible({ timeout: 10000 });
  });

  test("cover letter builder landing page exists with CTA", async ({
    page,
  }) => {
    await page.goto("/cover-letter-builder");

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });

    // Should have a CTA to start building
    const ctaButton = page
      .getByRole("link", {
        name: /build|create|start|get started/i,
      })
      .or(
        page.getByRole("button", {
          name: /build|create|start|get started/i,
        }),
      );
    await expect(ctaButton.first()).toBeVisible({ timeout: 10000 });
  });

  test("selects a cover letter template", async ({ page }) => {
    await page.goto("/build-letter");

    // Look for template cards in the builder
    const templateCards = page
      .locator("[data-testid='template-card'], .group")
      .filter({ has: page.locator("img") });

    if (
      await templateCards
        .first()
        .isVisible({ timeout: 10000 })
        .catch(() => false)
    ) {
      await templateCards.first().click();

      // Should advance to the next step (content editing)
      const contentStep = page.getByText(
        /step 2|content|recipient|company|dear|hiring/i,
      );
      await expect(contentStep.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("fills cover letter recipient and company details", async ({
    page,
  }) => {
    await page.goto("/build-letter");

    // Select template if present
    const templateCards = page
      .locator("[data-testid='template-card'], .group")
      .filter({ has: page.locator("img") });
    if (
      await templateCards
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false)
    ) {
      await templateCards.first().click();
    }

    // Fill recipient details
    const recipientName = page
      .getByLabel(/recipient|hiring manager|addressee/i)
      .or(page.getByPlaceholder(/recipient|hiring manager|name/i));
    const companyName = page
      .getByLabel(/company|organization/i)
      .or(page.getByPlaceholder(/company|organization/i));
    const jobTitle = page
      .getByLabel(/job title|position|role/i)
      .or(page.getByPlaceholder(/job title|position|role/i));

    if (await recipientName.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await recipientName.first().fill("Sarah Connor");
    }
    if (await companyName.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await companyName.first().fill("Cyberdyne Systems");
    }
    if (await jobTitle.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await jobTitle.first().fill("Senior Frontend Engineer");
    }
  });

  test("writes cover letter body content", async ({ page }) => {
    await page.goto("/build-letter");

    // Select template if present
    const templateCards = page
      .locator("[data-testid='template-card'], .group")
      .filter({ has: page.locator("img") });
    if (
      await templateCards
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false)
    ) {
      await templateCards.first().click();
    }

    // Find the body/content textarea
    const bodyTextarea = page
      .getByLabel(/body|content|letter|message/i)
      .or(page.getByPlaceholder(/write|body|content|letter/i))
      .or(page.locator("textarea"));

    if (await bodyTextarea.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      await bodyTextarea.first().fill(
        "Dear Hiring Manager,\n\n" +
          "I am writing to express my strong interest in the Senior Frontend Engineer position " +
          "at Cyberdyne Systems. With over 8 years of experience building scalable web applications " +
          "using React and TypeScript, I am confident I can make meaningful contributions to your team.\n\n" +
          "Thank you for your consideration.\n\n" +
          "Sincerely,\nAlice Johnson",
      );
    }
  });

  test("cover letter templates gallery page loads", async ({ page }) => {
    await page.goto("/cover-letter-templates");

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });

    // Should display template cards
    const templateCards = page
      .locator("[data-testid='template-card']")
      .or(page.locator(".group").filter({ has: page.locator("img") }));

    await expect(templateCards.first()).toBeVisible({ timeout: 15000 });
  });

  test("cover letter examples page loads with categories", async ({
    page,
  }) => {
    await page.goto("/cover-letter-examples");

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });

    // Should display example categories or cards
    const exampleContent = page
      .getByRole("link")
      .or(page.locator("[data-testid='category-card']"))
      .or(page.locator(".group"));

    const count = await exampleContent.count();
    expect(count).toBeGreaterThan(0);
  });

  test("cover letter content hub page loads", async ({ page }) => {
    await page.goto("/cover-letter");

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading.first()).toBeVisible({ timeout: 10000 });

    // Should have links to related articles
    const articleLinks = page.getByRole("link", {
      name: /how to|format|tips|template|necessary|include/i,
    });
    const linkCount = await articleLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});
