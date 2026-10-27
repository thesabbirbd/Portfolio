import React from "react";
import Link from "next/link";
import { Send, Mail, FileText } from "lucide-react";
import { SOCIAL_LINKS } from "@/data/socials";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { SectionHeader, Accent } from "@/components/system/SectionHeader";
import { Card } from "@/components/system/Card";

const email = SOCIAL_LINKS.find((l) => l.id === "gmail");
const github = SOCIAL_LINKS.find((l) => l.id === "github");
const linkedin = SOCIAL_LINKS.find((l) => l.id === "linkedin");

/**
 * Home closing chapter. Keeps id="contact" so nav/dock/hero "Contact" actions land here;
 * the full intent-based form lives on /contact.
 */
export function ContactCTA() {
  return (
    <section id="contact" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full scroll-mt-20">
      <Card variant="elevated" deco className="px-5 py-8 sm:px-10 sm:py-12 text-center">
        <SectionHeader
          index="07"
          align="center"
          expression="glass"
          eyebrow="Contact"
          title={<>Let&apos;s build something <Accent>together</Accent>.</>}
          lede="Open to building, learning and collaborating — on projects, roles and community work. Messages open as a draft in your own email app."
        />
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-primary text-on-primary font-semibold shadow-[0_10px_28px_-10px_rgb(var(--primary)/0.7)] hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Send aria-hidden="true" className="w-4 h-4" /> Write a message
          </Link>
          {email && (
            <a
              href={email.url}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 surface-card text-ink font-semibold hover:border-primary/40 transition-colors"
            >
              <Mail aria-hidden="true" className="w-4 h-4 text-primary" /> {email.handle}
            </a>
          )}
        </div>
        <div className="mt-5 flex items-center justify-center gap-1.5 text-ink-3">
          {github && (
            <a href={github.url} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2.5 rounded-full hover:bg-ink/5 hover:text-ink transition-colors">
              <GithubIcon className="w-5 h-5" />
            </a>
          )}
          {linkedin && (
            <a href={linkedin.url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2.5 rounded-full hover:bg-ink/5 hover:text-ink transition-colors">
              <LinkedinIcon className="w-5 h-5" />
            </a>
          )}
          <Link href="/resume" aria-label="Résumé" className="p-2.5 rounded-full hover:bg-ink/5 hover:text-ink transition-colors">
            <FileText className="w-5 h-5" />
          </Link>
        </div>
      </Card>
    </section>
  );
}
