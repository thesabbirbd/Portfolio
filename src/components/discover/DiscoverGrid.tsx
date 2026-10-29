import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DISCOVER_SECTIONS } from "@/data/discover";
import { RoleIcon } from "@/components/system/Card";
import { cn } from "@/lib/utils";

/** The six Discover sections as link cards (Home chapter + /explore hub). */
export function DiscoverGrid({ counts, className }: { counts?: Partial<Record<string, string>>; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4", className)}>
      {DISCOVER_SECTIONS.map(({ id, href, title, label, blurb, Icon, role }) => (
        <li key={id} className="reveal">
          <Link
            href={href}
            className="group lux-card relative flex sm:flex-col gap-3 h-full rounded-card surface-card surface-interactive p-4 sm:p-5 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <RoleIcon role={role} className="w-9 h-9 sm:w-10 sm:h-10 shrink-0">
              <Icon className="w-[18px] h-[18px]" />
            </RoleIcon>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="font-mono text-eyebrow uppercase text-ink-3">{label}{counts?.[id] ? ` · ${counts[id]}` : ""}</span>
                <ArrowUpRight aria-hidden="true" className="w-4 h-4 text-ink-3 group-hover:text-primary transition-colors" />
              </span>
              <span className="block text-base font-bold text-ink mt-1">{title}</span>
              <span className="block text-sm text-ink-2 mt-1 leading-snug">{blurb}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
