import { describe, it, expect } from "vitest";
import {
  generateVCardString,
  renderStandeeCardToCanvas,
  type VCardContact,
  type StandeeCardData,
} from "../vcard-standee-engine";
import { encodeQrMatrix } from "../qr-matrix-encoder";

describe("vCard & Standee Engine (Stage 080)", () => {
  it("formats RFC 6350 vCard 3.0 correctly with required and optional fields", () => {
    const contact: VCardContact = {
      fullName: "Md Sabbirul Islam Khan",
      organization: "THE SABBiR Systems",
      title: "Chief Product Manager (CPM)",
      phone: "+8801700000000",
      whatsapp: "+8801700000000",
      bkashNumber: "01700000000",
      email: "contact@sabbir.nav.bd",
      website: "https://sabbir.nav.bd",
    };

    const vcf = generateVCardString(contact);
    expect(vcf).toContain("BEGIN:VCARD");
    expect(vcf).toContain("VERSION:3.0");
    expect(vcf).toContain("FN:Md Sabbirul Islam Khan");
    expect(vcf).toContain("ORG:THE SABBiR Systems");
    expect(vcf).toContain("TITLE:Chief Product Manager (CPM)");
    expect(vcf).toContain("TEL;TYPE=CELL,VOICE:+8801700000000");
    expect(vcf).toContain("TEL;TYPE=WHATSAPP:+8801700000000");
    expect(vcf).toContain("NOTE:bKash / Nagad: 01700000000");
    expect(vcf).toContain("EMAIL;TYPE=INTERNET:contact@sabbir.nav.bd");
    expect(vcf).toContain("URL:https://sabbir.nav.bd");
    expect(vcf).toContain("END:VCARD");
  });

  it("handles minimal contact without optional fields", () => {
    const minimal: VCardContact = {
      fullName: "Visitor Guest",
      organization: "",
      title: "",
      phone: "+8801800000000",
      email: "guest@example.com",
      website: "https://example.com",
    };

    const vcf = generateVCardString(minimal);
    expect(vcf).toContain("FN:Visitor Guest");
    expect(vcf).toContain("ORG:Independent");
    expect(vcf).toContain("TITLE:Founder & Engineer");
    expect(vcf).not.toContain("WHATSAPP");
    expect(vcf).not.toContain("NOTE:bKash");
  });

  it("encodes valid QR matrix for payload", () => {
    const qr = encodeQrMatrix("https://sabbir.nav.bd");
    expect(qr.size).toBeGreaterThan(20);
    expect(qr.matrix.length).toBe(qr.size);
    // Top-left finder pattern corner must be true
    expect(qr.matrix[0][0]).toBe(true);
    expect(qr.matrix[0][6]).toBe(true);
    expect(qr.matrix[6][0]).toBe(true);
  });

  it("renders standee card to mock canvas without crashing", () => {
    const mockCtx = {
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 0,
      fillRect: () => {},
      strokeRect: () => {},
      save: () => {},
      restore: () => {},
      textAlign: "",
      font: "",
      fillText: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      roundRect: () => {},
    };

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: () => mockCtx,
    } as unknown as HTMLCanvasElement;

    const data: StandeeCardData = {
      type: "founder_card",
      title: "Md Sabbirul Islam Khan",
      subtitle: "Full-Stack AI & Systems Architect",
      qrPayload: "https://sabbir.nav.bd",
      accentColor: "#F59E0B",
    };

    expect(() => renderStandeeCardToCanvas(mockCanvas, data)).not.toThrow();
    expect(mockCanvas.width).toBe(800);
    expect(mockCanvas.height).toBe(1200);
  });
});
