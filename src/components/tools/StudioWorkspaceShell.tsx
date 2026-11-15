"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Code2 } from "lucide-react";
import { BanglaGuideModal } from "@/components/ui/BanglaGuideModal";

interface Props {
  title: string;
  badge?: string;
  category?: string;
  description?: string;
  children: React.ReactNode;
}

export function StudioWorkspaceShell({
  title,
  badge = "Dedicated Studio",
  category = "Utilities",
  description,
  children,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/tools"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Tools
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
              {category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>{title}</span>
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/tools/embed-widget-studio"
            className="px-3 py-2 rounded-xl border border-border bg-card/60 hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm text-foreground"
            title="Embed this tool on your website as a free widget"
          >
            <span>🧩</span>
            <span>Embed on Your Website</span>
          </Link>
          <BanglaGuideModal topic="tools" />
        </div>
      </div>

      {/* Main Studio Body */}
      <div>{children}</div>
    </div>
  );
}
