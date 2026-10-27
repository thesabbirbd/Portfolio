"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageSquare, Lightbulb, Send, Mail, FileDown, Code, User, Check } from "lucide-react";
import { sound } from "@/lib/sound";
import { GlassButton } from "@/components/ui/glass/GlassButton";
import { GlassInput } from "@/components/ui/glass/GlassInput";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/data/socials";

type Intent = "hire" | "collaborate" | "community" | "general";

const CONTACT_EMAIL = "iamthesabbir@gmail.com";

const INTENTS: { id: Intent; title: string; desc: string; hint: string }[] = [
  { id: "hire", title: "Career / Hiring", desc: "Roles, internships or contract work.", hint: "The resume and project case studies are the quickest way to see what I can do." },
  { id: "collaborate", title: "Collaboration", desc: "Open source, learning projects or partnerships.", hint: "Share the idea or repository — I'm happy to discuss scope and approach." },
  { id: "community", title: "Community / Mentorship", desc: "Knowledge sharing or tech community.", hint: "Always happy to talk Linux, local AI and networking setups." },
  { id: "general", title: "General", desc: "Just saying hi or anything else.", hint: "Write whatever you like below." },
];

const LABEL = "text-xs font-bold uppercase tracking-widest text-ink-3 mb-1.5 block";

/**
 * Intent-first contact flow. Order is the same on every screen size — choose a reason, write
 * the message, then quick links — so on phones the form appears right under the choice.
 * There is no server endpoint: the form opens a pre-filled draft in the visitor's own email app
 * and the UI says exactly that, with a copy fallback for devices without a mail client.
 */
