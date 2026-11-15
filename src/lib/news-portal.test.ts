import { describe, it, expect } from "vitest";
import { getAllNewsStories, getNewsStoryBySlug, getFeaturedNewsStory } from "./news-portal";

describe("News Portal Subsystem", () => {
  it("should return at least 16 news stories with required fields", () => {
    const stories = getAllNewsStories();
    expect(stories.length).toBeGreaterThanOrEqual(16);

    for (const story of stories) {
      expect(story.id).toBeTruthy();
      expect(story.slug).toBeTruthy();
      expect(story.title).toBeTruthy();
      expect(story.source).toBeTruthy();
      expect(story.category).toBeTruthy();
      expect(story.summary).toBeTruthy();
      expect(story.coverImage).toMatch(/^https?:\/\//);
      expect(story.engineeringTakeaway).toBeTruthy();
      expect(Array.isArray(story.executiveSummary)).toBe(true);
      expect(story.executiveSummary?.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("should find an existing story by slug and return undefined for non-existing", () => {
    const story = getNewsStoryBySlug("postgres-17-incremental-backup");
    expect(story).toBeDefined();
    expect(story?.title).toContain("PostgreSQL 17");

    const nonExistent = getNewsStoryBySlug("random-non-existent-slug-xyz");
    expect(nonExistent).toBeUndefined();
  });

  it("should return the highest virality points story as featured", () => {
    const featured = getFeaturedNewsStory();
    expect(featured).toBeDefined();
    const all = getAllNewsStories();
    const maxPoints = Math.max(...all.map((s) => s.points));
    expect(featured.points).toBe(maxPoints);
  });
});
