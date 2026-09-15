"use client";

import React from "react";
import { MapPin, Globe, Award, Camera, ExternalLink, Gift, Compass } from "lucide-react";
import { COMMUNITY_DATA } from "@/data/community";
import { sound } from "@/lib/sound";

export function MapsExplorerSection() {
  const { maps } = COMMUNITY_DATA;

  return (
    <section id="maps" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4">
          <Globe className="w-3.5 h-3.5" />
          Geospatial Mapping &bull; 360&deg; VR
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
          🌍 Maps, Places &amp; Exploration
        </h2>
        <p className="max-w-2xl text-base sm:text-lg text-[var(--text-muted)]">
          Connecting local landmarks, roads, and cultural sites of Bangladesh to the global knowledge graph.
        </p>
      </div>

      {/* Main Greenify Glassmorphism Feature Card */}
      <div className="rounded-3xl glass-emerald p-6 sm:p-10 border border-emerald-500/25 shadow-xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Story & Recognition */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> {maps.stats.status}
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" /> Google HQ Gift Recipient 🎁
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Google Maps Local Guide &amp; 360&deg; Street View Photographer
            </h3>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {maps.narrative}
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                <Camera className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Spherical 360&deg; photography published on Google Street View</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Active Member of Google Local Guides Bangladesh</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                <Compass className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Verified business places, road networks &amp; navigation points</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                <Gift className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Direct recognition and physical rewards from Google Headquarters</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a
                href={maps.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.click()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md shadow-emerald-600/20"
              >
                <Globe className="w-4 h-4" /> View Local Guide Profile
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <a
                href={maps.featuredLocationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.click()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm glass-subtle border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              >
                <MapPin className="w-4 h-4" /> Featured Location Pin
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>

          {/* Right Column: Visual Infographic Badge / Glass Display */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-5 rounded-2xl glass-subtle border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--text-muted)]">GEOSPATIAL PLATFORM</span>
                <span className="text-xs font-bold text-emerald-500">VERIFIED</span>
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                Local Guides Bangladesh Community
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-normal">
                Continuous voluntary community mapping empowering local businesses, tourism discovery, and real-time transit routing across Rajshahi and surrounding districts.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                  Street View 360&deg;
                </span>
                <span className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                  HQ Recognition
                </span>
                <span className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                  Local Guides BD
                </span>
              </div>
            </div>

            {/* Quick Quote */}
            <div className="p-4 rounded-2xl glass-subtle border border-[var(--border-glass)] text-xs text-[var(--text-secondary)] italic">
              &ldquo;Volunteering on Google Maps bridges the physical world with the open digital web, enabling millions of travelers to find accurate directions and authentic local places.&rdquo;
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
