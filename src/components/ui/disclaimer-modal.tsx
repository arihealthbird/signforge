"use client";

import { X, Scale, AlertCircle } from "lucide-react";

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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Top border accent */}
        <div className="h-1 w-full bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-secondary">
              <Scale className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Legal Disclaimers</h2>
              <p className="text-xs text-muted-foreground">Trademarks & usage terms</p>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="space-y-4">
            {/* Service Disclaimer */}
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Service Provided As-Is</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This tool is provided free of charge without any warranty, express or implied. 
                    Use at your own discretion.
                  </p>
                </div>
              </div>
            </div>

            {/* Trademark Section */}
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <h3 className="text-sm font-medium mb-3">Trademark Notices</h3>
              <div className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                <p>
                  <span className="font-medium text-foreground/80">Disney Properties:</span>{" "}
                  Star Wars™, Pirates of the Caribbean™, and related characters are trademarks of Disney and Lucasfilm Ltd.
                </p>
                <p>
                  <span className="font-medium text-foreground/80">Marvel Properties:</span>{" "}
                  Spider-Man™ and related characters are trademarks of Marvel Entertainment, LLC.
                </p>
                <p>
                  <span className="font-medium text-foreground/80">NBCUniversal Properties:</span>{" "}
                  The Office™ and Parks and Recreation™ are trademarks of NBCUniversal Media, LLC.
                </p>
              </div>
            </div>

            {/* Fan Tribute Notice */}
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <p className="text-xs text-blue-400 leading-relaxed">
                <span className="font-medium">Fan Tribute:</span> All themed templates are unofficial fan creations 
                made for personal, non-commercial use. We are not affiliated with or endorsed by any trademark holders.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground/70">
              © {currentYear} Open Insurance. All rights reserved.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              Got it
            </button>
          </div>
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
