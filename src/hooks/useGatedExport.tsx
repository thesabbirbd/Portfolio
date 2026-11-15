"use client";

import React, { useState, useCallback, useRef } from "react";
import { useWorkplaceAuth } from "@/contexts/WorkplaceAuthContext";
import { ExportAuthGateModal } from "@/components/workplace/ExportAuthGateModal";
import { sound } from "@/lib/sound";

export interface GatedExportOptions {
  toolSlug: string;
  toolName: string;
  onSuccess?: () => void;
}

export function useGatedExport(defaultOptions?: Partial<GatedExportOptions>) {
  const { user, isAuthenticated, recordExport } = useWorkplaceAuth();

  const [isGateOpen, setIsGateOpen] = useState(false);
  const [activeToolName, setActiveToolName] = useState(defaultOptions?.toolName || "Studio Output");
  const [activeToolSlug, setActiveToolSlug] = useState(defaultOptions?.toolSlug || "studio");
  const [xpToast, setXpToast] = useState<{ show: boolean; delta: number; message: string } | null>(null);

  const pendingExportFnRef = useRef<(() => void | Promise<void>) | null>(null);

  const triggerExport = useCallback(
    async (
      exportCallback: () => void | Promise<void>,
      customSlug?: string,
      customName?: string
    ) => {
      const slug = customSlug || defaultOptions?.toolSlug || activeToolSlug;
      const name = customName || defaultOptions?.toolName || activeToolName;
      setActiveToolSlug(slug);
      setActiveToolName(name);

      if (!isAuthenticated) {
        // Unauthenticated -> hold export callback and show auth gate modal
        pendingExportFnRef.current = exportCallback;
        setIsGateOpen(true);
        sound.modalOpen();
        return;
      }

      // Already authenticated -> execute export and award XP
      try {
        await Promise.resolve(exportCallback());
        const awardedXp = await recordExport(slug);
        sound.milestone(`export-${slug}`);

        // Show XP Celebration Toast
        setXpToast({
          show: true,
          delta: awardedXp,
          message: `+${awardedXp} XP Awarded! Recorded on Leaderboard`,
        });

        setTimeout(() => {
          setXpToast(null);
        }, 3500);

        if (defaultOptions?.onSuccess) {
          defaultOptions.onSuccess();
        }
      } catch (err) {
        console.error("Export execution error:", err);
      }
    },
    [isAuthenticated, recordExport, defaultOptions, activeToolSlug, activeToolName]
  );

  const handleAuthenticatedProceed = useCallback(async () => {
    setIsGateOpen(false);
    if (pendingExportFnRef.current) {
      const cb = pendingExportFnRef.current;
      pendingExportFnRef.current = null;
      try {
        await Promise.resolve(cb());
        const awardedXp = await recordExport(activeToolSlug);
        sound.confirm();

        setXpToast({
          show: true,
          delta: awardedXp,
          message: `+${awardedXp} XP Awarded! Welcome to THE SABBiR OS Workplace`,
        });

        setTimeout(() => {
          setXpToast(null);
        }, 3500);
      } catch (err) {
        console.error("Post-auth export execution error:", err);
      }
    }
  }, [activeToolSlug, recordExport]);

  const closeGate = useCallback(() => {
    setIsGateOpen(false);
    pendingExportFnRef.current = null;
  }, []);

  const GateModal = (
    <>
      <ExportAuthGateModal
        isOpen={isGateOpen}
        onClose={closeGate}
        toolName={activeToolName}
        onAuthenticatedProceed={handleAuthenticatedProceed}
      />
      {xpToast?.show && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[120] flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-neutral-900/95 px-4 py-3 shadow-2xl text-white backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-lg text-amber-400 font-bold border border-amber-500/40">
            ⚡
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300">+{xpToast.delta} XP Earned!</div>
            <div className="text-[11px] text-neutral-400">{xpToast.message}</div>
          </div>
        </div>
      )}
    </>
  );

  return {
    triggerExport,
    triggerGatedExport: triggerExport,
    isGateOpen,
    closeGate,
    activeToolName,
    xpToast,
    GateModal,
    AuthGateModalComponent: GateModal,
  };
}
