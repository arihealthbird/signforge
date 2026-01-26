"use client";

interface ElectricLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ElectricLogo({ size = "md", className = "" }: ElectricLogoProps) {
  // Fixed sizes - no responsive changes to ensure consistency
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const imgSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const roundedClasses = {
    sm: "rounded-lg",
    md: "rounded-lg",
    lg: "rounded-xl",
  };

  return (
    <div className={`relative ${className}`}>
      {/* Logo container with border-rainbow-animated */}
      <div className={`${sizeClasses[size]} ${roundedClasses[size]} border-rainbow-animated flex items-center justify-center bg-background relative overflow-visible`}>
        <img 
          src="/images/foundry.png" 
          alt="SignForge" 
          className={`${imgSizes[size]} object-contain relative z-10 logo-icon-filter`}
        />
        {/* Subtle inner glow */}
        <div className={`absolute inset-0 ${roundedClasses[size]} bg-gradient-to-br from-[var(--gradient-start)]/5 via-transparent to-[var(--gradient-end)]/5`} />
      </div>

      {/* Ambient glow behind logo */}
      <div 
        className={`absolute inset-0 ${roundedClasses[size]} opacity-30 blur-md -z-10`}
        style={{
          background: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-mid-3), var(--gradient-end))',
          animation: 'rainbow-border-shift 4s linear infinite',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
}
