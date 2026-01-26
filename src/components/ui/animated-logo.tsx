"use client";

import { ElectricLogo } from "./electric-logo";

interface AnimatedLogoProps {
  className?: string;
}

export function AnimatedLogo({ className = "" }: AnimatedLogoProps) {
  return <ElectricLogo size="sm" className={className} />;
}
