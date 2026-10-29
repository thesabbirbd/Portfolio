"use client";

import React from "react";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/data/socials";
import { AIYAAR } from "@/data/aiyaar";
import { APP_VERSION } from "@/lib/version";
import { Mail, ArrowUp, MapPin, Terminal, FileText, Command, Compass, Sparkles } from "lucide-react";
import {
  GithubIcon,
  LinkedinIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon
} from "@/components/ui/BrandIcons";
import { sound } from "@/lib/sound";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  x: TwitterIcon,
  maps: MapPin,
  gmail: Mail,
};

const COLUMNS = [
  {
    title: "Explore",
    icon: Compass,
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/aiyaar", label: `Aiyaar role · ${AIYAAR.roleShort}` },
      { href: AIYAAR.url, label: "Aiyaar website ↗", external: true },
      { href: "/resume", label: "Resume" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Engineering",
    icon: Terminal,
    links: [
      { href: "/projects", label: "Projects" },
      { href: "/engineering-lab", label: "Engineering Lab" },
      { href: "/experience", label: "Experience & Skills" },
    ],
  },
  {
    title: "Discover",
    icon: Sparkles,
    links: [
      { href: "/explore", label: "Explore hub" },
      { href: "/articles", label: "Technical articles" },
      { href: "/vlogs", label: "Vlogs" },
      { href: "/news", label: "News commentary" },
      { href: "/tools", label: "Interactive tools" },
      { href: "/playground", label: "Engineering playground" },
      { href: "/games", label: "Browser games" },
    ],
  },
  {
    title: "Knowledge",
    icon: FileText,
    links: [
      { href: "/notes", label: "Engineering Notes" },
      { href: "/journal", label: "Journal" },
      { href: "/exploration", label: "Exploration" },
      { href: "/search", label: "Search" },
    ],
  },
];

/**
 * Site footer. Static (visible without JS), token-based, monochrome brand icons that wrap on
 * narrow phones, and extra bottom padding on phones so the floating dock never covers it.
 */
export function Footer() {
  const scrollToTop = () => {
    sound.launch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 w-full mt-16 md:mt-24 border-t border-line bg-surface">
      <div className="container mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-[calc(7rem+env(safe-area-inset-bottom))] md:pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10 mb-12 md:mb-16">
          <div className="col-span-2 lg:col-span-2 space-y-5">
            <p className="text-xl font-bold tracking-tight text-ink">THE SABBiR</p>
            <p className="text-sm text-ink-2 leading-relaxed max-w-sm">
              A documented learning journey through backend systems, Linux, DevOps, networking and local AI.
            </p>
            <ul className="flex flex-wrap items-center gap-2" aria-label="Profiles">
              {SOCIAL_LINKS.map((social) => {
                const Icon = ICONS[social.icon] ?? Mail;
                return (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-xl surface-card surface-interactive text-ink-2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {COLUMNS.map(({ title, icon: Icon, links }) => (
            <nav key={title} aria-label={title} className="space-y-3">
              <h2 className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-2 mb-3 md:mb-5">
                <Icon aria-hidden="true" className="w-3 h-3 text-primary" /> {title}
              </h2>
              <ul className="space-y-0.5">
                {links.map((l) => (
                  <li key={l.href}>
                    {"external" in l && l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center text-sm text-ink-2 hover:text-primary transition-colors">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="inline-flex min-h-8 items-center text-sm text-ink-2 hover:text-primary transition-colors">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-line gap-4">
          <div className="text-xs text-ink-3 flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span>&copy; {new Date().getFullYear()} Md Sabbirul Islam Khan · THE SABBiR · v{APP_VERSION}</span>
            <span aria-hidden="true" className="hidden md:inline">|</span>
            <span className="hidden md:flex items-center gap-2"><Command aria-hidden="true" className="w-3 h-3" /> Press <kbd className="px-1.5 py-0.5 bg-muted rounded border border-line font-mono text-[11px]">Ctrl+K</kbd> for the command menu</span>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 min-h-10 rounded-full surface-card surface-interactive text-xs font-medium text-ink-2 hover:text-ink"
          >
            Back to top
            <ArrowUp aria-hidden="true" className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
