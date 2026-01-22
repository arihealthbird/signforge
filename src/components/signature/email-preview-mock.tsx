"use client";

import { ReactNode } from "react";
import { EmailThemeId, getEmailTheme } from "@/lib/email-themes";
import { clsx } from "clsx";
import { ThemeParticles } from "@/components/ui/theme-particles";

interface EmailPreviewMockProps {
  emailTheme: EmailThemeId;
  previewTheme: "light" | "dark";
  senderEmail: string;
  children: ReactNode; // The signature preview
  isAIGenerating?: boolean;
  deviceWidth?: number; // Optional device width for responsive preview
}

// Captain Jack Pirate Theme - Treasure Map Scroll Component
function CaptainJackScroll({
  theme,
  isDark,
  senderEmail,
  children,
  isAIGenerating,
  deviceWidth,
}: {
  theme: ReturnType<typeof getEmailTheme>;
  isDark: boolean;
  senderEmail: string;
  children: ReactNode;
  isAIGenerating: boolean;
  deviceWidth?: number;
}) {
  // Responsive width - use deviceWidth if provided, default to 600px
  const containerWidth = deviceWidth || 600;
  const contentWidth = Math.max(containerWidth - 80, 280); // Inner content width with padding
  const scale = containerWidth < 500 ? containerWidth / 600 : 1;
  
  // Pirate color palette - aged parchment and treasure gold
  // Parchment is always a brownish paper color, so text must ALWAYS be dark for contrast
  const parchmentBg = isDark ? "#3d3020" : "#f4e4c1";
  const parchmentBgSecondary = isDark ? "#352a1c" : "#e8d4a8";
  const parchmentBgTertiary = isDark ? "#2a2218" : "#dcc89a";
  const woodColor = isDark ? "#3d2e1e" : "#5c4033";
  const woodColorLight = isDark ? "#5a4530" : "#8b6914";
  const goldColor = isDark ? "#d4af37" : "#c9a227";
  const goldColorLight = isDark ? "#f4cf57" : "#e8c547";
  const brassColor = isDark ? "#b5a642" : "#a89832";
  // Text must be dark in BOTH modes since parchment is always light/tan colored
  const textColor = "#2c1810";
  const textMuted = "#5c4a38";
  const inkColor = "#1a0f08";
  
  return (
    <div className="min-h-fit relative p-4 flex items-start justify-center overflow-hidden" style={{ width: containerWidth }}>
      {/* Treasure Map Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDark 
            ? `linear-gradient(135deg, #1a2a20 0%, #2a3a30 30%, #1a3d4d 70%, #1a2a20 100%)`
            : `linear-gradient(135deg, #d4c4a0 0%, #c4b490 30%, #a8c8d8 70%, #d4c4a0 100%)`,
        }}
      />
      
      {/* Map grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Compass Rose - Top Left */}
      <div 
        className="absolute top-4 left-4 opacity-50 pointer-events-none"
        style={{ width: '80px', height: '80px' }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer circle */}
          <circle cx="50" cy="50" r="45" stroke={goldColor} strokeWidth="2" fill="none" opacity="0.6"/>
          <circle cx="50" cy="50" r="40" stroke={goldColor} strokeWidth="1" fill="none" opacity="0.4"/>
          {/* Main compass points */}
          <polygon points="50,5 55,40 50,35 45,40" fill={goldColor} opacity="0.8"/>
          <polygon points="50,95 55,60 50,65 45,60" fill={textMuted} opacity="0.6"/>
          <polygon points="5,50 40,45 35,50 40,55" fill={textMuted} opacity="0.6"/>
          <polygon points="95,50 60,45 65,50 60,55" fill={textMuted} opacity="0.6"/>
          {/* Diagonal points */}
          <polygon points="15,15 40,42 35,38 38,35" fill={textMuted} opacity="0.4"/>
          <polygon points="85,15 60,42 65,38 62,35" fill={textMuted} opacity="0.4"/>
          <polygon points="15,85 40,58 35,62 38,65" fill={textMuted} opacity="0.4"/>
          <polygon points="85,85 60,58 65,62 62,65" fill={textMuted} opacity="0.4"/>
          {/* Center */}
          <circle cx="50" cy="50" r="8" fill={goldColor} opacity="0.7"/>
          <circle cx="50" cy="50" r="4" fill={isDark ? '#1a1610' : '#f4e4c1'}/>
          {/* N marker */}
          <text x="50" y="18" textAnchor="middle" fontSize="10" fill={goldColor} fontWeight="bold">N</text>
          {/* W E S markers */}
          <text x="17" y="54" textAnchor="middle" fontSize="8" fill={textMuted}>W</text>
          <text x="83" y="54" textAnchor="middle" fontSize="8" fill={textMuted}>E</text>
          <text x="50" y="92" textAnchor="middle" fontSize="8" fill={textMuted}>S</text>
        </svg>
      </div>
      
      {/* Skull and Crossbones - Top Right Corner */}
      <div 
        className="absolute top-3 right-3 opacity-40 pointer-events-none"
        style={{ width: '50px', height: '50px' }}
      >
        <svg viewBox="0 0 50 50" fill={textColor} xmlns="http://www.w3.org/2000/svg">
          {/* Skull */}
          <ellipse cx="25" cy="18" rx="12" ry="14" fill={textColor} opacity="0.9"/>
          {/* Eye sockets */}
          <ellipse cx="20" cy="16" rx="4" ry="5" fill={isDark ? '#1a1610' : '#2c1810'}/>
          <ellipse cx="30" cy="16" rx="4" ry="5" fill={isDark ? '#1a1610' : '#2c1810'}/>
          {/* Nose */}
          <path d="M25 22 L23 26 L27 26 Z" fill={isDark ? '#1a1610' : '#2c1810'}/>
          {/* Teeth */}
          <rect x="19" y="28" width="3" height="5" fill={textColor}/>
          <rect x="24" y="28" width="3" height="5" fill={textColor}/>
          <rect x="29" y="28" width="3" height="5" fill={textColor}/>
          {/* Crossbones */}
          <rect x="5" y="38" width="40" height="5" rx="2" fill={textColor} opacity="0.8" transform="rotate(-25 25 40)"/>
          <rect x="5" y="38" width="40" height="5" rx="2" fill={textColor} opacity="0.8" transform="rotate(25 25 40)"/>
        </svg>
      </div>
      
      {/* Dashed treasure path */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        viewBox="0 0 600 620"
        preserveAspectRatio="none"
      >
        <path 
          d="M80 520 Q150 480, 180 450 Q210 420, 260 440 Q310 460, 350 420 Q390 380, 420 400 Q450 420, 480 380 Q510 340, 520 300"
          stroke={goldColor}
          strokeWidth="3"
          strokeDasharray="15 10"
          fill="none"
          strokeLinecap="round"
        />
        {/* X marks the spot */}
        <g transform="translate(510, 290)">
          <line x1="-10" y1="-10" x2="10" y2="10" stroke={goldColor} strokeWidth="4" strokeLinecap="round"/>
          <line x1="10" y1="-10" x2="-10" y2="10" stroke={goldColor} strokeWidth="4" strokeLinecap="round"/>
        </g>
        {/* Small X markers along path */}
        <g transform="translate(180, 450)" opacity="0.5">
          <line x1="-4" y1="-4" x2="4" y2="4" stroke={textMuted} strokeWidth="2"/>
          <line x1="4" y1="-4" x2="-4" y2="4" stroke={textMuted} strokeWidth="2"/>
        </g>
        <g transform="translate(350, 420)" opacity="0.5">
          <line x1="-4" y1="-4" x2="4" y2="4" stroke={textMuted} strokeWidth="2"/>
          <line x1="4" y1="-4" x2="-4" y2="4" stroke={textMuted} strokeWidth="2"/>
        </g>
      </svg>
      
      {/* Main Parchment Scroll */}
      <div 
        className="relative z-10"
        style={{
          filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))",
        }}
      >
        {/* Top scroll roll */}
        <div 
          className="relative mx-4"
          style={{
            height: '28px',
            background: `linear-gradient(180deg, 
              ${parchmentBgTertiary} 0%, 
              ${parchmentBgSecondary} 40%, 
              ${parchmentBg} 100%
            )`,
            borderRadius: '14px 14px 0 0',
            boxShadow: `
              inset 0 -8px 12px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'},
              0 -2px 4px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}
            `,
          }}
        >
          {/* Scroll roll texture lines */}
          <div 
            className="absolute inset-x-4 top-2 h-1 rounded-full opacity-30"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
          />
          <div 
            className="absolute inset-x-6 top-4 h-0.5 rounded-full opacity-20"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
          />
        </div>
        
        {/* Main scroll body */}
        <div
          className="relative overflow-visible"
          style={{
            width: contentWidth,
          }}
        >
          {/* Actual parchment - using CSS for worn edges effect instead of SVG clip path for dynamic height */}
          <div
            className="relative overflow-hidden pirate-parchment-content"
            style={{
              width: "100%",
              minHeight: "fit-content",
              paddingBottom: "24px",
              background: `linear-gradient(180deg, ${parchmentBg} 0%, ${parchmentBgSecondary} 50%, ${parchmentBg} 100%)`,
              borderRadius: "4px",
              boxShadow: `
                inset 0 0 60px ${isDark ? 'rgba(0,0,0,0.25)' : 'rgba(139,69,19,0.1)'},
                inset 4px 0 12px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(139,69,19,0.08)'},
                inset -4px 0 12px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(139,69,19,0.08)'},
                0 4px 16px rgba(0,0,0,0.2)
              `,
            }}
          >
            {/* Parchment noise texture */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                opacity: isDark ? 0.05 : 0.06,
                mixBlendMode: "multiply",
              }}
            />
            
            {/* Wrinkle/fold lines */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(45deg, transparent 48%, rgba(139,69,19,0.03) 49%, rgba(139,69,19,0.03) 51%, transparent 52%),
                  linear-gradient(-30deg, transparent 46%, rgba(139,69,19,0.02) 48%, rgba(139,69,19,0.02) 52%, transparent 54%),
                  linear-gradient(60deg, transparent 45%, rgba(0,0,0,0.015) 48%, rgba(0,0,0,0.015) 52%, transparent 55%)
                `,
                backgroundSize: '100% 100%',
              }}
            />
            
            {/* Diagonal crease */}
            <div 
              className="absolute pointer-events-none"
              style={{
                top: '15%',
                left: '20%',
                width: '200px',
                height: '2px',
                background: `linear-gradient(90deg, transparent, rgba(139,69,19,0.08), rgba(139,69,19,0.12), rgba(139,69,19,0.08), transparent)`,
                transform: 'rotate(-8deg)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.1)',
              }}
            />
            
            {/* Another crease */}
            <div 
              className="absolute pointer-events-none"
              style={{
                bottom: '25%',
                right: '15%',
                width: '150px',
                height: '2px',
                background: `linear-gradient(90deg, transparent, rgba(139,69,19,0.06), rgba(139,69,19,0.1), rgba(139,69,19,0.06), transparent)`,
                transform: 'rotate(12deg)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.08)',
              }}
            />
            
            {/* Age spots/stains */}
            <div 
              className="absolute pointer-events-none"
              style={{
                top: '20%',
                right: '10%',
                width: '100px',
                height: '80px',
                background: `radial-gradient(ellipse, rgba(139,69,19,0.1) 0%, transparent 70%)`,
                borderRadius: '50%',
              }}
            />
            <div 
              className="absolute pointer-events-none"
              style={{
                bottom: '30%',
                left: '5%',
                width: '80px',
                height: '60px',
                background: `radial-gradient(ellipse, rgba(139,69,19,0.08) 0%, transparent 70%)`,
                borderRadius: '50%',
              }}
            />
            <div 
              className="absolute pointer-events-none"
              style={{
                top: '60%',
                left: '45%',
                width: '50px',
                height: '40px',
                background: `radial-gradient(ellipse, rgba(139,69,19,0.06) 0%, transparent 70%)`,
                borderRadius: '50%',
              }}
            />
            
            {/* Burn/water damage mark on corner */}
            <div 
              className="absolute pointer-events-none"
              style={{
                bottom: '0',
                right: '0',
                width: '80px',
                height: '80px',
                background: `radial-gradient(ellipse at bottom right, rgba(80,50,20,0.15) 0%, rgba(139,69,19,0.08) 30%, transparent 60%)`,
                borderRadius: '50% 0 0 0',
              }}
            />
            
            {/* Worn/faded corner */}
            <div 
              className="absolute pointer-events-none"
              style={{
                top: '0',
                left: '0',
                width: '60px',
                height: '60px',
                background: `radial-gradient(ellipse at top left, rgba(255,255,255,0.08) 0%, transparent 60%)`,
                borderRadius: '0 0 50% 0',
              }}
            />
          
          {/* Captain's Log Header */}
          <div 
            className="relative px-6 pt-4 pb-3"
            style={{ 
              borderBottom: `2px solid ${isDark ? 'rgba(212,175,55,0.3)' : 'rgba(139,69,19,0.2)'}`,
            }}
          >
            <div className="flex items-center justify-center gap-3">
              {/* Skull left */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill={goldColor} opacity="0.8">
                <ellipse cx="16" cy="12" rx="10" ry="11" fill={goldColor}/>
                <circle cx="11" cy="11" r="3" fill={isDark ? parchmentBg : '#2c1810'}/>
                <circle cx="21" cy="11" r="3" fill={isDark ? parchmentBg : '#2c1810'}/>
                <path d="M12 18 L14 16 L16 18 L18 16 L20 18" stroke={isDark ? parchmentBg : '#2c1810'} strokeWidth="1.5" fill="none"/>
                <rect x="13" y="22" width="2" height="4" fill={goldColor}/>
                <rect x="17" y="22" width="2" height="4" fill={goldColor}/>
              </svg>
              
              {/* Title */}
              <h1 
                style={{ 
                  fontFamily: "var(--font-pirata-one), 'Pirata One', cursive",
                  fontSize: '32px',
                  color: textColor,
                  textShadow: isDark 
                    ? '2px 2px 4px rgba(0,0,0,0.4)' 
                    : '1px 1px 2px rgba(0,0,0,0.2)',
                  letterSpacing: '0.05em',
                }}
              >
                Captain&apos;s Log
              </h1>
              
              {/* Ship silhouette right */}
              <svg width="36" height="32" viewBox="0 0 40 32" fill={goldColor} opacity="0.7">
                {/* Hull */}
                <path d="M5 22 L10 28 L30 28 L35 22 Q20 24, 5 22" fill={goldColor}/>
                {/* Mast */}
                <rect x="19" y="4" width="2" height="20" fill={goldColor}/>
                {/* Sails */}
                <path d="M12 6 L19 6 L19 16 L12 14 Z" fill={goldColor} opacity="0.8"/>
                <path d="M21 6 L28 6 L28 14 L21 16 Z" fill={goldColor} opacity="0.8"/>
                {/* Flag */}
                <path d="M20 4 L28 6 L20 8 Z" fill={goldColor}/>
              </svg>
            </div>
          </div>
          
          {/* Email Meta Fields - Pirate Style */}
          <div className="px-6 pt-4 pb-2">
            <div 
              className="space-y-2 text-sm"
              style={{ 
                fontFamily: "'IM Fell English', Georgia, serif",
                fontStyle: 'italic',
              }}
            >
              <div className="flex gap-3">
                <span style={{ color: textMuted, width: '70px' }}>From:</span>
                <span style={{ color: textColor }}>
                  {senderEmail || "captain@blackpearl.sea"}
                </span>
              </div>
              <div className="flex gap-3">
                <span style={{ color: textMuted, width: '70px' }}>To:</span>
                <span style={{ color: textMuted }}>recipient@example.com</span>
              </div>
              <div className="flex gap-3">
                <span style={{ color: textMuted, width: '70px' }}>Subject:</span>
                <span style={{ color: textColor, fontWeight: 500 }}>
                  {theme.subject}
                </span>
              </div>
            </div>
          </div>
          
          {/* Decorative divider */}
          <div 
            className="mx-6 my-2 flex items-center gap-3"
            style={{ color: goldColor }}
          >
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${goldColor}40, transparent)` }} />
            <span className="text-sm opacity-60">⚓ ☠️ ⚓</span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${goldColor}40, transparent)` }} />
          </div>
          
          {/* Email Body */}
          <div className="px-6 py-3">
            <div 
              className="space-y-3 text-sm leading-relaxed"
              style={{ 
                color: inkColor,
                fontFamily: "'IM Fell English', Georgia, serif",
              }}
            >
              <p style={{ color: goldColor, fontStyle: 'italic' }}>
                {theme.greeting}
              </p>
              {theme.body.map((paragraph, index) => (
                <p key={index} style={{ textAlign: "justify", lineHeight: "1.7" }}>
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* Closing */}
            <p 
              className="text-sm mt-4"
              style={{ 
                color: inkColor,
                fontFamily: "'IM Fell English', Georgia, serif",
                fontStyle: "italic",
              }}
            >
              {theme.closing}
            </p>
            
            {/* Signature Section */}
            <div 
              className="mt-4 pt-3 relative"
              style={{ borderTop: `1px dashed ${isDark ? 'rgba(212,175,55,0.3)' : 'rgba(139,69,19,0.2)'}` }}
            >
              {/* AI Loading effect */}
              {isAIGenerating && (
                <>
                  <div className="ai-loading-border" />
                  <div className="ai-loading-inner-glow" />
                  <div className="ai-shimmer-subtle" />
                </>
              )}
              <div style={{ color: inkColor }}>
                {children}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom scroll roll */}
        <div 
          className="relative mx-4"
          style={{
            height: '28px',
            background: `linear-gradient(180deg, 
              ${parchmentBg} 0%, 
              ${parchmentBgSecondary} 60%, 
              ${parchmentBgTertiary} 100%
            )`,
            borderRadius: '0 0 14px 14px',
            boxShadow: `
              inset 0 8px 12px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'},
              0 2px 4px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}
            `,
          }}
        >
          {/* Scroll roll texture lines */}
          <div 
            className="absolute inset-x-4 bottom-2 h-1 rounded-full opacity-30"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
          />
          <div 
            className="absolute inset-x-6 bottom-4 h-0.5 rounded-full opacity-20"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
          />
        </div>
      </div>
      </div>
      
      {/* Treasure Chest - Bottom Right */}
      <div 
        className="absolute bottom-2 right-2 opacity-60 pointer-events-none"
        style={{ width: '60px', height: '45px' }}
      >
        <svg viewBox="0 0 60 45" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Chest body */}
          <rect x="5" y="18" width="50" height="25" rx="3" fill={woodColor}/>
          {/* Chest lid */}
          <path d="M5 18 Q30 5, 55 18" fill={woodColorLight}/>
          <rect x="5" y="15" width="50" height="6" rx="2" fill={woodColor}/>
          {/* Metal bands */}
          <rect x="3" y="22" width="54" height="3" fill={brassColor} opacity="0.8"/>
          <rect x="3" y="35" width="54" height="3" fill={brassColor} opacity="0.8"/>
          {/* Lock */}
          <rect x="25" y="25" width="10" height="12" rx="2" fill={goldColor}/>
          <circle cx="30" cy="31" r="2" fill={isDark ? '#1a1610' : '#2c1810'}/>
          {/* Gold coins peeking out */}
          <circle cx="15" cy="12" r="4" fill={goldColorLight} opacity="0.9"/>
          <circle cx="22" cy="10" r="3" fill={goldColor} opacity="0.85"/>
          <circle cx="38" cy="11" r="3.5" fill={goldColorLight} opacity="0.9"/>
          <circle cx="45" cy="13" r="3" fill={goldColor} opacity="0.85"/>
        </svg>
      </div>
      
      {/* Bottom Navigation Icons */}
      <div 
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-4"
      >
        {/* Anchor icon */}
        <div 
          className="flex items-center justify-center"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: `linear-gradient(145deg, ${goldColorLight}, ${goldColor})`,
            boxShadow: `
              inset 0 2px 4px rgba(255,255,255,0.3),
              inset 0 -2px 4px rgba(0,0,0,0.2),
              0 2px 4px rgba(0,0,0,0.3)
            `,
            border: `2px solid ${brassColor}`,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 32" fill="none" stroke={isDark ? '#1a1610' : '#2c1810'} strokeWidth="2">
            <circle cx="12" cy="4" r="3"/>
            <line x1="12" y1="7" x2="12" y2="28"/>
            <path d="M4 20 Q4 28 12 28 Q20 28 20 20" fill="none"/>
            <line x1="6" y1="16" x2="18" y2="16"/>
          </svg>
        </div>
        
        {/* Coins icon */}
        <div 
          className="flex items-center justify-center"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: `linear-gradient(145deg, ${goldColorLight}, ${goldColor})`,
            boxShadow: `
              inset 0 2px 4px rgba(255,255,255,0.3),
              inset 0 -2px 4px rgba(0,0,0,0.2),
              0 2px 4px rgba(0,0,0,0.3)
            `,
            border: `2px solid ${brassColor}`,
          }}
        >
          <span style={{ fontSize: '14px' }}>💰</span>
        </div>
        
        {/* Info/compass icon */}
        <div 
          className="flex items-center justify-center"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: `linear-gradient(145deg, ${goldColorLight}, ${goldColor})`,
            boxShadow: `
              inset 0 2px 4px rgba(255,255,255,0.3),
              inset 0 -2px 4px rgba(0,0,0,0.2),
              0 2px 4px rgba(0,0,0,0.3)
            `,
            border: `2px solid ${brassColor}`,
          }}
        >
          <span style={{ fontSize: '14px' }}>⚓</span>
        </div>
      </div>
    </div>
  );
}

// Parks and Recreation Theme - Official Pawnee Memo Component
function PawneeParksMеmo({
  theme,
  isDark,
  senderEmail,
  children,
  isAIGenerating,
}: {
  theme: ReturnType<typeof getEmailTheme>;
  isDark: boolean;
  senderEmail: string;
  children: ReactNode;
  isAIGenerating: boolean;
}) {
  // Government green color palette
  const paperBg = isDark ? "#1a2e1a" : "#f8fdf8";
  const paperBgSecondary = isDark ? "#162816" : "#f0f9f0";
  const borderColor = isDark ? "#2d5a27" : "#3d7a35";
  const textColor = isDark ? "#e8f5e9" : "#1a3318";
  const textMuted = isDark ? "#81c784" : "#2d5a27";
  const sealColor = isDark ? "#4ade80" : "#2d5a27";
  const stampColor = isDark ? "rgba(74, 222, 128, 0.15)" : "rgba(45, 90, 39, 0.08)";
  const lineColor = isDark ? "rgba(74, 222, 128, 0.15)" : "rgba(45, 90, 39, 0.1)";
  
  return (
    <div className="w-[600px] min-h-[500px] relative p-6 flex items-center justify-center">
      {/* Subtle park/nature background texture */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: isDark 
            ? `radial-gradient(circle at 30% 20%, #2d5a27 0%, transparent 40%),
               radial-gradient(circle at 70% 80%, #1a4d2e 0%, transparent 40%),
               #0f1f0f`
            : `radial-gradient(circle at 30% 20%, #a7d9a7 0%, transparent 40%),
               radial-gradient(circle at 70% 80%, #c8e6c9 0%, transparent 40%),
               #e8f5e9`,
        }}
      />
      
      {/* Main Document */}
      <div 
        className="relative"
        style={{
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
        }}
      >
        {/* Official government document */}
        <div
          className="relative overflow-hidden"
          style={{
            width: "560px",
            minHeight: "480px",
            background: `linear-gradient(180deg, ${paperBg} 0%, ${paperBgSecondary} 100%)`,
            border: `3px solid ${borderColor}`,
            borderRadius: "2px",
            boxShadow: `
              inset 0 0 80px ${stampColor},
              0 2px 8px rgba(0,0,0,0.1)
            `,
          }}
        >
          {/* Official watermark seal in background */}
          <div 
            className="absolute pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "280px",
              height: "280px",
              opacity: isDark ? 0.04 : 0.03,
            }}
          >
            <svg viewBox="0 0 100 100" fill={sealColor}>
              <circle cx="50" cy="50" r="48" stroke={sealColor} strokeWidth="2" fill="none"/>
              <circle cx="50" cy="50" r="42" stroke={sealColor} strokeWidth="1" fill="none"/>
              <circle cx="50" cy="50" r="36" stroke={sealColor} strokeWidth="0.5" fill="none"/>
              <text x="50" y="30" textAnchor="middle" fontSize="6" fill={sealColor}>CITY OF PAWNEE</text>
              <text x="50" y="55" textAnchor="middle" fontSize="4" fill={sealColor}>PARKS & RECREATION</text>
              <text x="50" y="75" textAnchor="middle" fontSize="3" fill={sealColor}>EST. 1817</text>
              {/* Star decoration */}
              <polygon points="50,38 52,44 58,44 53,48 55,54 50,50 45,54 47,48 42,44 48,44" fill={sealColor}/>
            </svg>
          </div>
          
          {/* Document Header */}
          <div 
            className="relative px-6 pt-5 pb-4"
            style={{ 
              borderBottom: `2px solid ${borderColor}`,
              background: isDark 
                ? "linear-gradient(180deg, rgba(45, 90, 39, 0.2) 0%, transparent 100%)"
                : "linear-gradient(180deg, rgba(45, 90, 39, 0.08) 0%, transparent 100%)",
            }}
          >
            {/* Header with seal and title */}
            <div className="flex items-center gap-4">
              {/* Mini seal */}
              <div 
                className="flex-shrink-0"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: `2px solid ${sealColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDark ? "rgba(74, 222, 128, 0.1)" : "rgba(45, 90, 39, 0.05)",
                }}
              >
                <span style={{ fontSize: "20px" }}>🌳</span>
              </div>
              
              <div className="flex-1">
                <div 
                  className="text-sm font-bold tracking-wide uppercase"
                  style={{ color: sealColor }}
                >
                  City of Pawnee, Indiana
                </div>
                <div 
                  className="text-lg font-bold tracking-tight"
                  style={{ 
                    color: textColor,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                  }}
                >
                  Parks and Recreation Department
                </div>
                <div 
                  className="text-[10px] tracking-widest uppercase mt-0.5"
                  style={{ color: textMuted }}
                >
                  Official Correspondence • Form PR-{Math.floor(Math.random() * 9000) + 1000}
                </div>
              </div>
              
              {/* "APPROVED" stamp */}
              <div 
                className="absolute top-3 right-4"
                style={{
                  transform: "rotate(-12deg)",
                  border: `2px solid ${isDark ? "#4ade80" : "#2d5a27"}`,
                  borderRadius: "4px",
                  padding: "4px 12px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                  color: isDark ? "#4ade80" : "#2d5a27",
                  opacity: 0.6,
                }}
              >
                APPROVED ✓
              </div>
            </div>
          </div>
          
          {/* Form Fields */}
          <div className="px-6 pt-4 pb-2">
            <div 
              className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              <div className="flex gap-2">
                <span style={{ color: textMuted, width: "50px" }}>FROM:</span>
                <span 
                  style={{ 
                    color: textColor, 
                    borderBottom: `1px solid ${lineColor}`,
                    flex: 1,
                    paddingBottom: "2px",
                  }}
                >
                  {senderEmail || "leslie.knope@pawnee.gov"}
                </span>
              </div>
              <div className="flex gap-2">
                <span style={{ color: textMuted, width: "50px" }}>DATE:</span>
                <span 
                  style={{ 
                    color: textColor, 
                    borderBottom: `1px solid ${lineColor}`,
                    flex: 1,
                    paddingBottom: "2px",
                  }}
                >
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2">
                <span style={{ color: textMuted, width: "50px" }}>TO:</span>
                <span 
                  style={{ 
                    color: textMuted, 
                    borderBottom: `1px solid ${lineColor}`,
                    flex: 1,
                    paddingBottom: "2px",
                  }}
                >
                  recipient@example.com
                </span>
              </div>
              <div className="flex gap-2">
                <span style={{ color: textMuted, width: "50px" }}>DEPT:</span>
                <span 
                  style={{ 
                    color: textColor, 
                    borderBottom: `1px solid ${lineColor}`,
                    flex: 1,
                    paddingBottom: "2px",
                  }}
                >
                  Parks & Recreation
                </span>
              </div>
            </div>
            
            {/* Subject line */}
            <div 
              className="mt-3 pt-2 flex gap-2 text-xs"
              style={{ 
                fontFamily: "'Courier New', monospace",
                borderTop: `1px dashed ${lineColor}`,
              }}
            >
              <span style={{ color: textMuted }}>RE:</span>
              <span 
                className="font-semibold"
                style={{ color: textColor }}
              >
                {theme.subject}
              </span>
            </div>
          </div>
          
          {/* Divider with decorative elements */}
          <div 
            className="mx-6 my-2 flex items-center gap-3"
            style={{ color: sealColor }}
          >
            <div className="flex-1 h-px" style={{ background: lineColor }} />
            <span className="text-xs">🌳 🧇 🐴</span>
            <div className="flex-1 h-px" style={{ background: lineColor }} />
          </div>
          
          {/* Email Body */}
          <div className="px-6 py-3">
            <div 
              className="space-y-3 text-sm leading-relaxed"
              style={{ color: textColor }}
            >
              <p className="font-semibold" style={{ color: sealColor }}>
                {theme.greeting}
              </p>
              {theme.body.map((paragraph, index) => (
                <p key={index} style={{ textAlign: "justify" }}>{paragraph}</p>
              ))}
            </div>
            
            {/* Closing */}
            <p 
              className="text-sm mt-4 font-medium"
              style={{ color: textColor }}
            >
              {theme.closing}
            </p>
            
            {/* Signature Section */}
            <div 
              className="mt-4 pt-3 relative"
              style={{ borderTop: `1px dashed ${lineColor}` }}
            >
              {/* AI Loading effect */}
              {isAIGenerating && (
                <>
                  <div className="ai-loading-border" />
                  <div className="ai-loading-inner-glow" />
                  <div className="ai-shimmer-subtle" />
                </>
              )}
              {children}
            </div>
          </div>
          
          {/* Footer with "Li'l Sebastian" tribute */}
          <div 
            className="absolute bottom-3 right-4 flex items-center gap-2"
            style={{ opacity: 0.4 }}
          >
            <span className="text-[10px]" style={{ color: textMuted }}>
              In memory of Li&apos;l Sebastian 🐴✨
            </span>
          </div>
          
          {/* Corner fold effect */}
          <div 
            className="absolute bottom-0 left-0"
            style={{
              width: "0",
              height: "0",
              borderStyle: "solid",
              borderWidth: "25px 25px 0 0",
              borderColor: `${isDark ? "#0f1f0f" : "#e8f5e9"} transparent transparent transparent`,
            }}
          />
        </div>
        
        {/* Attached "Post-it" style note */}
        <div 
          className="absolute -right-2 top-16"
          style={{
            width: "70px",
            height: "70px",
            background: isDark ? "#4a4538" : "#fff9c4",
            transform: "rotate(6deg)",
            boxShadow: "2px 2px 8px rgba(0,0,0,0.2)",
            borderRadius: "2px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
          }}
        >
          <span className="text-xl">🧇</span>
          <span 
            className="text-[8px] text-center mt-1"
            style={{ 
              color: isDark ? "#a89880" : "#6b5b3d",
              fontFamily: "'Comic Sans MS', cursive",
            }}
          >
            JJ&apos;s Diner!
          </span>
        </div>
        
        {/* Paper clip */}
        <div 
          className="absolute left-1 top-12"
          style={{
            width: "20px",
            height: "50px",
            border: `3px solid ${isDark ? "#71717a" : "#a1a1aa"}`,
            borderRadius: "10px 10px 0 0",
            borderBottom: "none",
            transform: "rotate(-15deg)",
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}

// Office Theme Sticky Note Component
function OfficeStickyNote({
  theme,
  isDark,
  senderEmail,
  children,
  isAIGenerating,
}: {
  theme: ReturnType<typeof getEmailTheme>;
  isDark: boolean;
  senderEmail: string;
  children: ReactNode;
  isAIGenerating: boolean;
}) {
  const stickyBg = isDark ? "#4a4538" : "#fff9c4";
  const stickyBgSecondary = isDark ? "#3d3a2e" : "#fff59d";
  const textColor = isDark ? "#f5f0e6" : "#4a4a4a";
  const textMuted = isDark ? "#a89880" : "#6b6156";
  const foldColor = isDark ? "#353025" : "#e6d9a8";
  const tapeColor = isDark ? "rgba(200, 180, 140, 0.4)" : "rgba(200, 180, 140, 0.6)";
  const lineColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  
  return (
    <div className="w-[600px] min-h-[500px] relative p-8 flex items-center justify-center">
      {/* Cork board texture background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: isDark 
            ? `radial-gradient(circle at 20% 30%, #4a3d2e 0%, transparent 50%),
               radial-gradient(circle at 80% 70%, #3d3528 0%, transparent 50%),
               #1a1714`
            : `radial-gradient(circle at 20% 30%, #c9a86c 0%, transparent 50%),
               radial-gradient(circle at 80% 70%, #b8956a 0%, transparent 50%),
               #d4a574`,
        }}
      />
      
      {/* Main Sticky Note */}
      <div 
        className="relative"
        style={{
          transform: "rotate(-2deg)",
          filter: "drop-shadow(4px 4px 8px rgba(0,0,0,0.25))",
        }}
      >
        {/* Tape at top */}
        <div 
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
          style={{
            width: "80px",
            height: "30px",
            background: tapeColor,
            transform: "rotate(3deg)",
            borderRadius: "2px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
        
        {/* Sticky note body */}
        <div
          className="relative overflow-hidden"
          style={{
            width: "540px",
            minHeight: "440px",
            background: `linear-gradient(180deg, ${stickyBg} 0%, ${stickyBgSecondary} 100%)`,
            boxShadow: `
              inset 0 0 60px rgba(0,0,0,0.03),
              4px 4px 0 rgba(0,0,0,0.08),
              8px 8px 20px rgba(0,0,0,0.15)
            `,
            borderRadius: "3px",
          }}
        >
          {/* Ruled lines on sticky note */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 27px,
                ${lineColor} 27px,
                ${lineColor} 28px
              )`,
              backgroundPosition: "0 50px",
            }}
          />
          
          {/* Red margin line */}
          <div 
            className="absolute top-0 bottom-0 w-[2px]"
            style={{
              left: "40px",
              background: isDark ? "rgba(220, 74, 74, 0.3)" : "rgba(220, 74, 74, 0.25)",
            }}
          />
          
          {/* Content */}
          <div className="relative z-10 p-6 pl-14 pt-8">
            {/* Header with doodles */}
            <div className="mb-4 pb-3 border-b-2 border-dashed" style={{ borderColor: lineColor }}>
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-xs uppercase tracking-wider"
                  style={{ 
                    color: textMuted,
                    fontFamily: "'Comic Sans MS', 'Segoe Print', cursive",
                  }}
                >
                  ✉️ Memo
                </span>
                <span 
                  className="text-[10px] px-2 py-0.5 rounded"
                  style={{ 
                    background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                    color: textMuted,
                    fontFamily: "'Comic Sans MS', 'Segoe Print', cursive",
                  }}
                >
                  World&apos;s Best Boss ☕
                </span>
              </div>
              
              {/* From/To/Subject in handwritten style */}
              <div className="space-y-1">
                <div className="flex gap-2">
                  <span 
                    className="text-xs w-14"
                    style={{ color: textMuted, fontFamily: "'Comic Sans MS', cursive" }}
                  >
                    From:
                  </span>
                  <span 
                    className="text-xs"
                    style={{ color: textColor, fontFamily: "'Comic Sans MS', cursive" }}
                  >
                    {senderEmail || "michael.scott@dundermifflin.com"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span 
                    className="text-xs w-14"
                    style={{ color: textMuted, fontFamily: "'Comic Sans MS', cursive" }}
                  >
                    To:
                  </span>
                  <span 
                    className="text-xs"
                    style={{ color: textMuted, fontFamily: "'Comic Sans MS', cursive" }}
                  >
                    recipient@example.com
                  </span>
                </div>
                <div className="flex gap-2">
                  <span 
                    className="text-xs w-14"
                    style={{ color: textMuted, fontFamily: "'Comic Sans MS', cursive" }}
                  >
                    Re:
                  </span>
                  <span 
                    className="text-xs font-semibold underline decoration-wavy decoration-1"
                    style={{ 
                      color: textColor, 
                      fontFamily: "'Comic Sans MS', cursive",
                      textDecorationColor: isDark ? "#ef6b6b" : "#dc4a4a",
                    }}
                  >
                    {theme.subject}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Email Body */}
            <div 
              className="space-y-3 mb-6 text-sm leading-relaxed"
              style={{ 
                color: textColor,
                fontFamily: "'Comic Sans MS', 'Segoe Print', cursive",
              }}
            >
              <p className="italic">{theme.greeting}</p>
              {theme.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {/* Closing */}
            <p 
              className="text-sm mb-4"
              style={{ 
                color: textColor,
                fontFamily: "'Comic Sans MS', 'Segoe Print', cursive",
              }}
            >
              {theme.closing}
            </p>
            
            {/* Signature Section */}
            <div 
              className="pt-3 border-t-2 border-dashed relative"
              style={{ borderColor: lineColor }}
            >
              {/* AI Loading effect */}
              {isAIGenerating && (
                <>
                  <div className="ai-loading-border" />
                  <div className="ai-loading-inner-glow" />
                  <div className="ai-shimmer-subtle" />
                </>
              )}
              {children}
            </div>
            
            {/* Doodles in corner */}
            <div 
              className="absolute bottom-4 right-4 text-2xl opacity-30"
              style={{ transform: "rotate(15deg)" }}
            >
              🏆
            </div>
          </div>
          
          {/* Folded corner effect */}
          <div 
            className="absolute bottom-0 right-0"
            style={{
              width: "0",
              height: "0",
              borderStyle: "solid",
              borderWidth: "0 0 40px 40px",
              borderColor: `transparent transparent ${foldColor} transparent`,
              filter: "drop-shadow(-2px -2px 3px rgba(0,0,0,0.1))",
            }}
          />
          <div 
            className="absolute bottom-0 right-0"
            style={{
              width: "40px",
              height: "40px",
              background: `linear-gradient(135deg, transparent 50%, ${isDark ? '#2a2520' : '#f5f0e6'} 50%)`,
            }}
          />
        </div>
        
        {/* Small additional notes/stickers */}
        <div 
          className="absolute -right-3 top-20"
          style={{
            width: "60px",
            height: "60px",
            background: isDark ? "#3d2e35" : "#fce4ec",
            transform: "rotate(8deg)",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.15)",
            borderRadius: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
          }}
        >
          📎
        </div>
      </div>
    </div>
  );
}

// Spider-Man Notebook Paper Theme - Clean notebook page
function SpiderManNotebook({
  theme,
  isDark,
  senderEmail,
  children,
  isAIGenerating,
}: {
  theme: ReturnType<typeof getEmailTheme>;
  isDark: boolean;
  senderEmail: string;
  children: ReactNode;
  isAIGenerating: boolean;
}) {
  // Spider-Man color palette - ALWAYS dark text on light paper for readability
  // The paper is always a light color (white/cream) so text must be dark
  const primaryRed = "#dc2626";
  const primaryBlue = "#1e40af";
  
  // Paper is always light (notebook paper style) - text is always dark for contrast
  const paperBg = isDark ? "#1e293b" : "#ffffff";
  const paperBgSecondary = isDark ? "#1e3a5f" : "#f8f9fa";
  const textColor = isDark ? "#f1f5f9" : "#1f2937";
  const textMuted = isDark ? "#94a3b8" : "#6b7280";
  const lineColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";
  const marginLineColor = isDark ? "rgba(220, 38, 38, 0.25)" : "rgba(220, 38, 38, 0.15)";
  const holeColor = isDark ? "#0f172a" : "#e5e7eb";
  const holeShadow = isDark ? "inset 0 2px 4px rgba(0,0,0,0.6)" : "inset 0 2px 4px rgba(0,0,0,0.15)";
  
  // Force dark text for light paper, light text for dark paper
  const forceTextStyle = { color: textColor } as React.CSSProperties;
  const forceMutedStyle = { color: textMuted } as React.CSSProperties;
  
  return (
    <div className="w-[600px] min-h-[500px] relative p-6 flex items-center justify-center">
      {/* Subtle NYC cityscape gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDark 
            ? `linear-gradient(180deg, #0f172a 0%, #1e293b 100%)`
            : `linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 100%)`,
          opacity: 0.3,
        }}
      />
      
      {/* Main Notebook Page */}
      <div 
        className="relative z-20"
        style={{
          filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.2))",
        }}
      >
        {/* Notebook page body */}
        <div
          className="spidey-notebook relative overflow-hidden"
          data-preview-theme={isDark ? "dark" : "light"}
          style={{
            width: "560px",
            minHeight: "480px",
            backgroundColor: paperBg,
            backgroundImage: `linear-gradient(180deg, ${paperBg} 0%, ${paperBgSecondary} 100%)`,
            borderRadius: "4px",
            boxShadow: isDark 
              ? `0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)`
              : `0 1px 3px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.08)`,
          }}
        >
          {/* Ruled lines on paper */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 27px,
                ${lineColor} 27px,
                ${lineColor} 28px
              )`,
              backgroundPosition: "0 70px",
            }}
          />
          
          {/* Red margin line */}
          <div 
            className="absolute top-0 bottom-0 w-[1px]"
            style={{
              left: "50px",
              backgroundColor: marginLineColor,
            }}
          />
          
          {/* Notebook holes on the left */}
          <div className="absolute left-3 top-[80px]">
            <div 
              className="w-4 h-4 rounded-full mb-[100px]"
              style={{ 
                backgroundColor: holeColor,
                boxShadow: holeShadow,
              }}
            />
            <div 
              className="w-4 h-4 rounded-full mb-[100px]"
              style={{ 
                backgroundColor: holeColor,
                boxShadow: holeShadow,
              }}
            />
            <div 
              className="w-4 h-4 rounded-full"
              style={{ 
                backgroundColor: holeColor,
                boxShadow: holeShadow,
              }}
            />
          </div>
          
          {/* Header section */}
          <div 
            className="relative px-6 pl-16 pt-5 pb-4"
            style={{ 
              borderBottom: `2px solid ${isDark ? 'rgba(220, 38, 38, 0.35)' : 'rgba(220, 38, 38, 0.2)'}`,
              color: textColor,
            }}
          >
            {/* Spider-Man themed header badge */}
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${primaryRed} 0%, ${primaryBlue} 100%)`,
                  boxShadow: `0 2px 8px ${isDark ? 'rgba(220, 38, 38, 0.4)' : 'rgba(220, 38, 38, 0.3)'}`,
                }}
              >
                <span className="text-lg">🕷️</span>
              </div>
              <div className="flex-1">
                <div 
                  className="text-sm font-bold tracking-wide"
                  style={{ color: primaryRed }}
                >
                  Daily Bugle Email
                </div>
                <div 
                  className="text-[10px] tracking-wider uppercase mt-0.5"
                  style={{ color: textMuted }}
                >
                  Your Friendly Neighborhood Correspondence
                </div>
              </div>
            </div>
            
            {/* Email meta info */}
            <div 
              className="space-y-1.5 text-xs"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <div className="flex gap-2">
                <span className="spidey-muted">From:</span>
                <span>{senderEmail || "peter.parker@dailybugle.com"}</span>
                <span 
                  className="spidey-red ml-2 px-2 py-0.5 rounded text-[10px]"
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryRed}20, ${primaryBlue}20)`,
                  }}
                >
                  {theme.character}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="spidey-muted">To:</span>
                <span className="spidey-muted">recipient@example.com</span>
              </div>
              <div className="flex gap-2">
                <span className="spidey-muted">Subject:</span>
                <span className="font-medium">{theme.subject}</span>
              </div>
            </div>
          </div>
          
          {/* Email Body */}
          <div className="px-6 pl-16 py-4">
            <p className="spidey-red font-medium mb-3">
              {theme.greeting}
            </p>
            {theme.body.map((paragraph, index) => (
              <p 
                key={index} 
                className="text-sm mb-3"
                style={{ lineHeight: "1.7" }}
              >
                {paragraph}
              </p>
            ))}
            
            {/* Closing */}
            <p className="text-sm mt-5 font-medium">
              {theme.closing}
            </p>
            
            {/* Signature Section */}
            <div 
              className="mt-4 pt-4 relative spidey-signature-section"
              style={{ 
                borderTop: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                color: textColor,
              }}
            >
              {/* AI Loading effect */}
              {isAIGenerating && (
                <>
                  <div className="ai-loading-border" />
                  <div className="ai-loading-inner-glow" />
                  <div className="ai-shimmer-subtle" />
                </>
              )}
              {/* Force signature text colors via wrapper */}
              <div className="spidey-signature-content" style={{ color: textColor }}>
                {children}
              </div>
            </div>
          </div>
          
          {/* Small web decoration in corner - very subtle */}
          <div 
            className="absolute bottom-4 right-4 opacity-10"
            style={{ color: primaryRed }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor">
              <circle cx="20" cy="20" r="18" strokeWidth="0.5" opacity="0.5"/>
              <circle cx="20" cy="20" r="12" strokeWidth="0.5" opacity="0.5"/>
              <circle cx="20" cy="20" r="6" strokeWidth="0.5" opacity="0.5"/>
              <line x1="20" y1="2" x2="20" y2="38" strokeWidth="0.5" opacity="0.4"/>
              <line x1="2" y1="20" x2="38" y2="20" strokeWidth="0.5" opacity="0.4"/>
              <line x1="5" y1="5" x2="35" y2="35" strokeWidth="0.5" opacity="0.3"/>
              <line x1="35" y1="5" x2="5" y2="35" strokeWidth="0.5" opacity="0.3"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// Yoda Zen Scroll Theme - Bamboo & Nature Wisdom
function YodaZenScroll({
  theme,
  isDark,
  senderEmail,
  children,
  isAIGenerating,
}: {
  theme: ReturnType<typeof getEmailTheme>;
  isDark: boolean;
  senderEmail: string;
  children: ReactNode;
  isAIGenerating: boolean;
}) {
  // Zen garden color palette
  const paperBg = isDark ? "#152a1d" : "#fdfef9";
  const paperBgSecondary = isDark ? "#1a3525" : "#f5f7f0";
  const bambooColor = isDark ? "#5a8a50" : "#5a7c4c";
  const bambooLight = isDark ? "#7aaa70" : "#7a9e6a";
  const textColor = isDark ? "#e5f0ea" : "#2a3a28";
  const textMuted = isDark ? "#7a9a85" : "#6b7b6a";
  const borderColor = isDark ? "#2a4a35" : "#c5d4bf";
  const accentGold = isDark ? "#e5c24a" : "#c9a227";
  
  return (
    <div className="w-[600px] min-h-[500px] relative p-6 flex items-center justify-center">
      {/* Subtle zen garden background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: isDark 
            ? `radial-gradient(ellipse at 30% 20%, #1a3525 0%, transparent 50%),
               radial-gradient(ellipse at 70% 80%, #0d1a12 0%, transparent 50%),
               #0d1a12`
            : `radial-gradient(ellipse at 30% 20%, #e5ede0 0%, transparent 50%),
               radial-gradient(ellipse at 70% 80%, #eef3e8 0%, transparent 50%),
               #f7f9f4`,
        }}
      />
      
      {/* Floating bamboo leaves decoration */}
      <div 
        className="absolute top-4 right-8 text-3xl opacity-20"
        style={{ transform: "rotate(15deg)" }}
      >
        🎋
      </div>
      <div 
        className="absolute bottom-8 left-6 text-2xl opacity-15"
        style={{ transform: "rotate(-10deg)" }}
      >
        🌿
      </div>
      
      {/* Main Scroll Document */}
      <div 
        className="relative"
        style={{
          filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.12))",
        }}
      >
        {/* Ancient scroll container */}
        <div
          className="relative overflow-hidden"
          style={{
            width: "560px",
            minHeight: "480px",
            background: `linear-gradient(180deg, ${paperBg} 0%, ${paperBgSecondary} 100%)`,
            border: `2px solid ${borderColor}`,
            borderRadius: "4px",
            boxShadow: `
              inset 0 0 60px ${isDark ? "rgba(0,0,0,0.2)" : "rgba(90,124,76,0.05)"},
              0 2px 8px rgba(0,0,0,0.08)
            `,
          }}
        >
          {/* Bamboo corner decorations */}
          <div 
            className="absolute top-0 left-0 w-6 h-6"
            style={{
              borderTop: `3px solid ${bambooColor}`,
              borderLeft: `3px solid ${bambooColor}`,
              borderRadius: "4px 0 0 0",
            }}
          />
          <div 
            className="absolute top-0 right-0 w-6 h-6"
            style={{
              borderTop: `3px solid ${bambooColor}`,
              borderRight: `3px solid ${bambooColor}`,
              borderRadius: "0 4px 0 0",
            }}
          />
          <div 
            className="absolute bottom-0 left-0 w-6 h-6"
            style={{
              borderBottom: `3px solid ${bambooColor}`,
              borderLeft: `3px solid ${bambooColor}`,
              borderRadius: "0 0 0 4px",
            }}
          />
          <div 
            className="absolute bottom-0 right-0 w-6 h-6"
            style={{
              borderBottom: `3px solid ${bambooColor}`,
              borderRight: `3px solid ${bambooColor}`,
              borderRadius: "0 0 4px 0",
            }}
          />
          
          {/* Subtle Jedi symbol watermark */}
          <div 
            className="absolute pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "200px",
              height: "200px",
              opacity: isDark ? 0.03 : 0.025,
            }}
          >
            <svg viewBox="0 0 100 100" fill={bambooColor}>
              <path d="M50 5 L60 25 L80 25 L65 40 L70 60 L50 50 L30 60 L35 40 L20 25 L40 25 Z" />
              <circle cx="50" cy="75" r="15" stroke={bambooColor} strokeWidth="2" fill="none"/>
              <circle cx="50" cy="75" r="8" fill={bambooColor}/>
            </svg>
          </div>
          
          {/* Document Header */}
          <div 
            className="relative px-6 pt-5 pb-4"
            style={{ 
              borderBottom: `1px solid ${borderColor}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div 
                  className="text-lg tracking-wider"
                  style={{ 
                    color: textColor,
                    fontFamily: "'Soloist Title', 'Soloist', Georgia, serif",
                    letterSpacing: "0.1em",
                  }}
                >
                  Jedi Council Archives
                </div>
                <div 
                  className="text-[10px] tracking-widest uppercase mt-1"
                  style={{ color: textMuted }}
                >
                  Wisdom of the Force • {new Date().toLocaleDateString()}
                </div>
              </div>
              
              {/* Jedi Master seal */}
              <div 
                className="flex items-center justify-center"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: `2px solid ${bambooLight}`,
                  background: isDark ? "rgba(90,138,80,0.1)" : "rgba(90,124,76,0.08)",
                }}
              >
                <span style={{ fontSize: "24px" }}>🧘</span>
              </div>
            </div>
          </div>
          
          {/* Form Fields - Zen style */}
          <div className="px-6 pt-4 pb-2">
            <div 
              className="space-y-2 text-xs"
              style={{ fontFamily: "Georgia, serif" }}
            >
              <div className="flex gap-3">
                <span style={{ color: textMuted, width: "60px" }}>From:</span>
                <span style={{ color: textColor }}>
                  {senderEmail || "master.yoda@jedi.temple"}
                </span>
                <span 
                  className="ml-2 px-2 py-0.5 rounded text-[10px]"
                  style={{ 
                    background: isDark ? "rgba(90,138,80,0.2)" : "rgba(90,124,76,0.1)",
                    color: bambooColor,
                  }}
                >
                  Jedi Grand Master
                </span>
              </div>
              <div className="flex gap-3">
                <span style={{ color: textMuted, width: "60px" }}>To:</span>
                <span style={{ color: textMuted }}>recipient@example.com</span>
              </div>
              <div className="flex gap-3">
                <span style={{ color: textMuted, width: "60px" }}>Subject:</span>
                <span style={{ color: textColor, fontStyle: "italic" }}>
                  {theme.subject}
                </span>
              </div>
            </div>
          </div>
          
          {/* Zen divider */}
          <div 
            className="mx-6 my-3 flex items-center gap-4"
            style={{ color: bambooColor }}
          >
            <div className="flex-1 h-px" style={{ background: borderColor }} />
            <span className="text-xs opacity-60">✦ ☯ ✦</span>
            <div className="flex-1 h-px" style={{ background: borderColor }} />
          </div>
          
          {/* Email Body */}
          <div className="px-6 py-3">
            <div 
              className="space-y-4 text-sm leading-relaxed"
              style={{ 
                color: textColor,
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              <p className="italic" style={{ color: bambooColor }}>
                {theme.greeting}
              </p>
              {theme.body.map((paragraph, index) => (
                <p key={index} style={{ textAlign: "justify", lineHeight: "1.7" }}>
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* Closing */}
            <p 
              className="text-sm mt-5"
              style={{ 
                color: textColor,
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
              }}
            >
              {theme.closing}
            </p>
            
            {/* Signature Section */}
            <div 
              className="mt-4 pt-4 relative"
              style={{ borderTop: `1px solid ${borderColor}` }}
            >
              {/* AI Loading effect */}
              {isAIGenerating && (
                <>
                  <div className="ai-loading-border" />
                  <div className="ai-loading-inner-glow" />
                  <div className="ai-shimmer-subtle" />
                </>
              )}
              {children}
            </div>
          </div>
          
          {/* Wisdom quote at bottom */}
          <div 
            className="absolute bottom-3 left-0 right-0 text-center"
            style={{ opacity: 0.4 }}
          >
            <span 
              className="text-[10px] italic"
              style={{ 
                color: textMuted,
                fontFamily: "Georgia, serif",
              }}
            >
              "Do or do not. There is no try."
            </span>
          </div>
        </div>
        
        {/* Small wisdom seal */}
        <div 
          className="absolute -right-2 top-20"
          style={{
            width: "50px",
            height: "50px",
            background: isDark ? "#1a3525" : "#e5ede0",
            borderRadius: "50%",
            transform: "rotate(10deg)",
            boxShadow: "2px 2px 8px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${bambooColor}`,
          }}
        >
          <span style={{ fontSize: "20px" }}>☯</span>
        </div>
      </div>
    </div>
  );
}

