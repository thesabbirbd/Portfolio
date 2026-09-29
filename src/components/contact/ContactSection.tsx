"use client";

import React, { useState } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Zap, Send, Mail, CheckCircle2, ChevronRight, FileDown, Code, User } from "lucide-react";
import { sound } from "@/lib/sound";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/glass/GlassButton";
import { GlassInput } from "@/components/ui/glass/GlassInput";
import Link from "next/link";

type Intent = "hire" | "collaborate" | "community" | "general" | null;

export function ContactSection() {
  const [intent, setIntent] = useState<Intent>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    _honey: "" // Honeypot field
  });

  const handleIntent = (i: Intent) => {
    sound.click();
    setIntent(i);
    setIsSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.click();
    
    // Anti-spam: If honeypot is filled, ignore silently
    if (formData._honey) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission / Mailto fallback
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Since there is no real backend, open mailto as fallback but show success state in UI
      const subject = encodeURIComponent(`Inquiry: ${intent?.toUpperCase()}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
      window.location.href = `mailto:iamthesabbir@gmail.com?subject=${subject}&body=${body}`;
    }, 800);
  };

  return (
    <section id="contact" className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      <SectionReveal className="w-full">

      <div className="grid md:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Intent & Routing */}
        <div className="md:col-span-5 space-y-8">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-foreground mb-4">
              Professional Inquiry
            </h2>
            <p className="text-muted-foreground">
              What is the primary reason for contact? Selecting a path helps guide the conversation.
            </p>
          </div>

          <div className="space-y-3">
            <IntentButton 
              active={intent === 'hire'} 
              onClick={() => handleIntent('hire')}
              title="Career / Hiring" 
              desc="Full-time roles, contracts, or engineering positions."
            />
            <IntentButton 
              active={intent === 'collaborate'} 
              onClick={() => handleIntent('collaborate')}
              title="Technical Collaboration" 
              desc="Open source, system architecture, or project partnerships."
            />
            <IntentButton 
              active={intent === 'community'} 
              onClick={() => handleIntent('community')}
              title="Community / Mentorship" 
              desc="Knowledge sharing, guidance, or tech community."
            />
            <IntentButton 
              active={intent === 'general'} 
              onClick={() => handleIntent('general')}
              title="General Contact" 
              desc="Just saying hi or other inquiries."
            />
          </div>

          <div className="pt-8 border-t border-border/50">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Quick Links</h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/resume" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 text-sm font-semibold transition-colors">
                <FileDown className="w-4 h-4" /> Resume
              </Link>
              <a href="https://github.com/thesabbirbd" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 text-sm font-semibold transition-colors">
                <Code className="w-4 h-4" /> GitHub
              </a>
              <a href="https://bd.linkedin.com/in/thesabbirbd" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 text-sm font-semibold transition-colors">
                <User className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="md:col-span-7">
          <AnimatePresence mode="wait">
            {!intent ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-dashed border-border/50 bg-muted/10"
              >
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Select an Option</h3>
                <p className="text-muted-foreground max-w-sm">
                  Choose a reason for contact on the left to view the appropriate form and evidence paths.
                </p>
              </motion.div>
            ) : isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-primary/20 bg-primary/5"
              >
                <CheckCircle2 className="w-16 h-16 text-primary mb-6" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Transmission Ready</h3>
                <p className="text-muted-foreground max-w-sm mb-8">
                  Your email client has been opened to complete the transmission. I usually respond within 48 hours for professional inquiries.
                </p>
                <GlassButton onClick={() => setIsSuccess(false)} variant="secondary">
                  Send Another Message
                </GlassButton>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard heavy className="p-6 md:p-8 border-border/50 shadow-2xl">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-foreground capitalize">
                      {intent.replace('-', ' ')}
                    </h3>
                    
                    {/* Evidence Path Context */}
                    <div className="mt-3 p-3 rounded-lg bg-muted text-sm text-muted-foreground flex items-start gap-2">
                      <Zap className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                      <div>
                        {intent === 'hire' && "Reviewing my Interactive Resume or Projects is recommended before reaching out for hiring."}
                        {intent === 'collaborate' && "Looking forward to hearing your architectural ideas or open-source proposals."}
                        {intent === 'community' && "Always happy to discuss Linux, local AI, and networking setups."}
                        {intent === 'general' && "Drop a message below."}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Honeypot */}
                    <input 
                      type="text" 
                      name="_honey" 
                      style={{ display: 'none' }} 
                      tabIndex={-1} 
                      autoComplete="off"
                      value={formData._honey}
                      onChange={(e) => setFormData({...formData, _honey: e.target.value})}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">Name</label>
                        <GlassInput 
                          required 
                          placeholder="John Doe" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">Email</label>
                        <GlassInput 
                          required 
                          type="email" 
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">Message</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Detailed message..."
                        className="w-full bg-background border border-border/50 px-4 py-3 text-sm rounded-xl outline-none text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Transmit Message
                        </>
                      )}
                    </button>
                  </form>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      </SectionReveal>
    </section>
  );
}

function IntentButton({ active, onClick, title, desc }: { active: boolean, onClick: () => void, title: string, desc: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group flex items-center justify-between
        ${active 
          ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]' 
          : 'bg-muted/30 border-border/50 hover:bg-muted hover:border-border'}
      `}
    >
      <div>
        <h4 className={`font-bold mb-1 ${active ? 'text-primary' : 'text-foreground'}`}>{title}</h4>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ChevronRight className={`w-5 h-5 transition-transform ${active ? 'text-primary translate-x-1' : 'text-muted-foreground group-hover:text-foreground'}`} />
    </button>
  );
}
