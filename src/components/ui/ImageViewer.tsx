"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";
import { sound } from "@/lib/sound";

interface ImageViewerProps {
  isOpen: boolean;
  images: { src: string; title?: string }[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageViewer({ isOpen, images, initialIndex, onClose }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, currentIndex, images.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    sound.click();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    sound.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8"
          >
            {/* Header / Controls */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
              <div className="px-4 py-2 rounded-full glass-interactive text-white text-sm font-mono tracking-widest shadow-lg">
                {currentIndex + 1} / {images.length}
              </div>
              <button
                onClick={() => { onClose(); sound.click(); }}
                className="p-3 rounded-full glass-interactive text-white hover:bg-white/20 transition-colors shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Left */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 p-4 rounded-full glass-interactive text-white hover:bg-white/20 transition-colors z-10 shadow-lg hidden sm:block"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Image */}
            <div className="relative w-full max-w-6xl aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden glass-interactive shadow-2xl group cursor-crosshair">
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].title || `Image ${currentIndex + 1}`}
                fill
                quality={100}
                unoptimized
                className="object-contain"
              />
            </div>

            {/* Title / Description */}
            {images[currentIndex].title && (
              <div className="absolute bottom-6 px-6 py-3 rounded-2xl glass-interactive text-white text-sm sm:text-base font-medium shadow-lg max-w-2xl text-center">
                {images[currentIndex].title}
              </div>
            )}

            {/* Navigation Right */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 p-4 rounded-full glass-interactive text-white hover:bg-white/20 transition-colors z-10 shadow-lg hidden sm:block"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
            
            {/* Mobile Swipe / Click zones */}
            <div className="absolute inset-y-0 left-0 w-1/3 z-0 sm:hidden" onClick={handlePrev} />
            <div className="absolute inset-y-0 right-0 w-1/3 z-0 sm:hidden" onClick={handleNext} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
