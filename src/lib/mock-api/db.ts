/**
 * IndexedDB-backed store for the demo. Persists users, resumes, CVs, and
 * cover letters across page reloads so the demo feels like a real app.
 *
 * Distinct from `lib/indexedDB.ts` (which only stores draft autosaves). We
 * keep them separate so the existing autosave logic is untouched.
 */

const DB_NAME = "resumer_demo";
const DB_VERSION = 1;

export const STORES = {
  USERS: "users",
  RESUMES: "resumes",
  CVS: "cvs",
  COVER_LETTERS: "cover_letters",
  META: "meta",
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

function isAvailable(): boolean {
  try {
    return typeof indexedDB !== "undefined" && indexedDB !== null;
  } catch {
    return false;
  }
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (!isAvailable()) {
    return Promise.reject(new Error("IndexedDB unavailable"));
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      for (const store of Object.values(STORES)) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "id" });
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return dbPromise;
}

export async function dbPut<T extends { id: string }>(store: StoreName, value: T): Promise<T> {
  const db = await openDB();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const objectStore = tx.objectStore(store);
    const req = objectStore.put(value);
    req.onsuccess = () => resolve(value);
    req.onerror = () => reject(req.error);
  });
}

export async function dbGet<T>(store: StoreName, id: string): Promise<T | null> {
  const db = await openDB();
  return new Promise<T | null>((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).get(id);
    req.onsuccess = () => resolve((req.result as T) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function dbAll<T>(store: StoreName): Promise<T[]> {
  const db = await openDB();
  return new Promise<T[]>((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve((req.result as T[]) ?? []);
    req.onerror = () => reject(req.error);
  });
}

export async function dbDelete(store: StoreName, id: string): Promise<void> {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const req = tx.objectStore(store).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function dbQuery<T>(store: StoreName, predicate: (value: T) => boolean): Promise<T[]> {
  const all = await dbAll<T>(store);
  return all.filter(predicate);
}
