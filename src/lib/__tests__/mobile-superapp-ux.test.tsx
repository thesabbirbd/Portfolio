import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MobileAppShellBar } from "@/components/workplace/MobileAppShellBar";

describe("Native Mobile Super-App UX 3.0 (Block 6 - Stages 056-065)", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders 3-tab segmented app bar with Bangla step labels", () => {
    const onTabChange = vi.fn();
    render(<MobileAppShellBar activeTab="input" onTabChange={onTabChange} />);

    expect(screen.getByText("১. ইনপুট")).toBeDefined();
    expect(screen.getByText("২. প্রিভিউ")).toBeDefined();
    expect(screen.getByText("৩. সেভ")).toBeDefined();
  });

  it("handles tab click switching correctly", () => {
    const onTabChange = vi.fn();
    render(<MobileAppShellBar activeTab="input" onTabChange={onTabChange} />);

    const previewTab = screen.getByText("২. প্রিভিউ");
    fireEvent.click(previewTab);

    expect(onTabChange).toHaveBeenCalledWith("preview");
  });

  it("renders 1-click demo sample preset chip when onLoadSample is provided", () => {
    const onTabChange = vi.fn();
    const onLoadSample = vi.fn();

    render(
      <MobileAppShellBar
        activeTab="input"
        onTabChange={onTabChange}
        onLoadSample={onLoadSample}
      />
    );

    const sampleBtn = screen.getByText("⚡ ১-ক্লিক ডেমো ডেটা");
    expect(sampleBtn).toBeDefined();

    fireEvent.click(sampleBtn);
    expect(onLoadSample).toHaveBeenCalledTimes(1);
  });

  it("renders sticky bottom action bar with download and share buttons", () => {
    const onDownload = vi.fn();
    const onShare = vi.fn();

    render(
      <MobileAppShellBar
        activeTab="export"
        onTabChange={() => {}}
        onDownload={onDownload}
        onShare={onShare}
        downloadLabel="ডাউনলোড (PDF)"
        shareLabel="ভিজ্যুয়াল শেয়ার"
        showStickyBottomBar={true}
      />
    );

    const downloadBtn = screen.getByText("ডাউনলোড (PDF)");
    const shareBtn = screen.getByText("ভিজ্যুয়াল শেয়ার");

    expect(downloadBtn).toBeDefined();
    expect(shareBtn).toBeDefined();

    fireEvent.click(downloadBtn);
    expect(onDownload).toHaveBeenCalledTimes(1);

    fireEvent.click(shareBtn);
    expect(onShare).toHaveBeenCalledTimes(1);
  });
});
