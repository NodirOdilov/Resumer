/**
 * Seed the demo IndexedDB with users + pre-built resumes.
 *
 * Idempotent: only runs once per browser thanks to a sentinel record in the
 * `meta` object store. To force a re-seed, clear site data in DevTools.
 */

import { dbGet, dbPut, STORES } from "./db";
import { DEMO_RESUMES, DEMO_USERS } from "./seed-data";

const SEED_KEY = "demo-seeded-v1";

interface SeedSentinel {
  id: string;
  seededAt: string;
}

let seedPromise: Promise<void> | null = null;

export function seedDemoDataOnce(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    try {
      const sentinel = await dbGet<SeedSentinel>(STORES.META, SEED_KEY);
      if (sentinel) return;

      for (const user of DEMO_USERS) {
        await dbPut(STORES.USERS, user);
      }
      for (const r of DEMO_RESUMES) {
        if (r.type === "resume") await dbPut(STORES.RESUMES, r);
        else if (r.type === "cv") await dbPut(STORES.CVS, r);
        else if (r.type === "cover_letter") await dbPut(STORES.COVER_LETTERS, r);
      }
      await dbPut<SeedSentinel>(STORES.META, {
        id: SEED_KEY,
        seededAt: new Date().toISOString(),
      });

      // eslint-disable-next-line no-console
      console.log("[demo] Seeded demo accounts & resumes into IndexedDB.");
    } catch (err) {
      // Don't break the app if seeding fails; mock-api will still work with
      // the in-memory DEMO_USERS list (login still succeeds).
      // eslint-disable-next-line no-console
      console.warn("[demo] Seeding failed:", err);
    }
  })();

  return seedPromise;
}
