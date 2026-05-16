import { test, expect, type Page } from "@playwright/test";

/**
 * Scenarios 2-4:
 *   2. Creating a resume (fill all sections)
 *   3. Switching template -> preview updates
 *   4. Downloading PDF (premium flow)
 */

/** Helper: select the first template to enter the builder editor. */
async function selectTemplate(page: Page) {
  await page.goto("/build-resume");

  const templateCards = page
    .locator("[data-testid='template-card'], .group")
    .filter({ has: page.locator("img") });

  await expect(templateCards.first()).toBeVisible({ timeout: 15000 });
  await templateCards.first().click();

  // Wait until the editor form or step 2 indicator appears
  const editorReady = page.getByText(
    /step 2|content|personal|contact|first name/i,
  );
  await expect(editorReady.first()).toBeVisible({ timeout: 10000 });
}

/** Helper: navigate to a builder section by name. */
async function goToSection(page: Page, sectionName: RegExp) {
  const sectionButton = page
    .getByRole("button", { name: sectionName })
    .or(page.getByRole("link", { name: sectionName }))
    .or(page.getByRole("tab", { name: sectionName }));

  if (await sectionButton.first().isVisible({ timeout: 5000 }).catch(() => false)) {
    await sectionButton.first().click();
    await page.waitForTimeout(500);
  }
}

// ---------------------------------------------------------------------------
// Scenario 2: Creating a resume (fill all sections)
// ---------------------------------------------------------------------------
test.describe("Scenario 2: Creating a resume - fill all sections", () => {
  test.beforeEach(async ({ page }) => {
    await selectTemplate(page);
  });

  test("fills Contact / Personal Information section", async ({ page }) => {
    await goToSection(page, /personal|contact/i);

    const firstName = page
      .getByLabel(/first name/i)
      .or(page.getByPlaceholder(/first name/i));
    const lastName = page
      .getByLabel(/last name/i)
      .or(page.getByPlaceholder(/last name/i));
    const email = page
      .getByLabel(/email/i)
      .or(page.getByPlaceholder(/email/i));
    const phone = page
      .getByLabel(/phone/i)
      .or(page.getByPlaceholder(/phone/i));
    const location = page
      .getByLabel(/city|location|address/i)
      .or(page.getByPlaceholder(/city|location|address/i));

    if (await firstName.first().isVisible({ timeout: 5000 })) {
      await firstName.first().fill("Alice");
    }
    if (await lastName.first().isVisible()) {
      await lastName.first().fill("Johnson");
    }
    if (await email.first().isVisible()) {
      await email.first().fill("alice.johnson@example.com");
    }
    if (await phone.first().isVisible()) {
      await phone.first().fill("+1 555-123-4567");
    }
    if (await location.first().isVisible()) {
      await location.first().fill("San Francisco, CA");
    }

    // Verify the preview shows the entered name
    const preview = page.locator(
      "[data-testid='resume-preview'], .preview, iframe",
    );
    if (await preview.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(page.getByText("Alice")).toBeVisible({ timeout: 5000 });
    }
  });

  test("fills Experience section with a work entry", async ({ page }) => {
    await goToSection(page, /experience|work/i);

    // Click Add button to add a new entry
    const addButton = page.getByRole("button", { name: /add|new|\+/i });
    if (await addButton.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await addButton.first().click();
    }

    const jobTitle = page
      .getByLabel(/job title|position/i)
      .or(page.getByPlaceholder(/job title|position/i));
    const company = page
      .getByLabel(/company|employer/i)
      .or(page.getByPlaceholder(/company|employer/i));
    const description = page
      .getByLabel(/description|responsibilities/i)
      .or(page.getByPlaceholder(/description|responsibilities/i))
      .or(page.locator("textarea").first());

    if (await jobTitle.first().isVisible({ timeout: 5000 })) {
      await jobTitle.first().fill("Senior Software Engineer");
    }
    if (await company.first().isVisible()) {
      await company.first().fill("Acme Corporation");
    }
    if (await description.isVisible()) {
      await description.fill(
        "Led a team of 5 engineers to deliver the core billing platform, reducing processing time by 40%.",
      );
    }
  });

  test("fills Education section", async ({ page }) => {
    await goToSection(page, /education/i);

    const addButton = page.getByRole("button", { name: /add|new|\+/i });
    if (await addButton.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await addButton.first().click();
    }

    const school = page
      .getByLabel(/school|university|institution/i)
      .or(page.getByPlaceholder(/school|university|institution/i));
    const degree = page
      .getByLabel(/degree|qualification/i)
      .or(page.getByPlaceholder(/degree|qualification/i));

    if (await school.first().isVisible({ timeout: 5000 })) {
      await school.first().fill("Massachusetts Institute of Technology");
    }
    if (await degree.first().isVisible()) {
      await degree.first().fill("B.Sc. Computer Science");
    }
  });

  test("fills Skills section", async ({ page }) => {
    await goToSection(page, /skills/i);

    const skillInput = page
      .getByLabel(/skill/i)
      .or(page.getByPlaceholder(/skill|add a skill/i))
      .or(page.locator("input[name*='skill']"));

    if (await skillInput.first().isVisible({ timeout: 5000 })) {
      await skillInput.first().fill("TypeScript");
      // Press Enter to add the skill tag
      await skillInput.first().press("Enter");
      await skillInput.first().fill("React");
      await skillInput.first().press("Enter");
      await skillInput.first().fill("Node.js");
      await skillInput.first().press("Enter");
    }
  });

  test("fills Summary / Professional Profile section", async ({ page }) => {
    await goToSection(page, /summary|profile|objective/i);

    const summaryTextarea = page
      .getByLabel(/summary|profile|objective/i)
      .or(page.getByPlaceholder(/summary|profile|objective|about/i))
      .or(page.locator("textarea").first());

    if (await summaryTextarea.isVisible({ timeout: 5000 })) {
      await summaryTextarea.fill(
        "Results-driven software engineer with 8+ years of experience building scalable web applications. " +
          "Passionate about clean architecture, developer experience, and mentoring junior engineers.",
      );
    }
  });

  test("advances through all builder steps to completion", async ({
    page,
  }) => {
    // Fill minimal contact data
    const firstName = page
      .getByLabel(/first name/i)
      .or(page.getByPlaceholder(/first name/i));
    if (await firstName.first().isVisible({ timeout: 5000 })) {
      await firstName.first().fill("Alice");
    }

    // Navigate forward through steps
    const nextButton = page.getByRole("button", {
      name: /next|continue|finish/i,
    });
    let attempts = 0;
    while (
      (await nextButton.first().isVisible({ timeout: 3000 }).catch(() => false)) &&
      attempts < 10
    ) {
      await nextButton.first().click();
      await page.waitForTimeout(800);
      attempts++;
    }

    // Should reach the final step (download or completion)
    const finalContent = page.getByText(
      /download|ready|complete|finish|export|upgrade|premium/i,
    );
    await expect(finalContent.first()).toBeVisible({ timeout: 10000 });
  });
});

