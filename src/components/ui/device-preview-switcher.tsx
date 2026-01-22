"use client";

import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  ChevronDown,
  Check
} from "lucide-react";

export type DeviceType = "desktop" | "iphone-17-pro-max" | "ipad-mini" | "ipad-pro";

export interface DeviceConfig {
  id: DeviceType;
  name: string;
  shortName: string;
  width: number;
  height: number;
  icon: typeof Smartphone;
  category: "phone" | "tablet" | "desktop";
  hasNotch?: boolean;
  hasDynamicIsland?: boolean;
  borderRadius?: number;
  description?: string;
}

export const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  "desktop": {
    id: "desktop",
    name: "Desktop",
    shortName: "Desktop",
    width: 1440,
    height: 900,
    icon: Monitor,
    category: "desktop",
    description: "Full-width view",
  },
  "iphone-17-pro-max": {
    id: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    shortName: "17 Pro Max",
    width: 375, // Display width for preview (actual: 440pt)
    height: 812, // Display height for preview (actual: 956pt)
    icon: Smartphone,
    category: "phone",
    hasDynamicIsland: true,
    borderRadius: 47,
    description: "6.9\" display",
  },
  "ipad-mini": {
    id: "ipad-mini",
    name: "iPad Mini",
    shortName: "iPad Mini",
    width: 560, // Display width for preview (actual: 744pt)
    height: 750, // Display height for preview (actual: 1133pt)
    icon: Tablet,
    category: "tablet",
    borderRadius: 18,
    description: "8.3\" display",
  },
  "ipad-pro": {
    id: "ipad-pro",
    name: "iPad Pro 12.9\"",
    shortName: "iPad Pro",
    width: 680, // Display width for preview (actual: 1024pt)
    height: 880, // Display height for preview (actual: 1366pt)
    icon: Tablet,
    category: "tablet",
    borderRadius: 18,
    description: "12.9\" display",
  },
};

// Category labels and icons
const CATEGORY_INFO = {
  desktop: { label: "Desktop", icon: Monitor },
  phone: { label: "iPhone", icon: Smartphone },
  tablet: { label: "iPad", icon: Tablet },
};

interface DevicePreviewSwitcherProps {
  value: DeviceType;
  onChange: (device: DeviceType) => void;
  className?: string;
}

