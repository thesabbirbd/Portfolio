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
    expect(screen.getByText(/Claim Your Output & Earn Points/i)).toBeDefined();
    expect(screen.getByRole("tab", { name: /Guest Export/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /Full Account/i })).toBeDefined();
  });

  it("switches tabs between Guest Export and Full Account", () => {
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

    // Click Full Account tab
    const fullAccountTab = screen.getByRole("tab", { name: /Full Account/i });
    fireEvent.click(fullAccountTab);

    expect(screen.getByText(/Display Name \*/i)).toBeDefined();
    expect(screen.getByText(/Passcode \*/i)).toBeDefined();
  });

  it("submits guest name, receives +25 welcome XP, and calls proceed callback", async () => {
    const proceedFn = vi.fn();
    const closeFn = vi.fn();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          id: "usr-guest-1",
          handle: "rahim_creator",
          displayName: "Rahim Creator",
          role: "guest",
          totalXp: 25,
          exportsCount: 0,
        },
        sessionToken: "mock.session.token",
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

    const input = screen.getByPlaceholderText(/e\.g\. Rahim Coder/i);
    fireEvent.change(input, { target: { value: "Rahim Creator" } });

    const submitBtn = screen.getByRole("button", { name: /Download Now & Earn \+25 XP/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/workplace/auth",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ action: "guest", displayName: "Rahim Creator" }),
        })
      );
      expect(closeFn).toHaveBeenCalled();
      expect(proceedFn).toHaveBeenCalled();
    });
  });
});
