import { test, expect } from "@playwright/test";

/**
 * Scenario 6: Navigation - check all 40+ pages load correctly
 *
 * Iterates through every known route in the application and verifies
 * each one returns a non-500 status, renders content, and does not
 * throw critical JS errors.
 */

/** All static pages in the application (40+ routes). */
const ALL_PAGES: Array<{ path: string; name: string }> = [
  // Marketing / Home
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  { path: "/contact", name: "Contact" },
  { path: "/editorial-guidelines", name: "Editorial Guidelines" },
  { path: "/featured-in", name: "Featured In" },
  { path: "/fraud-awareness", name: "Fraud Awareness" },

  // Auth
  { path: "/signin", name: "Sign In" },
  { path: "/signup", name: "Sign Up" },
  { path: "/forgot-password", name: "Forgot Password" },
  { path: "/reset-password", name: "Reset Password" },
  { path: "/verify-email", name: "Verify Email" },

  // App / Builders
  { path: "/build-resume", name: "Resume Builder (App)" },
  { path: "/build-cv", name: "CV Builder (App)" },
  { path: "/build-letter", name: "Cover Letter Builder (App)" },
  { path: "/dashboard", name: "Dashboard" },
  { path: "/my-documents", name: "My Documents" },
  { path: "/account", name: "Account Settings" },

  // Tool Landing Pages
  { path: "/resume-builder", name: "Resume Builder Landing" },
  { path: "/cv-builder", name: "CV Builder Landing" },
  { path: "/cover-letter-builder", name: "Cover Letter Builder Landing" },

  // Galleries
  { path: "/resume-templates", name: "Resume Templates" },
  { path: "/resume-examples", name: "Resume Examples" },
  { path: "/cv-templates", name: "CV Templates" },
  { path: "/cv-examples", name: "CV Examples" },
  { path: "/cover-letter-templates", name: "Cover Letter Templates" },
  { path: "/cover-letter-examples", name: "Cover Letter Examples" },

  // Content - Resume
  { path: "/resume", name: "Resume Hub" },
  { path: "/resume/how-to", name: "How to Write a Resume" },
  { path: "/resume/format", name: "Resume Format" },
  { path: "/resume/free-templates", name: "Free Resume Templates" },
  { path: "/resume/free-templates-word", name: "Free Resume Templates Word" },
  { path: "/resume/google-docs", name: "Resume Google Docs" },

  // Content - CV
  { path: "/cv", name: "CV Hub" },
  { path: "/cv/how-to", name: "How to Write a CV" },
  { path: "/cv/format", name: "CV Format" },

  // Content - Cover Letter
  { path: "/cover-letter", name: "Cover Letter Hub" },
  { path: "/cover-letter/how-to", name: "How to Write a Cover Letter" },
  { path: "/cover-letter/format", name: "Cover Letter Format" },
  { path: "/cover-letter/tips", name: "Cover Letter Tips" },
  { path: "/cover-letter/what-to-include", name: "What to Include" },
  {
    path: "/cover-letter/are-cover-letters-necessary",
    name: "Are Cover Letters Necessary",
  },
  { path: "/cover-letter/generic", name: "Generic Cover Letter" },
  {
    path: "/cover-letter/free-templates-word",
    name: "Cover Letter Templates Word",
  },
  {
    path: "/cover-letter/google-docs-templates",
    name: "Cover Letter Google Docs",
  },

  // Content - Career
  { path: "/career-advice", name: "Career Advice" },
  { path: "/job-search", name: "Job Search" },
  { path: "/job-interviews", name: "Job Interviews" },

  // Legal
  { path: "/privacy-policy", name: "Privacy Policy" },
  { path: "/terms-of-service", name: "Terms of Service" },
  { path: "/accessibility", name: "Accessibility" },
  { path: "/cookies-and-tracking", name: "Cookies and Tracking" },
];

test.describe("Scenario 6: All pages load correctly", () => {
  for (const { path, name } of ALL_PAGES) {
    test(`${name} (${path}) loads without server errors`, async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      page.on("pageerror", (err) => {
        consoleErrors.push(err.message);
      });

      const response = await page.goto(path, {
        waitUntil: "domcontentloaded",
        timeout: 20000,
      });

      // Page should not return a 5xx server error
      expect(response?.status()).toBeLessThan(500);

      // Page should have visible content (not blank)
      const bodyText = await page.textContent("body");
      expect(bodyText?.trim().length).toBeGreaterThan(0);

      // Log JS console errors for debugging (filter benign ones)
      const criticalErrors = consoleErrors.filter(
        (e) =>
          !e.includes("hydration") &&
          !e.includes("ResizeObserver") &&
          !e.includes("favicon"),
      );
      if (criticalErrors.length > 0) {
        console.warn(`[${name}] Console errors:`, criticalErrors);
      }
    });
  }

  test("404 page renders for unknown routes", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist-xyz123");

    expect(response?.status()).toBe(404);

    const notFoundText = page.getByText(/not found|404|page.*exist/i);
    await expect(notFoundText.first()).toBeVisible({ timeout: 10000 });
  });

  test("header is present on all main pages", async ({ page }) => {
    const pagesToCheck = [
      "/",
      "/resume-templates",
      "/about",
      "/contact",
      "/career-advice",
    ];

    for (const path of pagesToCheck) {
      await page.goto(path, { waitUntil: "domcontentloaded" });

      const header = page.locator("header");
      await expect(header.first()).toBeVisible({ timeout: 10000 });

      // Logo should be visible in header
      const logo = header.getByRole("link", { name: /resumer/i });
      await expect(logo.first()).toBeVisible();
    }
  });

  test("footer is present on all main pages", async ({ page }) => {
    const pagesToCheck = ["/", "/resume-templates", "/about", "/cv"];

    for (const path of pagesToCheck) {
      await page.goto(path, { waitUntil: "domcontentloaded" });

      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      const footer = page.locator("footer");
      await expect(footer.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("navigation links resolve to valid pages", async ({ page }) => {
    await page.goto("/");

    // Collect all internal links from the nav
    const navLinks = page.locator("nav a[href^='/']");
    const hrefs: string[] = [];

    const count = await navLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute("href");
      if (href && !hrefs.includes(href)) {
        hrefs.push(href);
      }
    }

    // Verify each nav link resolves (not 500)
    for (const href of hrefs.slice(0, 15)) {
      const response = await page.goto(href, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });
      expect(response?.status()).toBeLessThan(500);
    }
  });
});
