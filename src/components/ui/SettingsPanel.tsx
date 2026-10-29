"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Volume2, VolumeX, Sun, Moon, Monitor, Eye, Sparkles, Shuffle } from "lucide-react";
import { useTheme } from "next-themes";
import { sound, type SoundLevel } from "@/lib/sound";
import { useSettings } from "@/contexts/SettingsContext";
import { OPEN_SETTINGS } from "@/lib/ui-events";
import { THEME_COLORS, THEME_META } from "@/lib/theme-color";
import { useThemeColor, useThemeSource, setThemeColor, randomizeThemeColor } from "@/lib/theme-color-store";
import { useNavVisibility } from "@/hooks/useNavVisibility";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CONTROL_SPRING, MOBILE_CORNER_RAISE } from "@/lib/fixed-controls";
import { Segmented, Switch } from "@/components/system/Controls";

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const colorTheme = useThemeColor();
  const themeSource = useThemeSource();
  const { spatial3D, toggle3D, reducedMotion, toggleMotion, soundEnabled, toggleSound, soundLevel, setSoundLevel, isHydrated } = useSettings();

  const { isNavHidden } = useNavVisibility();
  const isDesktop = useMediaQuery('(min-width: 768px)', true);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Other UI (e.g. the theme toast's "Change" button) opens Settings through a global event.
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(OPEN_SETTINGS, open);
    return () => window.removeEventListener(OPEN_SETTINGS, open);
  }, []);

  // Dialog focus management: move focus in on open, keep Tab inside, return it to the gear on close.
  useEffect(() => {
    if (!isOpen) return;
    const trigger = triggerRef.current;
    const t = setTimeout(() => closeRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button, [href], input, [tabindex]:not([tabindex='-1'])");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [isOpen]);

  if (!isHydrated) return null;


  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        ref={triggerRef}
        initial={false}
        animate={{ y: (!isDesktop && !isNavHidden) ? -MOBILE_CORNER_RAISE : 0 }}
        transition={CONTROL_SPRING}
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) sound.modalClose(); else sound.modalOpen();
        }}
        aria-label="Open System Settings"
        aria-expanded={isOpen}
        className="group fixed bottom-4 right-4 md:bottom-6 md:right-6 short-landscape:bottom-3 short-landscape:right-3 z-[46] mb-[env(safe-area-inset-bottom)] mr-[env(safe-area-inset-right)] p-3 print:hidden will-change-transform rounded-full surface-control text-ink-2 hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <Settings className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" />
      </motion.button>

      {/* Settings dialog — level-3 glass overlay; segmented theme/palette, accessible switches */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/40"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="relative w-full max-w-md max-h-[calc(100svh-1.5rem)] overflow-y-auto p-5 sm:p-6 rounded-panel surface-overlay deco-corners"
            >
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
                  <h2 id="settings-title" className="text-lg font-bold text-ink">Experience settings</h2>
                </div>
                <button
                  ref={closeRef}
                  onClick={() => { setIsOpen(false); sound.modalClose(); }}
                  className="p-1.5 rounded-lg text-ink-3 hover:text-ink hover:bg-ink/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  aria-label="Close settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-5 space-y-5 text-sm">
                <section className="space-y-2">
                  <h3 className="font-mono text-eyebrow uppercase text-ink-3">Theme</h3>
                  <Segmented
                    label="Theme"
                    value={(theme as "light" | "dark" | "system") ?? "system"}
                    onChange={(v) => { setTheme(v); sound.themeSwitch(); }}
                    options={[
                      { value: "light", label: "Light", icon: <Sun className="w-4 h-4" aria-hidden="true" /> },
                      { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" aria-hidden="true" /> },
                      { value: "system", label: "System", icon: <Monitor className="w-4 h-4" aria-hidden="true" /> },
                    ]}
                  />
                </section>

                <section className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-mono text-eyebrow uppercase text-ink-3">Colour theme</h3>
                    <button
                      type="button"
                      onClick={() => { randomizeThemeColor(); sound.themeSwitch(); }}
                      className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-ink-2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      <Shuffle className="w-3.5 h-3.5" aria-hidden="true" /> Randomize
                    </button>
                  </div>
                  <Segmented
                    label="Colour theme"
                    value={colorTheme ?? "orange"}
                    onChange={(v) => { setThemeColor(v); sound.themeSwitch(); }}
                    options={THEME_COLORS.map((c) => ({
                      value: c,
                      label: THEME_META[c].label,
                      icon: <span aria-hidden="true" className="w-3 h-3 rounded-full" style={{ background: THEME_META[c].swatch }} />,
                    }))}
                  />
                  {colorTheme && (
                    <p className="text-xs text-ink-3" aria-live="polite">
                      {THEME_META[colorTheme].family} · {THEME_META[colorTheme].detail} —{" "}
                      {themeSource === "saved" ? "saved on this device" : "picked at random for this visit"}
                    </p>
                  )}
                </section>

                <section className="space-y-2">
                  <h3 className="font-mono text-eyebrow uppercase text-ink-3">Experience</h3>
                  <div className="rounded-card surface-card p-3.5 mb-2">
                    <div className="flex items-center gap-3">
                      {/* Speaker = mute toggle (true mute, remembered). */}
                      <button
                        type="button"
                        onClick={toggleSound}
                        aria-pressed={soundEnabled}
                        aria-label={soundEnabled ? "Mute sound effects" : "Turn sound effects on"}
                        title={soundEnabled ? "Mute" : "Unmute"}
                        className={`grid place-items-center w-11 h-11 shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${soundEnabled ? "border-primary/40 bg-primary/10 text-primary" : "border-line text-ink-3 hover:text-ink"}`}
                      >
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-ink">Sound effects {soundEnabled ? "" : "· muted"}</div>
                        <div className="text-xs text-ink-3">Taps, scroll ticks, timeline clock and chapter cuts. Starts after your first tap.</div>
                      </div>
                    </div>
                    <div className={`mt-3 flex items-center gap-2 ${soundEnabled ? "" : "opacity-50"}`}>
                      <div className="flex-1 min-w-0">
                        <Segmented<SoundLevel>
                          label="Sound level"
                          value={soundLevel}
                          onChange={(v) => { if (!soundEnabled) toggleSound(); setSoundLevel(v); }}
                          options={[
                            { value: "low", label: "Low" },
                            { value: "medium", label: "Medium" },
                            { value: "high", label: "High" },
                          ]}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => sound.preview()}
                        disabled={!soundEnabled}
                        className="shrink-0 min-h-10 px-3 rounded-lg border border-line text-sm font-medium text-ink-2 hover:text-ink hover:border-line-strong transition-colors disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      >
                        Test
                      </button>
                    </div>
                  </div>
                  <ul className="rounded-card surface-card divide-y divide-border">
                    {[
                      { icon: Eye, title: "3D & spatial effects", desc: "Ambient hero video & interactive globe (uses more GPU). The 3D backdrop is always on and lightweight.", checked: spatial3D, onChange: toggle3D },
                      { icon: Sparkles, title: "Animations", desc: "Turn off for reduced motion (your OS setting is always respected)", checked: !reducedMotion, onChange: toggleMotion },
                    ].map(({ icon: Icon, title, desc, checked, onChange }) => (
                      <li key={title} className="p-3.5">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-start gap-3 min-w-0">
                            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${checked ? "text-primary" : "text-ink-3"}`} aria-hidden="true" />
                            <div className="min-w-0">
                              <div className="font-medium text-ink">{title}</div>
                              <div className="text-xs text-ink-3">{desc}</div>
                            </div>
                          </div>
                          <Switch checked={checked} onChange={onChange} label={title} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="pt-3 border-t border-line text-center text-xs text-ink-3">
                Preferences are saved on this device · THE SABBiR
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
