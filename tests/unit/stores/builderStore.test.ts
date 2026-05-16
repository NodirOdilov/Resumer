import { describe, it, expect, beforeEach } from "vitest";
import { useBuilderStore } from "@/stores/builderStore";
import { mockTemplate } from "../mocks/data";
import type { DocumentTemplate, DocumentSettings } from "@/types";

// Convert our mock template to the index.ts DocumentTemplate shape
const builderTemplate: DocumentTemplate = {
  id: mockTemplate.id,
  name: mockTemplate.name,
  slug: mockTemplate.slug,
  category: mockTemplate.category,
  thumbnail_url: mockTemplate.thumbnail,
  preview_url: mockTemplate.previewImages[0] || "",
  is_premium: mockTemplate.isPremium,
  colors: mockTemplate.colorSchemes.map((cs) => cs.primaryColor),
  description: mockTemplate.description,
};

describe("builderStore", () => {
  beforeEach(() => {
    useBuilderStore.getState().resetBuilder();
  });

  it("initial state has defaults", () => {
    const state = useBuilderStore.getState();

    expect(state.documentType).toBe("resume");
    expect(state.documentId).toBeNull();
    expect(state.activeStep).toBe(1);
    expect(state.activeSection).toBe("contact");
    expect(state.template).toBeNull();
    expect(state.content).toEqual({});
    expect(state.isDirty).toBe(false);
    expect(state.isSaving).toBe(false);
    expect(state.lastSavedAt).toBeNull();
    expect(state.versions).toEqual([]);
    expect(state.settings).toEqual({
      color: "#2563eb",
      font: "Inter",
      fontSize: 14,
      lineSpacing: 1.5,
      margins: { top: 24, right: 24, bottom: 24, left: 24 },
    });
  });

  it("setTemplate updates template", () => {
    useBuilderStore.getState().setTemplate(builderTemplate);

    const state = useBuilderStore.getState();
    expect(state.template).toEqual(builderTemplate);
    expect(state.isDirty).toBe(true);
  });

  it("updateContent updates section", () => {
    useBuilderStore.getState().updateContent("experience", [
      { company: "Acme", position: "Developer" },
    ]);

    const state = useBuilderStore.getState();
    expect(state.content.experience).toEqual([
      { company: "Acme", position: "Developer" },
    ]);
    expect(state.isDirty).toBe(true);
  });

  it("updateContent updates multiple sections independently", () => {
    useBuilderStore.getState().updateContent("experience", [
      { company: "Acme" },
    ]);
    useBuilderStore.getState().updateContent("education", [
      { institution: "MIT" },
    ]);

    const state = useBuilderStore.getState();
    expect(state.content.experience).toEqual([{ company: "Acme" }]);
    expect(state.content.education).toEqual([{ institution: "MIT" }]);
  });

  it("updateSettings merges settings", () => {
    useBuilderStore.getState().updateSettings({ color: "#FF0000" });

    const state = useBuilderStore.getState();
    expect(state.settings.color).toBe("#FF0000");
    // Other settings should remain at defaults
    expect(state.settings.font).toBe("Inter");
    expect(state.settings.fontSize).toBe(14);
    expect(state.isDirty).toBe(true);
  });

  it("updateSettings merges partial margins", () => {
    useBuilderStore.getState().updateSettings({
      margins: { top: 32, right: 32, bottom: 32, left: 32 },
    });

    const state = useBuilderStore.getState();
    expect(state.settings.margins).toEqual({
      top: 32,
      right: 32,
      bottom: 32,
      left: 32,
    });
  });

  it("resetBuilder clears state", () => {
    // Modify some state
    useBuilderStore.getState().setTemplate(builderTemplate);
    useBuilderStore.getState().updateContent("summary", "A summary");
    useBuilderStore.getState().updateSettings({ color: "#FF0000" });
    useBuilderStore.getState().nextStep();

    // Reset
    useBuilderStore.getState().resetBuilder();

    const state = useBuilderStore.getState();
    expect(state.template).toBeNull();
    expect(state.content).toEqual({});
    expect(state.settings.color).toBe("#2563eb");
    expect(state.activeStep).toBe(1);
    expect(state.isDirty).toBe(false);
  });

  it("nextStep increments step up to 3", () => {
    expect(useBuilderStore.getState().activeStep).toBe(1);

    useBuilderStore.getState().nextStep();
    expect(useBuilderStore.getState().activeStep).toBe(2);

    useBuilderStore.getState().nextStep();
    expect(useBuilderStore.getState().activeStep).toBe(3);

    // Should not go beyond 3
    useBuilderStore.getState().nextStep();
    expect(useBuilderStore.getState().activeStep).toBe(3);
  });

  it("prevStep decrements step down to 1", () => {
    useBuilderStore.getState().nextStep();
    useBuilderStore.getState().nextStep();
    expect(useBuilderStore.getState().activeStep).toBe(3);

    useBuilderStore.getState().prevStep();
    expect(useBuilderStore.getState().activeStep).toBe(2);

    useBuilderStore.getState().prevStep();
    expect(useBuilderStore.getState().activeStep).toBe(1);

    // Should not go below 1
    useBuilderStore.getState().prevStep();
    expect(useBuilderStore.getState().activeStep).toBe(1);
  });

  it("setActiveSection changes the active section", () => {
    useBuilderStore.getState().setActiveSection("education");
    expect(useBuilderStore.getState().activeSection).toBe("education");
  });

  it("markSaved updates save status", () => {
    useBuilderStore.getState().updateContent("test", "data");
    expect(useBuilderStore.getState().isDirty).toBe(true);

    useBuilderStore.getState().markSaved();

    const state = useBuilderStore.getState();
    expect(state.isDirty).toBe(false);
    expect(state.isSaving).toBe(false);
    expect(state.lastSavedAt).toBeInstanceOf(Date);
  });

  it("setDocumentId sets the document id", () => {
    useBuilderStore.getState().setDocumentId("resume-123");
    expect(useBuilderStore.getState().documentId).toBe("resume-123");

    useBuilderStore.getState().setDocumentId(null);
    expect(useBuilderStore.getState().documentId).toBeNull();
  });

  it("setDocumentType changes document type", () => {
    useBuilderStore.getState().setDocumentType("cv");
    expect(useBuilderStore.getState().documentType).toBe("cv");
  });

  it("addVersion appends to versions array", () => {
    const version = {
      id: "v1",
      version_number: 1,
      label: "First draft",
      created_at: "2025-01-01T00:00:00Z",
      content: {} as any,
      settings: {} as any,
    };

    useBuilderStore.getState().addVersion(version);
    expect(useBuilderStore.getState().versions).toHaveLength(1);
    expect(useBuilderStore.getState().versions[0].id).toBe("v1");

    const version2 = { ...version, id: "v2", version_number: 2 };
    useBuilderStore.getState().addVersion(version2);
    expect(useBuilderStore.getState().versions).toHaveLength(2);
  });

  it("setIsSaving updates saving flag", () => {
    useBuilderStore.getState().setIsSaving(true);
    expect(useBuilderStore.getState().isSaving).toBe(true);

    useBuilderStore.getState().setIsSaving(false);
    expect(useBuilderStore.getState().isSaving).toBe(false);
  });

  // ── Undo / Redo / History ───────────────────────────────────────────────

  describe("undo / redo", () => {
    it("undo restores previous content after updateContent", () => {
      useBuilderStore.getState().updateContent("summary", "First draft");
      useBuilderStore.getState().updateContent("summary", "Second draft");

      useBuilderStore.getState().undo();

      const state = useBuilderStore.getState();
      // After two updateContent calls the history contains the content
      // *before* each update.  Undoing once should give us the content
      // that existed right before the second updateContent — i.e. the
      // state that contained "First draft".
      expect(state.content.summary).toBe("First draft");
      expect(state.isDirty).toBe(true);
    });

    it("redo re-applies undone content", () => {
      useBuilderStore.getState().updateContent("summary", "First draft");
      useBuilderStore.getState().updateContent("summary", "Second draft");

      // After two updates:
      //   history = [{}, {summary: "First draft"}], index = 1
      //   content = {summary: "Second draft"}

      // Undo once -> restores history[1] = {summary: "First draft"}
      // Since we were at the tip, undo pushes current content onto history:
      //   history = [{}, {summary: "First draft"}, {summary: "Second draft"}], index = 0
      useBuilderStore.getState().undo();
      expect(useBuilderStore.getState().content.summary).toBe("First draft");

      // Redo moves index from 0 -> 1 -> content = history[1] = {summary: "First draft"}
      // Then redo again: index 1 -> 2 -> content = history[2] = {summary: "Second draft"}
      useBuilderStore.getState().redo();
      useBuilderStore.getState().redo();
      expect(useBuilderStore.getState().content.summary).toBe("Second draft");
    });

    it("undo does nothing when there is no history", () => {
      const before = useBuilderStore.getState();
      useBuilderStore.getState().undo();
      const after = useBuilderStore.getState();

      expect(after.content).toEqual(before.content);
      expect(after.historyIndex).toBe(-1);
    });

    it("redo does nothing when already at the latest state", () => {
      useBuilderStore.getState().updateContent("summary", "Only version");

      const before = useBuilderStore.getState();
      useBuilderStore.getState().redo();
      const after = useBuilderStore.getState();

      expect(after.content).toEqual(before.content);
    });

    it("multiple undos walk back through history", () => {
      useBuilderStore.getState().updateContent("summary", "v1");
      useBuilderStore.getState().updateContent("summary", "v2");
      useBuilderStore.getState().updateContent("summary", "v3");

      useBuilderStore.getState().undo(); // -> v2
      expect(useBuilderStore.getState().content.summary).toBe("v2");

      useBuilderStore.getState().undo(); // -> v1
      expect(useBuilderStore.getState().content.summary).toBe("v1");

      useBuilderStore.getState().undo(); // -> {} (initial empty)
      expect(useBuilderStore.getState().content.summary).toBeUndefined();
    });

    it("updateContent after undo discards redo future", () => {
      useBuilderStore.getState().updateContent("summary", "v1");
      useBuilderStore.getState().updateContent("summary", "v2");
      useBuilderStore.getState().updateContent("summary", "v3");

      useBuilderStore.getState().undo(); // -> v2
      useBuilderStore.getState().undo(); // -> v1

      // Now write a new branch
      useBuilderStore.getState().updateContent("summary", "v1-branch");

      // Redo should have nothing to restore — the future was truncated
      useBuilderStore.getState().redo();
      expect(useBuilderStore.getState().content.summary).toBe("v1-branch");
    });
  });

  describe("pushHistory", () => {
    it("pushHistory adds a snapshot to the history stack", () => {
      const snapshot = { summary: "snapshot-1" };
      useBuilderStore.getState().pushHistory(snapshot);

      const state = useBuilderStore.getState();
      expect(state.history).toHaveLength(1);
      expect(state.history[0]).toEqual(snapshot);
      expect(state.historyIndex).toBe(0);
    });

    it("pushHistory limits entries to MAX_HISTORY_LENGTH (50)", () => {
      // Push 55 entries — only the last 50 should be retained.
      for (let i = 0; i < 55; i++) {
        useBuilderStore.getState().pushHistory({ i });
      }

      const state = useBuilderStore.getState();
      expect(state.history).toHaveLength(50);
      // The earliest surviving entry should be the one pushed at index 5
      expect((state.history[0] as { i: number }).i).toBe(5);
      expect(state.historyIndex).toBe(49);
    });

    it("pushHistory truncates future entries after undo", () => {
      useBuilderStore.getState().pushHistory({ v: 1 });
      useBuilderStore.getState().pushHistory({ v: 2 });
      useBuilderStore.getState().pushHistory({ v: 3 });

      // Move back two steps
      useBuilderStore.setState({ historyIndex: 0 });

      // Push a new entry — entries at index 1 and 2 should be discarded
      useBuilderStore.getState().pushHistory({ v: "new" });

      const state = useBuilderStore.getState();
      expect(state.history).toHaveLength(2);
      expect(state.history[1]).toEqual({ v: "new" });
      expect(state.historyIndex).toBe(1);
    });
  });
});
