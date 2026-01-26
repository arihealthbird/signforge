"use client";

import { X, Scale } from "lucide-react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-background border border-border rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">Legal Disclaimers</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {/* Service Notice */}
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            This tool is provided free of charge, as-is, without warranty. Use at your own discretion.
          </p>

          {/* Trademarks */}
          <div className="text-[11px] text-muted-foreground leading-relaxed space-y-1.5">
            <p className="font-medium text-foreground/80 text-xs">Trademark Notices</p>
            <p>Star Wars™, Pirates of the Caribbean™ — Disney/Lucasfilm Ltd.</p>
            <p>Spider-Man™ — Marvel Entertainment, LLC.</p>
            <p>The Office™, Parks and Recreation™ — NBCUniversal Media, LLC.</p>
          </div>

          {/* Fan Tribute */}
          <p className="text-[11px] text-blue-400/80 leading-relaxed">
            All themed templates are unofficial fan creations for personal, non-commercial use. Not affiliated with or endorsed by any trademark holders.
          </p>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-secondary/30 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground/60">
            © {currentYear} Open Insurance
          </p>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-[11px] font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

interface DisclaimerLinkProps {
  onClick: () => void;
}

export function DisclaimerLink({ onClick }: DisclaimerLinkProps) {
  return (
    <button
      onClick={onClick}
      className="text-[10px] text-muted-foreground/70 hover:text-muted-foreground transition-colors underline underline-offset-2"
    >
      Disclaimers
    </button>
  );
}
