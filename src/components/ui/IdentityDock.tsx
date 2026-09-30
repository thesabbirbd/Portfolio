"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { useSpatialScroll } from "@/hooks/useSpatialScroll";
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
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const { spatial3D, toggle3D } = useSettings();
  const { scrollY } = useSpatialScroll();
  const [isNavHidden, setIsNavHidden] = useState(false);

  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 150) {
      setIsNavHidden(true); // scrolling down -> Nav is HIDDEN -> IdentityDock should be at BOTTOM MIDDLE
    } else {
      setIsNavHidden(false); // scrolling up/idle -> Nav is VISIBLE -> IdentityDock should be at RIGHT
    }
  });

  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setExpanded(false);
      setHoveredIcon(null);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const triggerCmdK = () => {
    sound.click();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  };

  const dockItems = [
    { id: "cmd", name: "Command", icon: Command, onClick: triggerCmdK, colorClass: "text-amber-500" },
    { id: "theme", name: "Theme", icon: Palette, onClick: () => { sound.click(); setTheme(theme === 'dark' ? 'light' : 'dark'); }, colorClass: "text-fuchsia-500" },
    { id: "3d", name: "3D Effect", icon: Box, onClick: () => { sound.click(); toggle3D(); }, colorClass: "text-cyan-500" },
    { id: "github", name: "GitHub", icon: GithubIcon, onClick: () => { sound.click(); window.open(SOCIAL_LINKS.find(l => l.id === "github")?.url || "", '_blank', 'noopener,noreferrer'); }, colorClass: "text-indigo-400" },
    { id: "contact", name: "Contact", icon: MessageSquare, onClick: () => { sound.click(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }, colorClass: "text-emerald-500" },
  ];

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
              className="relative w-full max-w-sm glass-panel rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 pointer-events-none" />
              <button onClick={() => setProfileOpen(false)} aria-label="Close profile panel" className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-muted" />
              </button>
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary/30 relative">
                <Image src="/assets/sabbir-stylish-portrait.jpg" alt="THE SABBiR" fill className="object-cover object-center" />
              </div>
              <h2 className="text-xl font-bold text-foreground tracking-tight mb-1">THE SABBiR</h2>
              <div className="flex items-center gap-1.5 text-xs font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                CURRENTLY: BUILDING OS
              </div>
              <p className="text-sm text-foreground/80 mb-6 leading-relaxed">Backend Architecture × DevOps × AI<br/>Systems Engineering & Infrastructure.</p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted font-mono mb-6 bg-background/30 px-3 py-1.5 rounded-lg border border-white/5">
                <MapPin className="w-3 h-3 text-accent" />
                Rajshahi, Bangladesh
              </div>
              <div className="flex gap-2 w-full">
                <GlassButton className="flex-1 text-xs py-2" onClick={() => { setProfileOpen(false); window.open(SOCIAL_LINKS.find(l => l.id === "github")?.url || "", '_blank', 'noopener,noreferrer'); }}>GitHub</GlassButton>
                <GlassButton className="flex-1 text-xs py-2" onClick={() => { setProfileOpen(false); window.open(SOCIAL_LINKS.find(l => l.id === "linkedin")?.url || "", '_blank', 'noopener,noreferrer'); }}>LinkedIn</GlassButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dock */}
            {/* Dynamic Position Wrapper */}
      <div className="fixed inset-x-0 bottom-0 z-[90] pointer-events-none">
        <motion.div 
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`flex w-full ${(!isDesktop && !isNavHidden) ? "justify-end pb-[90px] pr-4" : "justify-center pb-4 sm:pb-6"}`}
        >
        <motion.div 
          layout
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 300, damping: 30 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="pointer-events-auto flex items-center gap-1.5 glass-panel rounded-full p-1.5 shadow-2xl border border-white/10 backdrop-blur-2xl bg-background/50"
        >
          <button
            onClick={() => { sound.click(); setProfileOpen(true); }}
            className="w-10 h-10 rounded-full overflow-hidden relative border border-white/10 hover:border-primary/50 transition-colors shrink-0"
            title="Identity"

            aria-label="Open profile panel"
          >
            <Image src="/assets/sabbir-stylish-portrait.jpg" alt="Identity" fill className="object-cover object-center" />
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex items-center gap-1.5 overflow-visible px-1"
              >
                {dockItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="relative group flex flex-col items-center"
                    onMouseEnter={() => setHoveredIcon(item.id)}
                    onMouseLeave={() => setHoveredIcon(null)}
                  >
                    <button 
                      onClick={item.onClick}
                      aria-label={item.name}
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all relative z-10 hover:scale-110 duration-300"
                    >
                      <item.icon className={`w-5 h-5 ${item.colorClass} icon-3d-punchy transition-colors`} />
                    </button>
                    
                    {/* Tooltip */}
                    <AnimatePresence>
                      {hoveredIcon === item.id && (
                        <motion.span
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute -bottom-10 text-[10.5px] font-medium whitespace-nowrap glass-panel px-2.5 py-1.5 rounded-md text-foreground pointer-events-none z-20 shadow-lg"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => { sound.click(); setExpanded(!expanded); }}
            aria-label={expanded ? "Collapse dock" : "Expand dock"}
            className="md:hidden w-8 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-foreground transition-colors shrink-0"
            aria-label={expanded ? "Collapse dock" : "Expand dock"}
          >
            <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </button>
        </motion.div>
        </motion.div>
      </div>
    </>
  );
}
