"use client";

import { SIGNATURE_TEMPLATES } from "@/lib/templates";
import { TemplateId } from "@/lib/templates";
import { clsx } from "clsx";
import { Check, Layout } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelect: (templateId: TemplateId) => void;
}

const categoryColors = {
  professional: "bg-blue-500",
  creative: "bg-purple-500",
  minimal: "bg-slate-500",
  corporate: "bg-emerald-500",
};

const categoryTextColors = {
  professional: "text-blue-500",
  creative: "text-purple-500",
  minimal: "text-slate-500",
  corporate: "text-emerald-500",
};

// Elegant SVG preview icons
const TemplatePreviewIcon = ({ templateId, category }: { templateId: string; category: string }) => {
  const accentClass = categoryTextColors[category as keyof typeof categoryTextColors] || "text-slate-400";
  
  switch (templateId) {
    case "professional-classic":
      // Photo left, vertical line, stacked content
      return (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          <rect x="4" y="8" width="16" height="16" rx="8" className="fill-muted-foreground/30" />
          <line x1="24" y1="6" x2="24" y2="42" className={`stroke-current ${accentClass}`} strokeWidth="2" />
          <rect x="28" y="8" width="24" height="3" rx="1" className="fill-muted-foreground/50" />
          <rect x="28" y="14" width="18" height="2" rx="1" className="fill-muted-foreground/30" />
          <rect x="28" y="20" width="28" height="2" rx="1" className="fill-muted-foreground/30" />
          <rect x="28" y="26" width="22" height="2" rx="1" className="fill-muted-foreground/30" />
          <circle cx="30" cy="36" r="3" className="fill-muted-foreground/30" />
          <circle cx="38" cy="36" r="3" className="fill-muted-foreground/30" />
          <circle cx="46" cy="36" r="3" className="fill-muted-foreground/30" />
        </svg>
      );
    
    case "minimal-modern":
      // Horizontal inline, underline accent
      return (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          <rect x="4" y="10" width="20" height="3" rx="1" className="fill-muted-foreground/50" />
          <line x1="26" y1="10" x2="26" y2="14" className="stroke-muted-foreground/40" strokeWidth="1" />
          <rect x="28" y="10" width="14" height="2" rx="1" className="fill-muted-foreground/30" />
          <rect x="4" y="17" width="16" height="2" rx="1" className={`fill-current ${accentClass} opacity-60`} />
          <line x1="4" y1="22" x2="56" y2="22" className={`stroke-current ${accentClass}`} strokeWidth="2" />
          <rect x="4" y="28" width="22" height="2" rx="1" className="fill-muted-foreground/30" />
          <rect x="30" y="28" width="14" height="2" rx="1" className="fill-muted-foreground/30" />
          <circle cx="8" cy="38" r="3" className="fill-muted-foreground/30" />
          <circle cx="16" cy="38" r="3" className="fill-muted-foreground/30" />
          <circle cx="24" cy="38" r="3" className="fill-muted-foreground/30" />
        </svg>
      );
    
    case "corporate-bold":
      // Logo left with divider, bold structure
      return (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          <rect x="4" y="12" width="18" height="12" rx="2" className="fill-muted-foreground/30" />
          <rect x="8" y="16" width="10" height="4" rx="1" className="fill-muted-foreground/50" />
          <line x1="26" y1="8" x2="26" y2="40" className={`stroke-current ${accentClass}`} strokeWidth="2" />
          <rect x="30" y="10" width="22" height="4" rx="1" className="fill-muted-foreground/50" />
          <rect x="30" y="17" width="16" height="2" rx="1" className={`fill-current ${accentClass} opacity-60`} />
          <rect x="30" y="23" width="20" height="2" rx="1" className="fill-muted-foreground/30" />
          <text x="30" y="32" className="fill-muted-foreground/50" style={{ fontSize: '6px' }}>E:</text>
          <rect x="38" y="29" width="18" height="2" rx="1" className="fill-muted-foreground/30" />
          <text x="30" y="39" className="fill-muted-foreground/50" style={{ fontSize: '6px' }}>P:</text>
          <rect x="38" y="36" width="12" height="2" rx="1" className="fill-muted-foreground/30" />
        </svg>
      );
    
    case "creative-gradient":
      // Gradient card, rounded, playful
      return (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          <defs>
            <linearGradient id={`grad-${templateId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={`${accentClass}`} style={{ stopOpacity: 0.2 }} />
              <stop offset="100%" className={`${accentClass}`} style={{ stopOpacity: 0.05 }} />
            </linearGradient>
          </defs>
          <rect x="2" y="4" width="60" height="40" rx="4" fill={`url(#grad-${templateId})`} className="stroke-muted-foreground/10" strokeWidth="1" />
          <line x1="2" y1="4" x2="2" y2="44" className={`stroke-current ${accentClass}`} strokeWidth="3" />
          <rect x="8" y="10" width="14" height="14" rx="4" className="fill-muted-foreground/30" />
          <rect x="26" y="10" width="24" height="3" rx="1" className="fill-muted-foreground/50" />
          <rect x="26" y="16" width="28" height="2" rx="1" className={`fill-current ${accentClass} opacity-50`} />
          <rect x="26" y="24" width="20" height="2" rx="1" className="fill-muted-foreground/30" />
          <rect x="26" y="30" width="16" height="2" rx="1" className="fill-muted-foreground/30" />
          <rect x="8" y="36" width="20" height="5" rx="2.5" className={`fill-current ${accentClass} opacity-50`} />
        </svg>
      );
    
    case "executive-elegant":
      // Centered, sophisticated, photo top
      return (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          <circle cx="32" cy="10" r="8" className="fill-muted-foreground/30" />
          <circle cx="32" cy="10" r="9" className={`stroke-current ${accentClass}`} strokeWidth="1.5" fill="none" />
          <rect x="16" y="22" width="32" height="3" rx="1" className="fill-muted-foreground/50" />
          <rect x="22" y="28" width="20" height="2" rx="1" className={`fill-current ${accentClass} opacity-50`} />
          <line x1="26" y1="34" x2="38" y2="34" className={`stroke-current ${accentClass}`} strokeWidth="1.5" />
          <rect x="20" y="38" width="24" height="2" rx="1" className="fill-muted-foreground/30" />
          <circle cx="26" cy="44" r="2" className="fill-muted-foreground/30" />
          <circle cx="32" cy="44" r="2" className="fill-muted-foreground/30" />
          <circle cx="38" cy="44" r="2" className="fill-muted-foreground/30" />
        </svg>
      );
    
    case "startup-fresh":
      // Modern, pill badges, casual
      return (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          <rect x="4" y="6" width="12" height="8" rx="2" className="fill-muted-foreground/30" />
          <rect x="20" y="8" width="20" height="3" rx="1" className="fill-muted-foreground/50" />
          <rect x="4" y="18" width="18" height="5" rx="2.5" className={`fill-current ${accentClass} opacity-25`} />
          <rect x="6" y="19.5" width="14" height="2" rx="1" className={`fill-current ${accentClass} opacity-70`} />
          <rect x="24" y="19" width="14" height="2" rx="1" className="fill-muted-foreground/30" />
          <rect x="4" y="28" width="24" height="2" rx="1" className="fill-muted-foreground/30" />
          <rect x="32" y="28" width="16" height="2" rx="1" className="fill-muted-foreground/30" />
          <rect x="4" y="36" width="10" height="6" rx="2" className="fill-muted-foreground/20" />
          <rect x="16" y="36" width="10" height="6" rx="2" className="fill-muted-foreground/20" />
          <rect x="28" y="36" width="10" height="6" rx="2" className="fill-muted-foreground/20" />
          <rect x="42" y="36" width="16" height="6" rx="3" className={`fill-current ${accentClass} opacity-50`} />
        </svg>
      );
    
    default:
      return (
        <svg viewBox="0 0 64 48" className="w-full h-full">
          <rect x="4" y="8" width="56" height="32" rx="2" className="fill-muted-foreground/20" />
          <rect x="8" y="12" width="20" height="3" rx="1" className="fill-muted-foreground/30" />
          <rect x="8" y="18" width="40" height="2" rx="1" className="fill-muted-foreground/30" />
        </svg>
      );
  }
};

export function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Layout className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs sm:text-sm font-medium">Choose a Template</span>
      </div>
      
      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        {SIGNATURE_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id as TemplateId)}
            className={clsx(
              "group relative rounded-xl text-left transition-all overflow-hidden bg-card",
              selectedTemplate === template.id
                ? "border-rainbow-animated shadow-md"
                : "border border-border hover:border-primary/50"
            )}
          >
            {/* Visual Preview Section */}
            <div 
              className={clsx(
                "relative w-full h-20 bg-muted/50 border-b border-border/50 transition-colors"
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center p-3">
                <div className="w-full max-w-[140px] h-full opacity-80 group-hover:opacity-100 transition-opacity">
                  <TemplatePreviewIcon templateId={template.id} category={template.category} />
                </div>
              </div>
              
              {/* Selected indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-primary rounded-full shadow-sm">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </div>

            {/* Template Info Section */}
            <div className="p-2 sm:p-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-xs sm:text-sm text-foreground truncate">{template.name}</h4>
                <span
                  className={clsx(
                    "px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] text-white font-medium capitalize flex-shrink-0",
                    categoryColors[template.category]
                  )}
                >
                  {template.category}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-1">
                {template.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
