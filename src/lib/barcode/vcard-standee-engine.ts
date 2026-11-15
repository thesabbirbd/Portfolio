/**
 * RFC 6350 vCard 3.0 Generator & Printable Desk Standee Engine.
 * Supports bKash/Nagad Payment Standees, Wi-Fi QR Standees, and Founder Contact Cards.
 * 100% Client-Side Canvas rendering with scannable ISO QR matrices.
 */

import { encodeQrMatrix } from "./qr-matrix-encoder";

export interface VCardContact {
  fullName: string;
  organization: string;
  title: string;
  phone: string;
  whatsapp?: string;
  bkashNumber?: string;
  email: string;
  website: string;
  note?: string;
}

export type StandeeTemplateType = "founder_card" | "bkash_payment" | "wifi_access";

export interface StandeeCardData {
  type: StandeeTemplateType;
  title: string;
  subtitle: string;
  qrPayload: string;
  contact?: VCardContact;
  wifiSsid?: string;
  wifiPassword?: string;
  bkashMerchant?: string;
  accentColor: string;
}

/**
 * Format RFC 6350 vCard 3.0 string.
 */
export function generateVCardString(contact: VCardContact): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${contact.fullName}`,
    `ORG:${contact.organization || "Independent"}`,
    `TITLE:${contact.title || "Founder & Engineer"}`,
    `TEL;TYPE=CELL,VOICE:${contact.phone}`,
  ];

  if (contact.whatsapp) {
    lines.push(`TEL;TYPE=WHATSAPP:${contact.whatsapp}`);
  }
  if (contact.bkashNumber) {
    lines.push(`NOTE:bKash / Nagad: ${contact.bkashNumber}`);
  }
  if (contact.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${contact.email}`);
  }
  if (contact.website) {
    lines.push(`URL:${contact.website}`);
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

/**
 * Render printable desk standee or digital visiting card onto HTML5 Canvas.
 */
export function renderStandeeCardToCanvas(
  canvas: HTMLCanvasElement,
  data: StandeeCardData
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Standard Printable Standee: 800 x 1200 (2:3 Portrait Table Standee)
  const W = 800;
  const H = 1200;
  canvas.width = W;
  canvas.height = H;

  // 1. Elegant Background Card
  ctx.fillStyle = "#0B0F19";
  ctx.fillRect(0, 0, W, H);

  // Decorative border
  ctx.strokeStyle = data.accentColor || "#F59E0B";
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, W - 48, H - 48);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, W - 64, H - 64);

  // 2. Header Title & Subtitle
  ctx.save();
  ctx.textAlign = "center";

  // Accent Header Icon/Tag
  ctx.fillStyle = data.accentColor || "#F59E0B";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(data.type === "bkash_payment" ? "💳 INSTANT PAYMENT" : data.type === "wifi_access" ? "📶 GUEST WI-FI" : "🪪 DIGITAL CONTACT", W / 2, 90);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 38px sans-serif";
  ctx.fillText(data.title, W / 2, 145);

  ctx.fillStyle = "#9CA3AF";
  ctx.font = "400 20px sans-serif";
  ctx.fillText(data.subtitle, W / 2, 185);
  ctx.restore();

  // 3. Generate QR Code Matrix
  const qr = encodeQrMatrix(data.qrPayload);
  const qrSize = qr.size;
  const matrix = qr.matrix;

  // Draw White Rounded Container for QR Code
  const qrContainerSize = 460;
  const qrContainerX = (W - qrContainerSize) / 2;
  const qrContainerY = 230;

  ctx.save();
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.roundRect(qrContainerX, qrContainerY, qrContainerSize, qrContainerSize, 28);
  ctx.fill();

  // Draw QR code modules
  const pad = 36;
  const drawArea = qrContainerSize - pad * 2;
  const moduleSize = drawArea / qrSize;

  ctx.fillStyle = "#000000";
  for (let r = 0; r < qrSize; r++) {
    for (let c = 0; c < qrSize; c++) {
      if (matrix[r][c]) {
        ctx.fillRect(
          qrContainerX + pad + c * moduleSize,
          qrContainerY + pad + r * moduleSize,
          moduleSize,
          moduleSize
        );
      }
    }
  }
  ctx.restore();

  // 4. Instructions Pill under QR
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(W / 2 - 180, 720, 360, 48, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#FDE047";
  ctx.font = "bold 18px monospace";
  ctx.fillText("📷 SCAN WITH ANY CAMERA", W / 2, 750);
  ctx.restore();

  // 5. Details Section (Phone, Email, Wi-Fi credentials or Payment Number)
  const detailY = 820;
  ctx.save();
  ctx.textAlign = "center";

  if (data.type === "founder_card" && data.contact) {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(data.contact.fullName, W / 2, detailY);

    ctx.fillStyle = "#9CA3AF";
    ctx.font = "18px sans-serif";
    ctx.fillText(`${data.contact.title} • ${data.contact.organization}`, W / 2, detailY + 36);

    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 22px monospace";
    ctx.fillText(data.contact.phone, W / 2, detailY + 76);

    ctx.fillStyle = "#6B7280";
    ctx.font = "16px sans-serif";
    ctx.fillText(data.contact.email, W / 2, detailY + 110);
  } else if (data.type === "bkash_payment") {
    ctx.fillStyle = "#E11D48";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("bKash / Nagad Personal/Merchant", W / 2, detailY);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 36px monospace";
    ctx.fillText(data.bkashMerchant || "01711-XXXXXX", W / 2, detailY + 48);

    ctx.fillStyle = "#9CA3AF";
    ctx.font = "18px sans-serif";
    ctx.fillText("ক্যাশ-আউট বা পেমেন্ট করতে কিউআর স্ক্যান করুন", W / 2, detailY + 90);
  } else if (data.type === "wifi_access") {
    ctx.fillStyle = "#38BDF8";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(`SSID: ${data.wifiSsid || "GUEST_WIFI"}`, W / 2, detailY);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 24px monospace";
    ctx.fillText(`Password: ${data.wifiPassword || "None"}`, W / 2, detailY + 44);

    ctx.fillStyle = "#9CA3AF";
    ctx.font = "18px sans-serif";
    ctx.fillText("Auto-connects on iOS and Android devices", W / 2, detailY + 84);
  }
  ctx.restore();

  // 6. Footer Branding
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "#4B5563";
  ctx.font = "14px monospace";
  ctx.fillText("THE SABBiR OS • sabbir.nav.bd • Print & Place Standee", W / 2, H - 48);
  ctx.restore();
}
