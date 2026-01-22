"use client";

import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { EmailThemeId } from "@/lib/email-themes";
import { getThemeVisuals } from "@/lib/theme-visuals";

// Dynamically import Player with no SSR
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

interface LottieBackgroundProps {
  themeId: EmailThemeId;
  className?: string;
}

export function LottieBackground({ themeId, className }: LottieBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const visuals = getThemeVisuals(themeId);

  // Only render on client to avoid SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render if no Lottie URL or not mounted
  if (!mounted || !visuals.lottieUrl) {
    return null;
  }

  return (
    <div 
      className={className}
      style={{ 
        opacity: visuals.lottieOpacity || 0.15,
        mixBlendMode: "screen",
      }}
    >
      <Suspense fallback={null}>
        <Player
          src={visuals.lottieUrl}
          autoplay
          loop
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          renderer="svg"
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
            progressiveLoad: true,
            hideOnTransparent: true,
          }}
        />
      </Suspense>
    </div>
  );
}
