import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { ThemeToast } from "./ThemeToast";
import { THEME_TOAST_KEY } from "@/lib/theme-color";
import { OPEN_SETTINGS } from "@/lib/ui-events";

describe("ThemeToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    document.documentElement.setAttribute("data-theme-color", "green");
    document.documentElement.setAttribute("data-theme-source", "random");
  });
  afterEach(() => vi.useRealTimers());

  it("announces the session's theme once, then never again in that session", () => {
    const first = render(<ThemeToast />);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByRole("status").textContent).toContain("Studio theme: Emerald");
    expect(screen.getByRole("status").textContent).toContain("Switch anytime in Settings");
    expect(sessionStorage.getItem(THEME_TOAST_KEY)).toBe("1");
    first.unmount();

    render(<ThemeToast />); // next route / reload in the same session
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.queryByText(/Studio theme/)).toBeNull();
  });

  it("can be dismissed and hides itself after a few seconds", () => {
    render(<ThemeToast />);
    act(() => { vi.advanceTimersByTime(1000); });
    fireEvent.click(screen.getByRole("button", { name: "Dismiss theme notice" }));
    expect(screen.queryByText(/Studio theme/)).toBeNull();

    sessionStorage.clear();
    render(<ThemeToast />);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByText(/Studio theme/)).toBeTruthy();
    act(() => { vi.advanceTimersByTime(7500); });
    expect(screen.queryByText(/Studio theme/)).toBeNull();
  });

  it("'Change' opens Settings", () => {
    const opened = vi.fn();
    window.addEventListener(OPEN_SETTINGS, opened);
    render(<ThemeToast />);
    act(() => { vi.advanceTimersByTime(1000); });
    fireEvent.click(screen.getByRole("button", { name: "Change" }));
    expect(opened).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_SETTINGS, opened);
  });
});