export function ContactSection() {
  const [intent, setIntent] = useState<Intent | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    _honey: "" // Honeypot field
  });

  const current = INTENTS.find((i) => i.id === intent) ?? null;

  const handleIntent = (i: Intent) => {
    sound.click();
    setIntent(i);
    setIsSuccess(false);
    // Phones: the form sits below the choices — bring its top into view after this explicit tap.
    requestAnimationFrame(() => {
      const el = formRef.current;
      if (el && el.getBoundingClientRect().top > window.innerHeight * 0.6) {
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }
    });
  };

  const subjectText = `Inquiry: ${current?.title ?? "General"}`;
  const bodyText = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.click();

    // Anti-spam: If honeypot is filled, ignore silently
    if (formData._honey) {
      return;
    }

    window.location.href = mailtoHref;
    setIsSuccess(true);
  };

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${CONTACT_EMAIL}\nSubject: ${subjectText}\n\n${bodyText}`);
      setCopied(true);
      sound.success();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const fade = reduced ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.2 } };

  return (
    <section id="contact" className="pb-12 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full scroll-mt-20">
      <div className="grid md:grid-cols-12 gap-x-8 lg:gap-x-12 gap-y-8">
        {/* 1 · Intent */}
        <div className="md:col-span-5">
          <h2 className="font-mono text-eyebrow uppercase text-ink-3 mb-3"><span className="text-primary">01</span> · Choose a reason</h2>
          <div role="radiogroup" aria-label="Reason for contact" className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3">
            {INTENTS.map((i) => (
              <IntentButton key={i.id} active={intent === i.id} onClick={() => handleIntent(i.id)} title={i.title} desc={i.desc} />
            ))}
          </div>
        </div>

        {/* 2 · Message */}
        <div ref={formRef} className="md:col-span-7 md:col-start-6 md:row-start-1 md:row-span-2 scroll-mt-6">
          <h2 className="font-mono text-eyebrow uppercase text-ink-3 mb-3"><span className="text-primary">02</span> · Write your message</h2>
          <AnimatePresence mode="wait" initial={false}>
            {!current ? (
              <motion.div
                key="empty"
                {...fade}
                className="flex flex-col items-center justify-center text-center p-6 md:p-8 md:min-h-[380px] rounded-card border border-dashed border-line-strong bg-muted/30"
              >
                <MessageSquare aria-hidden="true" className="w-9 h-9 text-ink-3 mb-3" />
                <p className="text-sm text-ink-2 max-w-xs">
                  Pick a reason to open the form. It prepares an email draft — nothing is sent until you press Send in your email app.
                </p>
              </motion.div>
            ) : isSuccess ? (
              <motion.div
                key="success"
                {...fade}
                role="status"
                className="flex flex-col items-center justify-center text-center p-6 md:p-8 md:min-h-[380px] rounded-card border border-primary/25 bg-primary/5"
              >
                <Mail aria-hidden="true" className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-ink mb-2">Draft opened in your email app</h3>
                <p className="text-sm sm:text-base text-ink-2 max-w-sm mb-6">
                  Nothing has been sent yet — press <strong>Send</strong> in your email app to deliver it.
                  If no email app opened, copy the draft and send it to <span className="font-mono text-ink break-all">{CONTACT_EMAIL}</span>.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <GlassButton onClick={copyDraft} variant="primary" magnetic={false}>
                    {copied ? <><Check aria-hidden="true" className="w-4 h-4" /> Copied</> : "Copy draft"}
                  </GlassButton>
                  <GlassButton onClick={() => setIsSuccess(false)} variant="secondary" magnetic={false}>
                    Edit message
                  </GlassButton>
                  <a href={mailtoHref} className="inline-flex min-h-10 items-center text-sm font-medium text-primary hover:underline underline-offset-4">Open email app again</a>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" {...fade} className="rounded-card surface-elevated p-4 sm:p-6 md:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-ink">{current.title}</h3>
                <p className="mt-2 mb-5 p-3 rounded-lg bg-muted text-sm text-ink-2 flex items-start gap-2">
                  <Lightbulb aria-hidden="true" className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span>{current.hint}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="_honey"
                    aria-hidden="true"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData._honey}
                    onChange={(e) => setFormData({...formData, _honey: e.target.value})}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className={LABEL}>Name</label>
                      <GlassInput
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className={LABEL}>Email</label>
                      <GlassInput
                        id="contact-email"
                        name="email"
                        autoComplete="email"
                        required
                        type="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className={LABEL}>Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      placeholder="What would you like to talk about?"
                      className="w-full surface-card px-4 py-3 text-base sm:text-sm rounded-xl outline-none text-ink placeholder:text-ink-3 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-[border-color,box-shadow] resize-y"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-12 py-3 px-4 bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  >
                    <Send aria-hidden="true" className="w-4 h-4" /> Compose in email app
                  </button>
                  <p className="text-xs text-ink-3 text-center">
                    Opens a pre-filled draft in your email app — or write directly to{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-ink hover:text-primary break-all">{CONTACT_EMAIL}</a>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3 · Quick links */}
        <div className="md:col-span-5 pt-6 border-t border-line">
          <h2 className="font-mono text-eyebrow uppercase text-ink-3 mb-3">Or look around first</h2>
          <div className="flex flex-wrap gap-2">
            <a href="/cv/Md-Sabbirul-Islam-Khan-CV-2026.pdf" download className="inline-flex min-h-10 items-center gap-2 px-4 rounded-full surface-card surface-interactive text-sm font-semibold text-ink">
              <FileDown aria-hidden="true" className="w-4 h-4" /> CV (PDF)
            </a>
            <Link href="/resume" className="inline-flex min-h-10 items-center gap-2 px-4 rounded-full surface-card surface-interactive text-sm font-semibold text-ink">
              Resume
            </Link>
            <a href="https://github.com/thesabbirbd" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 px-4 rounded-full surface-card surface-interactive text-sm font-semibold text-ink">
              <Code aria-hidden="true" className="w-4 h-4" /> GitHub
            </a>
            <a href={SOCIAL_LINKS.find((l) => l.id === "linkedin")?.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 px-4 rounded-full surface-card surface-interactive text-sm font-semibold text-ink">
              <User aria-hidden="true" className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntentButton({ active, onClick, title, desc }: { active: boolean, onClick: () => void, title: string, desc: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "w-full h-full text-left p-3 md:p-4 rounded-xl border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        active ? "bg-primary/10 border-primary" : "surface-card hover:border-line-strong"
      )}
    >
      <span className={cn("block text-sm md:text-base font-bold mb-0.5 md:mb-1", active ? "text-primary" : "text-ink")}>{title}</span>
      <span className="block text-xs text-ink-2 leading-snug">{desc}</span>
    </button>
  );
}
