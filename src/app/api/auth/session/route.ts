import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  findUserByIdentifier,
  registerOrUpdateUser,
  verifyPasswordHash,
} from "@/lib/auth/user-registry-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password = "", displayName } = body;

    const trimmedId = (identifier || "").trim();
    if (!trimmedId) {
      return NextResponse.json({ ok: false, error: "ইউজারনেম বা গেস্ট আইডি প্রয়োজন।" }, { status: 400 });
    }

    const existing = findUserByIdentifier(trimmedId);

    if (!existing) {
      // New user creating an account:
      // If no password provided, create Blank-Password user!
      const hasPassword = Boolean(password && password.trim());
      const passHash = hasPassword
        ? crypto.createHash("sha256").update(password.trim()).digest("hex")
        : null;

      const newUser = registerOrUpdateUser({
        handle: trimmedId,
        displayName: displayName || (trimmedId.startsWith("SB-") ? `Guest (${trimmedId})` : trimmedId),
        role: "guest",
        hasPassword,
        passHash,
      });

      return NextResponse.json({
        ok: true,
        message: hasPassword ? "অ্যাকাউন্ট তৈরি সম্পন্ন!" : "পাসওয়ার্ডবিহীন ইউজারনেম লগইন সম্পন্ন!",
        user: newUser,
      });
    }

    // Existing user:
    if (!existing.hasPassword) {
      // User is in Blank-Password mode!
      // They can log in with a blank password!
      const user = registerOrUpdateUser({
        handle: existing.handle,
        displayName: existing.displayName,
      });

      return NextResponse.json({
        ok: true,
        message: "পাসওয়ার্ডবিহীন লগইন সফল!",
        user,
      });
    }

    // User has a password:
    if (!password || !password.trim()) {
      return NextResponse.json(
        {
          ok: false,
          requiresPassword: true,
          error: "এই ইউজারনেমটি পাসওয়ার্ড দিয়ে সুরক্ষিত। দয়া করে পাসওয়ার্ড দিন অথবা মোবাইল ও শহরের নাম দিয়ে রিকভার করুন।",
        },
        { status: 401 }
      );
    }

    const isMatch = verifyPasswordHash(password.trim(), existing.passHash);
    if (!isMatch) {
      return NextResponse.json(
        {
          ok: false,
          requiresPassword: true,
          error: "ভুল পাসওয়ার্ড! দয়া করে সঠিক পাসওয়ার্ড দিন অথবা একাউন্ট রিকভার করুন।",
        },
        { status: 401 }
      );
    }

    const user = registerOrUpdateUser({
      handle: existing.handle,
      displayName: existing.displayName,
    });

    return NextResponse.json({
      ok: true,
      message: "সফলভাবে লগইন হয়েছে!",
      user,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
