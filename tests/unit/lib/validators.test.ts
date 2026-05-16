import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  resumeSchema,
  forgotPasswordSchema,
  personalInfoSchema,
  educationSchema,
  workExperienceSchema,
  skillSchema,
} from "@/lib/validators";

describe("loginSchema", () => {
  it("validates correct data", () => {
    const result = loginSchema.safeParse({
      email: "john@example.com",
      password: "Password123!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty email", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "Password123!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailErrors = result.error.issues.filter(
        (i) => i.path[0] === "email"
      );
      expect(emailErrors.length).toBeGreaterThan(0);
      expect(emailErrors[0].message).toBe("Email is required");
    }
  });

  it("rejects invalid email format", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "Password123!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailErrors = result.error.issues.filter(
        (i) => i.path[0] === "email"
      );
      expect(emailErrors.some((e) => e.message.includes("valid email"))).toBe(
        true
      );
    }
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "john@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const pwErrors = result.error.issues.filter(
        (i) => i.path[0] === "password"
      );
      expect(pwErrors.length).toBeGreaterThan(0);
    }
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "john@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const pwErrors = result.error.issues.filter(
        (i) => i.path[0] === "password"
      );
      expect(
        pwErrors.some((e) => e.message.includes("at least 8"))
      ).toBe(true);
    }
  });
});

describe("registerSchema", () => {
  const validData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "StrongPass1!",
    confirmPassword: "StrongPass1!",
    acceptTerms: true as const,
  };

  it("validates correct data", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates password match", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "DifferentPass1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const matchErrors = result.error.issues.filter(
        (i) => i.path.includes("confirmPassword")
      );
      expect(
        matchErrors.some((e) => e.message.includes("do not match"))
      ).toBe(true);
    }
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "Sh1!",
      confirmPassword: "Sh1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const pwErrors = result.error.issues.filter(
        (i) => i.path[0] === "password"
      );
      expect(
        pwErrors.some((e) => e.message.includes("at least 8"))
      ).toBe(true);
    }
  });

  it("rejects password without uppercase letter", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "strongpass1!",
      confirmPassword: "strongpass1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((e) => e.message.includes("uppercase"))
      ).toBe(true);
    }
  });

  it("rejects password without lowercase letter", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "STRONGPASS1!",
      confirmPassword: "STRONGPASS1!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((e) => e.message.includes("lowercase"))
      ).toBe(true);
    }
  });

  it("rejects password without number", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "StrongPass!",
      confirmPassword: "StrongPass!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((e) => e.message.includes("number"))
      ).toBe(true);
    }
  });

  it("rejects password without special character", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "StrongPass1",
      confirmPassword: "StrongPass1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((e) => e.message.includes("special"))
      ).toBe(true);
    }
  });

  it("requires acceptTerms to be true", () => {
    const result = registerSchema.safeParse({
      ...validData,
      acceptTerms: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty first name", () => {
    const result = registerSchema.safeParse({
      ...validData,
      firstName: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (e) => e.path[0] === "firstName" && e.message.includes("required")
        )
      ).toBe(true);
    }
  });

  it("rejects invalid characters in first name", () => {
    const result = registerSchema.safeParse({
      ...validData,
      firstName: "John123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (e) =>
            e.path[0] === "firstName" &&
            e.message.includes("invalid characters")
        )
      ).toBe(true);
    }
  });
});

describe("resumeSchema", () => {
  it("validates content structure", () => {
    const result = resumeSchema.safeParse({
      title: "My Resume",
      templateId: "template-1",
      locale: "en-us",
      isPublic: false,
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
      settings: {
        fontFamily: "Inter",
        fontSize: 10,
        lineHeight: 1.5,
        primaryColor: "#0D47A1",
        secondaryColor: "#FF6F00",
        accentColor: "#00BFA5",
        backgroundColor: "#FFFFFF",
        textColor: "#1A1A2E",
        headingStyle: "uppercase",
        sectionSpacing: 16,
        itemSpacing: 8,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 15,
        marginRight: 15,
        paperSize: "a4",
        showPageNumbers: true,
        showIcons: true,
        showDividers: true,
        showDates: true,
        dateFormat: "MMM yyyy",
        columnsLayout: "single",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = resumeSchema.safeParse({
      title: "",
      templateId: "template-1",
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (e) => e.path[0] === "title" && e.message.includes("required")
        )
      ).toBe(true);
    }
  });

  it("rejects empty templateId", () => {
    const result = resumeSchema.safeParse({
      title: "My Resume",
      templateId: "",
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((e) => e.path[0] === "templateId")
      ).toBe(true);
    }
  });

  it("validates with minimal data using defaults", () => {
    const result = resumeSchema.safeParse({
      title: "My Resume",
      templateId: "template-1",
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.locale).toBe("en-us");
      expect(result.data.isPublic).toBe(false);
    }
  });

  it("rejects invalid paper size in settings", () => {
    const result = resumeSchema.safeParse({
      title: "My Resume",
      templateId: "template-1",
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
      settings: {
        paperSize: "tabloid",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects fontSize out of range", () => {
    const result = resumeSchema.safeParse({
      title: "My Resume",
      templateId: "template-1",
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
      settings: {
        fontSize: 50,
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("validates correct email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "john@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "not-email" });
    expect(result.success).toBe(false);
  });
});

describe("personalInfoSchema", () => {
  it("validates correct personal info", () => {
    const result = personalInfoSchema.safeParse({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid website URL", () => {
    const result = personalInfoSchema.safeParse({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      website: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty string for optional URL fields", () => {
    const result = personalInfoSchema.safeParse({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      website: "",
      linkedIn: "",
    });
    expect(result.success).toBe(true);
  });
});

describe("educationSchema", () => {
  it("validates correct data", () => {
    const result = educationSchema.safeParse({
      institution: "MIT",
      degree: "Bachelor of Science",
      startDate: "2020-09-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty institution", () => {
    const result = educationSchema.safeParse({
      institution: "",
      degree: "BS",
      startDate: "2020-09-01",
    });
    expect(result.success).toBe(false);
  });
});

describe("workExperienceSchema", () => {
  it("validates correct data", () => {
    const result = workExperienceSchema.safeParse({
      company: "Acme Corp",
      position: "Developer",
      startDate: "2021-01-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty company", () => {
    const result = workExperienceSchema.safeParse({
      company: "",
      position: "Developer",
      startDate: "2021-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("validates employment type enum", () => {
    const result = workExperienceSchema.safeParse({
      company: "Acme",
      position: "Dev",
      startDate: "2021-01-01",
      employmentType: "full-time",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid employment type", () => {
    const result = workExperienceSchema.safeParse({
      company: "Acme",
      position: "Dev",
      startDate: "2021-01-01",
      employmentType: "invalid-type",
    });
    expect(result.success).toBe(false);
  });
});

describe("skillSchema", () => {
  it("validates correct data", () => {
    const result = skillSchema.safeParse({
      name: "TypeScript",
      level: "expert",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty skill name", () => {
    const result = skillSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid skill level", () => {
    const result = skillSchema.safeParse({
      name: "TypeScript",
      level: "godlike",
    });
    expect(result.success).toBe(false);
  });
});
