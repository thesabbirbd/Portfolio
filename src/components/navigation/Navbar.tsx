"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Terminal, 
  Layers, 
  Cpu, 
  Flame, 
  Mail, 
  User, 
  ExternalLink 
} from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { PROFILE_DATA } from "@/data/profile";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "About", href: "#about", icon: User },
  { name: "Omnidesk", href: "#omnidesk", icon: Layers },
  { name: "Skills", href: "#skills", icon: Cpu },
  { name: "Mission", href: "#mission", icon: Flame },
  { name: "Contact", href: "#contact", icon: Mail },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section spy
      const sections = ["hero", "about", "omnidesk", "skills", "mission", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ================= DESKTOP FLOATING CAPSULE NAVBAR ================= */}
      <header className="fixed top-4 inset-x-0 z-50 hidden md:flex justify-center px-4 pointer-events-none">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-4 px-4 py-2 rounded-full transition-all duration-300",
            "glass-panel border border-slate-200/60 dark:border-white/10",
            scrolled
              ? "shadow-[0_16px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.5)] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl"
              : "bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg"
          )}
        >
          {/* Brand Logo & Live Status */}
          <Link
            href="#hero"
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors group"
          >
            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white font-mono font-bold text-xs shadow-sm">
              S
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 animate-pulse" />
            </div>
            <span className="font-bold tracking-wider text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
              {PROFILE_DATA.shortName}
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all relative",
                    isActive
                      ? "text-blue-600 dark:text-cyan-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-cyan-400/10 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <a
              href={PROFILE_DATA.socials[0].url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <ThemeSwitcher />

            <Link
              href="#contact"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-sm transition-all hover:scale-105"
            >
              <span>Connect</span>
            </Link>
          </div>
        </motion.nav>
      </header>

      {/* ================= MOBILE COMPACT TOP BAR ================= */}
      <div className="fixed top-0 inset-x-0 z-50 flex md:hidden items-center justify-between px-4 py-3 glass-panel border-b border-slate-200/50 dark:border-white/10">
        <Link href="#hero" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center font-bold text-xs">
            S
          </div>
          <span className="font-bold text-sm tracking-wider text-slate-900 dark:text-white">
            {PROFILE_DATA.shortName}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={PROFILE_DATA.socials[0].url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="p-2 text-slate-600 dark:text-slate-300"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <ThemeSwitcher />
        </div>
      </div>

      {/* ================= MOBILE FLOATING BOTTOM GLASS CAPSULE ================= */}
      <nav className="fixed bottom-3 inset-x-4 z-50 flex md:hidden justify-around items-center py-2.5 px-3 rounded-full glass-panel border border-slate-200/70 dark:border-white/15 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.href.replace("#", "");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 p-1 rounded-full text-[10px] font-medium transition-colors",
                isActive
                  ? "text-blue-600 dark:text-cyan-400 font-bold"
                  : "text-slate-500 dark:text-slate-400"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive && "stroke-[2.5px]")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
