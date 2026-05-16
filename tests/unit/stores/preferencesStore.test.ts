import { describe, it, expect, beforeEach } from "vitest";
import { usePreferencesStore } from "@/stores/preferencesStore";

describe("preferencesStore", () => {
  beforeEach(() => {
    usePreferencesStore.setState({
      language: "en-us",
      region: "",
    });
    localStorage.clear();
  });

  it("initial state has default language", () => {
    const state = usePreferencesStore.getState();
    expect(state.language).toBe("en-us");
    expect(state.region).toBe("");
  });

  it("sets language", () => {
    usePreferencesStore.getState().setLanguage("fr");
    expect(usePreferencesStore.getState().language).toBe("fr");
  });

  it("sets region", () => {
    usePreferencesStore.getState().setRegion("EU");
    expect(usePreferencesStore.getState().region).toBe("EU");
  });

  it("persists to localStorage", () => {
    usePreferencesStore.getState().setLanguage("de");

    const stored = localStorage.getItem("preferences-storage");
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed.state.language).toBe("de");
  });

  it("persists region to localStorage", () => {
    usePreferencesStore.getState().setRegion("US");

    const stored = localStorage.getItem("preferences-storage");
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed.state.region).toBe("US");
  });
});
