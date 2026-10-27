"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { Command, Palette, Box, MessageSquare, X, ChevronRight, MapPin } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { useTheme } from "next-themes";
import { useSettings } from "@/contexts/SettingsContext";
import { SOCIAL_LINKS } from "@/data/socials";
import { sound } from "@/lib/sound";
import Image from "next/image";
import { GlassButton } from "./glass/GlassButton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useNavVisibility } from "@/hooks/useNavVisibility";
import { goToSection, openCommandMenu } from "@/lib/ui-events";
import { dockTransition, MOBILE_DOCK_RAISE, MOBILE_DOCK_EXPANDED_RAISE, MOBILE_EDGE } from "@/lib/fixed-controls";

export function IdentityDock() {
  const [expanded, setExpanded] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const { toggle3D } = useSettings();
  const router = useRouter();
  const pathname = usePathname();
  const { isNavHidden } = useNavVisibility();
  const isDesktop = useMediaQuery("(min-width: 768px)", true);

  // Distance from screen-centre to the right edge slot (above Settings), measured so the
  // dock can glide between slots with a pure transform instead of swapping flex alignment.
  const dockRef = useRef<HTMLDivElement>(null);
  const [rightShift, setRightShift] = useState(0);

  useEffect(() => {
    const el = dockRef.current;
    if (!el) return;
    const measure = () => setRightShift(Math.max(0, window.innerWidth / 2 - MOBILE_EDGE - el.offsetWidth / 2));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (!isDesktop) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!isDesktop) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

  // On phones the expanded dock is a transient menu: fold it away once the visitor scrolls
  // or navigates to another route (state adjusted during render, not in an effect).
  const collapseKey = `${isNavHidden}|${pathname}`;
  const [lastCollapseKey, setLastCollapseKey] = useState(collapseKey);
  if (collapseKey !== lastCollapseKey) {
    setLastCollapseKey(collapseKey);
    if (!isDesktop) setExpanded(false);
  }

  // Profile dialog: focus moves to Close on open and back to the avatar on close; Escape closes.
  const avatarRef = useRef<HTMLButtonElement>(null);
  const profileCloseRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!profileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setProfileOpen(false);
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => profileCloseRef.current?.focus());
    const avatar = avatarRef.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      avatar?.focus();
    };
  }, [profileOpen]);

  const openExternal = (id: string) => {
    const url = SOCIAL_LINKS.find((l) => l.id === id)?.url;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const dockItems = [
    { id: "cmd", name: "Command Menu", icon: Command, onClick: () => { sound.click(); openCommandMenu(); } },
    { id: "theme", name: "Toggle Theme", icon: Palette, onClick: () => { sound.click(); setTheme(resolvedTheme === "dark" ? "light" : "dark"); } },
    { id: "3d", name: "3D Effect", icon: Box, onClick: () => { sound.click(); toggle3D(); } },
    { id: "github", name: "GitHub", icon: GithubIcon, onClick: () => { sound.click(); openExternal("github"); } },
    { id: "contact", name: "Contact", icon: MessageSquare, onClick: () => { sound.click(); goToSection("contact", "/contact", router.push); } },
  ];

  // Slot choreography:
  //  phones, nav visible -> collapsed dock rests above Settings on the right
  //  phones, nav hidden  -> dock settles bottom-centre between Terminal and Settings
  //  phones, expanded    -> centred, lifted clear of the corner buttons
  //  desktop             -> bottom-centre; it steps out of the reading column while the
  //                         visitor scrolls down and returns with the nav
  const desktopAway = isDesktop && isNavHidden && !expanded;
  const target = isDesktop
    ? { x: 0, y: desktopAway ? 96 : 0 }
    : expanded
      ? { x: 0, y: isNavHidden ? -MOBILE_DOCK_EXPANDED_RAISE : -MOBILE_DOCK_RAISE }
      : isNavHidden
        ? { x: 0, y: 0 }
        : { x: rightShift, y: -MOBILE_DOCK_RAISE };

  return (
    <>
      {/* Profile Panel Overlay */}
      <AnimatePresence>
        {profileOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Profile">
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
              <button ref={profileCloseRef} onClick={() => setProfileOpen(false)} aria-label="Close profile panel" className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-ink-3" />
              </button>
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary/30 relative">
                <Image src="/assets/sabbir-stylish-portrait.jpg" alt="Md Sabbirul Islam Khan" fill sizes="96px" className="object-cover object-center" />
              </div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">THE SABBiR</h2>
              <p className="text-xs text-ink-3 mb-3">Md Sabbirul Islam Khan</p>
              <div className="flex items-center gap-1.5 text-xs font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                BUILDING · LEARNING
              </div>
              <p className="text-sm text-foreground/80 mb-2 leading-relaxed">Chief Project Manager (CPM) at Aiyaar Ltd</p>
              <p className="text-sm text-foreground/80 mb-6 leading-relaxed">Management student exploring<br />Backend Engineering, DevOps &amp; Local AI.</p>
              <div className="flex items-center justify-center gap-2 text-xs text-ink-3 font-mono mb-6 bg-background/30 px-3 py-1.5 rounded-lg border border-white/5">
                <MapPin className="w-3 h-3 text-accent" />
                Rajshahi, Bangladesh
              </div>
              <div className="flex gap-2 w-full">
                <GlassButton className="flex-1 text-xs py-2" onClick={() => { setProfileOpen(false); openExternal("github"); }}>GitHub</GlassButton>
                <GlassButton className="flex-1 text-xs py-2" onClick={() => { setProfileOpen(false); openExternal("linkedin"); }}>LinkedIn</GlassButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dock: fixed base slot is bottom-centre; every repositioning is a transform. */}
      <div className="fixed inset-x-0 bottom-4 md:bottom-6 short-landscape:bottom-3 mb-[env(safe-area-inset-bottom)] z-[45] flex justify-center pointer-events-none print:hidden">
        <motion.div
          ref={dockRef}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: desktopAway ? 0 : 1, ...target }}
          transition={dockTransition(isNavHidden)}
          aria-hidden={desktopAway || undefined}
          inert={desktopAway || undefined}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={() => isDesktop && setExpanded(true)}
          className="pointer-events-auto flex items-center gap-1.5 glass-panel rounded-full p-1.5 shadow-2xl border border-white/10 backdrop-blur-lg bg-background/75 will-change-transform"
        >
          {/* Phones: the collapsed dock is just this avatar bubble; first tap expands, next tap opens the profile. */}
          <button
            ref={avatarRef}
            onClick={() => {
              sound.click();
              if (!isDesktop && !expanded) setExpanded(true);
              else setProfileOpen(true);
            }}
            className="w-10 h-10 rounded-full overflow-hidden relative border border-white/10 hover:border-primary/50 transition-colors shrink-0"
            title="Identity"
            aria-label={!isDesktop && !expanded ? "Expand quick actions dock" : "Open profile panel"}
            aria-expanded={!isDesktop ? expanded : undefined}
          >
            <Image src="/assets/sabbir-stylish-portrait.jpg" alt="" fill sizes="40px" className="object-cover object-center" />
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
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
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-[background-color,transform] relative z-10 hover:scale-110 duration-300"
                    >
                      <item.icon className="w-5 h-5 text-ink-2 group-hover:text-primary transition-colors" />
                    </button>

                    {/* Tooltip sits above the dock so it never renders off-screen */}
                    <AnimatePresence>
                      {hoveredIcon === item.id && isDesktop && (
                        <motion.span
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute bottom-full mb-2.5 text-[10.5px] font-medium whitespace-nowrap glass-panel px-2.5 py-1.5 rounded-md text-foreground pointer-events-none z-20 shadow-lg"
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

          {expanded && (
            <button
              onClick={() => { sound.click(); setExpanded(false); }}
              aria-label="Collapse dock"
              className="md:hidden w-8 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-ink-3 hover:text-foreground transition-colors shrink-0"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
          )}
        </motion.div>
      </div>
    </>
  );
}
