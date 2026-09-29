"use client";

import React, { useEffect, useState, useRef } from "react";
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

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { theme, setTheme } = useTheme();
  const { spatial3D, toggle3D, soundEnabled, toggleSound, reducedMotion, toggleMotion, setLens } = useSettings();
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        sound.click();
      }
      if (e.key === "/" && !open) {
        // Prevent if typing in an input
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
        e.preventDefault();
        setOpen(true);
        sound.click();
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
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
    { category: "NAVIGATION", name: "Search Knowledge Base", icon: Search, action: () => runCommand(() => window.location.href = '/search') },
    { category: "NAVIGATION", name: "Home", icon: Home, action: () => runCommand(() => window.location.href = '/') },
    { category: "NAVIGATION", name: "About", icon: User, action: () => runCommand(() => window.location.href = '/about') },
    { category: "NAVIGATION", name: "Experience & Skills", icon: Terminal, action: () => runCommand(() => window.location.href = '/experience') },

    { category: "NAVIGATION", name: "Journey & Timeline", icon: Activity, action: () => runCommand(() => window.location.href = '/about#timeline') },
    { category: "NAVIGATION", name: "Resume", icon: Briefcase, action: () => runCommand(() => window.location.href = '/resume') },
    { category: "NAVIGATION", name: "Projects", icon: Folder, action: () => runCommand(() => window.location.href = '/projects') },
    { category: "NAVIGATION", name: "Engineering Lab", icon: Terminal, action: () => runCommand(() => window.location.href = '/engineering-lab') },
    { category: "NAVIGATION", name: "Notes", icon: Box, action: () => runCommand(() => window.location.href = '/notes') },
    { category: "NAVIGATION", name: "Journal", icon: Box, action: () => runCommand(() => window.location.href = '/journal') },
    { category: "NAVIGATION", name: "Maps & Exploration", icon: Globe, action: () => runCommand(() => window.location.href = '/exploration') },
    { category: "NAVIGATION", name: "Contact", icon: MessageSquare, action: () => runCommand(() => window.location.href = '/contact') },
    
    // WORK / QUICK EXPLORE
    ...PROJECTS_DATA.map(p => ({
      category: "WORK",
      name: `Project: \${p.title}`,
      icon: Briefcase,
      action: () => runCommand(() => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        // Assuming project system handles expansion natively on scroll
      })
    })),
    
    // EXPERIENCE LENSES
    { category: "EXPERIENCE LENSES", name: `View as: Engineer`, icon: Terminal, action: () => runCommand(() => { setLens('engineer'); window.location.href = '/projects'; }) },
    { category: "EXPERIENCE LENSES", name: `View as: Professional / Recruiter`, icon: Briefcase, action: () => runCommand(() => { setLens('professional'); window.location.href = '/resume'; }) },
    { category: "EXPERIENCE LENSES", name: `View as: Explorer`, icon: Globe, action: () => runCommand(() => { setLens('explorer'); window.location.href = '/exploration'; }) },
    { category: "EXPERIENCE LENSES", name: `View as: General (Default)`, icon: Home, action: () => runCommand(() => { setLens('general'); window.location.href = '/'; }) },

    // PREFERENCES
    { category: "PREFERENCES", name: `Toggle 3D: \${spatial3D ? 'OFF' : 'ON'}`, icon: Box, action: () => runCommand(() => toggle3D()) },
    { category: "PREFERENCES", name: `Change Theme: \${theme === 'dark' ? 'Light' : 'Dark'}`, icon: Palette, action: () => runCommand(() => setTheme(theme === 'dark' ? 'light' : 'dark')) },
    { category: "PREFERENCES", name: `Toggle Sound: \${soundEnabled ? 'OFF' : 'ON'}`, icon: Volume2, action: () => runCommand(() => toggleSound()) },
    { category: "PREFERENCES", name: `Toggle Motion: \${reducedMotion ? 'Enable' : 'Reduce'}`, icon: Activity, action: () => runCommand(() => toggleMotion()) },
    
    // CONNECT
    { category: "CONNECT", name: "LinkedIn", icon: LinkedinIcon, action: () => runCommand(() => window.open(SOCIAL_LINKS.find(l => l.id === "linkedin")?.url || "", '_blank')) },
    { category: "CONNECT", name: "GitHub", icon: GithubIcon, action: () => runCommand(() => window.open(SOCIAL_LINKS.find(l => l.id === "github")?.url || "", '_blank')) },
    { category: "CONNECT", name: "Email", icon: Mail, action: () => runCommand(() => window.location.href = SOCIAL_LINKS.find(l => l.id === "gmail")?.url || "") },
  ];

  const filteredCommands = search === "" 
    ? commands 
    : commands.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()));

  // Group by category
  const grouped = filteredCommands.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, typeof commands>);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                placeholder="Search THE SABBiR..."
                className="bg-transparent border-none outline-none flex-1 text-foreground placeholder:text-muted font-medium text-lg"
              />
              <button 
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 scroll-smooth">
              {Object.keys(grouped).length === 0 ? (
                <div className="p-8 text-center text-muted text-sm font-mono">
                  No matching commands.
                </div>
              ) : (
                Object.keys(grouped).map((category) => (
                  <motion.div layout key={category} className="mb-4 last:mb-0">
                    <div className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-muted uppercase">
                      {category}
                    </div>
                    {grouped[category].map((cmd, i) => (
                      <motion.button layout key={cmd.name}
                        onClick={cmd.action}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-primary/10 hover:shadow-[0_0_10px_rgba(var(--primary),0.2)_inset] transition-all duration-200 text-left group"
                      >
                        <cmd.icon className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                        {cmd.name}
                      </motion.button>
                    ))}
                  </motion.div>
                ))
              )}
            </div>

            {/* Shortcut Help Footer */}
            <div className="px-4 py-3 border-t border-white/5 bg-background/20 flex items-center justify-between text-[10px] text-muted font-mono uppercase tracking-wider hidden sm:flex">
              <div className="flex gap-4">
                <span><kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 mr-1">⌘K</kbd> Command Center</span>
                <span><kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 mr-1">ESC</kbd> Close</span>
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

function User(props: any) {
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
