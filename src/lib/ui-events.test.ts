import { describe, it, expect, vi, afterEach } from "vitest";
import { goToSection } from "./ui-events";

describe("goToSection", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should scroll into view when the element exists", () => {
    const mockScrollIntoView = vi.fn();
    const mockGetElementById = vi.spyOn(document, "getElementById").mockReturnValue({
      scrollIntoView: mockScrollIntoView,
    } as unknown as HTMLElement);
    const mockNavigate = vi.fn();

    goToSection("test-id", "/fallback", mockNavigate);

    expect(mockGetElementById).toHaveBeenCalledWith("test-id");
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should navigate to the fallback href when the element does not exist", () => {
    const mockGetElementById = vi.spyOn(document, "getElementById").mockReturnValue(null);
    const mockNavigate = vi.fn();

    goToSection("test-id", "/fallback", mockNavigate);

    expect(mockGetElementById).toHaveBeenCalledWith("test-id");
    expect(mockNavigate).toHaveBeenCalledWith("/fallback");
  });
});