// Surfer Dude Hawaii Theme - Tropical Beach Postcard Style
function SurferDudeBeachPostcard({
  theme,
  isDark,
  senderEmail,
  children,
  isAIGenerating,
}: {
  theme: ReturnType<typeof getEmailTheme>;
  isDark: boolean;
  senderEmail: string;
  children: ReactNode;
  isAIGenerating: boolean;
}) {
  // Hawaii tropical color palette
  const oceanCyan = isDark ? "#0e7490" : "#06b6d4";
  const oceanDeep = isDark ? "#164e63" : "#0891b2";
  const sunsetOrange = isDark ? "#c2410c" : "#f97316";
  const sunsetGold = isDark ? "#b45309" : "#fbbf24";
  const hibiscusPink = isDark ? "#be185d" : "#ec4899";
  const palmGreen = isDark ? "#166534" : "#22c55e";
  const sandBeige = isDark ? "#292524" : "#fef3c7";
  const sandDark = isDark ? "#1c1917" : "#fde68a";
  const tikiWood = isDark ? "#78350f" : "#92400e";
  const tikiWoodLight = isDark ? "#92400e" : "#a16207";
  const textColor = isDark ? "#fef3c7" : "#1c1917";
  const textMuted = isDark ? "#a3a3a3" : "#57534e";
  const cardBg = isDark ? "#1c1917" : "#fffbeb";
  const cardBgSecondary = isDark ? "#292524" : "#fef3c7";
  
  return (
    <div className="w-[600px] min-h-fit relative p-4 flex items-start justify-center overflow-hidden">
      {/* Tropical Sunset/Ocean Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDark 
            ? `linear-gradient(180deg, 
                #0c4a6e 0%, 
                #164e63 20%, 
                #134e4a 40%, 
                #422006 70%, 
                #1c1917 100%)`
            : `linear-gradient(180deg, 
                #7dd3fc 0%, 
                #38bdf8 15%, 
                #06b6d4 30%, 
                #f97316 60%, 
                #fb923c 75%, 
                #fbbf24 90%, 
                #fef3c7 100%)`,
        }}
      />
      
      {/* Sun/Moon */}
      <div 
        className="absolute pointer-events-none"
        style={{
          top: '8%',
          right: '12%',
          width: '60px',
          height: '60px',
          background: isDark 
            ? `radial-gradient(circle, #fef3c7 0%, #fef3c7 30%, transparent 70%)`
            : `radial-gradient(circle, #fef3c7 0%, #fbbf24 40%, #f97316 70%, transparent 100%)`,
          borderRadius: '50%',
          opacity: isDark ? 0.6 : 0.9,
          boxShadow: isDark 
            ? '0 0 30px rgba(254, 243, 199, 0.3)'
            : '0 0 60px rgba(251, 191, 36, 0.6)',
        }}
      />
      
      {/* Ocean waves at bottom */}
      <svg 
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        viewBox="0 0 600 80"
        preserveAspectRatio="none"
        style={{ height: '80px', width: '100%' }}
      >
        <path 
          d="M0 40 C50 30, 100 50, 150 40 C200 30, 250 50, 300 40 C350 30, 400 50, 450 40 C500 30, 550 50, 600 40 L600 80 L0 80 Z"
          fill={oceanDeep}
          opacity="0.7"
        />
        <path 
          d="M0 50 C40 42, 80 58, 120 50 C160 42, 200 58, 240 50 C280 42, 320 58, 360 50 C400 42, 440 58, 480 50 C520 42, 560 58, 600 50 L600 80 L0 80 Z"
          fill={oceanCyan}
          opacity="0.8"
        />
        {/* Foam/spray dots */}
        <circle cx="100" cy="48" r="2" fill="#fff" opacity="0.6"/>
        <circle cx="250" cy="45" r="1.5" fill="#fff" opacity="0.5"/>
        <circle cx="400" cy="47" r="2" fill="#fff" opacity="0.6"/>
        <circle cx="520" cy="44" r="1.5" fill="#fff" opacity="0.5"/>
      </svg>
      
      {/* Palm tree silhouette - Left */}
      <div 
        className="absolute pointer-events-none"
        style={{ left: '-10px', bottom: '60px', opacity: 0.25 }}
      >
        <svg width="80" height="120" viewBox="0 0 48 64" fill={palmGreen}>
          <path d="M22 28 C20 40, 18 52, 20 64 L28 64 C30 52, 28 40, 26 28" fill={tikiWood}/>
          <path d="M24 26 C30 20, 42 18, 48 22 C42 20, 34 22, 24 26" fill={palmGreen}/>
          <path d="M24 26 C18 20, 6 18, 0 22 C6 20, 14 22, 24 26" fill={palmGreen}/>
          <path d="M24 24 C28 14, 38 8, 46 6 C38 10, 30 16, 24 24" fill={palmGreen} opacity="0.8"/>
          <path d="M24 24 C20 14, 10 8, 2 6 C10 10, 18 16, 24 24" fill={palmGreen} opacity="0.8"/>
        </svg>
      </div>
      
      {/* Palm tree silhouette - Right */}
      <div 
        className="absolute pointer-events-none"
        style={{ right: '-5px', bottom: '70px', opacity: 0.2, transform: 'scaleX(-1)' }}
      >
        <svg width="70" height="100" viewBox="0 0 48 64" fill={palmGreen}>
          <path d="M22 28 C20 40, 18 52, 20 64 L28 64 C30 52, 28 40, 26 28" fill={tikiWood}/>
          <path d="M24 26 C30 20, 42 18, 48 22 C42 20, 34 22, 24 26" fill={palmGreen}/>
          <path d="M24 26 C18 20, 6 18, 0 22 C6 20, 14 22, 24 26" fill={palmGreen}/>
          <path d="M24 24 C28 14, 38 8, 46 6 C38 10, 30 16, 24 24" fill={palmGreen} opacity="0.8"/>
        </svg>
      </div>
      
      {/* Hibiscus flowers */}
      <div className="absolute top-3 left-16 opacity-50 pointer-events-none" style={{ transform: 'rotate(-15deg)' }}>
        <svg width="32" height="32" viewBox="0 0 40 40">
          <ellipse cx="20" cy="8" rx="6" ry="9" fill={hibiscusPink} opacity="0.9"/>
          <ellipse cx="9" cy="17" rx="9" ry="6" fill={hibiscusPink} opacity="0.85" transform="rotate(-20 9 17)"/>
          <ellipse cx="31" cy="17" rx="9" ry="6" fill={hibiscusPink} opacity="0.85" transform="rotate(20 31 17)"/>
          <ellipse cx="13" cy="30" rx="7" ry="9" fill={hibiscusPink} opacity="0.8" transform="rotate(30 13 30)"/>
          <ellipse cx="27" cy="30" rx="7" ry="9" fill={hibiscusPink} opacity="0.8" transform="rotate(-30 27 30)"/>
          <circle cx="20" cy="20" r="5" fill={sunsetGold}/>
          <circle cx="20" cy="20" r="3" fill={sunsetOrange}/>
        </svg>
      </div>
      
      <div className="absolute bottom-24 right-12 opacity-40 pointer-events-none" style={{ transform: 'rotate(20deg)' }}>
        <svg width="28" height="28" viewBox="0 0 40 40">
          <ellipse cx="20" cy="8" rx="6" ry="9" fill={hibiscusPink} opacity="0.9"/>
          <ellipse cx="9" cy="17" rx="9" ry="6" fill={hibiscusPink} opacity="0.85" transform="rotate(-20 9 17)"/>
          <ellipse cx="31" cy="17" rx="9" ry="6" fill={hibiscusPink} opacity="0.85" transform="rotate(20 31 17)"/>
          <ellipse cx="13" cy="30" rx="7" ry="9" fill={hibiscusPink} opacity="0.8" transform="rotate(30 13 30)"/>
          <ellipse cx="27" cy="30" rx="7" ry="9" fill={hibiscusPink} opacity="0.8" transform="rotate(-30 27 30)"/>
          <circle cx="20" cy="20" r="5" fill={sunsetGold}/>
        </svg>
      </div>
      
      {/* Main Postcard Container */}
      <div 
        className="relative z-10"
        style={{
          filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.25))",
        }}
      >
        {/* Postcard body */}
        <div
          className="relative overflow-hidden"
          style={{
            width: "530px",
            minHeight: "fit-content",
            background: `linear-gradient(180deg, ${cardBg} 0%, ${cardBgSecondary} 100%)`,
            borderRadius: "12px",
            border: `3px solid ${tikiWood}`,
            boxShadow: `
              inset 0 0 40px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(251,191,36,0.1)'},
              0 4px 20px rgba(0,0,0,0.2)
            `,
          }}
        >
          {/* Decorative tiki border pattern - top */}
          <div 
            className="absolute top-0 left-0 right-0 h-3 flex justify-center items-center gap-4"
            style={{ background: tikiWood }}
          >
            {/* Tiki pattern triangles */}
            {[...Array(18)].map((_, i) => (
              <div 
                key={i} 
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `8px solid ${tikiWoodLight}`,
                }}
              />
            ))}
          </div>
          
          {/* Postcard Header */}
          <div 
            className="relative px-6 pt-6 pb-4"
            style={{ 
              borderBottom: `2px dashed ${isDark ? 'rgba(251,191,36,0.3)' : 'rgba(146,64,14,0.2)'}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Shaka hand icon */}
                <div 
                  className="flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${oceanCyan} 0%, ${sunsetOrange} 100%)`,
                    boxShadow: `0 2px 8px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(249,115,22,0.3)'}`,
                  }}
                >
                  <span style={{ fontSize: '24px' }}>🤙</span>
                </div>
                
                <div>
                  <h1 
                    className="text-xl font-bold"
                    style={{ 
                      color: textColor,
                      fontFamily: "'Soloist', Georgia, serif",
                      letterSpacing: '0.02em',
                    }}
                  >
                    Aloha Mail
                  </h1>
                  <div 
                    className="text-[10px] tracking-wider uppercase mt-0.5 flex items-center gap-2"
                    style={{ color: textMuted }}
                  >
                    <span>🌺</span>
                    <span>Hawaiian Vibes Only</span>
                    <span>🌴</span>
                  </div>
                </div>
              </div>
              
              {/* Surfboard stamp */}
              <div 
                className="flex flex-col items-center"
                style={{
                  padding: '6px 12px',
                  border: `2px solid ${sunsetOrange}`,
                  borderRadius: '4px',
                  transform: 'rotate(6deg)',
                }}
              >
                <span style={{ fontSize: '20px' }}>🏄‍♂️</span>
                <span 
                  className="text-[8px] font-bold uppercase tracking-wider"
                  style={{ color: sunsetOrange }}
                >
                  Stoked!
                </span>
              </div>
            </div>
          </div>
          
          {/* Email Meta Fields */}
          <div className="px-6 pt-4 pb-2">
            <div 
              className="space-y-2 text-xs"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <div className="flex gap-3">
                <span style={{ color: textMuted, width: '55px' }}>From:</span>
                <span style={{ color: textColor }}>
                  {senderEmail || "chad@gnarlywaves.com"}
                </span>
                <span 
                  className="ml-2 px-2 py-0.5 rounded text-[10px]"
                  style={{ 
                    background: `linear-gradient(135deg, ${oceanCyan}30, ${sunsetOrange}30)`,
                    color: oceanCyan,
                  }}
                >
                  {theme.character}
                </span>
              </div>
              <div className="flex gap-3">
                <span style={{ color: textMuted, width: '55px' }}>To:</span>
                <span style={{ color: textMuted }}>recipient@example.com</span>
              </div>
              <div className="flex gap-3">
                <span style={{ color: textMuted, width: '55px' }}>Subject:</span>
                <span style={{ color: textColor, fontWeight: 500 }}>
                  {theme.subject}
                </span>
              </div>
            </div>
          </div>
          
          {/* Tropical divider */}
          <div 
            className="mx-6 my-3 flex items-center gap-3"
            style={{ color: sunsetOrange }}
          >
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${sunsetOrange}40, transparent)` }} />
            <span className="text-xs">🌺 🌊 🏄‍♂️ 🌴 🌺</span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${sunsetOrange}40, transparent)` }} />
          </div>
          
          {/* Email Body */}
          <div className="px-6 py-3">
            <div 
              className="space-y-3 text-sm leading-relaxed"
              style={{ color: textColor }}
            >
              <p className="font-medium" style={{ color: oceanCyan }}>
                {theme.greeting}
              </p>
              {theme.body.map((paragraph, index) => (
                <p key={index} style={{ lineHeight: "1.7" }}>
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* Closing */}
            <p 
              className="text-sm mt-4 font-medium"
              style={{ color: textColor }}
            >
              {theme.closing}
            </p>
            
            {/* Signature Section */}
            <div 
              className="mt-4 pt-4 relative"
              style={{ borderTop: `1px dashed ${isDark ? 'rgba(251,191,36,0.3)' : 'rgba(146,64,14,0.2)'}` }}
            >
              {/* AI Loading effect */}
              {isAIGenerating && (
                <>
                  <div className="ai-loading-border" />
                  <div className="ai-loading-inner-glow" />
                  <div className="ai-shimmer-subtle" />
                </>
              )}
              {children}
            </div>
          </div>
          
          {/* Decorative tiki border pattern - bottom */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-3 flex justify-center items-center gap-4"
            style={{ background: tikiWood }}
          >
            {[...Array(18)].map((_, i) => (
              <div 
                key={i} 
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: `8px solid ${tikiWoodLight}`,
                }}
              />
            ))}
          </div>
          
          {/* Tiki head corner decoration */}
          <div 
            className="absolute -bottom-1 -right-1 opacity-30 pointer-events-none"
            style={{ transform: 'rotate(-10deg)' }}
          >
            <svg width="40" height="50" viewBox="0 0 40 56" fill={tikiWood}>
              <path d="M8 12 C8 4, 32 4, 32 12 L34 44 C34 52, 6 52, 6 44 Z"/>
              <rect x="12" y="18" width="6" height="8" rx="1" fill={isDark ? '#1c1917' : '#451a03'} opacity="0.8"/>
              <rect x="22" y="18" width="6" height="8" rx="1" fill={isDark ? '#1c1917' : '#451a03'} opacity="0.8"/>
              <rect x="14" y="38" width="12" height="6" rx="1" fill={isDark ? '#1c1917' : '#451a03'}/>
            </svg>
          </div>
        </div>
        
        {/* Floating plumeria flower */}
        <div 
          className="absolute -right-2 top-24"
          style={{
            transform: 'rotate(15deg)',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 32 32">
            <ellipse cx="16" cy="6" rx="5" ry="8" fill="#fef3c7" opacity="0.95"/>
            <ellipse cx="6" cy="14" rx="8" ry="5" fill="#fef3c7" opacity="0.9" transform="rotate(-30 6 14)"/>
            <ellipse cx="26" cy="14" rx="8" ry="5" fill="#fef3c7" opacity="0.9" transform="rotate(30 26 14)"/>
            <ellipse cx="10" cy="26" rx="6" ry="8" fill="#fef3c7" opacity="0.85" transform="rotate(20 10 26)"/>
            <ellipse cx="22" cy="26" rx="6" ry="8" fill="#fef3c7" opacity="0.85" transform="rotate(-20 22 26)"/>
            <circle cx="16" cy="16" r="4" fill={sunsetGold}/>
            <circle cx="16" cy="16" r="2" fill={sunsetOrange}/>
          </svg>
        </div>
      </div>
      
      {/* Surfboard leaning */}
      <div 
        className="absolute bottom-16 left-8 opacity-30 pointer-events-none"
        style={{ transform: 'rotate(-20deg)' }}
      >
        <svg width="16" height="60" viewBox="0 0 12 48">
          <ellipse cx="6" cy="24" rx="5" ry="22" fill={oceanCyan}/>
          <line x1="6" y1="6" x2="6" y2="42" stroke="#fff" strokeWidth="1" opacity="0.4"/>
          <ellipse cx="6" cy="12" rx="2" ry="4" fill={sunsetOrange} opacity="0.6"/>
        </svg>
      </div>
    </div>
  );
}

// Shakespeare Parchment Theme - Renaissance Elizabethan Style
// Uses full-bleed layout like standard email preview for consistent scroll behavior
function ShakespeareParchment({
  theme,
  isDark,
  senderEmail,
  children,
  isAIGenerating,
}: {
  theme: ReturnType<typeof getEmailTheme>;
  isDark: boolean;
  senderEmail: string;
  children: ReactNode;
  isAIGenerating: boolean;
}) {
  // Renaissance parchment color palette - aged paper with ink contrast
  const parchmentBg = isDark ? "#2a241c" : "#f5efe0";
  const parchmentBgSecondary = isDark ? "#231e17" : "#ebe4d0";
  const parchmentBorder = isDark ? "#4a3d2e" : "#c4a86a";
  const textColor = isDark ? "#e8e0d0" : "#2c1810";
  const textMuted = isDark ? "#a89880" : "#5c4a38";
  const accentPurple = isDark ? "#b794f6" : "#6b2d8f";
  const accentGold = isDark ? "#d4af37" : "#8b6914";
  const sealWax = isDark ? "#8b2942" : "#8b2942";
  const inkColor = isDark ? "#d4cfc0" : "#1a0f08";
  
  // Window button colors - royal purple theme
  const buttonColors = [accentPurple, accentGold, accentPurple];
  
  return (
    <div className="w-[600px] min-h-[400px] relative overflow-hidden">
      {/* Parchment texture background - covers entire preview */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${parchmentBg} 0%, ${parchmentBgSecondary} 50%, ${parchmentBg} 100%)`,
        }}
      />
      
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: isDark ? 0.03 : 0.04,
          mixBlendMode: "multiply",
        }}
      />
      
      {/* Shakespeare watermark - theater masks (full preview) */}
      <div 
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "280px",
          height: "280px",
          opacity: isDark ? 0.025 : 0.02,
        }}
      >
        <svg viewBox="0 0 100 100" fill={accentPurple}>
          <ellipse cx="30" cy="45" rx="18" ry="22" stroke={accentPurple} strokeWidth="2" fill="none"/>
          <circle cx="24" cy="40" r="3" fill={accentPurple}/>
          <circle cx="36" cy="40" r="3" fill={accentPurple}/>
          <path d="M22 52 Q30 60, 38 52" stroke={accentPurple} strokeWidth="2" fill="none"/>
          <ellipse cx="70" cy="45" rx="18" ry="22" stroke={accentPurple} strokeWidth="2" fill="none"/>
          <circle cx="64" cy="40" r="3" fill={accentPurple}/>
          <circle cx="76" cy="40" r="3" fill={accentPurple}/>
          <path d="M62 55 Q70 48, 78 55" stroke={accentPurple} strokeWidth="2" fill="none"/>
          <path d="M30 68 Q50 80, 70 68" stroke={accentPurple} strokeWidth="1" fill="none" opacity="0.5"/>
        </svg>
      </div>
      
      {/* Email Header - Parchment scroll style */}
      <div 
        className="relative z-10 px-6 py-4"
        style={{ 
          borderBottom: `2px solid ${parchmentBorder}`,
          background: isDark 
            ? "linear-gradient(180deg, rgba(42, 36, 28, 0.95) 0%, rgba(35, 30, 23, 0.9) 100%)"
            : "linear-gradient(180deg, rgba(245, 239, 224, 0.95) 0%, rgba(235, 228, 208, 0.9) 100%)",
        }}
      >
        {/* Window Controls with Renaissance styling */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex gap-1.5">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: buttonColors[0] }}
            />
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: buttonColors[1] }}
            />
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: buttonColors[2] }}
            />
          </div>
          <div 
            className="flex-1 h-6 rounded-md"
            style={{
              backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.05)",
              border: `1px solid ${parchmentBorder}`,
            }}
          />
          {/* Wax seal in header */}
          <div 
            className="flex items-center justify-center"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: `radial-gradient(circle at 30% 30%, ${isDark ? "#b83a5a" : "#a02848"} 0%, ${sealWax} 50%, ${isDark ? "#6b1a2a" : "#5a1525"} 100%)`,
              boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            <span style={{ fontSize: "14px" }}>🎭</span>
          </div>
        </div>
        
        {/* Email Meta - Calligraphic style */}
        <div 
          className="space-y-2"
          style={{ fontFamily: "'IM Fell English', 'Palatino Linotype', Georgia, serif" }}
        >
          <div className="flex gap-2">
            <span className="text-xs w-12" style={{ color: textMuted, fontStyle: "italic" }}>From:</span>
            <span className="text-xs" style={{ color: textColor }}>
              {senderEmail || "william@globe-theatre.co.uk"}
            </span>
            <span 
              className="text-[10px] px-1.5 py-0.5 rounded ml-2"
              style={{ 
                backgroundColor: isDark ? "rgba(183, 148, 246, 0.15)" : "rgba(107, 45, 143, 0.1)",
                color: accentPurple,
                fontStyle: "italic",
              }}
            >
              The Bard of Avon
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-xs w-12" style={{ color: textMuted, fontStyle: "italic" }}>To:</span>
            <span className="text-xs" style={{ color: textMuted }}>recipient@example.com</span>
          </div>
          <div className="flex gap-2">
            <span className="text-xs w-12" style={{ color: textMuted, fontStyle: "italic" }}>Subject:</span>
            <span className="text-xs font-medium" style={{ color: textColor }}>{theme.subject}</span>
          </div>
        </div>
      </div>
      
      {/* Email Body - Parchment content area */}
      <div className="relative z-10 px-6 py-6">
        {/* Decorative corner flourishes */}
        <div className="absolute top-2 left-2 opacity-30">
          <svg width="30" height="30" viewBox="0 0 50 50">
            <path d="M5 5 Q5 25, 25 25 Q5 25, 5 45" stroke={accentGold} strokeWidth="1.5" fill="none"/>
            <circle cx="8" cy="8" r="2" fill={accentGold}/>
          </svg>
        </div>
        <div className="absolute top-2 right-2 opacity-30" style={{ transform: "scaleX(-1)" }}>
          <svg width="30" height="30" viewBox="0 0 50 50">
            <path d="M5 5 Q5 25, 25 25 Q5 25, 5 45" stroke={accentGold} strokeWidth="1.5" fill="none"/>
            <circle cx="8" cy="8" r="2" fill={accentGold}/>
          </svg>
        </div>
        
        {/* Body text */}
        <div 
          className="text-sm space-y-4 mb-8 leading-relaxed"
          style={{ 
            color: inkColor,
            fontFamily: "'IM Fell English', 'Palatino Linotype', Georgia, serif",
            lineHeight: "1.8",
          }}
        >
          <p style={{ color: accentPurple, fontStyle: "italic" }}>
            {theme.greeting}
          </p>
          {theme.body.map((paragraph, index) => (
            <p key={index} style={{ textAlign: "justify", textIndent: index > 0 ? "1.5em" : "0" }}>
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Closing */}
        <p 
          className="text-sm mb-6"
          style={{ 
            color: inkColor,
            fontFamily: "'IM Fell English', Georgia, serif",
            fontStyle: "italic",
          }}
        >
          {theme.closing}
        </p>
        
        {/* Signature Section */}
        <div 
          className="pt-4 relative shakespeare-signature-section"
          style={{ borderTop: `1px solid ${parchmentBorder}` }}
        >
          {/* AI Loading effect */}
          {isAIGenerating && (
            <>
              <div className="ai-loading-border" />
              <div className="ai-loading-inner-glow" />
              <div className="ai-shimmer-subtle" />
            </>
          )}
          <div style={{ color: inkColor }}>
            {children}
          </div>
        </div>
      </div>
      
      {/* Quill decoration in corner */}
      <div 
        className="absolute bottom-4 right-4 text-2xl opacity-20"
        style={{ transform: "rotate(15deg)" }}
      >
        🪶
      </div>
    </div>
  );
}

// iOS Mail App Preview - Realistic iPhone email client
function IOSMailPreview({
  theme,
  isDark,
  senderEmail,
  children,
  isAIGenerating,
  deviceWidth,
}: {
  theme: ReturnType<typeof getEmailTheme>;
  isDark: boolean;
  senderEmail: string;
  children: ReactNode;
  isAIGenerating: boolean;
  deviceWidth: number;
}) {
  // iOS system colors
  const bgColor = isDark ? "#000000" : "#F2F2F7";
  const cardBg = isDark ? "#1C1C1E" : "#FFFFFF";
  const textPrimary = isDark ? "#FFFFFF" : "#000000";
  const textSecondary = isDark ? "#8E8E93" : "#8E8E93";
  const borderColor = isDark ? "#38383A" : "#C6C6C8";
  const blueAccent = "#007AFF";
  
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  return (
    <div 
      className="w-full h-full overflow-hidden flex flex-col"
      style={{ 
        backgroundColor: bgColor,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif',
      }}
    >
      {/* iOS Status Bar */}
      <div 
        className="flex items-center justify-between px-6 py-2 relative"
        style={{ 
          backgroundColor: cardBg,
          paddingTop: '12px',
        }}
      >
        {/* Time */}
        <span 
          className="text-[15px] font-semibold"
          style={{ color: textPrimary }}
        >
          {currentTime}
        </span>
        
        {/* Dynamic Island Spacer */}
        <div className="w-[90px]" />
        
        {/* Right Icons */}
        <div className="flex items-center gap-1">
          {/* Signal */}
          <svg width="17" height="12" viewBox="0 0 17 12" fill={textPrimary}>
            <rect x="0" y="8" width="3" height="4" rx="1" opacity="0.3"/>
            <rect x="4.5" y="5" width="3" height="7" rx="1" opacity="0.5"/>
            <rect x="9" y="2" width="3" height="10" rx="1" opacity="0.7"/>
            <rect x="13.5" y="0" width="3" height="12" rx="1"/>
          </svg>
          {/* WiFi */}
          <svg width="16" height="12" viewBox="0 0 16 12" fill={textPrimary} className="ml-1">
            <path d="M8 2.5C10.5 2.5 12.7 3.5 14.3 5.1L15.4 4C13.5 2.1 10.9 1 8 1C5.1 1 2.5 2.1 0.6 4L1.7 5.1C3.3 3.5 5.5 2.5 8 2.5ZM8 5.5C9.7 5.5 11.2 6.2 12.3 7.3L13.4 6.2C12 4.8 10.1 4 8 4C5.9 4 4 4.8 2.6 6.2L3.7 7.3C4.8 6.2 6.3 5.5 8 5.5ZM8 8.5C8.8 8.5 9.5 8.8 10.1 9.4L11.2 8.3C10.3 7.4 9.2 7 8 7C6.8 7 5.7 7.4 4.8 8.3L5.9 9.4C6.5 8.8 7.2 8.5 8 8.5ZM8 10C8.6 10 9 10.4 9 11C9 11.6 8.6 12 8 12C7.4 12 7 11.6 7 11C7 10.4 7.4 10 8 10Z"/>
          </svg>
          {/* Battery */}
          <div className="flex items-center ml-1">
            <div 
              className="w-[22px] h-[11px] rounded-[3px] border-[1.5px] relative"
              style={{ borderColor: textPrimary }}
            >
              <div 
                className="absolute inset-[1.5px] rounded-[1px]"
                style={{ 
                  backgroundColor: textPrimary,
                  width: '75%',
                }}
              />
            </div>
            <div 
              className="w-[1.5px] h-[5px] rounded-r-[1px] ml-[1px]"
              style={{ backgroundColor: textPrimary }}
            />
          </div>
        </div>
      </div>
      
      {/* iOS Mail Navigation Header */}
      <div 
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ 
          backgroundColor: cardBg,
          borderColor: borderColor,
        }}
      >
        {/* Back button */}
        <button className="flex items-center gap-1">
          <svg width="12" height="20" viewBox="0 0 12 20" fill={blueAccent}>
            <path d="M10.5 1L2 10L10.5 19" stroke={blueAccent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ color: blueAccent }} className="text-[17px]">Inbox</span>
        </button>
        
        {/* Right action icons */}
        <div className="flex items-center gap-5">
          {/* Archive */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={blueAccent} strokeWidth="1.5">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
          {/* Flag */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={blueAccent} strokeWidth="1.5">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>
          </svg>
          {/* Reply */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={blueAccent} strokeWidth="1.5">
            <path d="M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4m-6-4l-4 4 4 4m8-8h-8"/>
          </svg>
        </div>
      </div>
      
      {/* Email Content Area */}
      <div 
        className="flex-1 overflow-auto"
        style={{ backgroundColor: bgColor }}
      >
        {/* Email Header Card */}
        <div 
          className="mx-0 mt-0 rounded-none border-b"
          style={{ 
            backgroundColor: cardBg,
            borderColor: borderColor,
          }}
        >
          {/* Subject Line */}
          <div className="px-4 pt-4 pb-2">
            <h1 
              className="text-[22px] font-semibold leading-tight"
              style={{ color: textPrimary }}
            >
              {theme.subject}
            </h1>
          </div>
          
          {/* Sender Info */}
          <div className="px-4 pb-4 flex items-start gap-3">
            {/* Avatar */}
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ 
                background: `linear-gradient(135deg, ${theme.accentColor || blueAccent}, ${theme.accentColor ? theme.accentColor + '88' : '#5856D6'})`,
              }}
            >
              <span className="text-white text-[17px] font-semibold">
                {(senderEmail || 'Y')[0].toUpperCase()}
              </span>
            </div>
            
            {/* Sender Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span 
                  className="text-[15px] font-semibold truncate"
                  style={{ color: textPrimary }}
                >
                  {senderEmail?.split('@')[0] || 'You'}
                </span>
                <span 
                  className="text-[13px] flex-shrink-0 ml-2"
                  style={{ color: textSecondary }}
                >
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span 
                  className="text-[13px]"
                  style={{ color: textSecondary }}
                >
                  To: me
                </span>
                <svg 
                  width="12" height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={textSecondary} 
                  strokeWidth="2"
                  className="ml-1"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Email Body */}
        <div 
          className="px-4 py-5"
          style={{ backgroundColor: cardBg }}
        >
          <div 
            className="text-[15px] leading-[1.5] space-y-4"
            style={{ color: textPrimary }}
          >
            <p>{theme.greeting}</p>
            {theme.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <p>{theme.closing}</p>
          </div>
          
          {/* Signature Area */}
          <div 
            className="mt-6 pt-4 relative border-t"
            style={{ borderColor: borderColor }}
          >
            {/* AI Loading Animation */}
            {isAIGenerating && (
              <>
                <div className="ai-loading-border" />
                <div className="ai-loading-inner-glow" />
                <div className="ai-shimmer-subtle" />
              </>
            )}
            {children}
          </div>
        </div>
      </div>
      
      {/* iOS Mail Bottom Toolbar */}
      <div 
        className="flex items-center justify-around py-3 border-t"
        style={{ 
          backgroundColor: cardBg,
          borderColor: borderColor,
          paddingBottom: '28px', // Home indicator safe area
        }}
      >
        {/* Archive */}
        <button className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={blueAccent} strokeWidth="1.5">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
        </button>
        {/* Folder */}
        <button className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={blueAccent} strokeWidth="1.5">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
        </button>
        {/* Reply */}
        <button className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={blueAccent} strokeWidth="1.5">
            <path d="M3 10l9-7v4c11 0 11 13 11 13s-2-5-11-5v4l-9-9z"/>
          </svg>
        </button>
        {/* Compose */}
        <button className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={blueAccent} strokeWidth="1.5">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// iPad Mail App Preview - Realistic iPad email client
function IPadMailPreview({
  theme,
  isDark,
  senderEmail,
  children,
  isAIGenerating,
  deviceWidth,
}: {
  theme: ReturnType<typeof getEmailTheme>;
  isDark: boolean;
  senderEmail: string;
  children: ReactNode;
  isAIGenerating: boolean;
  deviceWidth: number;
}) {
  // iPad system colors - similar to iOS but slightly adjusted
  const bgColor = isDark ? "#000000" : "#F2F2F7";
  const sidebarBg = isDark ? "#1C1C1E" : "#FFFFFF";
  const contentBg = isDark ? "#1C1C1E" : "#FFFFFF";
  const textPrimary = isDark ? "#FFFFFF" : "#000000";
  const textSecondary = isDark ? "#8E8E93" : "#8E8E93";
  const borderColor = isDark ? "#38383A" : "#C6C6C8";
  const blueAccent = "#007AFF";
  const selectedBg = isDark ? "#2C2C2E" : "#E5E5EA";
  
  // Calculate sidebar width - use percentage for responsive sizing
  const sidebarWidthPercent = 38; // 38% of width for sidebar
  
  return (
    <div 
      className="w-full h-full overflow-hidden flex flex-col"
      style={{ 
        backgroundColor: bgColor,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif',
      }}
    >
      {/* iPad Status Bar - Simplified */}
      <div 
        className="flex items-center justify-between px-6 h-7"
        style={{ backgroundColor: bgColor }}
      >
        <span 
          className="text-[13px] font-medium"
          style={{ color: textPrimary }}
        >
          {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </span>
        <div className="flex items-center gap-2">
          <div 
            className="w-[20px] h-[10px] rounded-[2px] border relative"
            style={{ borderColor: textPrimary }}
          >
            <div 
              className="absolute inset-[1px] rounded-[1px]"
              style={{ backgroundColor: textPrimary, width: '80%' }}
            />
          </div>
        </div>
      </div>
      
      {/* Main Content Area - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Inbox List */}
        <div 
          className="flex flex-col border-r overflow-hidden flex-shrink-0"
          style={{ 
            backgroundColor: sidebarBg,
            borderColor: borderColor,
            width: '38%',
            maxWidth: '280px',
            minWidth: '200px',
          }}
        >
          {/* Sidebar Header */}
          <div 
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: borderColor }}
          >
            <button className="flex items-center gap-1">
              <svg width="10" height="16" viewBox="0 0 10 16" fill={blueAccent}>
                <path d="M8.5 1L1.5 8L8.5 15" stroke={blueAccent} strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
              <span style={{ color: blueAccent }} className="text-[15px] ml-1">Mailboxes</span>
            </button>
            <span 
              className="text-[15px] font-semibold"
              style={{ color: textPrimary }}
            >
              Inbox
            </span>
            <button>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={blueAccent} strokeWidth="1.5">
                <path d="M3 6h18M3 12h18M3 18h18"/>
              </svg>
            </button>
          </div>
          
          {/* Email List */}
          <div className="flex-1 overflow-auto">
            {/* Current Email - Selected */}
            <div 
              className="px-4 py-3 border-b border-l-4"
              style={{ 
                backgroundColor: selectedBg,
                borderBottomColor: borderColor,
                borderLeftColor: blueAccent,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span 
                  className="text-[15px] font-semibold truncate flex-1"
                  style={{ color: textPrimary }}
                >
                  {senderEmail?.split('@')[0] || 'You'}
                </span>
                <span 
                  className="text-[12px] ml-2 flex-shrink-0"
                  style={{ color: textSecondary }}
                >
                  Now
                </span>
              </div>
              <p 
                className="text-[14px] font-medium truncate mb-0.5"
                style={{ color: textPrimary }}
              >
                {theme.subject}
              </p>
              <p 
                className="text-[13px] truncate"
                style={{ color: textSecondary }}
              >
                {theme.greeting}
              </p>
            </div>
            
            {/* Other dummy emails */}
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="px-4 py-3 border-b"
                style={{ borderColor: borderColor }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="text-[15px] truncate flex-1"
                    style={{ color: textPrimary }}
                  >
                    {['Newsletter', 'John Smith', 'Support Team'][i - 1]}
                  </span>
                  <span 
                    className="text-[12px] ml-2 flex-shrink-0"
                    style={{ color: textSecondary }}
                  >
                    {i}h ago
                  </span>
                </div>
                <p 
                  className="text-[14px] truncate mb-0.5"
                  style={{ color: textPrimary }}
                >
                  {['Weekly Update', 'Re: Project Status', 'Your ticket #12345'][i - 1]}
                </p>
                <p 
                  className="text-[13px] truncate"
                  style={{ color: textSecondary }}
                >
                  Preview text would appear here...
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Content - Email Detail */}
        <div 
          className="flex-1 flex flex-col overflow-hidden min-w-0"
          style={{ 
            backgroundColor: contentBg,
          }}
        >
          {/* Content Header */}
          <div 
            className="flex items-center justify-between px-5 py-3 border-b"
            style={{ borderColor: borderColor }}
          >
            <div className="flex-1 min-w-0">
              <h1 
                className="text-[20px] font-semibold truncate"
                style={{ color: textPrimary }}
              >
                {theme.subject}
              </h1>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <button>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={blueAccent} strokeWidth="1.5">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
              </button>
              <button>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={blueAccent} strokeWidth="1.5">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>
                </svg>
              </button>
              <button>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={blueAccent} strokeWidth="1.5">
                  <path d="M3 10l9-7v4c11 0 11 13 11 13s-2-5-11-5v4l-9-9z"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Scrollable Email Content */}
          <div className="flex-1 overflow-auto">
            {/* Sender Info */}
            <div className="px-5 py-4 flex items-start gap-4 border-b" style={{ borderColor: borderColor }}>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.accentColor || blueAccent}, ${theme.accentColor ? theme.accentColor + '88' : '#5856D6'})`,
                }}
              >
                <span className="text-white text-[20px] font-semibold">
                  {(senderEmail || 'Y')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span 
                    className="text-[17px] font-semibold"
                    style={{ color: textPrimary }}
                  >
                    {senderEmail?.split('@')[0] || 'You'}
                  </span>
                  <span 
                    className="text-[13px]"
                    style={{ color: textSecondary }}
                  >
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-[14px] mt-0.5" style={{ color: textSecondary }}>
                  &lt;{senderEmail || 'you@company.com'}&gt;
                </div>
                <div className="text-[13px] mt-1 flex items-center gap-1" style={{ color: textSecondary }}>
                  To: me
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={textSecondary} strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Email Body */}
            <div className="px-5 py-5">
              <div 
                className="text-[16px] leading-[1.6] space-y-4"
                style={{ color: textPrimary }}
              >
                <p>{theme.greeting}</p>
                {theme.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <p>{theme.closing}</p>
              </div>
              
              {/* Signature */}
              <div 
                className="mt-8 pt-5 relative border-t"
                style={{ borderColor: borderColor }}
              >
                {isAIGenerating && (
                  <>
                    <div className="ai-loading-border" />
                    <div className="ai-loading-inner-glow" />
                    <div className="ai-shimmer-subtle" />
                  </>
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmailPreviewMock({
  emailTheme,
  previewTheme,
  senderEmail,
  children,
  isAIGenerating = false,
  deviceWidth,
}: EmailPreviewMockProps) {
  const theme = getEmailTheme(emailTheme);
  const isDark = previewTheme === "dark";
  
  // Responsive width - use deviceWidth if provided, default to 600px
  const containerWidth = deviceWidth || 600;
  const isResponsiveMode = deviceWidth !== undefined && deviceWidth < 600;
  
  // Device detection for native-looking previews
  // iPhone: width <= 500 (iPhone 17 Pro Max is 440)
  // iPad: width > 500 && width <= 1100 (iPad Mini is 744, iPad Pro is 1024)
  const isIPhoneDevice = deviceWidth !== undefined && deviceWidth <= 500;
  const isIPadDevice = deviceWidth !== undefined && deviceWidth > 500 && deviceWidth <= 1100;
  
  // For iPhone device, render iOS Mail app preview (for all themes)
  // This shows how the signature will actually appear in iOS Mail
  if (isIPhoneDevice) {
    return (
      <IOSMailPreview
        theme={theme}
        isDark={isDark}
        senderEmail={senderEmail}
        isAIGenerating={isAIGenerating}
        deviceWidth={deviceWidth}
      >
        {children}
      </IOSMailPreview>
    );
  }
  
  // For iPad device, render iPad Mail app preview (for all themes)
  // This shows how the signature will actually appear in iPad Mail
  if (isIPadDevice) {
    return (
      <IPadMailPreview
        theme={theme}
        isDark={isDark}
        senderEmail={senderEmail}
        isAIGenerating={isAIGenerating}
        deviceWidth={deviceWidth}
      >
        {children}
      </IPadMailPreview>
    );
  }
  
  // For responsive mode, themed layouts use CSS scaling to fit within the device width
  const themedLayoutStyle = isResponsiveMode ? {
    transform: `scale(${containerWidth / 600})`,
    transformOrigin: 'top left',
    width: 600,
  } : undefined;
  
  const themedLayoutWrapperStyle = isResponsiveMode ? {
    width: containerWidth,
    height: 'auto',
    overflow: 'hidden',
  } : undefined;
  
  // Render special Parks and Recreation memo layout
  if (emailTheme === "parks-and-recreation") {
    return (
      <div style={themedLayoutWrapperStyle}>
        <div style={themedLayoutStyle}>
          <PawneeParksMеmo
            theme={theme}
            isDark={isDark}
            senderEmail={senderEmail}
            isAIGenerating={isAIGenerating}
          >
            {children}
          </PawneeParksMеmo>
        </div>
      </div>
    );
  }
  
  // Render special Office sticky note layout
  if (emailTheme === "the-office") {
    return (
      <div style={themedLayoutWrapperStyle}>
        <div style={themedLayoutStyle}>
          <OfficeStickyNote
            theme={theme}
            isDark={isDark}
            senderEmail={senderEmail}
            isAIGenerating={isAIGenerating}
          >
            {children}
          </OfficeStickyNote>
        </div>
      </div>
    );
  }
  
  // Render special Yoda zen scroll layout
  if (emailTheme === "yoda") {
    return (
      <div style={themedLayoutWrapperStyle}>
        <div style={themedLayoutStyle}>
          <YodaZenScroll
            theme={theme}
            isDark={isDark}
            senderEmail={senderEmail}
            isAIGenerating={isAIGenerating}
          >
            {children}
          </YodaZenScroll>
        </div>
      </div>
    );
  }
  
  // Render special Spider-Man notebook layout
  if (emailTheme === "spider-man") {
    return (
      <div style={themedLayoutWrapperStyle}>
        <div style={themedLayoutStyle}>
          <SpiderManNotebook
            theme={theme}
            isDark={isDark}
            senderEmail={senderEmail}
            isAIGenerating={isAIGenerating}
          >
            {children}
          </SpiderManNotebook>
        </div>
      </div>
    );
  }
  
  // Render special Shakespeare parchment layout
  if (emailTheme === "shakespeare") {
    return (
      <div style={themedLayoutWrapperStyle}>
        <div style={themedLayoutStyle}>
          <ShakespeareParchment
            theme={theme}
            isDark={isDark}
            senderEmail={senderEmail}
            isAIGenerating={isAIGenerating}
          >
            {children}
          </ShakespeareParchment>
        </div>
      </div>
    );
  }
  
  // Render special Surfer Dude Hawaii beach postcard layout
  if (emailTheme === "surfer-dude") {
    return (
      <div style={themedLayoutWrapperStyle}>
        <div style={themedLayoutStyle}>
          <SurferDudeBeachPostcard
            theme={theme}
            isDark={isDark}
            senderEmail={senderEmail}
            isAIGenerating={isAIGenerating}
          >
            {children}
          </SurferDudeBeachPostcard>
        </div>
      </div>
    );
  }
  
  // Render special Captain Jack pirate scroll layout
  if (emailTheme === "pirate") {
    return (
      <div style={themedLayoutWrapperStyle}>
        <div style={themedLayoutStyle}>
          <CaptainJackScroll
            theme={theme}
            isDark={isDark}
            senderEmail={senderEmail}
            isAIGenerating={isAIGenerating}
            deviceWidth={deviceWidth}
          >
            {children}
          </CaptainJackScroll>
        </div>
      </div>
    );
  }
  
  // Determine background gradient for themed headers
  const headerBg = theme.headerBg 
    ? (isDark ? theme.headerBg.dark : theme.headerBg.light)
    : undefined;
    
  // Window button colors
  const buttonColors = theme.windowButtons?.colors || ["#ef4444", "#fbbf24", "#22c55e"];
  
  // Text colors based on whether we have a custom theme
  const hasCustomTheme = !!theme.headerBg;
  const headerTextMuted = hasCustomTheme ? "rgba(255,255,255,0.6)" : (isDark ? "#71717a" : "#6b7280");
  const headerTextPrimary = hasCustomTheme ? "rgba(255,255,255,0.9)" : (isDark ? "#e4e4e7" : "#111827");
  const headerTextBold = hasCustomTheme ? "#ffffff" : (isDark ? "#fafafa" : "#111827");
  
  // Body text colors - use explicit colors for custom themes
  const bodyTextColor = hasCustomTheme ? "rgba(255,255,255,0.85)" : (isDark ? "#d4d4d8" : "#374151");

  // Determine if this is a "fun" theme (non-professional)
  const isFunTheme = emailTheme !== "professional";

  // Responsive sizing calculations
  const padding = isResponsiveMode ? 'px-3 py-3' : 'px-6 py-4';
  const bodyPadding = isResponsiveMode ? 'px-3 py-4' : 'px-6 py-6';
  const fontSize = isResponsiveMode ? 'text-[11px]' : 'text-xs';
  const bodyFontSize = isResponsiveMode ? 'text-xs' : 'text-sm';
  const buttonSize = isResponsiveMode ? 'w-2.5 h-2.5' : 'w-3 h-3';
  const addressBarHeight = isResponsiveMode ? 'h-5' : 'h-6';

  return (
    <div 
      className="min-h-[300px] relative overflow-hidden w-full"
      style={{ width: containerWidth }}
    >
      {/* Subtle particle effects inside preview */}
      {isFunTheme && (
        <div className="absolute inset-0 pointer-events-none z-[1]">
          <ThemeParticles
            themeId={emailTheme}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      )}

      {/* Email Header Mock */}
      <div 
        className={clsx(
          "relative z-10 border-b transition-all duration-300",
          padding,
          !hasCustomTheme && (isDark 
            ? "bg-zinc-800 border-zinc-700" 
            : "bg-gray-100 border-gray-200")
        )}
        style={headerBg ? { 
          background: headerBg,
          borderColor: theme.accentColor ? `${theme.accentColor}30` : undefined
        } : undefined}
      >
        {/* Window Controls */}
        <div className={clsx("flex items-center gap-2 mb-2", isResponsiveMode && "gap-1.5 mb-1.5")}>
          <div className={clsx("flex", isResponsiveMode ? "gap-1" : "gap-1.5")}>
            <div 
              className={clsx(buttonSize, "rounded-full transition-colors duration-300")} 
              style={{ backgroundColor: buttonColors[0] }}
            />
            <div 
              className={clsx(buttonSize, "rounded-full transition-colors duration-300")} 
              style={{ backgroundColor: buttonColors[1] }}
            />
            <div 
              className={clsx(buttonSize, "rounded-full transition-colors duration-300")} 
              style={{ backgroundColor: buttonColors[2] }}
            />
          </div>
          <div 
            className={clsx(
              "flex-1 rounded-md border transition-colors duration-300",
              addressBarHeight,
              !hasCustomTheme && (isDark 
                ? "bg-zinc-700 border-zinc-600" 
                : "bg-white border-gray-200")
            )}
            style={hasCustomTheme ? {
              backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.2)",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.3)"
            } : undefined}
          />
        </div>
        
        {/* Email Meta */}
        <div className={clsx(isResponsiveMode ? "space-y-1" : "space-y-2")}>
          <div className="flex gap-2 flex-wrap">
            <span 
              className={clsx(fontSize, "w-10 flex-shrink-0 transition-colors duration-300")}
              style={{ color: headerTextMuted }}
            >
              From:
            </span>
            <span 
              className={clsx(fontSize, "transition-colors duration-300 truncate")}
              style={{ color: headerTextPrimary }}
            >
              {senderEmail || "you@company.com"}
            </span>
            {theme.character && !isResponsiveMode && (
              <span 
                className="text-[10px] px-1.5 py-0.5 rounded ml-2 transition-all duration-300"
                style={{ 
                  backgroundColor: theme.accentColor ? `${theme.accentColor}30` : "rgba(255,255,255,0.2)",
                  color: theme.accentColor || headerTextPrimary
                }}
              >
                {theme.character}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <span 
              className={clsx(fontSize, "w-10 flex-shrink-0 transition-colors duration-300")}
              style={{ color: headerTextMuted }}
            >
              To:
            </span>
            <span 
              className={clsx(fontSize, "transition-colors duration-300 truncate")}
              style={{ color: headerTextMuted }}
            >
              recipient@example.com
            </span>
          </div>
          <div className="flex gap-2">
            <span 
              className={clsx(fontSize, "w-10 flex-shrink-0 transition-colors duration-300")}
              style={{ color: headerTextMuted }}
            >
              Subject:
            </span>
            <span 
              className={clsx(fontSize, "font-medium transition-colors duration-300 truncate")}
              style={{ color: headerTextBold }}
            >
              {theme.subject}
            </span>
          </div>
        </div>
      </div>

      {/* Email Body Mock */}
      <div className={clsx("relative z-10", bodyPadding)}>
        <div 
          className={clsx(
            bodyFontSize, 
            isResponsiveMode ? "space-y-2 mb-4" : "space-y-4 mb-8",
            "leading-relaxed transition-colors duration-300"
          )}
          style={{ color: bodyTextColor }}
        >
          <p className={theme.specialEffects === "yoda" ? "italic" : ""}>
            {theme.greeting}
          </p>
          {theme.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <p 
          className={clsx(bodyFontSize, isResponsiveMode ? "mb-3" : "mb-6", "transition-colors duration-300")}
          style={{ color: bodyTextColor }}
        >
          {theme.closing}
        </p>
        
        {/* Signature Preview */}
        <div className={clsx(
          isResponsiveMode ? "pt-3" : "pt-4",
          "border-t transition-colors duration-300 relative",
          isDark ? "border-zinc-700/50" : "border-gray-200/50"
        )}>
          {/* Elegant rainbow border loading animation */}
          {isAIGenerating && (
            <>
              <div className="ai-loading-border" />
              <div className="ai-loading-inner-glow" />
              <div className="ai-shimmer-subtle" />
            </>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
