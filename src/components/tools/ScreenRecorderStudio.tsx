"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Video,
  Monitor,
  Camera,
  Mic,
  MicOff,
  Circle,
  Square,
  Pause,
  Play,
  Download,
  Share2,
  FileText,
  Eye,
  Settings,
  Sparkles,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  compositeScreenAndWebcam,
  DEFAULT_STUDIO_CONFIG,
  PipCorner,
  ScreenStudioConfig,
} from "@/lib/video/screen-studio-engine";

export function ScreenRecorderStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);

  // Streams
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);

  // Config
  const [config, setConfig] = useState<ScreenStudioConfig>(DEFAULT_STUDIO_CONFIG);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Teleprompter
  const [showTeleprompter, setShowTeleprompter] = useState(true);
  const [teleprompterScript, setTeleprompterScript] = useState(
    "Welcome to THE SABBiR OS tutorial! Today we are showcasing the in-browser Screen Studio with zero cloud relay and zero watermarks."
  );

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "screen-recorder",
    toolName: "Screen & PiP Webcam Studio",
  });

  // Compositor Loop (60 FPS)
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      if (canvasRef.current) {
        compositeScreenAndWebcam(
          canvasRef.current,
          screenVideoRef.current,
          webcamVideoRef.current,
          config
        );
      }
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [config]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Request Screen Share
  const handleSelectScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1920, height: 1080, frameRate: 60 },
        audio: true,
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.muted = true;
      video.play();
      screenVideoRef.current = video;
      setScreenStream(stream);

      stream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
        screenVideoRef.current = null;
      };

      sound.launch();
    } catch (err) {
      console.warn("Screen share cancelled:", err);
    }
  };

  // Request Webcam
  const handleToggleWebcam = async () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach((t) => t.stop());
      webcamVideoRef.current = null;
      setWebcamStream(null);
      sound.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, frameRate: 30 },
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.muted = true;
      video.play();
      webcamVideoRef.current = video;
      setWebcamStream(stream);
      sound.confirm();
    } catch (err) {
      console.warn("Webcam access failed:", err);
    }
  };

  // Request Mic
  const handleToggleMic = async () => {
    if (micStream) {
      micStream.getTracks().forEach((t) => t.stop());
      setMicStream(null);
      sound.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      sound.confirm();
    } catch (err) {
      console.warn("Mic access failed:", err);
    }
  };

  // Start Recording
  const handleStartRecording = () => {
    if (!canvasRef.current) return;
    recordedChunksRef.current = [];
    setRecordedBlobUrl(null);
    setRecordingSeconds(0);

    const canvasStream = canvasRef.current.captureStream(60);

    // Combine audio tracks (screen audio + mic audio)
    const audioTracks: MediaStreamTrack[] = [];
    if (screenStream?.getAudioTracks().length) {
      audioTracks.push(...screenStream.getAudioTracks());
    }
    if (micStream?.getAudioTracks().length) {
      audioTracks.push(...micStream.getAudioTracks());
    }

    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioTracks,
    ]);

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : "video/webm";

    const recorder = new MediaRecorder(combinedStream, { mimeType });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedBlobUrl(url);
      setIsRecording(false);
      sound.levelUp();
    };

    recorder.start(1000);
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    setIsPaused(false);
    sound.launch();
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      sound.confirm();
    }
  };

  const handleDownloadVideo = () => {
    if (!recordedBlobUrl) return;
    triggerExport(() => {
      sound.shutter();
      const a = document.createElement("a");
      a.href = recordedBlobUrl;
      a.download = `sabbir-screen-recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getSharePayload = () => {
    return {
      type: "screen-recording-snapshot",
      recordedSeconds: recordingSeconds,
      pipCorner: config.pipCorner,
      hasWebcam: !!webcamStream,
      hasMic: !!micStream,
      createdAt: new Date().toISOString(),
    };
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="screen-recorder"
        toolName="Screen &amp; PiP Webcam Studio"
        category="Video Studio"
        onExportClick={recordedBlobUrl ? handleDownloadVideo : undefined}
        getSharePayload={getSharePayload}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Viewport */}
        <div className="lg:col-span-8 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md flex flex-col items-center justify-between min-h-[520px] relative overflow-hidden">
          {/* Top Studio Controls */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectScreen}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  screenStream
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-neutral-700 bg-neutral-800 text-neutral-200 hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{screenStream ? "Screen Sharing Active" : "1. Share Screen"}</span>
              </button>

              <button
                onClick={handleToggleWebcam}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  webcamStream
                    ? "border-amber-500 bg-amber-500/10 text-amber-300"
                    : "border-neutral-700 bg-neutral-800 text-neutral-200 hover:text-white"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{webcamStream ? "Webcam ON" : "2. Add Webcam PiP"}</span>
              </button>

              <button
                onClick={handleToggleMic}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  micStream
                    ? "border-blue-500 bg-blue-500/10 text-blue-300"
                    : "border-neutral-700 bg-neutral-800 text-neutral-200 hover:text-white"
                }`}
              >
                {micStream ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{micStream ? "Mic ON" : "Mic Audio"}</span>
              </button>
            </div>

            {/* Recording Timer Badge */}
            {isRecording && (
              <div className="flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs font-mono font-bold text-rose-300 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>REC {formatTimer(recordingSeconds)}</span>
              </div>
            )}
          </div>

          {/* Canvas Compositor Surface */}
          <div className="flex-1 flex items-center justify-center max-w-full max-h-[460px] p-2 relative w-full">
            <canvas
              ref={canvasRef}
              width={1920}
              height={1080}
              className="max-h-[420px] max-w-full rounded-2xl shadow-2xl border border-white/10 block object-contain"
            />

            {/* Floating Teleprompter Overlay */}
            {showTeleprompter && (
              <div className="absolute top-6 left-6 right-6 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 p-4 text-xs text-amber-300 shadow-2xl">
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mb-1">
                  <span>📜 Live Teleprompter (Invisible to Recording Output)</span>
                  <button onClick={() => setShowTeleprompter(false)} className="hover:text-white">✕</button>
                </div>
                <p className="font-sans text-sm leading-relaxed text-white font-medium">
                  {teleprompterScript}
                </p>
              </div>
            )}
          </div>

          {/* Master Record / Stop Bar */}
          <div className="w-full flex items-center justify-between border-t border-neutral-800 pt-4 mt-3">
            <div className="flex items-center gap-2">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2.5 text-xs font-bold text-white transition-colors shadow-lg shadow-rose-600/20"
                >
                  <Circle className="w-3.5 h-3.5 fill-current" />
                  <span>Start 1080p Recording</span>
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="flex items-center gap-2 rounded-xl bg-neutral-100 hover:bg-white px-5 py-2.5 text-xs font-bold text-neutral-950 transition-colors shadow-lg"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop &amp; Save Video</span>
                </button>
              )}
            </div>

            {recordedBlobUrl && (
              <button
                onClick={handleDownloadVideo}
                className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-xs font-bold text-neutral-950 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download .webm (+25 XP)</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Settings & Teleprompter Editor */}
        <div className="lg:col-span-4 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md space-y-5">
          {/* PiP Corner Selector */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Circular Webcam Position
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "bottom-right", label: "Bottom Right" },
                { id: "bottom-left", label: "Bottom Left" },
                { id: "top-right", label: "Top Right" },
                { id: "hidden", label: "Hidden" },
              ].map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => {
                    setConfig({ ...config, pipCorner: pos.id as PipCorner });
                    sound.click();
                  }}
                  className={`rounded-xl py-2 px-2.5 text-xs font-medium border text-center transition-all ${
                    config.pipCorner === pos.id
                      ? "border-amber-500 bg-amber-500/10 text-amber-300 font-bold"
                      : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Teleprompter Script Editor */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Teleprompter Script</span>
              </h3>
              <button
                onClick={() => setShowTeleprompter(!showTeleprompter)}
                className="text-xs text-amber-400 hover:underline"
              >
                {showTeleprompter ? "Hide" : "Show"}
              </button>
            </div>
            <textarea
              rows={6}
              value={teleprompterScript}
              onChange={(e) => setTeleprompterScript(e.target.value)}
              placeholder="Paste your tutorial or pitch script here..."
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-xs text-neutral-200 leading-relaxed resize-none focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Quality Specs Note */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 text-[11px] text-neutral-400 space-y-1">
            <div className="text-white font-semibold">💎 Zero Watermarks &amp; Zero Limits</div>
            <p className="text-neutral-500">
              Recorded directly into your browser's RAM and exported as clean 1080p 60fps WebM. Never transmitted to any third-party server.
            </p>
          </div>
        </div>
      </div>

      {GateModal}
    </div>
  );
}
