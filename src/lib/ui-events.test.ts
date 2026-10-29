import { describe, it, expect } from "vitest";
import { isTypingTarget } from "./ui-events";

describe("isTypingTarget", () => {
  it("returns false for null target", () => {
    expect(isTypingTarget(null)).toBe(false);
  });

  it.each([
    ["INPUT", document.createElement("input")],
    ["TEXTAREA", document.createElement("textarea")],
    ["SELECT", document.createElement("select")],
  ])("returns true for %s elements", (_, el) => {
    expect(isTypingTarget(el)).toBe(true);
  });

  it("returns true for elements with isContentEditable", () => {
    const el = document.createElement("div");
    Object.defineProperty(el, "isContentEditable", { value: true, configurable: true });
    expect(isTypingTarget(el)).toBe(true);
  });

  it("returns false for other elements like DIV or BUTTON", () => {
    expect(isTypingTarget(document.createElement("div"))).toBe(false);
    expect(isTypingTarget(document.createElement("button"))).toBe(false);
  });
});
