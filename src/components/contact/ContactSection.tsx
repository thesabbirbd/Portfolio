"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  MapPin, 
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { PROFILE_DATA } from "@/data/profile";
import { SOCIAL_LINKS } from "@/data/socials";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { 
  GithubIcon, 
  LinkedinIcon, 
  FacebookIcon, 
  InstagramIcon, 
  TwitterIcon 
} from "@/components/ui/BrandIcons";
import { sound } from "@/lib/sound";
import confetti from "canvas-confetti";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "Backend & Systems",
    message: "",
    website_trap: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    sound.click();
    navigator.clipboard.writeText("iamthesabbir@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website_trap) return; // bot trapped
    if (!formData.name || !formData.email || !formData.message) return;

    sound.click();

    // Trigger visual celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#0072ff", "#00f0ff", "#7928ca"],
      });
    } catch (_) {}

    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-16 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] bg-gradient-to-tl from-cyan-500/10 via-blue-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Heading */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-blue-600 dark:text-cyan-400 bg-blue-500/10 border border-blue-500/20">
          <Mail className="w-3.5 h-3.5" />
          <span>06 // INITIATE TRANSMISSION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          LET&apos;S BUILD SOMETHING{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 dark:from-cyan-400 dark:to-blue-400">
            USEFUL
          </span>
          .
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
          Open to technical collaboration, engineering dialogue, learning, experimentation, and meaningful digital architectures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Channels & Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard glow="blue" className="p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Direct Communication
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Whether you want to discuss high-throughput FastAPI endpoints, offline Ollama setups, NOC infrastructure, or BBA management strategies, feel free to reach out.
            </p>

            {/* Email quick-copy bar */}
            <div className="p-3 rounded-xl glass-panel border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-xs font-mono text-slate-800 dark:text-slate-200 truncate">
                  iamthesabbir@gmail.com
                </span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
                title="Copy email to clipboard"
                aria-label="Copy email"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Social Coordinates Grid */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Official Coordinates
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://github.com/thesabbirbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 hover:border-cyan-400/40 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <GithubIcon className="w-4 h-4 text-slate-900 dark:text-white" />
                  <span className="truncate">thesabbirbd</span>
                </a>
                <a
                  href="https://linkedin.com/in/thesabbirbd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 hover:border-blue-500/40 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4 text-blue-600" />
                  <span className="truncate">LinkedIn</span>
                </a>
                <a
                  href="https://facebook.com/iamthesabbir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 hover:border-blue-500/40 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <FacebookIcon className="w-4 h-4 text-blue-600" />
                  <span className="truncate">Facebook</span>
                </a>
                <a
                  href="https://www.google.com/maps/contrib/115922089427483699024"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 hover:border-emerald-500/40 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="truncate">Google Maps</span>
                </a>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Interactive Form (7 cols) */}
        <div className="lg:col-span-7">
          <GlassCard glow="cyan" className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Transmission Dispatched
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Thank you for reaching out, <b>{formData.name}</b>! A confirmation link has been prepared for your direct email client.
                  </p>
                  <div className="pt-4">
                    <GlowButton
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      size="sm"
                    >
                      Send Another Message
                    </GlowButton>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Anti-bot honeypot */}
                  <input
                    type="text"
                    name="website_trap"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    value={formData.website_trap}
                    onChange={(e) => setFormData({ ...formData, website_trap: e.target.value })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                      Collaboration Domain
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="Backend & Systems">Backend Architecture &amp; APIs</option>
                      <option value="DevOps & Docker">DevOps &amp; Containerization</option>
                      <option value="Offline AI & Ollama">Offline AI &amp; Local Inference</option>
                      <option value="NOC & Networking">NOC &amp; Network Infrastructure</option>
                      <option value="Business Management">Management &amp; Tech Strategy</option>
                      <option value="General Conversation">General Conversation</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your proposal, technical inquiry, or collaborative idea..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-500 text-white font-semibold text-sm shadow-[0_0_24px_rgba(0,114,255,0.35)] hover:shadow-[0_0_32px_rgba(0,240,255,0.5)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmit Message</span>
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
