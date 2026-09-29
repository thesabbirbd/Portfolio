"use client";

import React from "react";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/data/socials";
import { Mail, ArrowUp, MapPin, Terminal, Activity, FileText, Briefcase, Command, Compass } from "lucide-react";
import { 
  GithubIcon, 
  LinkedinIcon, 
  FacebookIcon, 
  InstagramIcon, 
  TwitterIcon 
} from "@/components/ui/BrandIcons";
import { sound } from "@/lib/sound";

import { motion } from "framer-motion";

export function Footer() {
  const scrollToTop = () => {
    sound.click();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getSocialIcon = (icon: string) => {
    const baseClass = "w-5 h-5 icon-3d-punchy transition-transform group-hover:scale-110";
    switch (icon) {
      case "github":
        return <GithubIcon className={`${baseClass} text-indigo-400`} />;
      case "linkedin":
        return <LinkedinIcon className={`${baseClass} text-blue-500`} />;
      case "facebook":
        return <FacebookIcon className={`${baseClass} text-blue-600`} />;
      case "instagram":
        return <InstagramIcon className={`${baseClass} text-pink-500`} />;
      case "x":
        return <TwitterIcon className={`${baseClass} text-zinc-300`} />;
      case "maps":
        return <MapPin className={`${baseClass} text-emerald-500`} />;
      case "gmail":
      default:
        return <Mail className={`${baseClass} text-red-500`} />;
    }
  };

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5 }}
      className="relative z-10 w-full mt-32 border-t border-border/50 bg-background/50 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 md:px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold tracking-tight text-foreground">THE SABBiR</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              An engineering-first platform documenting my journey through backend systems, local AI orchestration, DevOps, and network architecture.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-zinc-900/30 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-zinc-800 transition-all group"
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-6">
              <Compass className="w-3 h-3 text-primary" /> Explore
            </h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Identity</Link></li>
              <li><Link href="/resume" className="text-sm text-muted-foreground hover:text-primary transition-colors">Resume</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-6">
              <Terminal className="w-3 h-3 text-primary" /> Engineering
            </h4>
            <ul className="space-y-3">
              <li><Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/engineering-lab" className="text-sm text-muted-foreground hover:text-primary transition-colors">Laboratory</Link></li>
              <li><Link href="/experience" className="text-sm text-muted-foreground hover:text-primary transition-colors">Skills & Tech</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-6">
              <FileText className="w-3 h-3 text-primary" /> Knowledge
            </h4>
            <ul className="space-y-3">
              <li><Link href="/notes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Engineering Notes</Link></li>
              <li><Link href="/journal" className="text-sm text-muted-foreground hover:text-primary transition-colors">Process Logs</Link></li>
              <li><Link href="/exploration" className="text-sm text-muted-foreground hover:text-primary transition-colors">Exploration</Link></li>
              <li><Link href="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">Search Graph</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/30 gap-4">
          <div className="text-xs text-muted-foreground flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span>&copy; {new Date().getFullYear()} Md Sabbirul Islam Khan.</span>
            <span className="hidden md:inline text-border/50">|</span>
            <span className="flex items-center gap-2"><Command className="w-3 h-3" /> Press <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border/50 font-mono text-[10px]">Ctrl+K</kbd> for Command Center</span>
          </div>
          
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/30 border border-border/50 hover:bg-zinc-800 transition-all text-xs font-medium text-muted-foreground hover:text-foreground"
            aria-label="Scroll to top"
          >
            Back to top
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.footer>
  );
}
