/**
 * THE SABBiR OS — Email Signature HTML Generator Engine
 * Generates inline-styled, email-client safe HTML tables compatible with
 * Gmail Web, Apple Mail, Microsoft Outlook, and Mozilla Thunderbird.
 */

export interface EmailSignatureData {
  fullName: string;
  jobTitle: string;
  companyName: string;
  companyUrl: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  brandColor: string;
  template: "executive" | "founder" | "compact" | "banner" | "mono" | "badge";
  linkedin?: string;
  github?: string;
  whatsapp?: string;
  website?: string;
  disclaimer?: string;
}

export const DEFAULT_SIGNATURE_DATA: EmailSignatureData = {
  fullName: "Md Sabbirul Islam Khan",
  jobTitle: "Founder & Chief Product Manager (CPM)",
  companyName: "THE SABBiR / Aiyaar",
  companyUrl: "https://sabbir.nav.bd",
  email: "iamthesabbir@gmail.com",
  phone: "+880 1700-000000",
  location: "Dhaka, Bangladesh",
  avatarUrl: "https://sabbir.nav.bd/the-sabbir-og-1200x630.jpg",
  brandColor: "#F59E0B", // Amber gold
  template: "executive",
  linkedin: "https://linkedin.com/in/iamthesabbir",
  github: "https://github.com/thesabbir",
  whatsapp: "https://wa.me/8801700000000",
  website: "https://sabbir.nav.bd",
  disclaimer: "Confidentiality Note: This email and any attachments are confidential and intended solely for the recipient.",
};