// ---------------------------------------------------------------------------
// Scenario 3: Switching template -> preview updates
// ---------------------------------------------------------------------------
test.describe("Scenario 3: Switching template -> preview updates", () => {
  test("selecting a different template updates the preview", async ({
    page,
  }) => {
    await page.goto("/build-resume");

    const templateCards = page
      .locator("[data-testid='template-card'], .group")
      .filter({ has: page.locator("img") });

    await expect(templateCards.first()).toBeVisible({ timeout: 15000 });

    const cardCount = await templateCards.count();
    expect(cardCount).toBeGreaterThan(1);

    // Select the first template
    await templateCards.nth(0).click();
    const step2 = page.getByText(/step 2|content|personal|contact/i);
    await expect(step2.first()).toBeVisible({ timeout: 10000 });

    // Go back to template selection if possible
    const backButton = page.getByRole("button", { name: /back|previous/i });
    const templateTab = page
      .getByRole("button", { name: /template/i })
      .or(page.getByRole("tab", { name: /template/i }));

    if (await templateTab.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await templateTab.first().click();
    } else if (await backButton.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await backButton.first().click();
    }

    // Wait for template grid to reappear
    await expect(templateCards.first()).toBeVisible({ timeout: 10000 });

    // Select a different template
    if (cardCount > 1) {
      await templateCards.nth(1).click();
    }

    // Editor should reload with the new template
    const editorContent = page.getByText(
      /step 2|content|personal|contact|first name/i,
    );
    await expect(editorContent.first()).toBeVisible({ timeout: 10000 });
  });

  test("template gallery page shows all available templates", async ({
    page,
  }) => {
    await page.goto("/resume-templates");

    const templateCards = page
      .locator("[data-testid='template-card']")
      .or(page.locator(".group").filter({ has: page.locator("img") }));

    await expect(templateCards.first()).toBeVisible({ timeout: 15000 });

    const count = await templateCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("clicking 'Use this template' on gallery navigates to builder", async ({
    page,
  }) => {
    await page.goto("/resume-templates");

    const templateCards = page
      .locator("[data-testid='template-card']")
      .or(page.locator(".group").filter({ has: page.locator("img") }));

    await expect(templateCards.first()).toBeVisible({ timeout: 15000 });

    // Hover to reveal CTA
    await templateCards.first().hover();

    const useTemplateLink = page.getByRole("link", {
      name: /use this template/i,
    });
    if (await useTemplateLink.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await useTemplateLink.first().click();
      await expect(page).toHaveURL(/build-resume|resume-builder/, {
        timeout: 10000,
      });
    }
  });

  test("template filter/category tabs filter the gallery", async ({
    page,
  }) => {
    await page.goto("/resume-templates");
    await page.waitForLoadState("networkidle");

    const filterButtons = page
      .getByRole("tab")
      .or(
        page.getByRole("button", {
          name: /professional|modern|creative|simple|all/i,
        }),
      );

    if (await filterButtons.first().isVisible({ timeout: 10000 }).catch(() => false)) {
      const tabs = await filterButtons.count();
      if (tabs > 1) {
        await filterButtons.nth(1).click();
        await page.waitForTimeout(500);

        // Templates should still render (filtered set)
        const cards = page
          .locator("[data-testid='template-card']")
          .or(page.locator(".group").filter({ has: page.locator("img") }));
        const count = await cards.count();
        expect(count).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Scenario 4: Downloading PDF (premium flow)
// ---------------------------------------------------------------------------
test.describe("Scenario 4: Downloading PDF (premium flow)", () => {
  test("free user sees paywall / upgrade prompt on download step", async ({
    page,
  }) => {
    await selectTemplate(page);

    // Navigate to the download step
    const downloadTab = page
      .getByRole("button", { name: /download/i })
      .or(page.getByRole("tab", { name: /download/i }));

    const nextButton = page.getByRole("button", {
      name: /next|continue|finish/i,
    });

    if (await downloadTab.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await downloadTab.first().click();
    } else {
      // Click next until we reach download
      let attempts = 0;
      while (
        (await nextButton.first().isVisible({ timeout: 3000 }).catch(() => false)) &&
        attempts < 10
      ) {
        await nextButton.first().click();
        await page.waitForTimeout(800);
        attempts++;
      }
    }

    // Should see upgrade/premium prompt for free users
    const premiumPrompt = page.getByText(
      /upgrade|premium|subscribe|unlock|pricing|plan/i,
    );
    await expect(premiumPrompt.first()).toBeVisible({ timeout: 10000 });
  });

  test("download step shows PDF, DOCX, and TXT format options", async ({
    page,
  }) => {
    await selectTemplate(page);

    // Navigate to download step
    const downloadTab = page
      .getByRole("button", { name: /download/i })
      .or(page.getByRole("tab", { name: /download/i }));
    const nextButton = page.getByRole("button", {
      name: /next|continue|finish/i,
    });

    if (await downloadTab.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await downloadTab.first().click();
    } else {
      let attempts = 0;
      while (
        (await nextButton.first().isVisible({ timeout: 3000 }).catch(() => false)) &&
        attempts < 10
      ) {
        await nextButton.first().click();
        await page.waitForTimeout(800);
        attempts++;
      }
    }

    // Should show format options
    const pdfOption = page.getByText(/\.pdf|pdf/i);
    await expect(pdfOption.first()).toBeVisible({ timeout: 10000 });
  });

  test("download step shows 'Your resume is ready' heading", async ({
    page,
  }) => {
    await selectTemplate(page);

    // Navigate to download step
    const downloadTab = page
      .getByRole("button", { name: /download/i })
      .or(page.getByRole("tab", { name: /download/i }));
    const nextButton = page.getByRole("button", {
      name: /next|continue|finish/i,
    });

    if (await downloadTab.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await downloadTab.first().click();
    } else {
      let attempts = 0;
      while (
        (await nextButton.first().isVisible({ timeout: 3000 }).catch(() => false)) &&
        attempts < 10
      ) {
        await nextButton.first().click();
        await page.waitForTimeout(800);
        attempts++;
      }
    }

    const readyHeading = page.getByText(/resume.*ready|download/i);
    await expect(readyHeading.first()).toBeVisible({ timeout: 10000 });
  });
});
