"use client";

import { useEffect, useState } from "react";
import { EmailThemeId } from "@/lib/email-themes";
import { getThemeVisuals } from "@/lib/theme-visuals";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

interface RiveBackgroundProps {
  themeId: EmailThemeId;
  className?: string;
}

// Separate component to isolate the useRive hook
function RivePlayer({ src, opacity }: { src: string; opacity: number }) {
  const { RiveComponent } = useRive({
    src,
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });

  return (
    <div
      style={{
        opacity,
        mixBlendMode: "screen",
        position: "absolute",
        inset: 0,
      }}
    >
      <RiveComponent
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}

export function RiveBackground({ themeId, className }: RiveBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const visuals = getThemeVisuals(themeId);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render if no Rive URL or not mounted
  if (!mounted || !visuals.riveUrl) {
    return null;
  }

  return (
    <div className={className}>
      <RivePlayer src={visuals.riveUrl} opacity={visuals.riveOpacity || 0.15} />
    </div>
  );
}
