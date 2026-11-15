"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Square,
  Scissors,
  Mic,
  MicOff,
  Volume2,
  Sliders,
  RotateCcw,
  Upload,
  Download,
  Share2,
  Sparkles,
  Check,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  extractWaveformPeaks,
  trimAudioBuffer,
  applyFade,
  normalizeVolume,
  reverseAudioBuffer,
  apply3BandEq,
  generateSyntheticVoiceDemo,
  encodeWavBuffer,
  WaveformPeaks,
} from "@/lib/audio/waveform-daw-engine";

export function AudioEditorStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // Audio Data
  const [audioBuffer, setAudioBuffer] = useState<Float32Array | null>(null);
  const [sampleRate, setSampleRate] = useState<number>(44100);
  const [duration, setDuration] = useState<number>(0);

  // Playback & Selection
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // EQ Sliders
  const [lowGain, setLowGain] = useState(0);
  const [midGain, setMidGain] = useState(0);
  const [highGain, setHighGain] = useState(0);

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "audio-editor",
    toolName: "WebAudio Waveform DAW Studio",
  });

  // Initialize with synthetic demo voice
  useEffect(() => {
    const demo = generateSyntheticVoiceDemo(5.0, 44100);
    setAudioBuffer(demo);
    setSampleRate(44100);
    setDuration(demo.length / 44100);
    setTrimStart(0);
    setTrimEnd(demo.length / 44100);
  }, []);

  // Draw Waveform on Canvas
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#0A0A0C";
    ctx.fillRect(0, 0, W, H);

    // Grid center line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();

    // Waveform Peaks
    const peaks = extractWaveformPeaks(audioBuffer, W);
    const midY = H / 2;

    // Draw selection highlight
    if (duration > 0 && trimEnd > trimStart) {
      const selX1 = (trimStart / duration) * W;
      const selX2 = (trimEnd / duration) * W;
      ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
      ctx.fillRect(selX1, 0, selX2 - selX1, H);

      ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(selX1, 0);
      ctx.lineTo(selX1, H);
      ctx.moveTo(selX2, 0);
      ctx.lineTo(selX2, H);
      ctx.stroke();
    }

    // Draw Audio Waveform bars
    ctx.fillStyle = "#F59E0B";
    for (let x = 0; x < W; x++) {
      const minVal = peaks.min[x];
      const maxVal = peaks.max[x];

      const top = midY - maxVal * (H * 0.42);
      const bottom = midY - minVal * (H * 0.42);
      const barH = Math.max(2, bottom - top);

      ctx.fillRect(x, top, 1, barH);
    }

    // Playhead line
    if (duration > 0) {
      const playX = (currentTime / duration) * W;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playX, 0);
      ctx.lineTo(playX, H);
      ctx.stroke();
    }
  }, [audioBuffer, duration, currentTime, trimStart, trimEnd]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  // Audio Playback Engine
  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch {}
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const startPlayback = () => {
    if (!audioBuffer) return;
    stopPlayback();

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const buffer = ctx.createBuffer(1, audioBuffer.length, sampleRate);
    buffer.copyToChannel(new Float32Array(audioBuffer), 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const startOffset = currentTime >= duration ? 0 : currentTime;
    source.start(0, startOffset);
    sourceNodeRef.current = source;
    setIsPlaying(true);
    sound.launch();

    const playStart = Date.now() - startOffset * 1000;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - playStart) / 1000;
      if (elapsed >= duration) {
        setCurrentTime(0);
        setIsPlaying(false);
        clearInterval(interval);
      } else {
        setCurrentTime(elapsed);
      }
    }, 40);

    source.onended = () => {
      setIsPlaying(false);
      clearInterval(interval);
    };
  };

  // DSP Actions
  const handleTrim = () => {
    if (!audioBuffer) return;
    const trimmed = trimAudioBuffer(audioBuffer, sampleRate, trimStart, trimEnd);
    if (trimmed.length > 0) {
      stopPlayback();
      setAudioBuffer(trimmed);
      const newDur = trimmed.length / sampleRate;
      setDuration(newDur);
      setTrimStart(0);
      setTrimEnd(newDur);
      setCurrentTime(0);
      sound.confirm();
    }
  };

  const handleFade = () => {
    if (!audioBuffer) return;
    const copy = new Float32Array(audioBuffer);
    applyFade(copy, sampleRate, 0.4, 0.4);
    setAudioBuffer(copy);
    sound.click();
  };

  const handleNormalize = () => {
    if (!audioBuffer) return;
    const copy = new Float32Array(audioBuffer);
    normalizeVolume(copy, 0.95);
    setAudioBuffer(copy);
    sound.click();
  };

  const handleReverse = () => {
    if (!audioBuffer) return;
    const rev = reverseAudioBuffer(audioBuffer);
    setAudioBuffer(rev);
    sound.click();
  };

  const handleApplyEq = () => {
    if (!audioBuffer) return;
    const processed = apply3BandEq(audioBuffer, sampleRate, lowGain, midGain, highGain);
    setAudioBuffer(processed);
    sound.levelUp();
  };

  // Mic Recording
  const startRecording = async () => {
    stopPlayback();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const arrayBuf = await audioBlob.arrayBuffer();

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const tempCtx = new AudioContextClass();
        const decoded = await tempCtx.decodeAudioData(arrayBuf);

        const channel = decoded.getChannelData(0);
        setAudioBuffer(new Float32Array(channel));
        setSampleRate(decoded.sampleRate);
        const dur = decoded.duration;
        setDuration(dur);
        setTrimStart(0);
        setTrimEnd(dur);
        setCurrentTime(0);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      sound.launch();
    } catch (err) {
      console.error("Mic access failed:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      sound.confirm();
    }
  };

  // Upload Audio
  const handleUploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopPlayback();
    const arrayBuf = await file.arrayBuffer();
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const tempCtx = new AudioContextClass();
    const decoded = await tempCtx.decodeAudioData(arrayBuf);

    const channel = decoded.getChannelData(0);
    setAudioBuffer(new Float32Array(channel));
    setSampleRate(decoded.sampleRate);
    setDuration(decoded.duration);
    setTrimStart(0);
    setTrimEnd(decoded.duration);
    setCurrentTime(0);
    sound.confirm();
  };

  // Export 16-Bit PCM WAV
  const handleExportWav = () => {
    if (!audioBuffer) return;
    triggerExport(() => {
      sound.shutter();
      const wavArrayBuffer = encodeWavBuffer(audioBuffer, sampleRate);
      const blob = new Blob([wavArrayBuffer], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sabbir-daw-audio-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const getSharePayload = () => {
    return {
      type: "audio-daw-snapshot",
      durationSec: duration,
      sampleRate,
      lowGain,
      midGain,
      highGain,
      createdAt: new Date().toISOString(),
    };
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="audio-editor"
        toolName="WebAudio Waveform DAW Studio"
        category="Audio Studio"
        onExportClick={handleExportWav}
        getSharePayload={getSharePayload}
      />

      {/* Main DAW Surface */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 sm:p-7 backdrop-blur-md space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <button
                onClick={startPlayback}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </button>
            ) : (
              <button
                onClick={stopPlayback}
                className="flex items-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-700 transition-colors"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={() => {
                stopPlayback();
                setCurrentTime(0);
              }}
              title="Stop & Reset Playhead"
              className="p-2 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white"
            >
              <Square className="w-4 h-4" />
            </button>

            {/* Mic Record Button */}
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Record Mic</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white animate-pulse"
              >
                <MicOff className="w-3.5 h-3.5" />
                <span>Stop Recording</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Import Audio</span>
              <input type="file" accept="audio/*" onChange={handleUploadAudio} className="hidden" />
            </label>

            <button
              onClick={() => {
                const demo = generateSyntheticVoiceDemo(5.0, 44100);
                setAudioBuffer(demo);
                setDuration(5.0);
                setTrimStart(0);
                setTrimEnd(5.0);
                setCurrentTime(0);
                sound.click();
              }}
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-400 hover:text-white"
            >
              Reset Demo Track
            </button>
          </div>
        </div>

        {/* Waveform Canvas View */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>Time: {currentTime.toFixed(2)}s / {duration.toFixed(2)}s</span>
            <span>Trim Selection: {trimStart.toFixed(2)}s - {trimEnd.toFixed(2)}s</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-inner">
            <canvas
              ref={canvasRef}
              width={900}
              height={180}
              className="w-full h-44 cursor-crosshair block"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = clickX / rect.width;
                setCurrentTime(pct * duration);
              }}
            />
          </div>

          {/* Region Sliders */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <span className="text-[11px] text-neutral-400">Selection Start: {trimStart.toFixed(2)}s</span>
              <input
                type="range"
                min={0}
                max={Math.max(0.1, duration)}
                step={0.05}
                value={trimStart}
                onChange={(e) => setTrimStart(Math.min(parseFloat(e.target.value), trimEnd - 0.1))}
                className="w-full accent-amber-500"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-neutral-400">Selection End: {trimEnd.toFixed(2)}s</span>
              <input
                type="range"
                min={0}
                max={Math.max(0.1, duration)}
                step={0.05}
                value={trimEnd}
                onChange={(e) => setTrimEnd(Math.max(parseFloat(e.target.value), trimStart + 0.1))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Action Toolbelt: Trim, Fade, Normalize, EQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
          {/* Audio Processors */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Waveform Operations
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleTrim}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors"
              >
                <Scissors className="w-3.5 h-3.5 text-amber-400" />
                <span>Crop Selection</span>
              </button>
              <button
                onClick={handleFade}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors"
              >
                <span>Fade In / Out</span>
              </button>
              <button
                onClick={handleNormalize}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors"
              >
                <span>Normalize (-0.5dB)</span>
              </button>
              <button
                onClick={handleReverse}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors"
              >
                <span>Reverse Playback</span>
              </button>
            </div>
          </div>

          {/* 3-Band Parametric EQ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Vocal 3-Band EQ
              </h3>
              <button
                onClick={handleApplyEq}
                className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20"
              >
                Apply EQ
              </button>
            </div>

            <div className="space-y-2">
              {[
                { label: "Low (100 Hz)", val: lowGain, set: setLowGain },
                { label: "Mid (1 kHz - Vocal)", val: midGain, set: setMidGain },
                { label: "High (8 kHz - Air)", val: highGain, set: setHighGain },
              ].map((band) => (
                <div key={band.label} className="space-y-0.5">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>{band.label}</span>
                    <span className="font-mono">{band.val > 0 ? `+${band.val}` : band.val} dB</span>
                  </div>
                  <input
                    type="range"
                    min={-12}
                    max={12}
                    step={1}
                    value={band.val}
                    onChange={(e) => band.set(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Master Export Bar */}
        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={handleExportWav}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Export 16-Bit PCM WAV (+25 XP)</span>
          </button>
        </div>
      </div>

      {GateModal}
    </div>
  );
}
