"use client";

import React from "react";
import Link from "next/link";
import { PROFILE_DATA } from "@/data/profile";
import { Mail, ArrowUp } from "lucide-react";
import { 
  GithubIcon, 
  LinkedinIcon, 
  FacebookIcon, 
  InstagramIcon, 
  TwitterIcon 
} from "@/components/ui/BrandIcons";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialIcons: Record<string, React.ReactNode> = {
    Github: <GithubIcon className="w-4 h-4" />,
    Linkedin: <LinkedinIcon className="w-4 h-4" />,
    Facebook: <FacebookIcon className="w-4 h-4" />,
    Instagram: <InstagramIcon className="w-4 h-4" />,
    Twitter: <TwitterIcon className="w-4 h-4" />,
    Mail: <Mail className="w-4 h-4" />,
  };

  return (
    <footer className="relative border-t border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md pt-16 pb-24 md:pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-500/10 dark:bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Main Statement */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Crafted with precision by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 dark:from-cyan-400 dark:to-blue-400">
                {PROFILE_DATA.shortName}
              </span>
              .
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400 tracking-wide">
              Business × Engineering × AI × Systems
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Built to Architect • Deploy • Learn • Scale
            </p>
          </div>

          {/* Social Links & Back to Top */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center gap-2">
              {PROFILE_DATA.socials.slice(0, 6).map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-2.5 rounded-full glass-panel hover:border-cyan-400/50 hover:text-cyan-500 transition-all hover:scale-110 text-slate-600 dark:text-slate-300"
                >
                  {socialIcons[social.icon] || <Mail className="w-4 h-4" />}
                </a>
              ))}
            </div>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
            >
              <span>Back to surface</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200/50 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono">SYSTEM ONLINE • sabbir.nav.bd</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Md Sabbirul Islam Khan. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
