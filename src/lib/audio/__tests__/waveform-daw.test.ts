import { describe, it, expect } from "vitest";
import {
  encodeWavBuffer,
  trimAudioBuffer,
  applyFade,
  normalizeVolume,
  reverseAudioBuffer,
  generateSyntheticVoiceDemo,
  extractWaveformPeaks,
} from "../waveform-daw-engine";

describe("WebAudio Waveform DAW Engine (waveform-daw-engine.ts)", () => {
  it("encodes valid 16-bit PCM RIFF WAV headers according to RFC 2361", () => {
    const sampleRate = 44100;
    // 1 second of audio
    const samples = new Float32Array(sampleRate);
    for (let i = 0; i < samples.length; i++) {
      samples[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 0.5;
    }

    const wavBuffer = encodeWavBuffer(samples, sampleRate);
    expect(wavBuffer.byteLength).toBe(44 + sampleRate * 2);

    const view = new DataView(wavBuffer);
    // Check RIFF magic numbers
    const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
    expect(riff).toBe("RIFF");

    const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11));
    expect(wave).toBe("WAVE");

    // Format chunk
    expect(view.getUint16(20, true)).toBe(1); // PCM format
    expect(view.getUint16(22, true)).toBe(1); // 1 channel
    expect(view.getUint32(24, true)).toBe(sampleRate); // sample rate
    expect(view.getUint16(34, true)).toBe(16); // 16 bits per sample
  });

  it("accurately trims audio buffers by start and end seconds", () => {
    const sampleRate = 1000;
    const samples = new Float32Array(5000); // 5 seconds
    for (let i = 0; i < samples.length; i++) samples[i] = i;

    // Trim from 1.0s to 3.0s (2000 samples)
    const trimmed = trimAudioBuffer(samples, sampleRate, 1.0, 3.0);
    expect(trimmed.length).toBe(2000);
    expect(trimmed[0]).toBe(1000);
    expect(trimmed[trimmed.length - 1]).toBe(2999);
  });

  it("normalizes volume to target peak level", () => {
    const samples = new Float32Array([0.1, -0.2, 0.4, -0.5]);
    const gain = normalizeVolume(samples, 1.0);

    expect(gain).toBeCloseTo(2.0, 2);
    expect(Math.abs(samples[3])).toBeCloseTo(1.0, 2);
  });

  it("generates synthetic voice harmonic demo track", () => {
    const demo = generateSyntheticVoiceDemo(2.0, 44100);
    expect(demo.length).toBe(88200);

    const peaks = extractWaveformPeaks(demo, 100);
    expect(peaks.max.length).toBe(100);
    expect(peaks.min.length).toBe(100);
  });

  it("reverses audio samples in-place", () => {
    const samples = new Float32Array([1.0, 2.0, 3.0, 4.0]);
    const reversed = reverseAudioBuffer(samples);
    expect(Array.from(reversed)).toEqual([4.0, 3.0, 2.0, 1.0]);
  });
});
