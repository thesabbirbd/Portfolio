"use client";

import { useEffect } from "react";
import { GlowButton } from "@/components/ui/GlowButton";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 animate-pulse">
        <AlertCircle className="w-10 h-10" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          System Error Encountered
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We encountered an unexpected error processing your request. The experience has been safely paused.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <GlowButton 
          onClick={() => reset()}
          variant="primary"
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Recover & Retry
        </GlowButton>
        <GlowButton 
          href="/"
          variant="glass"
          icon={<Home className="w-4 h-4" />}
        >
          Return to Core
        </GlowButton>
      </div>
    </div>
  );
}