export function generateEmailSignatureHtml(data: EmailSignatureData): string {
  const {
    fullName,
    jobTitle,
    companyName,
    companyUrl,
    email,
    phone,
    location,
    avatarUrl,
    brandColor,
    template,
    linkedin,
    github,
    whatsapp,
    website,
    disclaimer,
  } = data;

  const fontStack = "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
  const socialIcons: string[] = [];

  if (linkedin) {
    socialIcons.push(
      `<a href="${linkedin}" target="_blank" style="text-decoration:none; display:inline-block; margin-right:8px; color:${brandColor}; font-size:12px; font-weight:bold;">LinkedIn</a>`
    );
  }
  if (github) {
    socialIcons.push(
      `<a href="${github}" target="_blank" style="text-decoration:none; display:inline-block; margin-right:8px; color:${brandColor}; font-size:12px; font-weight:bold;">GitHub</a>`
    );
  }
  if (website) {
    socialIcons.push(
      `<a href="${website}" target="_blank" style="text-decoration:none; display:inline-block; margin-right:8px; color:${brandColor}; font-size:12px; font-weight:bold;">Website</a>`
    );
  }
  if (whatsapp) {
    socialIcons.push(
      `<a href="${whatsapp}" target="_blank" style="text-decoration:none; display:inline-block; color:#22C55E; font-size:12px; font-weight:bold;">WhatsApp</a>`
    );
  }

  const socialRow =
    socialIcons.length > 0
      ? `<tr><td style="padding-top:8px;">${socialIcons.join(
          `<span style="color:#CBD5E1; margin-right:8px;">•</span>`
        )}</td></tr>`
      : "";

  const disclaimerRow = disclaimer
    ? `<tr><td colspan="2" style="padding-top:12px; font-size:10px; line-height:14px; color:#94A3B8; border-top:1px solid #E2E8F0; margin-top:10px;">${disclaimer}</td></tr>`
    : "";

  switch (template) {
    case "compact":
      return `
<table cellpadding="0" cellspacing="0" border="0" style="${fontStack} font-size:13px; color:#0F172A; line-height:1.4;">
  <tr>
    <td style="padding-right:12px; vertical-align:middle;">
      <img src="${avatarUrl}" width="54" height="54" alt="${fullName}" style="border-radius:50%; display:block; object-fit:cover;" />
    </td>
    <td style="border-left:2px solid ${brandColor}; padding-left:12px; vertical-align:middle;">
      <div style="font-size:14px; font-weight:bold; color:#0F172A;">${fullName}</div>
      <div style="font-size:12px; color:#64748B;">${jobTitle} | <a href="${companyUrl}" style="color:${brandColor}; text-decoration:none;">${companyName}</a></div>
      <div style="font-size:11px; color:#64748B; margin-top:3px;">
        <a href="mailto:${email}" style="color:#0F172A; text-decoration:none;">${email}</a> • ${phone} • ${location}
      </div>
    </td>
  </tr>
</table>`.trim();

    case "founder":
      return `
<table cellpadding="0" cellspacing="0" border="0" style="${fontStack} font-size:13px; color:#0F172A; max-width:500px;">
  <tr>
    <td style="padding-right:16px; vertical-align:top; width:72px;">
      <img src="${avatarUrl}" width="72" height="72" alt="${fullName}" style="border-radius:12px; display:block; border:1px solid #E2E8F0;" />
    </td>
    <td style="border-left:3px solid ${brandColor}; padding-left:16px; vertical-align:top;">
      <div style="font-size:16px; font-weight:bold; color:#0F172A; letter-spacing:-0.2px;">${fullName}</div>
      <div style="font-size:12px; font-weight:600; color:${brandColor}; text-transform:uppercase; margin-top:2px;">${jobTitle}</div>
      <div style="font-size:12px; color:#475569; margin-top:2px;">
        <a href="${companyUrl}" style="color:#0F172A; text-decoration:none; font-weight:bold;">${companyName}</a> — ${location}
      </div>
      <div style="font-size:12px; color:#64748B; margin-top:6px;">
        Email: <a href="mailto:${email}" style="color:#0F172A; text-decoration:none;">${email}</a> | Tel: ${phone}
      </div>
      <table cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;">
        ${socialRow}
      </table>
    </td>
  </tr>
  ${disclaimerRow}
</table>`.trim();

    case "mono":
      return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:'Courier New', Courier, monospace; font-size:12px; color:#1E293B; line-height:1.5;">
  <tr>
    <td style="border-left:3px solid #0F172A; padding-left:12px;">
      <div style="font-weight:bold; font-size:14px;">> ${fullName}</div>
      <div>ROLE : ${jobTitle}</div>
      <div>ORG  : ${companyName} (${companyUrl})</div>
      <div>CONT : ${email} | ${phone}</div>
      <div style="margin-top:4px;">LOC  : ${location}</div>
    </td>
  </tr>
</table>`.trim();

    case "executive":
    default:
      return `
<table cellpadding="0" cellspacing="0" border="0" style="${fontStack} font-size:13px; color:#1E293B; max-width:540px;">
  <tr>
    <td style="padding-right:16px; vertical-align:middle; width:64px;">
      <img src="${avatarUrl}" width="64" height="64" alt="${fullName}" style="border-radius:50%; display:block; border:2px solid ${brandColor};" />
    </td>
    <td style="border-left:2px solid #E2E8F0; padding-left:16px; vertical-align:middle;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <span style="font-size:15px; font-weight:700; color:#0F172A;">${fullName}</span>
            <span style="color:#94A3B8; margin:0 6px;">|</span>
            <span style="font-size:12px; color:#64748B; font-weight:500;">${jobTitle}</span>
          </td>
        </tr>
        <tr>
          <td style="font-size:12px; color:#475569; padding-top:2px;">
            <a href="${companyUrl}" target="_blank" style="color:${brandColor}; text-decoration:none; font-weight:600;">${companyName}</a> • ${location}
          </td>
        </tr>
        <tr>
          <td style="font-size:11px; color:#64748B; padding-top:4px;">
            ✉️ <a href="mailto:${email}" style="color:#0F172A; text-decoration:none;">${email}</a>
            <span style="color:#CBD5E1; margin:0 6px;">•</span>
            📞 ${phone}
          </td>
        </tr>
        ${socialRow}
      </table>
    </td>
  </tr>
  ${disclaimerRow}
</table>`.trim();
  }
}
