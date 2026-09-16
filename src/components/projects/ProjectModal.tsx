"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Cpu, Layers, CheckCircle, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ProjectItem } from "@/data/projects";
import { sound } from "@/lib/sound";

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (project) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      sound.modalOpen();
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl glass-spatial border border-[var(--border-glass)] shadow-2xl p-6 sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={() => {
              onClose();
              sound.click();
            }}
            className="absolute top-5 right-5 p-2 rounded-full glass-interactive text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
            aria-label="Close Project Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category & Status */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
              {project.category}
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] dark:text-[var(--color-accent)] border border-[var(--color-accent)]/20">
              {project.status}
            </span>
            <span className="text-xs text-[var(--text-muted)]">&bull; {project.year}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            {project.title}
            {project.featured && <Sparkles className="w-6 h-6 text-[var(--color-primary)]" />}
          </h2>

          {/* Short tagline */}
          <p className="text-base text-[var(--color-primary)] font-medium mb-5">
            {project.shortDescription}
          </p>

          {/* Long Description */}
          <div className="p-4 sm:p-5 rounded-2xl glass-subtle border border-[var(--border-glass)] mb-6 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {project.longDescription}
          </div>

          {/* Architecture Panel */}
          {project.architecture && (
            <div className="mb-6 p-4 rounded-2xl border border-[var(--border-glass)] bg-[var(--color-primary)]/5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-2">
                <Layers className="w-4 h-4" /> System Architecture
              </div>
              <p className="text-sm font-mono text-[var(--text-primary)]">{project.architecture}</p>
            </div>
          )}

          {/* Key Engineering Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[var(--color-secondary)]" /> Key Engineering Highlights
              </h4>
              <ul className="space-y-2">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                    <CheckCircle className="w-4 h-4 text-[var(--color-accent)] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Stats Grid */}
          {project.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {project.stats.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl glass-subtle border border-[var(--border-glass)] text-center">
                  <div className="text-xs text-[var(--text-muted)] mb-1">{s.label}</div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Technologies Chips */}
          <div className="mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-mono rounded-lg glass-subtle border border-[var(--border-glass)] text-[var(--text-secondary)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Links & Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border-glass)]">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.click()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
              >
                <GithubIcon className="w-4 h-4" /> View on GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.click()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Live Destination
              </a>
            )}
            <button
              onClick={() => {
                onClose();
                sound.click();
              }}
              className="ml-auto px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
