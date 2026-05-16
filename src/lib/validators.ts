import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  headline: z.string().max(120, "Headline must be less than 120 characters").optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional(),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
  linkedIn: z.string().url("Invalid URL").or(z.literal("")).optional(),
  location: z.object({
    address: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    postalCode: z.string().max(20).optional(),
  }).optional(),
  summary: z.string().max(2000, "Summary must be less than 2000 characters").optional(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(200),
  degree: z.string().min(1, "Degree is required").max(200),
  fieldOfStudy: z.string().max(200).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  gpa: z.string().max(10).optional(),
  description: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
  achievements: z.array(z.string().max(500)).max(10).optional(),
});

export type EducationFormData = z.infer<typeof educationSchema>;

export const workExperienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(200),
  position: z.string().min(1, "Position is required").max(200),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  location: z.string().max(200).optional(),
  employmentType: z.enum([
    "full-time",
    "part-time",
    "contract",
    "freelance",
    "internship",
    "volunteer",
    "self-employed",
  ]).optional(),
  description: z.string().max(3000).optional(),
  achievements: z.array(z.string().max(500)).max(15).optional(),
  technologies: z.array(z.string().max(50)).max(20).optional(),
});

export type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(100),
  level: z.enum(["beginner", "intermediate", "advanced", "expert", "master"]).optional(),
  category: z.string().max(100).optional(),
  yearsOfExperience: z.number().min(0).max(50).optional(),
});

export type SkillFormData = z.infer<typeof skillSchema>;

export const resumeSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  templateId: z.string().min(1, "Template is required"),
  locale: z.string().default("en-us"),
  isPublic: z.boolean().default(false),
  personalInfo: personalInfoSchema,
  settings: z.object({
    fontFamily: z.string().default("Inter"),
    fontSize: z.number().min(8).max(16).default(10),
    lineHeight: z.number().min(1).max(2).default(1.5),
    primaryColor: z.string().default("#0D47A1"),
    secondaryColor: z.string().default("#FF6F00"),
    accentColor: z.string().default("#00BFA5"),
    backgroundColor: z.string().default("#FFFFFF"),
    textColor: z.string().default("#1A1A2E"),
    headingStyle: z.enum(["uppercase", "capitalize", "normal", "bold-underline"]).default("uppercase"),
    sectionSpacing: z.number().min(0).max(40).default(16),
    itemSpacing: z.number().min(0).max(20).default(8),
    marginTop: z.number().min(0).max(50).default(20),
    marginBottom: z.number().min(0).max(50).default(20),
    marginLeft: z.number().min(0).max(50).default(15),
    marginRight: z.number().min(0).max(50).default(15),
    paperSize: z.enum(["a4", "letter", "legal"]).default("a4"),
    showPageNumbers: z.boolean().default(true),
    showIcons: z.boolean().default(true),
    showDividers: z.boolean().default(true),
    showDates: z.boolean().default(true),
    dateFormat: z.string().default("MMM yyyy"),
    columnsLayout: z.enum(["single", "double", "sidebar-left", "sidebar-right"]).default("single"),
  }).optional(),
});

export type ResumeFormData = z.infer<typeof resumeSchema>;

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  headline: z.string().max(120).optional(),
  phone: z.string().max(20).optional(),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
  linkedIn: z.string().url("Invalid URL").or(z.literal("")).optional(),
  github: z.string().url("Invalid URL").or(z.literal("")).optional(),
  twitter: z.string().url("Invalid URL").or(z.literal("")).optional(),
  location: z.object({
    address: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    postalCode: z.string().max(20).optional(),
  }).optional(),
  summary: z.string().max(2000).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters"),
  category: z.enum([
    "general",
    "support",
    "billing",
    "partnership",
    "feedback",
    "bug-report",
  ]).default("general"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128)
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
