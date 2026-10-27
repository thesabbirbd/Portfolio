# THE SABBiR — Phase 12 Report: Optional Sound FX

**Date:** 2026-10-28 · **Git:** local only.

## Phase / status
**Complete.** Minimal, safe version: original procedural Web Audio tones, no audio files, no new dependency.

## Observed problems (existing `src/lib/sound.ts`)
- Off by default and persisted, which was good. But:
  - **Any later call** (including hover) could create or resume the AudioContext, whether or not a user gesture was involved.
  - Two-note cues used `setTimeout`, so rapid triggers could **queue up**.
  - Nothing throttled repeats.
  - Turning sound off left the context running.
  - Oscillator and gain nodes were never disconnected.
- **A hover sound** fired on every "My World" card `mouseenter`. The brief forbids sound for mouse movement.
- **No volume setting** and no explicit test-sound control.
- `ProjectModal` played its "open" cue twice (click handler and effect). Its cleanup also forced `body.style.overflow = "auto"` instead of restoring the previous value.
- The timeline's `sabbir:milestone` hook (Phase 7) fired on mount and had no listener.

## Decisions
- **Gesture-gated audio.** The AudioContext is only created or resumed from a user gesture: the Settings switch, clicks, or the test button. Scroll-driven cues **never** unlock audio. If no running context exists yet, a milestone is silently skipped.
- **Scheduling on the audio clock** (`osc.start(t + delay)`), plus a per-cue minimum gap: 60ms for clicks, 200–250ms for chords, **1.2s for milestones**. Repeats of the same milestone are ignored (scroll jitter). Nothing can stack.
- **Off means off immediately:** the flag flips and the context is suspended.
- **Sound palette** (all subtle, under 0.04 gain, behind a master gain):

  | Cue | Sound |
  |---|---|
  | Click | Soft triangle tick |
  | Switch | Short sine |
  | Panel open | Two-note rise |
  | Copy / preference confirmation and test sound | Two-note chord |
  | Timeline milestone | Quiet two-note accent |

- **Volume:** a simple Quiet/Normal setting (master gain 0.45 or 1.0), persisted, with a preview on change.
- The reduced-motion setting is independent of sound, as the brief requires.

## Changes implemented
- `src/lib/sound.ts`, rewritten:
  - `ensure(fromGesture)`, a master gain, `play(name, notes, { gesture, minGap })`, node cleanup on `ended`, and `suspend()` on disable.
  - `preview()`, `milestone(id)`, `setLevel()` / `getLevel()`.
  - Safe storage access. `SoundSystem` is exported for tests. `hover()` was removed.
- `src/contexts/SettingsContext.tsx`: `soundLevel` / `setSoundLevel`, and one global `sabbir:milestone` listener that calls `sound.milestone`.
- `src/components/about/JourneyTimeline.tsx`: dispatches only on real phase changes, not on mount.
- `src/components/ui/SettingsPanel.tsx`: the sound row describes exactly what plays ("off by default, never autoplays"). When on, it shows an inline Quiet/Normal segmented control and a **Test sound** button.
- `src/components/about/AboutSection.tsx`: hover sound removed.
- `src/components/projects/ProjectModal.tsx`: duplicate open cue removed; the body overflow is restored to its previous value.
- `src/lib/sound.test.ts`: two new tests:
  - a scroll milestone never constructs an AudioContext without a gesture;
  - sound is silent by default, and rapid repeats are throttled.
- **New** `scripts/qa/sound-audit.mjs`: instruments `AudioContext` before page scripts run and drives real CDP input gestures.

## Validation
- `pnpm test` **71/71** (was 69) · build pass · app `tsc` 0.
- **`sound-audit`: 6/6 checks pass** (headless Chrome, real input events):
  1. Fresh visit, with clicks and a full timeline scroll: **0 AudioContexts, 0 notes**.
  2. Enabling in Settings creates 1 context, plays the preview chord, and stores `"true"`.
  3. The Test sound button plays the preview.
  4. Disabling suspends the context and stores `"false"`. Later clicks play **0** notes.
  5. Returning visitor with sound stored ON, scrolling the timeline before any gesture: **0 contexts, 0 notes**.
  6. After one gesture, a timeline scroll through about 8 phases plays **1** throttled milestone cue.
- **Screenshot:** Settings at 390px, dark, sound on (volume and Test sound inline).

## Regressions / risks
- Tones were verified by instrumentation, not by listening. Subjective loudness on real speakers is untested. Gains are deliberately low and "Quiet" halves them.
- Safari's `webkitAudioContext` fallback is kept but untested here.

## Unresolved factual decisions
None.

## Next phase
Phase 13 — Whole-site interactions & deep-route integrity.
