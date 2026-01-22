"use client";

import { Pen } from "lucide-react";

interface AnimatedLogoProps {
  className?: string;
}

export function AnimatedLogo({ className = "" }: AnimatedLogoProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg border-rainbow-animated flex items-center justify-center bg-background relative overflow-visible">
        <Pen className="w-3 h-3 sm:w-3.5 sm:h-3.5 relative z-10" />
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-md sm:rounded-lg bg-gradient-to-br from-[var(--gradient-start)]/5 via-transparent to-[var(--gradient-end)]/5" />
      </div>
      {/* Ambient glow behind logo */}
      <div 
        className="absolute inset-0 rounded-md sm:rounded-lg opacity-30 blur-md -z-10"
        style={{
          background: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-mid-3), var(--gradient-end))',
          animation: 'rainbow-border-shift 4s linear infinite',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
}
