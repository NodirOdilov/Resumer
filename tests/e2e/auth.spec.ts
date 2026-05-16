import { test, expect, type Page } from "@playwright/test";

/**
 * Scenario 1: Registration -> email verification -> login
 *
 * Covers the full authentication lifecycle: account creation,
 * email verification acknowledgement, login with credentials,
 * and related auth flows (logout, forgot password, validation).
 */

const TEST_USER = {
  firstName: "Jane",
  lastName: "Smith",
  email: `test+${Date.now()}@resumer-e2e.com`,
  password: "Str0ngP@ssw0rd!",
};

test.describe("Scenario 1: Registration -> Email Verification -> Login", () => {
  test.describe("Registration flow", () => {
    test("fills registration form, submits, and lands on verify-email page", async ({
      page,
    }) => {
      await page.goto("/signup");

      // Fill out all registration fields
      await page.getByPlaceholder("John").fill(TEST_USER.firstName);
      await page.getByPlaceholder("Doe").fill(TEST_USER.lastName);
      await page.getByPlaceholder("you@example.com").fill(TEST_USER.email);
      await page
        .getByPlaceholder("At least 8 characters")
        .fill(TEST_USER.password);
      await page
        .getByPlaceholder("Repeat your password")
        .fill(TEST_USER.password);

      // Accept terms and conditions
      await page.getByRole("checkbox").check();

      // Submit the form
      await page.getByRole("button", { name: /create account/i }).click();

      // Should redirect to the email verification page
      await expect(page).toHaveURL(/verify-email/, { timeout: 15000 });

      // Verification page should explain that an email was sent
      const verifyContent = page.getByText(
        /check.*email|verify.*email|confirmation.*sent|inbox/i,
      );
      await expect(verifyContent.first()).toBeVisible({ timeout: 10000 });
    });

    test("shows validation errors for empty required fields", async ({
      page,
    }) => {
      await page.goto("/signup");

      // Submit without filling anything
      await page.getByRole("button", { name: /create account/i }).click();

      // At least one validation error should appear
      const validationError = page.getByText(
        /required|must|invalid|please enter/i,
      );
      await expect(validationError.first()).toBeVisible({ timeout: 5000 });
    });

    test("shows error when passwords do not match", async ({ page }) => {
      await page.goto("/signup");

      await page.getByPlaceholder("John").fill("Test");
      await page.getByPlaceholder("Doe").fill("User");
      await page
        .getByPlaceholder("you@example.com")
        .fill("mismatch@example.com");
      await page
        .getByPlaceholder("At least 8 characters")
        .fill("Password123!");
      await page
        .getByPlaceholder("Repeat your password")
        .fill("DifferentPass!");
      await page.getByRole("checkbox").check();

      await page.getByRole("button", { name: /create account/i }).click();

      const mismatchError = page.getByText(/match|mismatch|do not match/i);
      await expect(mismatchError.first()).toBeVisible({ timeout: 5000 });
    });

    test("signup page links to sign in page", async ({ page }) => {
      await page.goto("/signup");

      const signinLink = page.getByRole("link", { name: /sign in/i });
      await expect(signinLink).toBeVisible();
      await expect(signinLink).toHaveAttribute("href", /signin|login/);
    });
  });

  test.describe("Email verification page", () => {
    test("verify-email page renders with instructions", async ({ page }) => {
      await page.goto("/verify-email");

      // Page should load without errors
      const heading = page.getByRole("heading");
      await expect(heading.first()).toBeVisible({ timeout: 10000 });

      // Should contain verification-related text
      const verificationText = page.getByText(
        /verify|email|check|inbox|confirm/i,
      );
      await expect(verificationText.first()).toBeVisible();
    });

    test("verify-email page has resend option", async ({ page }) => {
      await page.goto("/verify-email");

      // There should be a resend button or link
      const resendAction = page
        .getByRole("button", { name: /resend|send again/i })
        .or(page.getByRole("link", { name: /resend|send again/i }))
        .or(page.getByText(/resend|send again|didn.*receive/i));

      await expect(resendAction.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Login flow", () => {
    test("fills login form, submits, and redirects to dashboard", async ({
      page,
    }) => {
      await page.goto("/signin");

      await page
        .getByPlaceholder("you@example.com")
        .fill("john@example.com");
      await page
        .getByPlaceholder("Enter your password")
        .fill("Password123!");

      await page.getByRole("button", { name: /sign in/i }).click();

      // Should redirect to dashboard on success
      await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
    });

    test("shows error for invalid credentials", async ({ page }) => {
      await page.goto("/signin");

      await page
        .getByPlaceholder("you@example.com")
        .fill("nonexistent@example.com");
      await page
        .getByPlaceholder("Enter your password")
        .fill("wrongpassword!");

      await page.getByRole("button", { name: /sign in/i }).click();

      const errorMessage = page.getByText(
        /invalid|incorrect|wrong|error|failed/i,
      );
      await expect(errorMessage.first()).toBeVisible({ timeout: 10000 });
    });

    test("login page has links to signup and forgot password", async ({
      page,
    }) => {
      await page.goto("/signin");

      const signupLink = page.getByRole("link", { name: /sign up/i });
      await expect(signupLink).toBeVisible();
      await expect(signupLink).toHaveAttribute("href", /signup|register/);

      const forgotLink = page.getByRole("link", {
        name: /forgot password/i,
      });
      await expect(forgotLink).toBeVisible();
      await expect(forgotLink).toHaveAttribute("href", /forgot-password/);
    });
  });

  test.describe("Forgot password flow", () => {
    test("submits email and shows success message", async ({ page }) => {
      await page.goto("/forgot-password");

      await page
        .getByPlaceholder(/email|you@example/i)
        .fill("john@example.com");

      await page.getByRole("button", { name: /reset|send|submit/i }).click();

      const successMessage = page.getByText(
        /email.*sent|check.*inbox|reset.*link|instructions/i,
      );
      await expect(successMessage.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Logout flow", () => {
    test("logs in, then logs out and returns to home or sign-in", async ({
      page,
    }) => {
      // Login first
      await page.goto("/signin");
      await page
        .getByPlaceholder("you@example.com")
        .fill("john@example.com");
      await page
        .getByPlaceholder("Enter your password")
        .fill("Password123!");
      await page.getByRole("button", { name: /sign in/i }).click();
      await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });

      // Open account/profile menu if present
      const accountMenu = page.getByRole("button", {
        name: /account|profile|menu/i,
      });
      if (await accountMenu.isVisible({ timeout: 3000 }).catch(() => false)) {
        await accountMenu.click();
      }

      // Click logout
      const logoutButton = page
        .getByRole("button", { name: /log\s?out|sign\s?out/i })
        .or(page.getByRole("link", { name: /log\s?out|sign\s?out/i }));

      await logoutButton.first().click();

      // Should redirect to home or sign-in
      await expect(page).toHaveURL(/^\/$|\/signin|\/login/, {
        timeout: 10000,
      });
    });
  });
});
