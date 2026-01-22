"use client";

import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { EmailThemeId } from "@/lib/email-themes";
import { getThemeParticles } from "@/lib/theme-particles";

interface ThemeParticlesProps {
  themeId: EmailThemeId;
  className?: string;
}

// Track global initialization state
let engineInitialized = false;
let engineInitPromise: Promise<void> | null = null;

export function ThemeParticles({ themeId, className }: ThemeParticlesProps) {
  const [init, setInit] = useState(engineInitialized);

  useEffect(() => {
    // If already initialized, skip
    if (engineInitialized) {
      setInit(true);
      return;
    }

    // If initialization is in progress, wait for it
    if (engineInitPromise) {
      engineInitPromise.then(() => setInit(true));
      return;
    }

    // Start initialization
    engineInitPromise = initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      engineInitialized = true;
      setInit(true);
    });
  }, []);

  const options = useMemo(() => getThemeParticles(themeId), [themeId]);

  if (!init) {
    return null;
  }

  return (
    <Particles
      id={`particles-${themeId}`}
      className={className}
      options={options}
    />
  );
}
