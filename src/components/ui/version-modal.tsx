"use client";

import { X, Heart, ExternalLink } from "lucide-react";
import { ElectricLogo } from "./electric-logo";

interface VersionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APP_VERSION = "3.1.0";
const BUILD_DATE = "January 2026";

export function VersionModal({ isOpen, onClose }: VersionModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative w-full max-w-xs bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Animated rainbow top border */}
        <div 
          className="h-1 w-full"
          style={{
            background: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-mid-1), var(--gradient-mid-2), var(--gradient-mid-3), var(--gradient-mid-4), var(--gradient-end), var(--gradient-start))',
            backgroundSize: '200% 100%',
            animation: 'rainbow-border-shift 3s linear infinite',
          }}
        />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Content */}
        <div className="px-6 py-5 flex flex-col items-center text-center">
          {/* Logo with electrical effect */}
          <div className="mb-3">
            <ElectricLogo size="lg" />
          </div>

          {/* App name + version inline */}
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg" style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700 }}>SignForge</h2>
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 border border-amber-500/30">
              BETA
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            by <span className="font-medium">OpenOS</span> · v{APP_VERSION}
          </p>

          {/* Description */}
          <p className="text-xs text-muted-foreground mb-4">
            AI-powered email signature builder
          </p>

          {/* Wavy rainbow divider - surge starts here */}
          <svg className="w-full h-3 mb-4" viewBox="0 0 200 12" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient1" x1="-100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="30%">
                  <animate attributeName="stop-color" values="#ff6b6b;#4ecdc4;#a855f7;#f59e0b;#ff6b6b" dur="24s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%">
                  <animate attributeName="stop-color" values="#4ecdc4;#a855f7;#f59e0b;#ff6b6b;#4ecdc4" dur="24s" repeatCount="indefinite" />
                </stop>
                <stop offset="70%">
                  <animate attributeName="stop-color" values="#a855f7;#f59e0b;#ff6b6b;#4ecdc4;#a855f7" dur="24s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="transparent" />
                <animate attributeName="x1" values="-100%;100%;100%" keyTimes="0;0.35;1" dur="8s" repeatCount="indefinite" calcMode="linear" />
                <animate attributeName="x2" values="0%;200%;200%" keyTimes="0;0.35;1" dur="8s" repeatCount="indefinite" calcMode="linear" />
              </linearGradient>
              <filter id="electricGlow1" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Glow layer */}
            <path
              d="M0,6 Q10,2 20,6 T40,6 T60,6 T80,6 T100,6 T120,6 T140,6 T160,6 T180,6 T200,6"
              fill="none"
              stroke="url(#waveGradient1)"
              strokeWidth="4"
              opacity="0.3"
              filter="url(#electricGlow1)"
            />
            {/* Main stroke */}
            <path
              d="M0,6 Q10,2 20,6 T40,6 T60,6 T80,6 T100,6 T120,6 T140,6 T160,6 T180,6 T200,6"
              fill="none"
              stroke="url(#waveGradient1)"
              strokeWidth="1.5"
              opacity="0.8"
            />
            {/* Leading spark */}
            <circle r="2.5" opacity="0" filter="url(#electricGlow1)">
              <animate attributeName="fill" values="#ffffff;#ffffff" dur="8s" repeatCount="indefinite" />
              <animate attributeName="cx" values="0;200;200" keyTimes="0;0.35;1" dur="8s" repeatCount="indefinite" />
              <animate attributeName="cy" values="6;6;6" dur="8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.05;0.30;0.35" dur="8s" repeatCount="indefinite" />
              <animate attributeName="r" values="2;3;2" dur="0.3s" repeatCount="indefinite" />
            </circle>
          </svg>

          {/* Compact info row */}
          <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground mb-4">
            <span>{BUILD_DATE}</span>
            <span className="w-1 h-1 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid-2)]" />
            <span>Free to Use</span>
            <span className="w-1 h-1 rounded-full bg-gradient-to-r from-[var(--gradient-mid-3)] to-[var(--gradient-end)]" />
            <span className="text-emerald-500">Active</span>
          </div>

          {/* Link */}
          <a
            href="https://www.openinsurance.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-md bg-secondary hover:bg-secondary/80 transition-colors mb-4"
          >
            <ExternalLink className="w-3 h-3" />
            Website
          </a>

          {/* Copyright with wavy rainbow border - surge continues here */}
          <div className="w-full relative">
            <svg className="w-full h-3 mb-2" viewBox="0 0 200 12" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient2" x1="-100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="30%">
                    <animate attributeName="stop-color" values="#ff6b6b;#4ecdc4;#a855f7;#f59e0b;#ff6b6b" dur="24s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="50%">
                    <animate attributeName="stop-color" values="#4ecdc4;#a855f7;#f59e0b;#ff6b6b;#4ecdc4" dur="24s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="70%">
                    <animate attributeName="stop-color" values="#a855f7;#f59e0b;#ff6b6b;#4ecdc4;#a855f7" dur="24s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="transparent" />
                  <animate attributeName="x1" values="-100%;-100%;100%;100%" keyTimes="0;0.4;0.75;1" dur="8s" repeatCount="indefinite" calcMode="linear" />
                  <animate attributeName="x2" values="0%;0%;200%;200%" keyTimes="0;0.4;0.75;1" dur="8s" repeatCount="indefinite" calcMode="linear" />
                </linearGradient>
                <filter id="electricGlow2" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Glow layer */}
              <path
                d="M0,6 Q10,10 20,6 T40,6 T60,6 T80,6 T100,6 T120,6 T140,6 T160,6 T180,6 T200,6"
                fill="none"
                stroke="url(#waveGradient2)"
                strokeWidth="4"
                opacity="0.3"
                filter="url(#electricGlow2)"
              />
              {/* Main stroke */}
              <path
                d="M0,6 Q10,10 20,6 T40,6 T60,6 T80,6 T100,6 T120,6 T140,6 T160,6 T180,6 T200,6"
                fill="none"
                stroke="url(#waveGradient2)"
                strokeWidth="1.5"
                opacity="0.8"
              />
              {/* Leading spark */}
              <circle r="2.5" opacity="0" filter="url(#electricGlow2)">
                <animate attributeName="fill" values="#ffffff;#ffffff" dur="8s" repeatCount="indefinite" />
                <animate attributeName="cx" values="0;0;200;200" keyTimes="0;0.4;0.75;1" dur="8s" repeatCount="indefinite" />
                <animate attributeName="cy" values="6;6;6;6" dur="8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0;0.9;0.9;0" keyTimes="0;0.4;0.45;0.70;0.75" dur="8s" repeatCount="indefinite" />
                <animate attributeName="r" values="2;3;2" dur="0.3s" repeatCount="indefinite" />
              </circle>
            </svg>
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
              © {new Date().getFullYear()} Open Insurance · Made with <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface VersionBadgeProps {
  onClick: () => void;
}

export function VersionBadge({ onClick }: VersionBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-secondary/50 transition-all group"
    >
      <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 border border-amber-500/30 group-hover:border-amber-500/50 transition-colors">
        BETA
      </span>
      <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
        v{APP_VERSION}
      </span>
    </button>
  );
}
