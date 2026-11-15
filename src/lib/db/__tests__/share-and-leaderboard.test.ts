import { describe, it, expect, beforeEach } from "vitest";
import {
  createUser,
  getUser,
  recordXpEvent,
  getLeaderboard,
  createShare,
  getShare,
  purgeExpiredShares,
  listActiveShares,
} from "../workplace-store";
import { hashPassword, verifyPassword } from "../../security/crypto-auth";

describe("Workplace DB & Ephemeral Share Engine (workplace-store.ts)", () => {
  beforeEach(async () => {
    await purgeExpiredShares();
  });

  it("creates a 24-hour ephemeral share with valid token and expiration", async () => {
    const payload = JSON.stringify({ layer: "vector", shapes: 4, text: "Dhaka Event" });
    const share = await createShare({
      creatorName: "THE SABBiR Creator",
      toolSlug: "story-maker",
      title: "Festive Story Poster",
      payloadJson: payload,
    });

    expect(share.token).toBeDefined();
    expect(share.token).toHaveLength(10);

    const expiresTime = new Date(share.expiresAt).getTime();
    const now = Date.now();
    // Should be approximately 24 hours in the future
    const hoursDiff = (expiresTime - now) / 3600_000;
    expect(hoursDiff).toBeGreaterThanOrEqual(23.9);
    expect(hoursDiff).toBeLessThanOrEqual(24.1);

    // Retrieve share
    const retrieved = await getShare(share.token);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.title).toBe("Festive Story Poster");
    expect(retrieved?.viewsCount).toBe(1);
  });

  it("supports PIN code hashed protection on ephemeral shares", async () => {
    const rawPin = "5842";
    const hashedPin = hashPassword(rawPin);

    const share = await createShare({
      creatorName: "Tanvir",
      toolSlug: "invoice-maker",
      title: "Confidential Client Invoice",
      payloadJson: JSON.stringify({ total: 45000 }),
      pinCode: hashedPin,
    });

    const retrieved = await getShare(share.token);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.pinCode).toBe(hashedPin);
    expect(verifyPassword("5842", retrieved!.pinCode!)).toBe(true);
    expect(verifyPassword("9999", retrieved!.pinCode!)).toBe(false);
  });

  it("auto-purges expired shares (TTL expiration)", async () => {
    // Create an already-expired share (-1 hour)
    const share = await createShare({
      creatorName: "Ephemeral Test",
      toolSlug: "audio-editor",
      title: "Old Audio Snapshot",
      payloadJson: "{}",
      durationHours: -1, // expired 1 hour ago
    });

    // Reading should trigger expiration and return null
    const result = await getShare(share.token);
    expect(result).toBeNull();
  });

  it("records XP events and ranks creators accurately on the leaderboard", async () => {
    const testHandle = `tester_${Date.now()}`;
    await createUser({
      handle: testHandle,
      displayName: "Unit Tester",
      role: "member",
      welcomeXp: 50,
    });

    // Record an export event
    const res = await recordXpEvent({
      userHandle: testHandle,
      displayName: "Unit Tester",
      actionType: "tool_export",
      targetSlug: "image-editor",
      xpDelta: 50,
    });
    expect(res.newTotalXp).toBe(100);

    const leaderboard = await getLeaderboard({ type: "all" });
    const userInLeaderboard = leaderboard.find((u) => u.handle === testHandle);
    expect(userInLeaderboard).toBeDefined();
    expect(userInLeaderboard?.totalXp).toBe(100);
    expect(userInLeaderboard?.tier).toBe("Novice Scout");
  });
});
