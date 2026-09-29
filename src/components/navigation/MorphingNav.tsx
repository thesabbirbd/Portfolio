"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  Home, 
  User, 
  FolderGit2, 
  FlaskConical, 
  Mail,
  Search,
  Zap,
  ZapOff
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useSettings } from "@/contexts/SettingsContext";
import { useSpatialScroll } from "@/hooks/useSpatialScroll";
import { useMotionValueEvent } from "framer-motion";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { GlassButton } from "@/components/ui/glass/GlassButton";

const NAV_ITEMS = [
  { name: "Home", href: "/#hero", icon: Home, colorClass: "text-blue-500" },
  { name: "About", href: "/#about", icon: User, colorClass: "text-rose-500" },
  { name: "Work", href: "/#work", icon: FolderGit2, colorClass: "text-amber-500" },
  { name: "Lab", href: "/#lab", icon: FlaskConical, colorClass: "text-emerald-500" },
];

export function MorphingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { spatial3D, toggle3D } = useSettings();

  const { scrollY } = useSpatialScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else if (latest < previous) {
      setHidden(false);
    }
  });

  const openCmdk = () => {
    sound.click();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  };

  return (
    <>
      {/* ================= DESKTOP MORPHING NAV ================= */}
      <header className={cn("fixed top-0 inset-x-0 z-50 hidden md:flex justify-center px-6 pointer-events-none transition-all duration-500", hidden ? "-translate-y-[120%]" : "translate-y-0")} style={{ paddingTop: scrolled ? "1rem" : "2rem" }}>
        <motion.nav
          layout
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "pointer-events-auto flex items-center justify-between transition-all duration-500 overflow-hidden",
            scrolled
              ? "w-full max-w-2xl px-3 py-2 rounded-full glass-panel backdrop-blur-2xl bg-background/50"
              : "w-full max-w-6xl px-6 py-4 rounded-3xl bg-transparent border-b border-transparent"
          )}
        >
          {/* Logo */}
          <Link href="/#hero" className="flex items-center gap-3 group outline-none text-foreground" onClick={() => sound.click()}>
            <div className={cn("relative overflow-hidden rounded-xl glass-panel backdrop-blur-2xl bg-background/50 flex items-center justify-center font-bold font-mono transition-all", scrolled ? "w-8 h-8" : "w-10 h-10")}>
              <Image src="/assets/sabbir-uploaded-avatar.png" alt="Sabbir Logo" fill className="object-cover" sizes="40px" />
            </div>
            {!scrolled && <span className="font-bold tracking-widest text-sm text-foreground">THE SABBiR</span>}
          </Link>

          {/* Links */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => sound.click()}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10",
                  scrolled ? "text-foreground/80 hover:text-foreground" : "text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={openCmdk}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-foreground/80 hover:text-foreground"
              aria-label="Search Command Menu"
            >
              <Search className="w-5 h-5 text-fuchsia-500 icon-3d-punchy transition-transform hover:scale-110" />
            </button>
            <button
              onClick={() => {
                sound.click();
                toggle3D();
              }}
              className={cn(
                "p-2 rounded-full transition-colors flex items-center justify-center",
                spatial3D ? "text-blue-500 bg-blue-500/10" : "text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              )}
            >
              {spatial3D ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
            </button>
            <ThemeSwitcher />
            
            {!scrolled && (
              <GlassButton size="sm" className="ml-2" onClick={() => document.getElementById("contact")?.scrollIntoView()}>
                Contact
              </GlassButton>
            )}
          </div>
        </motion.nav>
      </header>

      {/* ================= MOBILE COMPACT NAV ================= */}
      <div className={cn("fixed inset-x-4 bottom-4 mb-[env(safe-area-inset-bottom)] z-50 flex md:hidden justify-between items-center px-4 py-3 rounded-full glass-panel backdrop-blur-2xl bg-background/50 transition-transform duration-500", hidden ? "translate-y-[150%]" : "translate-y-0")}>
        <Link href="/#hero" onClick={() => sound.click()} className="flex items-center gap-2 font-bold font-mono text-foreground">
          <div className="relative w-8 h-8 overflow-hidden rounded-full border border-white/20">
            <Image src="/assets/sabbir-uploaded-avatar.png" alt="Sabbir Logo" fill className="object-cover" sizes="32px" />
          </div>
        </Link>
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link key={item.name} href={item.href} onClick={() => sound.click()} className="p-2 text-foreground/80 hover:text-foreground group">
              <item.icon className={`w-5 h-5 ${item.colorClass} icon-3d-punchy transition-transform group-hover:scale-110`} />
            </Link>
          ))}
        </div>
        <button onClick={openCmdk} className="p-2 text-foreground/80 hover:text-foreground group">
          <Search className="w-5 h-5 text-fuchsia-500 icon-3d-punchy transition-transform hover:scale-110" />
        </button>
      </div>
    </>
  );
}
