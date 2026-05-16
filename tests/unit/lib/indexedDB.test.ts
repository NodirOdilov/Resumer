import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  openDB,
  saveDraft,
  loadDraft,
  deleteDraft,
  getAllDrafts,
} from "@/lib/indexedDB";

// ---------------------------------------------------------------------------
// jsdom does not ship a real IndexedDB implementation.  We provide a minimal
// in-memory fake that supports the operations used by the module under test.
// ---------------------------------------------------------------------------

interface FakeRecord {
  id: string;
  [key: string]: unknown;
}

function createFakeIndexedDB() {
  let store: Record<string, FakeRecord> = {};

  function makeRequest<T>(result: T): IDBRequest<T> {
    const req = {
      result,
      error: null as DOMException | null,
      onsuccess: null as ((ev: Event) => void) | null,
      onerror: null as ((ev: Event) => void) | null,
    } as unknown as IDBRequest<T>;

    // Fire onsuccess asynchronously so callers can attach handlers first.
    queueMicrotask(() => {
      req.onsuccess?.({} as Event);
    });

    return req;
  }

  function makeObjectStore(): IDBObjectStore {
    return {
      put(value: FakeRecord) {
        store[value.id] = value;
        return makeRequest(value.id);
      },
      get(key: string) {
        return makeRequest(store[key] ?? undefined);
      },
      delete(key: string) {
        delete store[key];
        return makeRequest(undefined);
      },
      getAll() {
        return makeRequest(Object.values(store));
      },
    } as unknown as IDBObjectStore;
  }

  function makeTransaction(): IDBTransaction {
    const tx = {
      objectStore: () => makeObjectStore(),
      oncomplete: null as ((ev: Event) => void) | null,
      onerror: null as ((ev: Event) => void) | null,
    } as unknown as IDBTransaction;

    // Fire oncomplete after microtask so store operations resolve first.
    queueMicrotask(() => {
      queueMicrotask(() => {
        tx.oncomplete?.({} as Event);
      });
    });

    return tx;
  }

  const fakeDB: IDBDatabase = {
    transaction: () => makeTransaction(),
    close: vi.fn(),
    objectStoreNames: { contains: () => true } as unknown as DOMStringList,
    createObjectStore: vi.fn(),
  } as unknown as IDBDatabase;

  const openRequest = {
    result: fakeDB,
    error: null,
    onsuccess: null as ((ev: Event) => void) | null,
    onerror: null as ((ev: Event) => void) | null,
    onupgradeneeded: null as ((ev: Event) => void) | null,
  } as unknown as IDBOpenDBRequest;

  // Simulate asynchronous open.
  const originalOpen = () => {
    queueMicrotask(() => {
      openRequest.onsuccess?.({} as Event);
    });
    return openRequest;
  };

  // Expose helpers for test assertions.
  return {
    open: originalOpen,
    resetStore: () => {
      store = {};
    },
    getStoreSnapshot: () => ({ ...store }),
  };
}

// Install the fake globally.
let fakeIDB: ReturnType<typeof createFakeIndexedDB>;

beforeEach(() => {
  fakeIDB = createFakeIndexedDB();
  (globalThis as Record<string, unknown>).indexedDB = { open: fakeIDB.open };
  fakeIDB.resetStore();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("indexedDB utilities", () => {
  it("openDB resolves to an IDBDatabase", async () => {
    const db = await openDB();
    expect(db).toBeDefined();
    expect(typeof db.transaction).toBe("function");
  });

  it("saveDraft and loadDraft round-trip", async () => {
    const data = { name: "John", skills: ["TypeScript"] };
    await saveDraft("doc-1", data);

    const draft = await loadDraft("doc-1");
    expect(draft).not.toBeNull();
    expect(draft!.id).toBe("doc-1");
    expect(draft!.data).toEqual(data);
    expect(typeof draft!.updatedAt).toBe("number");
  });

  it("loadDraft returns null for non-existent document", async () => {
    const draft = await loadDraft("non-existent");
    expect(draft).toBeNull();
  });

  it("saveDraft overwrites an existing draft", async () => {
    await saveDraft("doc-1", { version: 1 });
    await saveDraft("doc-1", { version: 2 });

    const draft = await loadDraft("doc-1");
    expect(draft).not.toBeNull();
    expect((draft!.data as { version: number }).version).toBe(2);
  });

  it("deleteDraft removes an entry", async () => {
    await saveDraft("doc-1", { name: "Test" });
    await deleteDraft("doc-1");

    const draft = await loadDraft("doc-1");
    expect(draft).toBeNull();
  });

  it("deleteDraft does not throw for non-existent id", async () => {
    await expect(deleteDraft("ghost")).resolves.toBeUndefined();
  });

  it("getAllDrafts returns all stored entries", async () => {
    await saveDraft("doc-a", { a: true });
    await saveDraft("doc-b", { b: true });
    await saveDraft("doc-c", { c: true });

    const drafts = await getAllDrafts();
    expect(drafts).toHaveLength(3);

    const ids = drafts.map((d) => d.id).sort();
    expect(ids).toEqual(["doc-a", "doc-b", "doc-c"]);
  });

  it("getAllDrafts returns empty array when store is empty", async () => {
    const drafts = await getAllDrafts();
    expect(drafts).toHaveLength(0);
  });

  it("openDB throws when indexedDB is not available", async () => {
    (globalThis as Record<string, unknown>).indexedDB = undefined;

    await expect(openDB()).rejects.toThrow(
      "IndexedDB is not available in this environment."
    );
  });
});
