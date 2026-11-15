import { describe, it, expect } from "vitest";
import {
  formatTimeSeconds,
  generateChallengeUrl,
  generateShareText,
  type ScorecardData,
} from "./scorecard-canvas";

describe("scorecard-canvas helpers", () => {
  it("formats seconds into MM:SSs format", () => {
    expect(formatTimeSeconds(0)).toBe("00:00s");
    expect(formatTimeSeconds(65)).toBe("01:05s");
    expect(formatTimeSeconds(125)).toBe("02:05s");
  });

  it("generates challenge URLs with proper query params", () => {
    const url = generateChallengeUrl("packet-defender", 4500);
    expect(url).toContain("challenge=packet-defender");
    expect(url).toContain("target=4500");
  });

  it("generates viral share text with valid brand and challenge link", () => {
    const mockData: ScorecardData = {
      gameId: "packet-defender",
      gameTitle: "Packet Defender: NOC DDoS Firewall",
      playerHandle: "thesabbir_guest",
      score: 5200,
      rankTier: "S-Tier // Kernel Master",
      accuracyPct: 98,
      timeTakenSeconds: 95,
      xpEarned: 520,
    };

    const text = generateShareText(mockData);
    expect(text).toContain("5,200 PTS");
    expect(text).toContain("Packet Defender");
    expect(text).toContain("S-Tier // Kernel Master");
    expect(text).toContain("#THESABBiR");
  });
});
