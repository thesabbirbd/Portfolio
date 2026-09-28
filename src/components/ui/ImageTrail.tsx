"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageTrailProps {
  children: React.ReactNode;
  images: string[];
}

export function ImageTrail({ children, images }: ImageTrailProps) {
  const [activeImage, setActiveImage] = useState(-1);
  const [trail, setTrail] = useState<{ id: number; x: number; y: number; img: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  let renderCount = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    // Only spawn image every N pixels moved to prevent spam
    renderCount.current += 1;
    if (renderCount.current % 10 !== 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nextImage = (activeImage + 1) % images.length;
    setActiveImage(nextImage);

    const newTrailItem = {
      id: Date.now(),
      x,
      y,
      img: images[nextImage],
    };

    setTrail((prev) => [...prev, newTrailItem].slice(-5)); // Keep only last 5
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden"
    >
      <AnimatePresence>
        {trail.map((item) => (
          <motion.img
            key={item.id}
            src={item.img}
            initial={{ opacity: 0.8, scale: 0.5, x: item.x - 50, y: item.y - 50, rotate: Math.random() * 20 - 10 }}
            animate={{ opacity: 0, scale: 1, y: item.y - 100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-32 h-32 object-cover rounded-xl shadow-2xl pointer-events-none z-0"
          />
        ))}
      </AnimatePresence>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
