"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDebounce } from '@/hooks/use-debounce';
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, X, Home, Folder, Cpu, Terminal, Globe, MessageSquare, Palette, Box, Volume2, Activity, Mail, Briefcase } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { useTheme } from "next-themes";
import { useSettings } from "@/contexts/SettingsContext";
import { PROJECTS_DATA } from "@/data/projects";
import { SOCIAL_LINKS } from "@/data/socials";
import { sound } from "@/lib/sound";
import { GlassInput } from "@/components/ui/glass/GlassInput";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { projectHref } from "@/data/projects";
import { OPEN_COMMAND_MENU, isTypingTarget, openTerminal } from "@/lib/ui-events";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // ⚡ Bolt: Debounce the search query to optimize performance
  // 💡 What: Apply 200ms debounce to the search input state
  // 🎯 Why: CommandMenu has a complex DOM structure. Preventing re-renders on every keystroke makes it feel snappier.
  // 📊 Impact: Prevents lag during rapid typing in the command menu.
  // 🔬 Measurement: Observe React Profiler; filtering and DOM updates now happen smoothly.
  const debouncedSearch = useDebounce(search, 200);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const { spatial3D, toggle3D, soundEnabled, toggleSound, reducedMotion, toggleMotion, setLens } = useSettings();
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl/⌘+K and "/" listeners, plus the explicit open event used by nav buttons.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        sound.click();
      } else if (e.key === "/" && !open && !isTypingTarget(e.target)) {
        e.preventDefault();
        setOpen(true);
        sound.click();
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    const openMenu = () => setOpen(true);
    window.addEventListener("keydown", down);
    window.addEventListener(OPEN_COMMAND_MENU, openMenu);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener(OPEN_COMMAND_MENU, openMenu);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearch(""); // Reset search when closed
    }
  }, [open]);

  const runCommand = (command: () => void) => {
    sound.click();
    command();
    setOpen(false);
  };

  const commands = [
    // NAVIGATION
    { category: "NAVIGATION", name: "Search Knowledge Base", icon: Search, action: () => runCommand(() => router.push('/search')) },
    { category: "NAVIGATION", name: "Home", icon: Home, action: () => runCommand(() => router.push('/')) },
    { category: "NAVIGATION", name: "Aiyaar Ltd — Chief Project Manager", icon: Briefcase, action: () => runCommand(() => router.push('/aiyaar')) },
    { category: "NAVIGATION", name: "About", icon: User, action: () => runCommand(() => router.push('/about')) },
    { category: "NAVIGATION", name: "Experience & Skills", icon: Terminal, action: () => runCommand(() => router.push('/experience')) },

    { category: "NAVIGATION", name: "Journey & Timeline", icon: Activity, action: () => runCommand(() => router.push('/about#timeline')) },
    { category: "NAVIGATION", name: "Resume", icon: Briefcase, action: () => runCommand(() => router.push('/resume')) },
    { category: "NAVIGATION", name: "Download CV (PDF)", icon: Briefcase, action: () => runCommand(() => { window.location.href = "/cv/Md-Sabbirul-Islam-Khan-CV-2026.pdf"; }) },
    { category: "NAVIGATION", name: "Projects", icon: Folder, action: () => runCommand(() => router.push('/projects')) },
    { category: "NAVIGATION", name: "Engineering Lab", icon: Terminal, action: () => runCommand(() => router.push('/engineering-lab')) },
    { category: "NAVIGATION", name: "Notes", icon: Box, action: () => runCommand(() => router.push('/notes')) },
    { category: "NAVIGATION", name: "Journal", icon: Box, action: () => runCommand(() => router.push('/journal')) },
    { category: "NAVIGATION", name: "Maps & Exploration", icon: Globe, action: () => runCommand(() => router.push('/exploration')) },
    { category: "NAVIGATION", name: "Contact", icon: MessageSquare, action: () => runCommand(() => router.push('/contact')) },
    
    // WORK / QUICK EXPLORE
    ...PROJECTS_DATA.map(p => ({
      category: "WORK",
      name: `Project: ${p.title}`,
      icon: Briefcase,
      action: () => runCommand(() => router.push(projectHref(p)))
    })),
    
    // EXPERIENCE LENSES
    { category: "EXPERIENCE LENSES", name: `View as: Engineer`, icon: Terminal, action: () => runCommand(() => { setLens('engineer'); router.push('/projects'); }) },
    { category: "EXPERIENCE LENSES", name: `View as: Professional / Recruiter`, icon: Briefcase, action: () => runCommand(() => { setLens('professional'); router.push('/resume'); }) },
    { category: "EXPERIENCE LENSES", name: `View as: Explorer`, icon: Globe, action: () => runCommand(() => { setLens('explorer'); router.push('/exploration'); }) },
    { category: "EXPERIENCE LENSES", name: `View as: General (Default)`, icon: Home, action: () => runCommand(() => { setLens('general'); router.push('/'); }) },

    // PREFERENCES
    { category: "PREFERENCES", name: `Toggle 3D: ${spatial3D ? 'OFF' : 'ON'}`, icon: Box, action: () => runCommand(() => toggle3D()) },
    { category: "PREFERENCES", name: `Change Theme: ${resolvedTheme === 'dark' ? 'Light' : 'Dark'}`, icon: Palette, action: () => runCommand(() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')) },
    { category: "PREFERENCES", name: `Toggle Sound: ${soundEnabled ? 'OFF' : 'ON'}`, icon: Volume2, action: () => runCommand(() => toggleSound()) },
    { category: "PREFERENCES", name: `Toggle Motion: ${reducedMotion ? 'Enable' : 'Reduce'}`, icon: Activity, action: () => runCommand(() => toggleMotion()) },
    
    // CONNECT
    { category: "CONNECT", name: "LinkedIn", icon: LinkedinIcon, action: () => runCommand(() => window.open(SOCIAL_LINKS.find(l => l.id === "linkedin")?.url || "", '_blank', 'noopener,noreferrer')) },
    { category: "CONNECT", name: "GitHub", icon: GithubIcon, action: () => runCommand(() => window.open(SOCIAL_LINKS.find(l => l.id === "github")?.url || "", '_blank', 'noopener,noreferrer')) },
    { category: "CONNECT", name: "Email", icon: Mail, action: () => runCommand(() => { window.location.href = SOCIAL_LINKS.find(l => l.id === "gmail")?.url || "mailto:iamthesabbir@gmail.com"; }) },
    { category: "CONNECT", name: "Terminal", icon: Terminal, action: () => runCommand(openTerminal) },
  ];

  const filteredCommands = debouncedSearch === ""
    ? commands 
    : (() => {
        const q = debouncedSearch.toLowerCase();
        return commands.filter(c => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
      })();

  // Group by category
  const grouped = filteredCommands.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, typeof commands>);

  const flat = Object.values(grouped).flat();

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedSearch, open]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (flat.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      flat[activeIndex]?.action();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 pt-[12vh] sm:pt-4" role="dialog" aria-modal="true" aria-label="Command menu">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-2xl spatial-glass-heavy rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-4 border-b border-white/10 dark:border-white/5 flex items-center gap-3 bg-background/40">
              <Command className="w-5 h-5 text-primary" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search THE SABBiR..."
                aria-label="Search commands"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-menu-list"
                aria-activedescendant={flat[activeIndex] ? `cmd-${activeIndex}` : undefined}
                className="bg-transparent border-none outline-none flex-1 min-w-0 text-foreground placeholder:text-ink-3 font-medium text-base sm:text-lg"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close command menu"
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-ink-3"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={listRef} id="command-menu-list" role="listbox" className="flex-1 overflow-y-auto overscroll-contain p-2">
              {Object.keys(grouped).length === 0 ? (
                <div className="p-8 text-center text-ink-3 text-sm font-mono">
                  No matching commands.
                </div>
              ) : (
                Object.keys(grouped).map((category) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <div className="px-3 py-1.5 text-[11px] font-bold tracking-widest text-ink-3 uppercase">
                      {category}
                    </div>
                    {grouped[category].map((cmd) => {
                      const index = flat.indexOf(cmd);
                      const active = index === activeIndex;
                      return (
                      <button key={cmd.name}
                        id={`cmd-${index}`}
                        data-index={index}
                        role="option"
                        aria-selected={active}
                        onClick={cmd.action}
                        onMouseMove={() => !active && setActiveIndex(index)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 text-left group",
                          active ? "bg-primary/10 text-foreground" : "text-foreground/80"
                        )}
                      >
                        <cmd.icon className={cn("w-4 h-4 transition-colors", active ? "text-primary" : "text-ink-3")} />
                        {cmd.name}
                      </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Shortcut Help Footer */}
            <div className="px-4 py-3 border-t border-white/5 bg-background/20 hidden sm:flex items-center justify-between text-[11px] text-ink-3 font-mono uppercase tracking-wider">
              <div className="flex gap-4">
                <span><kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 mr-1">⌘K</kbd> Command Center</span>
                <span><kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 mr-1">ESC</kbd> Close</span>
                <span><kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 mr-1">↑↓</kbd> Navigate</span>
                <span><kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 mr-1">↵</kbd> Select</span>
              </div>
              <div>THE SABBiR OS</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
