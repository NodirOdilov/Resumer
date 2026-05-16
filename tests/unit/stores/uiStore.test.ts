import { describe, it, expect, beforeEach } from "vitest";
import { useUiStore } from "@/stores/uiStore";

describe("uiStore", () => {
  beforeEach(() => {
    useUiStore.setState({
      sidebarOpen: true,
      mobileMenuOpen: false,
      theme: "light",
      previewZoom: 100,
    });
  });

  it("toggles sidebar", () => {
    expect(useUiStore.getState().sidebarOpen).toBe(true);

    useUiStore.getState().toggleSidebar();
    expect(useUiStore.getState().sidebarOpen).toBe(false);

    useUiStore.getState().toggleSidebar();
    expect(useUiStore.getState().sidebarOpen).toBe(true);
  });

  it("toggles mobile menu", () => {
    expect(useUiStore.getState().mobileMenuOpen).toBe(false);

    useUiStore.getState().toggleMobileMenu();
    expect(useUiStore.getState().mobileMenuOpen).toBe(true);

    useUiStore.getState().toggleMobileMenu();
    expect(useUiStore.getState().mobileMenuOpen).toBe(false);
  });

  it("sets theme", () => {
    expect(useUiStore.getState().theme).toBe("light");

    useUiStore.getState().setTheme("dark");
    expect(useUiStore.getState().theme).toBe("dark");

    useUiStore.getState().setTheme("light");
    expect(useUiStore.getState().theme).toBe("light");
  });

  it("sets preview zoom", () => {
    expect(useUiStore.getState().previewZoom).toBe(100);

    useUiStore.getState().setPreviewZoom(150);
    expect(useUiStore.getState().previewZoom).toBe(150);
  });

  it("clamps preview zoom to minimum of 25", () => {
    useUiStore.getState().setPreviewZoom(10);
    expect(useUiStore.getState().previewZoom).toBe(25);
  });

  it("clamps preview zoom to maximum of 200", () => {
    useUiStore.getState().setPreviewZoom(250);
    expect(useUiStore.getState().previewZoom).toBe(200);
  });

  it("initial state has correct defaults", () => {
    const state = useUiStore.getState();
    expect(state.sidebarOpen).toBe(true);
    expect(state.mobileMenuOpen).toBe(false);
    expect(state.theme).toBe("light");
    expect(state.previewZoom).toBe(100);
  });
});
