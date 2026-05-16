"use client";

import { useEffect } from "react";
import { seedDemoDataOnce } from "@/lib/mock-api/seed";
import { isDemoMode } from "@/lib/mock-api/adapter";

/**
 * Headless component that ensures demo data (users + resumes) is loaded
 * into IndexedDB on first visit. No UI — the credential hint lives on the
 * sign-in form itself.
 */
export function DemoSeeder() {
  useEffect(() => {
    if (!isDemoMode()) return;
    void seedDemoDataOnce();
  }, []);
  return null;
}
