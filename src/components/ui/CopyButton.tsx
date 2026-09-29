"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { sound } from "@/lib/sound";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    sound.click();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-100 transition-colors border border-white/5 flex items-center justify-center"
      aria-label="Copy to clipboard"
      title={copied ? "Copied!" : "Copy"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
          >
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
          >
            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