export function DevicePreviewSwitcher({ 
  value, 
  onChange,
  className 
}: DevicePreviewSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentDevice = DEVICE_CONFIGS[value];
  const Icon = currentDevice.icon;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const deviceGroups = {
    desktop: Object.values(DEVICE_CONFIGS).filter(d => d.category === "desktop"),
    phone: Object.values(DEVICE_CONFIGS).filter(d => d.category === "phone"),
    tablet: Object.values(DEVICE_CONFIGS).filter(d => d.category === "tablet"),
  };

  return (
    <div ref={containerRef} className={clsx("relative", className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
          "border shadow-sm",
          isOpen
            ? "bg-card border-primary/40 text-foreground ring-2 ring-primary/20"
            : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80"
        )}
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Device</span>
        <div className="w-px h-3 bg-border" />
        <span className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" />
          <span className="font-medium text-foreground">{currentDevice.shortName}</span>
        </span>
        <ChevronDown 
          className={clsx(
            "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className={clsx(
            "absolute top-full left-0 mt-2 z-50",
            "w-72 rounded-lg overflow-hidden",
            "bg-card border border-border shadow-2xl",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
          )}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-secondary/50 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Preview Device</p>
            <p className="text-xs text-muted-foreground mt-0.5">Test responsiveness on different screens</p>
          </div>
          
          {/* Options */}
          <div className="p-2 max-h-[380px] overflow-y-auto">
            {/* Desktop Section */}
            <div className="mb-2">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Monitor className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Desktop
                </span>
              </div>
              {deviceGroups.desktop.map((device) => (
                <DeviceOption 
                  key={device.id}
                  device={device}
                  isSelected={value === device.id}
                  onSelect={() => {
                    onChange(device.id);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>

            <div className="h-px bg-border mx-2 my-2" />

            {/* iPhone Section */}
            <div className="mb-2">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  iPhone
                </span>
              </div>
              {deviceGroups.phone.map((device) => (
                <DeviceOption 
                  key={device.id}
                  device={device}
                  isSelected={value === device.id}
                  onSelect={() => {
                    onChange(device.id);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>

            <div className="h-px bg-border mx-2 my-2" />

            {/* iPad Section */}
            <div>
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Tablet className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  iPad
                </span>
              </div>
              {deviceGroups.tablet.map((device) => (
                <DeviceOption 
                  key={device.id}
                  device={device}
                  isSelected={value === device.id}
                  onSelect={() => {
                    onChange(device.id);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-4 py-2.5 bg-secondary/30 border-t border-border">
            <p className="text-[11px] text-muted-foreground text-center">
              Preview only — signature adapts to any device
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function DeviceOption({ 
  device, 
  isSelected, 
  onSelect 
}: { 
  device: DeviceConfig; 
  isSelected: boolean; 
  onSelect: () => void;
}) {
  const Icon = device.icon;
  
  return (
    <button
      onClick={onSelect}
      className={clsx(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all",
        isSelected
          ? "bg-primary/10"
          : "hover:bg-secondary/70"
      )}
    >
      {/* Device icon with frame preview */}
      <div className={clsx(
        "flex items-center justify-center w-8 h-8 rounded-md",
        isSelected ? "bg-primary/20" : "bg-secondary"
      )}>
        <Icon className={clsx(
          "w-4 h-4",
          isSelected ? "text-primary" : "text-muted-foreground"
        )} />
      </div>
      
      {/* Device info */}
      <div className="flex-1 min-w-0">
        <p className={clsx(
          "text-sm font-medium",
          isSelected ? "text-primary" : "text-foreground"
        )}>
          {device.name}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {device.width} × {device.height}
          {device.description && ` • ${device.description}`}
        </p>
      </div>
      
      {/* Checkmark */}
      {isSelected && (
        <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={2.5} />
      )}
    </button>
  );
}

interface DeviceFrameProps {
  device: DeviceType;
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export function DeviceFrame({ 
  device, 
  children, 
  className,
  scale = 1 
}: DeviceFrameProps) {
  const config = DEVICE_CONFIGS[device];
  
  if (device === "desktop") {
    return <div className={className}>{children}</div>;
  }

  const isPhone = config.category === "phone";

  // Calculate scaled dimensions
  const frameWidth = config.width * scale;
  const frameHeight = config.height * scale;
  const borderRadius = (config.borderRadius || 40) * scale;
  const bezel = isPhone ? 12 * scale : 16 * scale;

  return (
    <div 
      className={clsx("relative", className)}
      style={{
        width: frameWidth + bezel * 2,
        height: frameHeight + bezel * 2,
      }}
    >
      {/* Device outer frame */}
      <div
        className={clsx(
          "absolute inset-0 rounded-[inherit]",
          "bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_25px_50px_-12px_rgba(0,0,0,0.5)]"
        )}
        style={{
          borderRadius: borderRadius + bezel / 2,
        }}
      >
        {/* Inner bezel highlight */}
        <div 
          className="absolute inset-[1px] rounded-[inherit] bg-gradient-to-br from-zinc-600/50 to-transparent pointer-events-none"
          style={{
            borderRadius: borderRadius + bezel / 2 - 1,
          }}
        />
        
        {/* Side buttons for phones */}
        {isPhone && (
          <>
            {/* Volume buttons - left side */}
            <div 
              className="absolute bg-zinc-700 rounded-l-sm"
              style={{
                left: -3 * scale,
                top: 120 * scale,
                width: 3 * scale,
                height: 35 * scale,
              }}
            />
            <div 
              className="absolute bg-zinc-700 rounded-l-sm"
              style={{
                left: -3 * scale,
                top: 165 * scale,
                width: 3 * scale,
                height: 35 * scale,
              }}
            />
            {/* Power button - right side */}
            <div 
              className="absolute bg-zinc-700 rounded-r-sm"
              style={{
                right: -3 * scale,
                top: 140 * scale,
                width: 3 * scale,
                height: 50 * scale,
              }}
            />
          </>
        )}

        {/* Screen area */}
        <div
          className="absolute bg-black overflow-hidden"
          style={{
            top: bezel,
            left: bezel,
            right: bezel,
            bottom: bezel,
            borderRadius: borderRadius,
          }}
        >
          {/* Screen content - content renders its own status bar, dynamic island, etc */}
          <div 
            className="absolute inset-0 overflow-hidden"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResponsivePreviewContainerProps {
  device: DeviceType;
  children: React.ReactNode;
  className?: string;
  maxHeight?: number;
}

export function ResponsivePreviewContainer({
  device,
  children,
  className,
  maxHeight = 700,
}: ResponsivePreviewContainerProps) {
  const config = DEVICE_CONFIGS[device];
  
  // For desktop, render children directly
  if (device === "desktop") {
    return <div className={className}>{children}</div>;
  }

  // Calculate scale to fit within maxHeight
  const bezel = config.category === "phone" ? 24 : 32;
  const totalHeight = config.height + bezel;
  const scale = Math.min(1, maxHeight / totalHeight);

  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <DeviceFrame device={device} scale={scale}>
        <div 
          style={{ 
            width: config.width,
            height: config.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <div style={{ width: config.width, minHeight: config.height }}>
            {children}
          </div>
        </div>
      </DeviceFrame>
    </div>
  );
}

// Quick toggle buttons for common devices
interface DeviceQuickToggleProps {
  value: DeviceType;
  onChange: (device: DeviceType) => void;
  className?: string;
}

export function DeviceQuickToggle({ value, onChange, className }: DeviceQuickToggleProps) {
  const quickDevices: DeviceType[] = ["desktop", "ipad-mini", "iphone-17-pro-max"];
  
  return (
    <div className={clsx("flex items-center gap-0.5 p-0.5 bg-secondary/50 rounded-lg border border-border", className)}>
      {quickDevices.map((deviceId) => {
        const device = DEVICE_CONFIGS[deviceId];
        const Icon = device.icon;
        const isSelected = value === deviceId;
        
        return (
          <button
            key={deviceId}
            onClick={() => onChange(deviceId)}
            className={clsx(
              "flex items-center justify-center h-7 px-2 rounded-md transition-all",
              isSelected 
                ? "bg-background shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
            title={device.name}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
