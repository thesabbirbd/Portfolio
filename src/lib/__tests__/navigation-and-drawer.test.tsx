import { describe, it, expect } from "vitest";
import { OS_DRAWER_APPS, OS_DRAWER_CATEGORIES } from "@/components/navigation/OSAppLauncherDrawer";

describe("OS App Launcher Mega-Drawer & Navigation (Block 2)", () => {
  it("includes all categories and at least 35 core apps in the drawer", () => {
    expect(OS_DRAWER_CATEGORIES.length).toBeGreaterThanOrEqual(8);
    expect(OS_DRAWER_APPS.length).toBeGreaterThanOrEqual(35);

    // Verify key studio presence
    const slugs = OS_DRAWER_APPS.map((a) => a.href);
    expect(slugs).toContain("/tools/id-card-stitcher");
    expect(slugs).toContain("/tools/bangla-converter");
    expect(slugs).toContain("/tools/cgpa-calculator");
    expect(slugs).toContain("/tools/medicine-scheduler");
    expect(slugs).toContain("/tools/family-budget-zakat");
    expect(slugs).toContain("/tools/electricity-solar-calculator");
    expect(slugs).toContain("/tools/gov-photo-sizer");
    expect(slugs).toContain("/agents");
    expect(slugs).toContain("/hacks");
    expect(slugs).toContain("/os-brain");
  });

  it("ensures every drawer app has both English and authentic Bangla titles", () => {
    for (const app of OS_DRAWER_APPS) {
      expect(app.name).toBeTruthy();
      expect(app.banglaName).toBeTruthy();
      expect(app.description).toBeTruthy();
      expect(app.icon).toBeTruthy();
      expect(app.href.startsWith("/")).toBe(true);
    }
  });

  it("has valid category assignments matching category list", () => {
    const validCatIds = new Set(OS_DRAWER_CATEGORIES.map((c) => c.id));
    for (const app of OS_DRAWER_APPS) {
      expect(validCatIds.has(app.category)).toBe(true);
    }
  });
});
