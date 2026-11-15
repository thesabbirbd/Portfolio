import { NextResponse } from "next/server";
import { db, schema } from "@/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, intent, message, phoneOrTg, sourcePage, _honey } = body;

    // 1. Silent Honeypot Anti-Spam Shield
    if (_honey) {
      return NextResponse.json({ ok: true, message: "Message received" });
    }

    // 2. Strict Input Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ ok: false, error: "A valid name is required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json({ ok: false, error: "A valid email address is required." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json({ ok: false, error: "Please write a message (at least 5 characters)." }, { status: 400 });
    }

    const cleanIntent = ["hire", "collaborate", "community", "general"].includes(intent)
      ? intent
      : "general";

    let insertedId: number | null = null;
    let telegramNotified = false;

    // 3. PostgreSQL Database Persistence (Neon / Drizzle)
    if (db) {
      try {
        const [lead] = await db
          .insert(schema.contactLeads)
          .values({
            intent: cleanIntent,
            senderName: name.trim(),
            senderEmail: email.trim().toLowerCase(),
            senderPhoneOrTg: phoneOrTg ? String(phoneOrTg).trim() : null,
            message: message.trim(),
            sourcePage: sourcePage || "/contact",
          })
          .returning({ id: schema.contactLeads.id });

        insertedId = lead?.id ?? null;
      } catch (dbErr) {
        console.error("Database insert error (contact_leads):", dbErr);
      }
    }

    // 4. Free Telegram Bot Instant Notification Webhook
    const tgBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    if (tgBotToken && tgChatId) {
      try {
        const tgText = `🚀 *New Lead on THE SABBiR (${cleanIntent.toUpperCase()})*\n\n` +
          `👤 *Name:* ${name.trim()}\n` +
          `📧 *Email:* \`${email.trim().toLowerCase()}\`\n` +
          (phoneOrTg ? `📱 *Phone/TG:* \`${String(phoneOrTg).trim()}\`\n` : "") +
          `📄 *Source:* \`${sourcePage || "/contact"}\`\n\n` +
          `💬 *Message:*\n${message.trim()}`;

        const tgRes = await fetch(`https://api.telegram.org/bot${tgBotToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: tgText,
            parse_mode: "Markdown",
          }),
        });

        if (tgRes.ok) {
          telegramNotified = true;
          if (db && insertedId) {
            await db
              .update(schema.contactLeads)
              .set({ telegramNotified: true })
              .where(drizzleEq(schema.contactLeads.id, insertedId));
          }
        }
      } catch (tgErr) {
        console.error("Telegram notification error:", tgErr);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Your message has been delivered directly.",
      leadId: insertedId,
      telegramNotified,
    });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

function drizzleEq(col: any, val: any) {
  // Safe helper to avoid pulling in extra operators if not needed
  const { eq } = require("drizzle-orm");
  return eq(col, val);
}
