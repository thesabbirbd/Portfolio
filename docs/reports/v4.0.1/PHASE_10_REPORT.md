# THE SABBiR — v4.0.1 · Phase 10 Report: Sound FX

**Date:** 2026-10-29 · **Git:** local only — no commit, push, merge or deploy.

## Status
**PASS (with honest device limits).** `sound-audit` 8/8 in headless Chrome, 13 sound unit tests. The output level was measured from the app's real sound engine. I did not listen on physical laptop or phone speakers; see "Not tested".

## Root cause of "barely audible"
I followed the real signal chain in `src/lib/sound.ts` (before this phase):

| Stage | Before | Effect |
|---|---|---|
| Per-note peak | **0.016–0.035** | about −36 to −29 dBFS. This was the main cause. |
| "Quiet" level | × 0.45 on top | a second cut (double attenuation), about −36 dBFS |
| Envelope | hard start at peak, then exponential decay | small click at onset, short perceived loudness |
| Master to output | gain straight to the speakers | no safety stage, so raising gain would have risked clipping |

Typical OS UI sounds sit around −20 to −12 dBFS. The old cues were 15–20 dB below that, so even full system volume left them faint, especially on small phone speakers.

## What changed
**Signal chain:** oscillator → per-note envelope → master volume → **soft-clip limiter** → speakers.

- **Per-note peaks raised to 0.14–0.26**, with a 6 ms attack ramp so the onset does not pop.
  - Low "square" cues (error, terminal submit) are kept at 0.07–0.08, because square waves carry much more energy.
- **Real volume slider (10–100 %, default 70 %).**
  - A perceptual curve maps the slider to master gain: 10 % → 0.26, 70 % → 0.62, 100 % → 1.
  - It is persisted as `sabbir_portfolio_sound_volume`. The old `quiet` setting migrates to 35 %.
  - Volume changes ramp smoothly (`setTargetAtTime`), so dragging makes no zipper noise.
- **Quiet is still audible.** The slider floor is 10 %, about −24 dBFS, which is still louder than the old *normal*.
- **Off is a true mute.** Nothing is scheduled at all, and the AudioContext is suspended.
- **Limiter:** a `WaveShaper` curve that is **exactly linear up to ±0.5**, where every single cue sits, and bends overlaps smoothly below ±0.87. The output therefore cannot clip.
  - A `DynamicsCompressor` was tried first and **rejected on evidence**. Chrome applies automatic makeup gain and level-dependent compression, which made 70 % and 100 % sound the same (−11.2 vs −11.3 dBFS).
- **Storm guard:**
  - a minimum gap per cue (50 ms for clicks, up to 1.2 s for milestones);
  - **at most 8 simultaneous voices**;
  - a short `stop` padding, with nodes disconnected on end.

### Sound categories (all original Web Audio synthesis, no samples)

| Cue | Used by |
|---|---|
| `click`: subtle tap | ordinary buttons, chips, filters, photo modes |
| `confirm` / `success`: CTA confirm | contact form handed to the mail app, success toasts |
| `navigate`: upward glide | nav links (desktop and phone), the logo, command-menu actions, the dock's Contact item, Footer "back to top" |
| `modalOpen` / `modalClose` | Settings open/close, command menu (⌘K / "/" / nav search), terminal launcher, project modal close |
| `type`: throttled tick (≥ 70 ms apart) | typing in the global terminal and the Lab terminal; never one per character |
| `terminalSubmit` | terminal command accepted |
| `error` / attention | unknown terminal command, blocked clipboard, error toasts |
| `copy`: rising triad | CopyButton, **only after the clipboard write succeeds** |
| `themeSwitch` | light/dark/system, colour theme, Randomize, the dock's theme toggle |
| `toggleSwitch` | 3D toggle (nav and dock) |
| `milestone` | career timeline phase change: scroll-driven, never unlocks audio, ≥ 1.2 s apart |
| `swipe` | defined, but **not wired**: the site has no swipe/drag gesture today, and I did not invent one |

**Side fix:** `CopyButton` previously showed "Copied!" even when the clipboard write failed. It now awaits the write and only confirms on success.

### Settings UI
When Sound effects is on, Settings shows:
- a **native `<input type="range">`** labelled "Sound volume", with `aria-valuetext`;
- keyboard support (arrows, Home, End, Page keys);
- a 40 px tall hit area with a filled track in the theme colour;
- a % read-out and a **Test sound** button.

Releasing the slider auditions the new level once, rather than on every step.

The Motion and Sound toggles stay independent. Sound is never the only signal: every cue accompanies visible text or state.

## Evidence

**`scripts/qa/sound-audit.mjs`: 8/8 PASS**

1. Fresh visit, clicks and timeline scroll: **0 AudioContexts, 0 notes**.
2. Turning sound on in Settings (a real CDP click) creates one context and plays the preview.
3. The Test sound button plays.
4. The volume slider works by keyboard (Home → 10), is labelled, persists, and auditions the level.
5. Turning sound off suspends the context, and no notes play afterwards.
6. A returning visitor with sound ON hears nothing before a gesture: scroll milestones stay silent.
7. After a gesture, milestone cues play, throttled (2 cues for a full timeline scroll).
8. **Output level**, rendered sample-exact from the app's own engine through an `OfflineAudioContext`:

| Volume | Peak | Old engine (for comparison) |
|---|---|---|
| 100 % | **−12.6 dBFS** | — |
| 70 % (default) | **−16.8 dBFS** | "normal" ≈ −29 dBFS |
| 10 % (floor) | **−24.4 dBFS** | "quiet" ≈ −36 dBFS |

The levels rise with the slider, and the peak stays below 0 dBFS. The default is **≈ 12 dB louder** than before, roughly 4× the amplitude.

**Unit tests (`src/lib/sound.test.ts`, 13):**
- default off;
- policy-blocked contexts don't throw;
- no context without a gesture;
- throttling;
- volume default, clamp and persistence;
- legacy migration;
- the gain curve;
- the limiter sits before the destination;
- peaks are ≥ 0.14 and ≤ 0.3;
- true mute;
- the voice cap;
- the limiter curve is linear and bounded;
- typing ticks are throttled.

## Not tested (limitations, stated honestly)
- **No physical listening test.** I could not listen through laptop or phone speakers. The levels above are measured digital output; perceived loudness also depends on the device and OS volume.
- **iOS Safari:** Web Audio follows the ring/silent switch on many iPhones, so cues can be silent while the switch is on silent. The code resumes the context inside the tap that enables sound, which is the documented unlock path. It has not been verified on a real iPhone.
- **Android Chrome:** not tested on a device. The same gesture rules apply as in desktop Chrome.

## Gate
**PASS** for the automated checks. Desktop and mobile *speaker* checks remain for the owner. Use **Settings → Sound effects → Test sound** at 10 %, 70 % and 100 %.
