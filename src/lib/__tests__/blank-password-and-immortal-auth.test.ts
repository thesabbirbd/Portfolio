import { describe, it, expect } from "vitest";
import {
  findUserByIdentifier,
  registerOrUpdateUser,
  verifyPasswordHash,
  hashRecoveryField,
} from "../auth/user-registry-server";

describe("Blank-Password Username Login & Immortal Recovery Subsystem", () => {
  it("allows instant login with blank password for accounts with hasPassword: false", () => {
    // tanvir_dev was seeded with hasPassword: false
    const user = findUserByIdentifier("tanvir_dev");
    expect(user).toBeDefined();
    expect(user?.hasPassword).toBe(false);
    expect(user?.passHash).toBeFalsy();
  });

  it("finds users case-insensitively by handle or Guest ID", () => {
    const admin = findUserByIdentifier("THESABBIRBD");
    expect(admin).toBeDefined();
    expect(admin?.role).toBe("superadmin");

    const guest = findUserByIdentifier("sb-4829");
    expect(guest).toBeDefined();
    expect(guest?.displayName).toBe("Guest Engineer");
  });

  it("verifies password correctly for password-protected accounts", () => {
    const user = findUserByIdentifier("thesabbirbd");
    expect(user?.hasPassword).toBe(true);

    const correctMatch = verifyPasswordHash("sabbir2026", user?.passHash);
    expect(correctMatch).toBe(true);

    const wrongMatch = verifyPasswordHash("wrongpass", user?.passHash);
    expect(wrongMatch).toBe(false);
  });

  it("verifies recovery hash computation for mobile number and city", () => {
    const phoneHash = hashRecoveryField("01700000000");
    const cityHash = hashRecoveryField("rajshahi");

    const user = findUserByIdentifier("thesabbirbd");
    expect(user?.recoveryPhoneHash).toBe(phoneHash);
    expect(user?.recoveryCityHash).toBe(cityHash);
  });

  it("creates a new Blank-Password user dynamically when registered without a password", () => {
    const newUser = registerOrUpdateUser({
      handle: "new_student_bd",
      displayName: "New Student",
      hasPassword: false,
      role: "guest",
    });

    expect(newUser.handle).toBe("new_student_bd");
    expect(newUser.hasPassword).toBe(false);

    const retrieved = findUserByIdentifier("new_student_bd");
    expect(retrieved).toBeDefined();
    expect(retrieved?.hasPassword).toBe(false);
  });
});
