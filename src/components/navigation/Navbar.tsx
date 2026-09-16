"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  User, 
  Compass, 
  FolderGit2, 
  FlaskConical, 
  Cpu, 
  Globe, 
  Users, 
  Mail,
  Sliders
} from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { PROFILE_DATA } from "@/data/profile";
import { SOCIAL_LINKS } from "@/data/socials";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "About", href: "#about", icon: User },
  { name: "Journey", href: "#journey", icon: Compass },
  { name: "Work", href: "#work", icon: FolderGit2 },
  { name: "Lab", href: "#lab", icon: FlaskConical },
  { name: "Skills", href: "#skills", icon: Cpu },
  { name: "Maps", href: "#maps", icon: Globe },
  { name: "Community", href: "#community", icon: Users },
  { name: "Contact", href: "#contact", icon: Mail },
];

const MOBILE_NAV_ITEMS = [
  { name: "About", href: "#about", icon: User },
  { name: "Work", href: "#work", icon: FolderGit2 },
  { name: "Lab", href: "#lab", icon: FlaskConical },
  { name: "Maps", href: "#maps", icon: Globe },
  { name: "Community", href: "#community", icon: Users },
  { name: "Contact", href: "#contact", icon: Mail },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const githubLink = SOCIAL_LINKS.find((s) => s.id === "github")?.url || "https://github.com/thesabbirbd";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section spy
      const sections = ["hero", "about", "journey", "work", "lab", "skills", "maps", "community", "mission", "contact"];
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
            "pointer-events-auto flex items-center justify-between gap-3 px-4 py-2 rounded-full transition-all duration-300",
            "glass-spatial border border-slate-200/70 dark:border-white/10",
            scrolled
              ? "shadow-[0_16px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.5)] bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl"
              : "bg-white/65 dark:bg-slate-900/65 backdrop-blur-lg"
          )}
        >
          {/* Brand Logo & Live Status */}
          <Link
            href="#hero"
            onClick={() => sound.click()}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors group"
          >
            <div className="relative flex items-center justify-center w-7 h-7">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image src="/assets/sabbir-portrait-v2.png" alt="Profile" fill sizes="10vw" className="object-cover" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] border-2 border-white dark:border-slate-950 animate-pulse" />
            </div>
            <span className="font-bold tracking-wider text-sm text-slate-900 dark:text-white group-hover:text-[var(--color-primary)] dark:group-hover:text-[var(--color-primary)] transition-colors">
              {PROFILE_DATA.shortName}
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => sound.click()}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all relative",
                    isActive
                      ? "text-[var(--color-primary)] dark:text-[var(--color-primary)] font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-[var(--color-secondary)]/10 -z-10"
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
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              onClick={() => sound.click()}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <ThemeSwitcher />

            <Link
              href="#contact"
              onClick={() => sound.click()}
              className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--color-primary)] opacity-90 hover:opacity-100 text-white text-xs font-medium shadow-sm transition-all hover:scale-105"
            >
              <span>Connect</span>
            </Link>
          </div>
        </motion.nav>
      </header>

      {/* ================= MOBILE COMPACT TOP BAR ================= */}
      <div className="fixed top-0 inset-x-0 z-50 flex md:hidden items-center justify-between px-4 py-3 glass-spatial border-b border-slate-200/50 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <Link href="#hero" onClick={() => sound.click()} className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-transparent">
            <Image src="/assets/sabbir-portrait-v2.png" alt="Profile" fill sizes="10vw" className="object-cover" />
          </div>
          <span className="font-bold text-sm tracking-wider text-slate-900 dark:text-white">
            {PROFILE_DATA.shortName}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            onClick={() => sound.click()}
            className="p-2 text-slate-600 dark:text-slate-300"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <ThemeSwitcher />
        </div>
      </div>

      {/* ================= MOBILE FLOATING BOTTOM GLASS CAPSULE ================= */}
      <nav className="fixed bottom-3 inset-x-3 z-50 flex md:hidden justify-around items-center py-2 px-2 rounded-full glass-spatial border border-slate-200/80 dark:border-white/15 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.href.replace("#", "");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => sound.click()}
              className={cn(
                "flex flex-col items-center gap-0.5 p-1 rounded-full text-[10px] font-medium transition-colors",
                isActive
                  ? "text-[var(--color-primary)] dark:text-[var(--color-primary)] font-bold"
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
