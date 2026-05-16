import { test, expect } from "@playwright/test";

/**
 * Scenario 7: Mobile - hamburger menu, builder responsive
 *
 * Validates mobile-first responsive behaviour: hamburger menu visibility,
 * navigation drawer functionality, builder layout changes, form usability,
 * and tablet grid layouts.
 */

const MOBILE = { width: 375, height: 812 };
const TABLET = { width: 768, height: 1024 };
const DESKTOP = { width: 1440, height: 900 };

test.describe("Scenario 7: Mobile responsive", () => {
  test.describe("Hamburger menu", () => {
    test("hamburger is visible on mobile, desktop nav is hidden", async ({
      page,
    }) => {
      await page.setViewportSize(MOBILE);
      await page.goto("/");

      // Mobile menu toggle should be visible
      const hamburger = page
        .getByLabel(/open menu/i)
        .or(
          page
            .locator("button.lg\\:hidden")
            .filter({ has: page.locator("svg") }),
        )
        .or(page.locator("[data-testid='mobile-menu-button']"));

      await expect(hamburger.first()).toBeVisible({ timeout: 10000 });

      // Desktop-only navigation items should be hidden
      const desktopOnlyElement = page.locator(
        "a.hidden.lg\\:block, .hidden.lg\\:flex, .hidden.lg\\:block",
      );
      if ((await desktopOnlyElement.count()) > 0) {
        await expect(desktopOnlyElement.first()).not.toBeVisible();
      }
    });

    test("hamburger opens mobile menu with nav items", async ({ page }) => {
      await page.setViewportSize(MOBILE);
      await page.goto("/");

      const hamburger = page
        .getByLabel(/open menu/i)
        .or(
          page
            .locator("button.lg\\:hidden")
            .filter({ has: page.locator("svg") }),
        );

      await hamburger.first().click();

      // Mobile menu overlay/drawer should appear
      const mobileMenu = page
        .getByRole("dialog")
        .or(page.locator("[data-testid='mobile-menu']"));

      await expect(mobileMenu.first()).toBeVisible({ timeout: 5000 });

      // Core navigation items should be present
      const expectedItems = ["Resume", "CV", "Cover Letter"];
      for (const item of expectedItems) {
        const menuItem = mobileMenu.first().getByText(item);
        await expect(menuItem.first()).toBeVisible();
      }
    });

    test("mobile menu can be closed", async ({ page }) => {
      await page.setViewportSize(MOBILE);
      await page.goto("/");

      // Open menu
      const hamburger = page
        .getByLabel(/open menu/i)
        .or(
          page
            .locator("button.lg\\:hidden")
            .filter({ has: page.locator("svg") }),
        );
      await hamburger.first().click();

      const mobileMenu = page
        .getByRole("dialog")
        .or(page.locator("[data-testid='mobile-menu']"));
      await expect(mobileMenu.first()).toBeVisible({ timeout: 5000 });

      // Close menu via close button or pressing Escape
      const closeButton = page
        .getByLabel(/close menu/i)
        .or(page.getByRole("button", { name: /close/i }));

      if (
        await closeButton
          .first()
          .isVisible({ timeout: 2000 })
          .catch(() => false)
      ) {
        await closeButton.first().click();
      } else {
        await page.keyboard.press("Escape");
      }

      // Menu should no longer be visible
      await expect(mobileMenu.first()).not.toBeVisible({ timeout: 5000 });
    });

    test("mobile menu links navigate to correct pages", async ({ page }) => {
      await page.setViewportSize(MOBILE);
      await page.goto("/");

      // Open menu
      const hamburger = page
        .getByLabel(/open menu/i)
        .or(
          page
            .locator("button.lg\\:hidden")
            .filter({ has: page.locator("svg") }),
        );
      await hamburger.first().click();

      const mobileMenu = page
        .getByRole("dialog")
        .or(page.locator("[data-testid='mobile-menu']"));
      await expect(mobileMenu.first()).toBeVisible({ timeout: 5000 });

      // Find and click a link within the mobile menu
      const resumeLink = mobileMenu
        .first()
        .getByRole("link", { name: /resume template|resume builder/i })
        .or(mobileMenu.first().getByRole("link", { name: /resume/i }));

      if (
        await resumeLink
          .first()
          .isVisible({ timeout: 3000 })
          .catch(() => false)
      ) {
        const href = await resumeLink.first().getAttribute("href");
        await resumeLink.first().click();

        // Should navigate away from home
        if (href && href !== "/") {
          await expect(page).not.toHaveURL(/^\/$/, { timeout: 10000 });
        }
      }
    });
  });

  test.describe("Builder responsive layout", () => {
    test("builder uses single-column layout on mobile", async ({ page }) => {
      await page.setViewportSize(MOBILE);
      await page.goto("/build-resume");
      await page.waitForLoadState("networkidle");

      const mainContent = page
        .locator("main, [data-testid='builder']")
        .first();
      if (await mainContent.isVisible({ timeout: 10000 })) {
        const box = await mainContent.boundingBox();
        if (box) {
          // Content should span close to the full mobile viewport width
          expect(box.width).toBeLessThanOrEqual(MOBILE.width + 20);
        }
      }

      // Preview panel should be hidden or below the form
      const preview = page.locator(
        "[data-testid='resume-preview'], .preview-panel",
      );
      if (
        await preview
          .first()
          .isVisible({ timeout: 3000 })
          .catch(() => false)
      ) {
        const previewBox = await preview.first().boundingBox();
        const formArea = page
          .locator("[data-testid='builder-form'], form")
          .first();
        if (await formArea.isVisible()) {
          const formBox = await formArea.boundingBox();
          if (previewBox && formBox) {
            // Preview should be below the form (stacked layout)
            expect(previewBox.y).toBeGreaterThanOrEqual(formBox.y);
          }
        }
      }
    });

    test("builder shows side-by-side layout on desktop", async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto("/build-resume");
      await page.waitForLoadState("networkidle");

      // On desktop, main content area should be wider
      const mainContent = page
        .locator("main, [data-testid='builder']")
        .first();
      if (await mainContent.isVisible({ timeout: 10000 })) {
        const box = await mainContent.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThan(MOBILE.width);
        }
      }
    });
  });

  test.describe("Mobile form usability", () => {
    test("login form inputs are full-width on mobile", async ({ page }) => {
      await page.setViewportSize(MOBILE);
      await page.goto("/signin");

      const emailInput = page.getByPlaceholder("you@example.com");
      const passwordInput = page.getByPlaceholder("Enter your password");
      const submitButton = page.getByRole("button", { name: /sign in/i });

      await expect(emailInput).toBeVisible({ timeout: 10000 });
      await expect(passwordInput).toBeVisible();
      await expect(submitButton).toBeVisible();

      // Inputs should be nearly full width on mobile
      const emailBox = await emailInput.boundingBox();
      if (emailBox) {
        expect(emailBox.width).toBeGreaterThan(250);
      }
    });

    test("signup form is usable on mobile", async ({ page }) => {
      await page.setViewportSize(MOBILE);
      await page.goto("/signup");

      // All form fields should be visible and accessible
      const firstNameInput = page.getByPlaceholder("John");
      await expect(firstNameInput).toBeVisible({ timeout: 10000 });

      const emailInput = page.getByPlaceholder("you@example.com");
      await expect(emailInput).toBeVisible();

      const submitButton = page.getByRole("button", {
        name: /create account/i,
      });
      await expect(submitButton).toBeVisible();
    });
  });

  test.describe("Tablet layout", () => {
    test("template grid shows multi-column layout on tablet", async ({
      page,
    }) => {
      await page.setViewportSize(TABLET);
      await page.goto("/resume-templates");

      const templateCards = page
        .locator("[data-testid='template-card']")
        .or(page.locator(".group").filter({ has: page.locator("img") }));

      await expect(templateCards.first()).toBeVisible({ timeout: 15000 });

      const count = await templateCards.count();
      if (count >= 2) {
        const firstBox = await templateCards.nth(0).boundingBox();
        const secondBox = await templateCards.nth(1).boundingBox();

        if (firstBox && secondBox) {
          // Cards should be side by side (same row)
          const sameRow = Math.abs(firstBox.y - secondBox.y) < 10;
          const differentColumn =
            Math.abs(firstBox.x - secondBox.x) > 100;

          if (sameRow) {
            expect(differentColumn).toBe(true);
          }
        }
      }
    });
  });

  test.describe("Mobile footer", () => {
    test("footer stacks vertically on mobile", async ({ page }) => {
      await page.setViewportSize(MOBILE);
      await page.goto("/");

      await page.evaluate(() =>
        window.scrollTo(0, document.body.scrollHeight),
      );

      const footer = page.locator("footer");
      await expect(footer).toBeVisible({ timeout: 5000 });

      const footerGrid = footer.locator(".grid");
      if (await footerGrid.first().isVisible()) {
        const gridBox = await footerGrid.first().boundingBox();
        if (gridBox) {
          expect(gridBox.width).toBeLessThanOrEqual(MOBILE.width + 20);
        }
      }
    });
  });

  test.describe("Desktop baseline", () => {
    test("desktop shows full navigation bar without hamburger", async ({
      page,
    }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto("/");

      const desktopNav = page.locator("nav").filter({
        has: page.getByText("Resume"),
      });
      await expect(desktopNav.first()).toBeVisible({ timeout: 10000 });

      // Hamburger should NOT be visible on desktop
      const hamburger = page.getByLabel(/open menu/i);
      if ((await hamburger.count()) > 0) {
        await expect(hamburger.first()).not.toBeVisible();
      }
    });
  });
});
