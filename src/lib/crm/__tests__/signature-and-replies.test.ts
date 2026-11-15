import { describe, it, expect } from "vitest";
import {
  generateEmailSignatureHtml,
  DEFAULT_SIGNATURE_DATA,
} from "@/lib/design/email-signature-engine";
import {
  QUICK_REPLY_MACROS,
  interpolateMacro,
  DEFAULT_MACRO_VARIABLES,
} from "../quick-reply-engine";

describe("Email Signature & Quick Reply CRM Engines (v5.2.12)", () => {
  it("generates inline-styled HTML tables for email clients", () => {
    const html = generateEmailSignatureHtml(DEFAULT_SIGNATURE_DATA);
    expect(html).toContain("<table");
    expect(html).toContain("Md Sabbirul Islam Khan");
    expect(html).toContain("iamthesabbir@gmail.com");
    expect(html).toContain("LinkedIn");
  });

  it("supports compact and founder templates without breaking structure", () => {
    const compactHtml = generateEmailSignatureHtml({
      ...DEFAULT_SIGNATURE_DATA,
      template: "compact",
    });
    expect(compactHtml).toContain("<table");
    expect(compactHtml).toContain("Md Sabbirul Islam Khan");

    const founderHtml = generateEmailSignatureHtml({
      ...DEFAULT_SIGNATURE_DATA,
      template: "founder",
    });
    expect(founderHtml).toContain("<table");
    expect(founderHtml).toContain("THE SABBiR / Aiyaar");
  });

  it("contains curated customer support macros", () => {
    expect(QUICK_REPLY_MACROS.length).toBeGreaterThanOrEqual(20);
    const bkashMacro = QUICK_REPLY_MACROS.find((m) => m.id === "bkash-send-money-bn");
    expect(bkashMacro).toBeDefined();
    expect(bkashMacro?.template).toContain("{bkash_no}");
  });

  it("interpolates dynamic variables cleanly without leaving braces", () => {
    const template = "Hello {customer_name}, your product {product} is {price} BDT. Contact {bkash_no}.";
    const interpolated = interpolateMacro(template, DEFAULT_MACRO_VARIABLES);

    expect(interpolated).toContain(DEFAULT_MACRO_VARIABLES.customer_name);
    expect(interpolated).toContain(DEFAULT_MACRO_VARIABLES.product);
    expect(interpolated).toContain(DEFAULT_MACRO_VARIABLES.price);
    expect(interpolated).not.toContain("{customer_name}");
    expect(interpolated).not.toContain("{product}");
    expect(interpolated).not.toContain("{price}");
  });
});
