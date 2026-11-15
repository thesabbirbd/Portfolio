import { describe, it, expect } from "vitest";
import { GOV_PHOTO_PRESETS } from "@/lib/vision/gov-photo-engine";
import { calculateRemittanceCorridors } from "../remittance-engine";

describe("Gov Photo Engine & Remittance Calculator (v5.2.12)", () => {
  it("contains official BCS and Visa photo presets with exact dimensions", () => {
    const bcsPhoto = GOV_PHOTO_PRESETS.find((p) => p.id === "bcs-photo");
    expect(bcsPhoto).toBeDefined();
    expect(bcsPhoto?.width).toBe(300);
    expect(bcsPhoto?.height).toBe(300);
    expect(bcsPhoto?.maxSizeBytes).toBe(100 * 1024);

    const bcsSign = GOV_PHOTO_PRESETS.find((p) => p.id === "bcs-signature");
    expect(bcsSign).toBeDefined();
    expect(bcsSign?.width).toBe(300);
    expect(bcsSign?.height).toBe(80);
    expect(bcsSign?.maxSizeBytes).toBe(60 * 1024);

    const usVisa = GOV_PHOTO_PRESETS.find((p) => p.id === "us-visa");
    expect(usVisa?.width).toBe(600);
    expect(usVisa?.height).toBe(600);
  });

  it("calculates Bangladesh Bank 2.5% cash incentive accurately", () => {
    const { results, winner } = calculateRemittanceCorridors(1000);
    expect(results.length).toBeGreaterThanOrEqual(4);
    expect(winner).toBeDefined();
    expect(winner.netInHandBdt).toBeGreaterThan(100000);

    // Verify 2.5% incentive is strictly 2.5% of base BDT
    const bankWire = results.find((r) => r.corridor.id === "bank-wire-swift");
    expect(bankWire).toBeDefined();
    if (bankWire) {
      expect(bankWire.govtIncentiveBdt).toBe(Math.round(bankWire.baseBdt * 0.025));
    }
  });

  it("ranks the corridors correctly by net in-hand Taka", () => {
    const { results } = calculateRemittanceCorridors(500);
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].netInHandBdt).toBeGreaterThanOrEqual(results[i + 1].netInHandBdt);
    }
  });
});
