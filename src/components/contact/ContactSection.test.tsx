import { render, screen, act, fireEvent, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ContactSection } from "./ContactSection";
import React from "react";

// Mock framer-motion minimally to avoid useMotionValue errors inside children components
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }: any) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
        return <div {...rest}>{children}</div>;
      },
      button: ({ children, ...props }: any) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
        return <button {...rest}>{children}</button>;
      },
      span: ({ children, ...props }: any) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
        return <span {...rest}>{children}</span>;
      },
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useReducedMotion: () => false,
  };
});

vi.mock("@/lib/sound", () => ({
  sound: {
    click: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("@/data/socials", () => ({
  SOCIAL_LINKS: [{ id: "linkedin", url: "https://linkedin.com/in/test" }],
}));

const mockClipboard = {
  writeText: vi.fn(),
};

// Use element scrollIntoView mock to avoid jsdom errors
window.HTMLElement.prototype.scrollIntoView = vi.fn();
// For touch devices check
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("ContactSection", () => {
  let originalLocation: Location;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
      configurable: true,
    });

    // Mock window.location
    originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' } as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.location = originalLocation;
    cleanup();
  });

  it("renders initial state correctly", () => {
    render(<ContactSection />);

    // Check initial prompt
    expect(screen.getByText(/01/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose a reason/i)).toBeInTheDocument();

    // Check intents
    expect(screen.getAllByRole("radio", { name: /Career \/ Hiring/i })[0]).toBeInTheDocument();

    // Initial empty state message
    expect(screen.getByText(/Pick a reason to open the form/i)).toBeInTheDocument();
  });

  it("shows form when an intent is selected", async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    const intentButton = screen.getAllByRole("radio", { name: /Career \/ Hiring/i })[0];
    await user.click(intentButton);

    // Form elements should appear
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
  });

  it("handles form submission properly", async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    // 1. Select intent
    await user.click(screen.getAllByRole("radio", { name: /Collaboration/i })[0]);

    // 2. Fill form
    await user.type(screen.getByLabelText(/Name/i), "John Doe");
    await user.type(screen.getByLabelText(/Email/i), "john@example.com");
    await user.type(screen.getByLabelText(/Message/i), "Let's work together!");

    // 3. Submit directly testing the form element
    const submitBtn = screen.getByRole("button", { name: /Compose in email app/i });
    const form = submitBtn.closest("form");
    fireEvent.submit(form!);

    // 4. Verify success state
    expect(await screen.findByText(/Draft opened in your email app/i)).toBeInTheDocument();

    // 5. Verify mailto link format
    const expectedSubject = "Inquiry: Collaboration";
    const expectedBody = "Name: John Doe\nEmail: john@example.com\n\nMessage:\nLet's work together!";

    expect(window.location.href).toContain(encodeURIComponent(expectedSubject));
    expect(window.location.href).toContain(encodeURIComponent(expectedBody));
  });

  it("silently ignores submission if honeypot is filled", async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    // Select intent
    await user.click(screen.getAllByRole("radio", { name: /General/i })[0]);

    // Fill required fields
    await user.type(screen.getByLabelText(/Name/i), "Spammer");
    await user.type(screen.getByLabelText(/Email/i), "spam@spam.com");
    await user.type(screen.getByLabelText(/Message/i), "Spam message");

    // Fill honeypot
    const honeypot = document.querySelector('input[name="_honey"]') as HTMLInputElement;
    fireEvent.change(honeypot, { target: { value: "I am a bot" } });

    // Submit
    const submitBtn = screen.getByRole("button", { name: /Compose in email app/i });
    const form = submitBtn.closest("form");
    fireEvent.submit(form!);

    // Success state should NOT show
    expect(screen.queryByText(/Draft opened in your email app/i)).not.toBeInTheDocument();
    expect(window.location.href).toBe("");
  });

  it("allows returning to edit message from success screen", async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    // Setup and submit
    await user.click(screen.getAllByRole("radio", { name: /General/i })[0]);
    await user.type(screen.getByLabelText(/Name/i), "Test");
    await user.type(screen.getByLabelText(/Email/i), "test@test.com");
    await user.type(screen.getByLabelText(/Message/i), "Test message");

    const submitBtn = screen.getByRole("button", { name: /Compose in email app/i });
    const form = submitBtn.closest("form");
    fireEvent.submit(form!);

    // Verify we are on success screen
    expect(await screen.findByText(/Draft opened in your email app/i)).toBeInTheDocument();

    // Click Edit message
    await user.click(screen.getByRole("button", { name: /Edit message/i }));

    // Form should be back with values preserved
    expect(screen.queryByText(/Draft opened in your email app/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toHaveValue("Test");
  });

  it("handles copy draft functionality", async () => {
    vi.useFakeTimers();

    render(<ContactSection />);

    // Setup and submit
    const intentBtn = screen.getAllByRole("radio", { name: /General/i })[0];
    fireEvent.click(intentBtn);

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: "Test message" } });

    const submitBtn = screen.getByRole("button", { name: /Compose in email app/i });
    const form = submitBtn.closest("form");
    fireEvent.submit(form!);

    // Wait for success screen
    expect(screen.getByText(/Draft opened in your email app/i)).toBeInTheDocument();

    // Click Copy using fireEvent since userEvent + fake timers causes timeouts
    mockClipboard.writeText.mockResolvedValueOnce(undefined);
    const copyBtn = screen.getByRole("button", { name: /Copy draft/i });

    // Need to await act for async handler
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(mockClipboard.writeText).toHaveBeenCalled();

    // Verify "Copied" text appears
    expect(screen.getByText(/Copied/i)).toBeInTheDocument();

    // Advance timers to clear "Copied" text
    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(screen.getByRole("button", { name: /Copy draft/i })).toBeInTheDocument();
    expect(screen.queryByText(/Copied/i)).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
