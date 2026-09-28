"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Command, Palette, Box, MessageSquare, X, ChevronRight, Activity, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { useTheme } from "next-themes";
import { useSettings } from "@/contexts/SettingsContext";
import { SOCIAL_LINKS } from "@/data/socials";
import { sound } from "@/lib/sound";
import Image from "next/image";
import { GlassButton } from "./glass/GlassButton";

export function IdentityDock() {
  const [expanded, setExpanded] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { spatial3D, toggle3D } = useSettings();

  const toggleDock = () => {
    sound.click();
    setExpanded(!expanded);
  };

  const triggerCmdK = () => {
    sound.click();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  };

  return (
    <>
      {/* Profile Panel Overlay */}
      <AnimatePresence>
        {profileOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className="absolute inset-0 bg-background/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-sm spatial-glass-heavy rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 pointer-events-none" />
              
              <button 
                onClick={() => setProfileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-muted" />
              </button>

              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary/30 relative">
                <Image
                  src="/assets/sabbir-stylish-portrait.jpg"
                  alt="THE SABBiR"
                  fill
                  className="object-cover object-center"
                />
              </div>

              <h2 className="text-xl font-bold text-foreground tracking-tight mb-1">THE SABBiR</h2>
              <div className="flex items-center gap-1.5 text-xs font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                CURRENTLY: BUILDING OS
              </div>

              <p className="text-sm text-foreground/80 mb-6 leading-relaxed">
                Backend Architecture × DevOps × AI<br/>
                Systems Engineering & Infrastructure.
              </p>

              <div className="flex items-center justify-center gap-2 text-xs text-muted font-mono mb-6 bg-background/30 px-3 py-1.5 rounded-lg border border-white/5">
                <MapPin className="w-3 h-3 text-accent" />
                Rajshahi, Bangladesh
              </div>

              <div className="flex gap-2 w-full">
                <GlassButton 
                  className="flex-1 text-xs py-2" 
                  onClick={() => { setProfileOpen(false); window.open(SOCIAL_LINKS.find(l => l.id === "github")?.url || "", '_blank'); }}
                >
                  GitHub
                </GlassButton>
                <GlassButton 
                  className="flex-1 text-xs py-2" 
                  onClick={() => { setProfileOpen(false); window.open(SOCIAL_LINKS.find(l => l.id === "linkedin")?.url || "", '_blank'); }}
                >
                  LinkedIn
                </GlassButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dock */}
      <motion.div 
        initial={{ y: 50, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-6 left-1/2 z-[90] flex items-center gap-1.5 spatial-glass rounded-full p-1.5 shadow-lg border border-white/10"
      >
        <button
          onClick={() => { sound.click(); setProfileOpen(true); }}
          className="w-10 h-10 rounded-full overflow-hidden relative border border-white/10 hover:border-primary/50 transition-colors shrink-0"
          title="Identity"
        >
          <Image src="/assets/sabbir-stylish-portrait.jpg" alt="Identity" fill className="object-cover object-center" />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center gap-1.5 overflow-hidden px-1"
            >
              <button onClick={triggerCmdK} className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all" title="Command Center (⌘K)">
                <Command className="w-4 h-4" />
              </button>
              <button onClick={() => { sound.click(); setTheme(theme === 'dark' ? 'light' : 'dark'); }} className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all" title="Toggle Theme">
                <Palette className="w-4 h-4" />
              </button>
              <button onClick={() => { sound.click(); toggle3D(); }} className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all" title="Toggle 3D">
                <Box className="w-4 h-4" />
              </button>
              <button onClick={() => { sound.click(); window.open(SOCIAL_LINKS.find(l => l.id === "github")?.url || "", '_blank'); }} className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all" title="GitHub">
                <GithubIcon className="w-4 h-4" />
              </button>
              <button onClick={() => { sound.click(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 flex items-center justify-center text-foreground/80 hover:text-primary transition-all" title="Contact">
                <MessageSquare className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={toggleDock}
          className="w-8 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-foreground transition-colors shrink-0"
        >
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </button>
      </motion.div>
    </>
  );
}
