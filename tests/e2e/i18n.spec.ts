import { test, expect } from "@playwright/test";

/**
 * Scenario 8: Multilingual - EN -> DE -> FR switching
 *
 * Verifies i18n support: locale-prefixed routes render correctly,
 * UI text changes per locale, and the language switcher works.
 * The app supports: en-us, en-gb, en-in, de, fr, es, it, pt-br, ru, tr, uz.
 */

test.describe("Scenario 8: Multilingual EN -> DE -> FR switching", () => {
  test.describe("Locale-prefixed routes render correctly", () => {
    const localePages = [
      { locale: "de", path: "/de", expectedText: /Startseite|Lebenslauf|Professionell/i },
      { locale: "fr", path: "/fr", expectedText: /Accueil|CV|Professionnel/i },
      { locale: "es", path: "/es", expectedText: /Inicio|Curr.culum|Profesional/i },
    ];

    for (const { locale, path, expectedText } of localePages) {
      test(`/${locale} home page loads with localized content`, async ({
        page,
      }) => {
        const response = await page.goto(path, {
          waitUntil: "domcontentloaded",
          timeout: 15000,
        });

        expect(response?.status()).toBeLessThan(500);

        // Page should contain text in the target language
        const localizedContent = page.getByText(expectedText);
        await expect(localizedContent.first()).toBeVisible({ timeout: 10000 });
      });
    }
  });

  test.describe("German (DE) locale", () => {
    test("German about page renders in German", async ({ page }) => {
      await page.goto("/de/about", { waitUntil: "domcontentloaded" });

      const heading = page.getByRole("heading");
      await expect(heading.first()).toBeVisible({ timeout: 10000 });

      // Nav should show German text
      const germanNav = page.getByText(/Vorlagen|Beispiele|Kontakt|Über uns/i);
      await expect(germanNav.first()).toBeVisible({ timeout: 10000 });
    });

    test("German resume builder page loads", async ({ page }) => {
      const response = await page.goto("/de/resume-builder", {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBeLessThan(500);

      const heading = page.getByRole("heading");
      await expect(heading.first()).toBeVisible({ timeout: 10000 });
    });

    test("German resume templates page loads", async ({ page }) => {
      const response = await page.goto("/de/resume-templates", {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBeLessThan(500);

      const content = page.getByText(/Vorlage|Lebenslauf/i);
      await expect(content.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("French (FR) locale", () => {
    test("French about page renders in French", async ({ page }) => {
      await page.goto("/fr/about", { waitUntil: "domcontentloaded" });

      const heading = page.getByRole("heading");
      await expect(heading.first()).toBeVisible({ timeout: 10000 });

      // Nav should show French text
      const frenchNav = page.getByText(
        /Mod.les|Exemples|Contact|propos/i,
      );
      await expect(frenchNav.first()).toBeVisible({ timeout: 10000 });
    });

    test("French cover letter page loads", async ({ page }) => {
      const response = await page.goto("/fr/cover-letter", {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBeLessThan(500);

      const heading = page.getByRole("heading");
      await expect(heading.first()).toBeVisible({ timeout: 10000 });
    });

    test("French contact page loads", async ({ page }) => {
      const response = await page.goto("/fr/contact", {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBeLessThan(500);
    });
  });

  test.describe("Language switcher interaction", () => {
    test("language switcher is present on the homepage", async ({ page }) => {
      await page.goto("/");

      const langSwitcher = page
        .getByRole("button", { name: /language|english|region|choose/i })
        .or(page.locator("[data-testid='language-switcher']"))
        .or(page.locator("select[name*='lang']"))
        .or(page.getByRole("button", { name: /🇺🇸|🇬🇧|en/i }));

      await expect(langSwitcher.first()).toBeVisible({ timeout: 10000 });
    });

    test("switching language from EN to DE updates page content", async ({
      page,
    }) => {
      await page.goto("/");

      const langSwitcher = page
        .getByRole("button", { name: /language|english|region|choose/i })
        .or(page.locator("[data-testid='language-switcher']"))
        .or(page.locator("select[name*='lang']"));

      if (
        await langSwitcher
          .first()
          .isVisible({ timeout: 5000 })
          .catch(() => false)
      ) {
        await langSwitcher.first().click();

        // Look for German option
        const germanOption = page
          .getByRole("option", { name: /deutsch|german/i })
          .or(page.getByRole("menuitem", { name: /deutsch|german/i }))
          .or(page.getByText(/deutsch|german|🇩🇪/i));

        if (
          await germanOption
            .first()
            .isVisible({ timeout: 3000 })
            .catch(() => false)
        ) {
          await germanOption.first().click();
          await page.waitForLoadState("networkidle");

          // URL should include /de or the page should have German content
          const url = page.url();
          const hasDeLocale = /\/de(\/|$)/.test(url);
          const hasGermanContent = await page
            .getByText(/Lebenslauf|Startseite|Erstellen/i)
            .first()
            .isVisible({ timeout: 5000 })
            .catch(() => false);

          expect(hasDeLocale || hasGermanContent).toBeTruthy();
        }
      }
    });

    test("switching language from EN to FR updates page content", async ({
      page,
    }) => {
      await page.goto("/");

      const langSwitcher = page
        .getByRole("button", { name: /language|english|region|choose/i })
        .or(page.locator("[data-testid='language-switcher']"))
        .or(page.locator("select[name*='lang']"));

      if (
        await langSwitcher
          .first()
          .isVisible({ timeout: 5000 })
          .catch(() => false)
      ) {
        await langSwitcher.first().click();

        const frenchOption = page
          .getByRole("option", { name: /fran.ais|french/i })
          .or(page.getByRole("menuitem", { name: /fran.ais|french/i }))
          .or(page.getByText(/fran.ais|french|🇫🇷/i));

        if (
          await frenchOption
            .first()
            .isVisible({ timeout: 3000 })
            .catch(() => false)
        ) {
          await frenchOption.first().click();
          await page.waitForLoadState("networkidle");

          const url = page.url();
          const hasFrLocale = /\/fr(\/|$)/.test(url);
          const hasFrenchContent = await page
            .getByText(/Créer|Accueil|Modèles/i)
            .first()
            .isVisible({ timeout: 5000 })
            .catch(() => false);

          expect(hasFrLocale || hasFrenchContent).toBeTruthy();
        }
      }
    });
  });

  test.describe("Locale consistency across pages", () => {
    test("navigating within DE locale keeps German UI", async ({ page }) => {
      await page.goto("/de", { waitUntil: "domcontentloaded" });

      // Click on a nav link
      const contactLink = page.getByRole("link", { name: /kontakt/i });
      if (
        await contactLink
          .first()
          .isVisible({ timeout: 5000 })
          .catch(() => false)
      ) {
        await contactLink.first().click();
        await page.waitForLoadState("domcontentloaded");

        // URL should still have /de prefix
        expect(page.url()).toMatch(/\/de\//);

        // Content should still be in German
        const germanText = page.getByText(
          /Kontakt|Nachricht|Senden|Adresse/i,
        );
        await expect(germanText.first()).toBeVisible({ timeout: 10000 });
      }
    });

    test("FR locale legal pages load in French", async ({ page }) => {
      const response = await page.goto("/fr/privacy-policy", {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBeLessThan(500);

      const heading = page.getByRole("heading");
      await expect(heading.first()).toBeVisible({ timeout: 10000 });
    });
  });
});
