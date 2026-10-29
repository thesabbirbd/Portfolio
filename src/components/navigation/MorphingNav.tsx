"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  FolderGit2,
  FlaskConical,
  NotebookPen,
  FileText,
  Search,
  Zap,
  ZapOff,
  Compass
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useSettings } from "@/contexts/SettingsContext";
import { useNavVisibility, useScrolledPastTop } from "@/hooks/useNavVisibility";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { GlassButton } from "@/components/ui/glass/GlassButton";
import { goToSection, openCommandMenu } from "@/lib/ui-events";

type NavItem = {
  name: string;
  href: string;
  /** Home-page section id this item scrolls to (if any). */
  section?: string;
  /** Route prefix that marks this item active on other pages. */
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  mobile: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { name: "About", href: "/#about", section: "about", route: "/about", icon: User, mobile: true },
  { name: "Work", href: "/#projects", section: "projects", route: "/projects", icon: FolderGit2, mobile: true },
  { name: "Lab", href: "/#lab", section: "lab", route: "/engineering-lab", icon: FlaskConical, mobile: true },
  { name: "Notes", href: "/notes", route: "/notes", icon: NotebookPen, mobile: true },
  { name: "Explore", href: "/explore", route: "/explore", icon: Compass, mobile: false },
  { name: "Resume", href: "/resume", route: "/resume", icon: FileText, mobile: false },
];

/** Tracks which home-page section is in view so the nav can reflect position. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    const ids = NAV_ITEMS.map((i) => i.section).filter(Boolean) as string[];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return active;
}

export function MorphingNav() {
  const scrolled = useScrolledPastTop();
  const { isNavHidden: hidden } = useNavVisibility();
  const { spatial3D, toggle3D } = useSettings();
  const pathname = usePathname();
  const router = useRouter();
  const activeSection = useActiveSection(pathname === "/");

  const isActive = (item: NavItem) =>
    pathname === "/" ? item.section !== undefined && activeSection === item.section : pathname.startsWith(item.route);

  const openCmdk = () => {
    sound.modalOpen();
    openCommandMenu();
  };

  return (
    <>
      {/* ================= DESKTOP MORPHING NAV ================= */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 hidden md:flex justify-center px-6 pt-4 short-landscape:pt-2 pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform print:hidden",
          hidden ? "-translate-y-[130%]" : scrolled ? "translate-y-0" : "translate-y-4"
        )}
      >
        {/* Stable geometry: the "morph" is a glass surface fading in (opacity), never a layout
            animation. Framer `layout` here used to snapshot every layout node on the page each time
            the nav re-rendered during scroll. */}
        <nav
          aria-label="Primary"
          className="relative pointer-events-auto w-full max-w-4xl flex items-center justify-between px-3 py-2 rounded-full"
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 rounded-full glass-panel backdrop-blur-lg bg-background/75 transition-opacity duration-500",
              scrolled ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Logo */}
          <Link href="/" aria-label="THE SABBiR — home" className="relative flex items-center gap-3 group outline-none text-foreground rounded-xl focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" onClick={() => sound.navigate()}>
            <div className="relative w-9 h-9 overflow-hidden rounded-xl border border-white/20 bg-background/50 flex items-center justify-center">
              <Image src="/assets/sabbir-uploaded-avatar.png" alt="" fill className="object-cover" sizes="36px" />
            </div>
            <span className="hidden lg:inline font-bold tracking-widest text-sm text-foreground">THE SABBiR</span>
          </Link>

          {/* Links */}
          <div className="relative flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => sound.navigate()}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative px-3.5 py-2 rounded-full text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                    active ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-0 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 transition-opacity duration-300",
                      active ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="relative">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={openCmdk}
              className="flex items-center gap-1.5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-foreground/80 hover:text-foreground"
              aria-label="Open command menu"
              title="Search (Ctrl/⌘ + K)"
            >
              <Search className="w-4 h-4" />
              <kbd className="hidden xl:inline text-[11px] font-mono px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10 text-ink-3">⌘K</kbd>
            </button>
            <button
              onClick={() => {
                sound.toggleSwitch();
                toggle3D();
              }}
              className={cn(
                "p-2 rounded-full transition-colors flex items-center justify-center",
                spatial3D ? "text-blue-500 bg-blue-500/10" : "text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              )}
              aria-label={spatial3D ? "Disable 3D effects" : "Enable 3D effects"}
              aria-pressed={spatial3D}
              title="3D spatial effects"
            >
              {spatial3D ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
            </button>
            <ThemeSwitcher />
            <GlassButton size="sm" magnetic={false} className="ml-1" onClick={() => goToSection("contact", "/contact", router.push)}>
              Contact
            </GlassButton>
          </div>
        </nav>
      </header>

      {/* ================= MOBILE COMPACT NAV ================= */}
      <nav
        aria-label="Primary"
        className={cn(
          "fixed left-1/2 bottom-4 mb-[env(safe-area-inset-bottom)] z-50 flex md:hidden justify-between items-center px-2.5 py-2 gap-1 rounded-full surface-control transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] w-max will-change-transform print:hidden",
          hidden ? "translate-y-[160%] -translate-x-1/2" : "translate-y-0 -translate-x-1/2"
        )}
      >
        <Link href="/" aria-label="THE SABBiR — home" onClick={() => sound.navigate()} className="flex items-center p-1">
          <div className="relative w-7 h-7 overflow-hidden rounded-full border border-white/20">
            <Image src="/assets/sabbir-uploaded-avatar.png" alt="" fill className="object-cover" sizes="32px" />
          </div>
        </Link>
        <div className="flex items-center gap-0.5">
          {NAV_ITEMS.filter((i) => i.mobile).map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => sound.navigate()}
                aria-label={item.name}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative p-2 rounded-full transition-colors",
                  active ? "bg-[var(--color-primary)]/12" : "hover:bg-black/5 dark:hover:bg-white/10"
                )}
              >
                <item.icon className={cn("w-[18px] h-[18px] transition-colors", active ? "text-primary" : "text-ink-2")} />
              </Link>
            );
          })}
        </div>
        <button onClick={openCmdk} className="p-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10" aria-label="Open command menu">
          <Search className="w-[18px] h-[18px] text-ink-2" />
        </button>
      </nav>
    </>
  );
}
