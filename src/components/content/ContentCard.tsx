import Link from 'next/link';
import { ContentItem } from '@/lib/content';
import { formatContentDate } from '@/lib/content-date';
import { DemoBadge } from '@/components/discover/DemoBadge';
import { Clock, Wrench } from 'lucide-react';
import { sound } from '@/lib/sound';

const COMPANION_TOOL_MAP: Record<string, { label: string; href: string }> = {
  "bcs-teletalk-passport-photo-and-signature-size-guide-bd": { label: "Gov Photo Sizer", href: "/tools/gov-photo-sizer" },
  "freelancer-remittance-payoneer-wise-to-bank-2-5-percent-incentive-bd": { label: "2.5% Remittance Calc", href: "/tools/remittance-calculator" },
  "command-palette-omnibar-and-keyboard-first-saas-ux-design": { label: "Raycast Omnibar", href: "/tools" },
  "automating-shop-khata-to-excel-with-ai": { label: "Khata OCR Scanner", href: "/tools/khata-scanner" },
  "how-to-remove-bg-and-optimize-product-photos": { label: "Background Remover", href: "/tools/bg-remover" },
  "docker-security-hardening-checklist-2026": { label: "Docker Hardener", href: "/tools/docker-hardener" },
  "scannable-barcode-and-qr-engineering-for-pos": { label: "Barcode & QR Studio", href: "/tools/barcode-studio" },
  "browser-web-audio-and-canvas-image-editing-architecture": { label: "Audio & Image DAW", href: "/tools/audio-editor" },
  "building-ephemeral-24h-sharing-and-saas-rbac-in-postgresql": { label: "24h Share Engine", href: "/explore" },
  "cidr-without-a-calculator": { label: "Subnet Calculator", href: "/tools" },
};

/**
 * Card for notes, journal entries, lab write-ups, and articles.
 * Includes estimated reading time, difficulty badge, and companion studio link.
 */
export function ContentCard({ item, baseUrl }: { item: ContentItem; baseUrl: string }) {
  const { meta, content } = item;
  const wordCount = (content || meta.description || "").split(/\s+/).length;
  const readTimeMin = Math.max(2, Math.ceil(wordCount / 180));
  const companion = meta.slug ? COMPANION_TOOL_MAP[meta.slug] : undefined;

  return (
    <Link
      href={`${baseUrl}/${meta.slug}`}
      className="reveal group block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <article className="flex flex-col h-full p-4 sm:p-6 rounded-card surface-card surface-interactive group-hover:-translate-y-0.5">
        {meta.coverImage && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted mb-3.5 border border-line/60">
            <img
              src={meta.coverImage}
              alt={meta.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-2.5 sm:mb-4 font-mono text-[11px] sm:text-xs">
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
            {meta.category || 'Note'}
          </span>
          {meta.difficulty && (
            <span className="px-2 py-0.5 rounded-md bg-muted text-ink-2 font-mono">
              {meta.difficulty}
            </span>
          )}
          {meta.demo && <DemoBadge />}
          <span className="text-ink-3 inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-ink-3" />
            <span>{readTimeMin} min read</span>
          </span>
          <time dateTime={meta.date} className="text-ink-3 ml-auto">
            {formatContentDate(meta.date)}
          </time>
        </div>
        <h3 className="text-base sm:text-xl font-bold text-ink mb-1.5 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {meta.title}
        </h3>
        <p className="text-sm text-ink-2 line-clamp-2 sm:line-clamp-3 leading-relaxed sm:mb-4 flex-grow">
          {meta.description}
        </p>

        {/* Companion Studio Pill & Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-2 border-t border-line/40">
          <div className="hidden sm:flex flex-wrap gap-1.5">
            {meta.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] font-mono text-ink-3 bg-muted px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>

          {companion && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                sound.navigate();
                window.location.href = companion.href;
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-mono font-semibold transition"
              title={`Open ${companion.label}`}
            >
              <Wrench className="w-3 h-3" />
              <span>🛠️ {companion.label}</span>
            </button>
          )}
        </div>
      </article>
    </Link>
  );
}
