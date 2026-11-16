import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  findUserByIdentifier,
  registerOrUpdateUser,
  hashRecoveryField,
} from "@/lib/auth/user-registry-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, phone, city, newPassword } = body;

    if (!identifier || !phone || !city) {
      return NextResponse.json(
        { ok: false, error: "ইউজারনেম, মোবাইল নম্বর এবং শহরের নাম দেওয়া আবশ্যক।" },
        { status: 400 }
      );
    }

    const user = findUserByIdentifier(identifier);
    if (!user) {
      return NextResponse.json({ ok: false, error: "এই ইউজারনেমে কোনো একাউন্ট পাওয়া যায়নি।" }, { status: 404 });
    }

    const phoneHash = hashRecoveryField(phone);
    const cityHash = hashRecoveryField(city);

    // If recovery hashes are set, verify them.
    // If not set yet (legacy), allow setting them with initial recovery.
    if (user.recoveryPhoneHash && user.recoveryPhoneHash !== phoneHash) {
      return NextResponse.json({ ok: false, error: "মোবাইল নম্বর মেলেনি!" }, { status: 401 });
    }

    if (user.recoveryCityHash && user.recoveryCityHash !== cityHash) {
      return NextResponse.json({ ok: false, error: "শহরের নাম মেলেনি!" }, { status: 401 });
    }

    // Recovery verified!
    let passHash = user.passHash;
    let hasPassword = user.hasPassword;

    if (newPassword && newPassword.trim()) {
      passHash = crypto.createHash("sha256").update(newPassword.trim()).digest("hex");
      hasPassword = true;
    } else {
      // If new password is blank, convert back to Blank-Password login mode!
      passHash = null;
      hasPassword = false;
    }

    const updated = registerOrUpdateUser({
      handle: user.handle,
      passHash,
      hasPassword,
      recoveryPhoneHash: phoneHash,
      recoveryCityHash: cityHash,
    });

    return NextResponse.json({
      ok: true,
      message: hasPassword
        ? "পাসওয়ার্ড সফলভাবে রিসেট হয়েছে এবং লগইন সম্পন্ন হয়েছে!"
        : "একাউন্ট সফলভাবে রিকভার হয়েছে এবং পাসওয়ার্ডবিহীন মোডে সেট করা হয়েছে!",
      user: updated,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}
