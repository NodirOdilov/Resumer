/**
 * Seed data for the demo. Resume content is stored in `demo-resumes.json`
 * as a workaround for a Next.js 15 trace-collection bug that trips on large
 * inline object literals on Windows.
 */

import demoResumesJson from "./demo-resumes.json";

export interface DemoUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  isPremium: boolean;
  createdAt: string;
}

export interface DemoResume {
  id: string;
  userId: string;
  title: string;
  type: "resume" | "cv" | "cover_letter";
  templateId: string;
  templateSlug: string;
  status: "draft" | "complete";
  language: string;
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: "user-demo",
    email: "demo@resumer.com",
    password: "Demo2026!",
    firstName: "Sarah",
    lastName: "Mitchell",
    isVerified: true,
    isPremium: true,
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "user-investor",
    email: "investor@resumer.com",
    password: "Investor2026!",
    firstName: "Alex",
    lastName: "Investor",
    isVerified: true,
    isPremium: true,
    createdAt: "2026-04-01T09:00:00Z",
  },
];

export const DEMO_RESUMES: DemoResume[] = demoResumesJson as DemoResume[];
