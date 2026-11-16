import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { ExportAuthGateModal } from "../ExportAuthGateModal";
import { WorkplaceAuthProvider } from "@/contexts/WorkplaceAuthContext";

// Mock global fetch for auth endpoint
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ExportAuthGateModal & Workplace Auth Flow", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders when isOpen is true and shows tool name badge", () => {
    render(
      <WorkplaceAuthProvider>
        <ExportAuthGateModal
          isOpen={true}
          onClose={vi.fn()}
          toolName="Multi-Layer Image Editor"
          onAuthenticatedProceed={vi.fn()}
        />
      </WorkplaceAuthProvider>
    );

    expect(screen.getByText(/Multi-Layer Image Editor/i)).toBeDefined();
    expect(screen.getByText(/ফাইলটি সেভ করুন ও XP অর্জন করুন/i)).toBeDefined();
    expect(screen.getByRole("tab", { name: /পাসওয়ার্ড ছাড়া/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /পাসওয়ার্ড লগইন/i })).toBeDefined();
  });

  it("switches tabs between Blank-Password and Password Login", () => {
    render(
      <WorkplaceAuthProvider>
        <ExportAuthGateModal
          isOpen={true}
          onClose={vi.fn()}
          toolName="Invoice Studio"
          onAuthenticatedProceed={vi.fn()}
        />
      </WorkplaceAuthProvider>
    );

    // Click Password Login tab
    const pwTab = screen.getByRole("tab", { name: /পাসওয়ার্ড লগইন/i });
    fireEvent.click(pwTab);

    expect(screen.getByText(/ইউজারনেম বা হ্যান্ডেল/i)).toBeDefined();
    expect(screen.getByText(/^পাসওয়ার্ড$/i)).toBeDefined();
  });

  it("submits guest name, receives +25 welcome XP, and calls proceed callback", async () => {
    const proceedFn = vi.fn();
    const closeFn = vi.fn();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          id: "usr-guest-1",
          handle: "rahim_creator",
          displayName: "Rahim Creator",
          role: "guest",
          xp: 25,
          exportsCount: 0,
        },
        token: "mock.session.token",
        welcomeBonus: 25,
      }),
    });

    render(
      <WorkplaceAuthProvider>
        <ExportAuthGateModal
          isOpen={true}
          onClose={closeFn}
          toolName="PDF Redactor"
          onAuthenticatedProceed={proceedFn}
        />
      </WorkplaceAuthProvider>
    );

    const input = screen.getByPlaceholderText(/tanvir_dev/i);
    fireEvent.change(input, { target: { value: "Rahim Creator" } });

    const submitBtn = screen.getByRole("button", { name: /সরাসরি ডাউনলোড করুন/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/auth/session",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ identifier: "Rahim Creator", password: "" }),
        })
      );
      expect(closeFn).toHaveBeenCalled();
      expect(proceedFn).toHaveBeenCalled();
    });
  });
});
