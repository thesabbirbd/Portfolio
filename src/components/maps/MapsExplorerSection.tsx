"use client";

import React from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { MapPin, Globe, Award, Camera, ExternalLink, Gift, Compass } from "lucide-react";
import dynamic from "next/dynamic";
import { COMMUNITY_DATA } from "@/data/community";
import { sound } from "@/lib/sound";
import { ImageTrail } from "@/components/ui/ImageTrail";
import { useSettings } from "@/contexts/SettingsContext";

const LazyGlobe = dynamic(() => import("@/components/maps/Globe"), {
  ssr: false,
});

export function MapsExplorerSection() {
  const { maps } = COMMUNITY_DATA;
  const { spatial3D } = useSettings();

  return (
    <section id="maps" className="py-8 sm:py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      <SectionReveal className="w-full">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] dark:text-[var(--color-accent)] mb-4">
          <Globe className="w-3.5 h-3.5" />
          Geospatial Mapping &bull; 360&deg; VR
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-2 sm:mb-4">
          🌍 Maps, Places &amp; Exploration
        </h2>
        <p className="max-w-2xl text-xs sm:text-lg text-[var(--text-muted)] px-4 sm:px-0">
          Connecting local landmarks, roads, and cultural sites of Bangladesh to the global knowledge graph.
        </p>
      </div>

      {/* Main Greenify Glassmorphism Feature Card */}
      <ImageTrail images={[
        "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1506744626753-143683923-28?auto=format&fit=crop&w=400&q=80"
      ]}>
        <div className="rounded-2xl sm:rounded-3xl glass-emerald p-4 sm:p-10 border border-[var(--color-accent)]/25 shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center">
            {/* Left Column: Story & Recognition */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] dark:text-[var(--color-accent)] border border-[var(--color-accent)]/30 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> {maps.stats.status}
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" /> Google HQ Gift Recipient 🎁
                </span>
              </div>

              <h3 className="text-lg sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
                Google Maps Local Guide &amp; 360&deg; Street View Photographer
              </h3>

              <p className="text-[11px] sm:text-base text-[var(--text-secondary)] leading-snug sm:leading-relaxed">
                {maps.narrative}
              </p>

              {/* Feature Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
                <div className="flex items-start gap-2 sm:gap-2.5 text-[10px] sm:text-sm text-[var(--text-secondary)] leading-tight sm:leading-normal">
                  <Camera className="w-4 h-4 text-[var(--color-accent)] shrink-0 mt-0.5" />
                  <span>Spherical 360&deg; photography published on Google Street View</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                  <MapPin className="w-4 h-4 text-[var(--color-accent)] shrink-0 mt-0.5" />
                  <span>Active Member of Google Local Guides Bangladesh</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                  <Compass className="w-4 h-4 text-[var(--color-accent)] shrink-0 mt-0.5" />
                  <span>Verified business places, road networks &amp; navigation points</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                  <Gift className="w-4 h-4 text-[var(--color-accent)] shrink-0 mt-0.5" />
                  <span>Direct recognition and physical rewards from Google Headquarters</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 sm:pt-4">
                <a
                  href={maps.profileUrl}
                  target="_blank" rel="noopener noreferrer"
                  rel="noopener noreferrer"
                  onClick={() => sound.click()}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-[10px] sm:text-sm bg-[var(--color-accent)] hover:bg-[var(--color-accent)] text-white transition-colors shadow-md shadow-emerald-600/20"
                >
                  <Globe className="w-4 h-4" /> View Local Guide Profile
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href={maps.featuredLocationUrl}
                  target="_blank" rel="noopener noreferrer"
                  rel="noopener noreferrer"
                  onClick={() => sound.click()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm glass-subtle border border-[var(--color-accent)]/30 text-[var(--color-accent)] dark:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors"
                >
                  <MapPin className="w-4 h-4" /> Featured Location Pin
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>

            {/* Right Column: 3D Interactive Globe (Lazy Loaded) */}
            <div className="lg:col-span-5 flex flex-col justify-center items-center relative h-64 lg:h-96 w-full">
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/10 to-transparent blur-3xl rounded-full" />
               <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <React.Suspense fallback={<div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />}>
                    {spatial3D ? <LazyGlobe /> : <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-muted)] p-8 text-center bg-black/5 dark:bg-white/5 rounded-3xl border border-black/10 dark:border-white/10"><Globe className="w-8 h-8 mb-4 opacity-50" /><p className="text-sm">3D Spatial Core Disabled</p><p className="text-xs opacity-70 mt-1">Enable 3D in System Settings</p></div>}
                  </React.Suspense>
               </div>
            </div>
          </div>
        </div>
      </ImageTrail>
    </SectionReveal>
    </section>
  );
}
