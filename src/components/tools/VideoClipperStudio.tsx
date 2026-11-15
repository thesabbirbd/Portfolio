"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Scissors,
  Camera,
  Film,
  Upload,
  Download,
  Share2,
  Sparkles,
  Smartphone,
  Layout,
  Square,
  Monitor,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  captureVideoFrame,
  generateContactSheet,
  drawTestReelFrame,
  VideoAspectTarget,
} from "@/lib/video/video-clipper-engine";

export function VideoClipperStudio() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const testCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasCustomVideo, setHasCustomVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10); // default 10s for procedural test reel

  // Trimming
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(10);

  // Formatting & Captions
  const [aspectTarget, setAspectTarget] = useState<VideoAspectTarget>("original");
  const [captionText, setCaptionText] = useState("AI-Generated Short • THE SABBiR OS");

  // Output Previews
  const [capturedStillUrl, setCapturedStillUrl] = useState<string | null>(null);
  const [contactSheetUrl, setContactSheetUrl] = useState<string | null>(null);

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "video-clipper",
    toolName: "Video Trimmer & Frame Grabber Studio",
  });

  // Procedural 60fps canvas loop when no custom video is loaded
  useEffect(() => {
    if (hasCustomVideo) return;

    let animId: number;
    let startTimestamp: number | null = null;

    const loop = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsedSec = ((timestamp - startTimestamp) / 1000) % 10;
      setCurrentTime(elapsedSec);

      if (testCanvasRef.current) {
        drawTestReelFrame(testCanvasRef.current, elapsedSec);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [hasCustomVideo]);

  // Handle Video Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setHasCustomVideo(true);
      sound.launch();
    }
  };

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 10;
      setDuration(dur);
      setTrimStart(0);
      setTrimEnd(dur);
    }
  };

  const togglePlay = () => {
    if (hasCustomVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
    sound.click();
  };

  // Capture Frame
  const handleCaptureFrame = () => {
    let canvas: HTMLCanvasElement;
    if (hasCustomVideo && videoRef.current) {
      canvas = captureVideoFrame(videoRef.current, { captionText, aspectTarget });
    } else if (testCanvasRef.current) {
      canvas = captureVideoFrame(testCanvasRef.current as any, { captionText, aspectTarget });
    } else {
      return;
    }

    const dataUrl = canvas.toDataURL("image/png");
    setCapturedStillUrl(dataUrl);
    sound.shutter();

    triggerExport(() => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `sabbir-frame-grab-${currentTime.toFixed(1)}s-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  // Generate Contact Sheet
  const handleGenerateContactSheet = async () => {
    if (!hasCustomVideo || !videoRef.current) {
      alert("Please upload a video file to generate a 6-frame contact sheet.");
      return;
    }

    sound.launch();
    const sheet = await generateContactSheet(videoRef.current, 6);
    setContactSheetUrl(sheet);
    sound.confirm();
  };

  const getSharePayload = () => {
    return {
      type: "video-clipper-snapshot",
      currentTime,
      duration,
      trimStart,
      trimEnd,
      aspectTarget,
      captionText,
      createdAt: new Date().toISOString(),
    };
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="video-clipper"
        toolName="Video Trimmer &amp; Frame Grabber Studio"
        category="Video Studio"
        onExportClick={handleCaptureFrame}
        getSharePayload={getSharePayload}
        previewDataUrl={capturedStillUrl || undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Viewport */}
        <div className="lg:col-span-7 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md flex flex-col items-center justify-center min-h-[500px]">
          {/* Top Video Toolbar */}
          <div className="w-full flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
            <label className="cursor-pointer flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Import MP4 / WebM</span>
              <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
            </label>

            <span className="text-xs font-mono text-neutral-400">
              {hasCustomVideo ? "Custom Video Loaded" : "Procedural 60fps Test Reel"}
            </span>
          </div>

          {/* Player View */}
          <div className="flex-1 flex items-center justify-center max-w-full max-h-[460px] p-2">
            {hasCustomVideo ? (
              <video
                ref={videoRef}
                src={videoUrl}
                onLoadedMetadata={handleVideoLoaded}
                onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
                controls
                className="max-h-[420px] max-w-full rounded-2xl shadow-2xl border border-white/10"
              />
            ) : (
              <canvas
                ref={testCanvasRef}
                width={800}
                height={450}
                className="max-h-[420px] max-w-full rounded-2xl shadow-2xl border border-white/10 block"
              />
            )}
          </div>

          {/* Time & Playback bar */}
          <div className="w-full pt-4 space-y-2 border-t border-neutral-800 mt-2">
            <div className="flex justify-between text-xs text-neutral-400 font-mono">
              <span>Time: {currentTime.toFixed(2)}s / {duration.toFixed(2)}s</span>
              <span>Trim: {trimStart.toFixed(1)}s - {trimEnd.toFixed(1)}s</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-neutral-500">Trim In Point</span>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={trimStart}
                  onChange={(e) => setTrimStart(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-500">Trim Out Point</span>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={trimEnd}
                  onChange={(e) => setTrimEnd(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Exports */}
        <div className="lg:col-span-5 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md space-y-5">
          {/* Target Aspect Ratio */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Output Aspect Ratio
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "original", label: "Source" },
                { id: "9:16", label: "9:16 Reels" },
                { id: "4:5", label: "4:5 Post" },
                { id: "1:1", label: "1:1 Square" },
                { id: "16:9", label: "16:9 YT" },
              ].map((asp) => (
                <button
                  key={asp.id}
                  onClick={() => {
                    setAspectTarget(asp.id as VideoAspectTarget);
                    sound.click();
                  }}
                  className={`rounded-xl py-2 text-xs font-medium border text-center transition-all ${
                    aspectTarget === asp.id
                      ? "border-amber-500 bg-amber-500/10 text-amber-300 font-bold"
                      : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                  }`}
                >
                  {asp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subtitle Caption Overlay */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Burn-In Subtitle Caption
            </h3>
            <input
              type="text"
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              placeholder="Enter caption to burn on frame..."
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white"
            />
          </div>

          {/* Frame Grab & Export Actions */}
          <div className="space-y-3 pt-3 border-t border-neutral-800">
            <button
              onClick={handleCaptureFrame}
              className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>📸 Capture 1080p Still Frame (+25 XP)</span>
            </button>

            {hasCustomVideo && (
              <button
                onClick={handleGenerateContactSheet}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 py-2.5 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2"
              >
                <Film className="w-3.5 h-3.5 text-blue-400" />
                <span>Generate 6-Frame Contact Sheet</span>
              </button>
            )}
          </div>

          {/* Contact Sheet Output Preview */}
          {contactSheetUrl && (
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <span className="text-[11px] text-neutral-400">Generated Contact Sheet:</span>
              <img src={contactSheetUrl} alt="Contact sheet" className="rounded-xl border border-neutral-700 w-full" />
            </div>
          )}
        </div>
      </div>

      {GateModal}
    </div>
  );
}
