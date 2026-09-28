"use client";

import React, { useState } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Zap, Map, Send, Mail, CheckCircle2 } from "lucide-react";
import { sound } from "@/lib/sound";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { GlassButton } from "@/components/ui/glass/GlassButton";
import { GlassInput } from "@/components/ui/glass/GlassInput";

export function ContactSection() {
  const [activeTab, setActiveTab] = useState<"talk" | "collaborate" | "explore" | null>(null);

  const handleTabClick = (tab: "talk" | "collaborate" | "explore") => {
    sound.click();
    setActiveTab(activeTab === tab ? null : tab);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <SectionReveal className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-gray-100 mb-4">
          LET'S BUILD <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">SOMETHING USEFUL</span>.
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">WHAT DO YOU WANT TO DO?</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <GlassButton
          variant={activeTab === "talk" ? "primary" : "secondary"}
          onClick={() => handleTabClick("talk")}
          icon={<MessageSquare className="w-4 h-4" />}
          iconPosition="left"
        >
          Talk
        </GlassButton>
        <GlassButton
          variant={activeTab === "collaborate" ? "primary" : "secondary"}
          onClick={() => handleTabClick("collaborate")}
          icon={<Zap className="w-4 h-4" />}
          iconPosition="left"
        >
          Collaborate
        </GlassButton>
        <GlassButton
          variant={activeTab === "explore" ? "primary" : "secondary"}
          onClick={() => handleTabClick("explore")}
          icon={<Map className="w-4 h-4" />}
          iconPosition="left"
        >
          Explore
        </GlassButton>
      </div>

      <AnimatePresence mode="wait">
        {activeTab && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <GlassCard heavy className="p-6 md:p-8 border-white/10 shadow-2xl">
              {activeTab === "talk" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Just say hi!</h3>
                  <GlassInput placeholder="Your Name" />
                  <GlassInput type="email" placeholder="Email Address" />
                  <textarea
                    rows={3}
                    placeholder="Message..."
                    className="w-full spatial-glass px-4 py-3 text-sm rounded-xl outline-none placeholder:text-slate-700 dark:text-slate-300 dark:placeholder:text-slate-700 dark:text-slate-300 text-gray-900 dark:text-gray-100 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                  
                  <GlassButton 
                    className="w-full" 
                    onClick={() => {
                      sound.click();
                      window.location.href = "mailto:iamthesabbir@gmail.com?subject=Hello from THE SABBiR V2.4&body=I tried to use the contact form, but I'm opening this via mailto since the backend is pending.";
                    }}
                  >
                    Open Email Client
                  </GlassButton>
                  <p className="text-xs text-center text-slate-700 dark:text-slate-300 mt-2">
                    * Backend configuration pending. This will open your default email client.
                  </p>

                </div>
              )}
              
              {activeTab === "collaborate" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Let's build something.</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <GlassInput placeholder="Company / Startup" />
                    <GlassInput placeholder="Role" />
                  </div>
                  <GlassInput placeholder="Project Description" />
                  
                  <GlassButton 
                    variant="primary" 
                    className="w-full" 
                    onClick={() => {
                      sound.click();
                      window.location.href = "mailto:iamthesabbir@gmail.com?subject=Collaboration Proposal";
                    }}
                  >
                    Open Email Client
                  </GlassButton>
                  <p className="text-xs text-center text-slate-700 dark:text-slate-300 mt-2">
                    * Backend configuration pending. This will open your default email client.
                  </p>

                </div>
              )}

              {activeTab === "explore" && (
                <div className="text-center py-8 space-y-4">
                  <Map className="w-12 h-12 text-cyan-400 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Geospatial Data & Mapping</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md mx-auto">
                    Check out my Local Guides profile or reach out for custom mapping solutions and 360 degree photography.
                  </p>
                  <GlassButton
                    variant="secondary"
                    className="mx-auto"
                    onClick={() => window.open("https://maps.google.com", "_blank")}
                  >
                    View Contributions
                  </GlassButton>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionReveal>
    </section>
  );
}
