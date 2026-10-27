"use client";

import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

/**
 * cobe v2 has no internal render loop: frames are drawn on `update()`. We drive rotation with
 * our own rAF loop that only runs while the canvas is on screen and motion is allowed, so the
 * globe costs nothing when scrolled away (or under reduced motion, where it stays still).
 */
export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let phi = 0;
    let frame = 0;
    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 800,
      height: 800,
      phi: 0,
      theta: 0.3, // Tilt to show northern hemisphere well
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.2],
      markerColor: [0, 0.9, 1],
      glowColor: [0.1, 0.2, 0.4],
      markers: [
        // Rajshahi, Bangladesh (Approx: 24.37, 88.60)
        { location: [24.3745, 88.6042], size: 0.1 },
      ],
    });

    const reduced = () =>
      document.documentElement.dataset.motion === "reduced" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      phi += 0.003;
      globe.update({ phi });
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduced()) {
        if (!frame) frame = requestAnimationFrame(tick);
      } else {
        stop();
      }
    });
    io.observe(canvas);

    return () => {
      io.disconnect();
      stop();
      globe.destroy();
    };
  }, []);

  return (
    <div className="w-full max-w-md aspect-square mx-auto flex items-center justify-center relative">
      <canvas
        ref={canvasRef}
        style={{
          width: 400,
          height: 400,
          maxWidth: "100%",
          aspectRatio: 1,
        }}
      />
      
      {/* Center Marker Ping */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] flex flex-col items-center pointer-events-none">
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping absolute opacity-50" />
        <div className="w-2 h-2 bg-cyan-400 rounded-full z-10" />
        <div className="mt-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded border border-white/10 text-[11px] text-cyan-400 font-mono">
          RAJSHAHI, BD
        </div>
      </div>
    </div>
  );
}
