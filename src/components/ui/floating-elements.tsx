"use client";

import { useMemo } from "react";
import { EmailThemeId, getEmailTheme } from "@/lib/email-themes";
import { getThemeVisuals, FloatingElement } from "@/lib/theme-visuals";

interface FloatingElementsProps {
  themeId: EmailThemeId;
  className?: string;
}

// Generate unique keyframe animation for each element
function generateKeyframes(element: FloatingElement, index: number): string {
  const name = `float-${element.id}-${index}`;
  const { startPosition, endPosition, rotation, rotationAnimation } = element;

  // If no end position, create a gentle floating animation
  if (!endPosition) {
    if (rotationAnimation) {
      return `
        @keyframes ${name} {
          0% { 
            left: ${startPosition.x}; 
            top: ${startPosition.y}; 
            transform: rotate(0deg);
          }
          100% { 
            left: ${startPosition.x}; 
            top: ${startPosition.y}; 
            transform: rotate(360deg);
          }
        }
      `;
    }
    // Gentle float in place
    return `
      @keyframes ${name} {
        0%, 100% { 
          left: ${startPosition.x}; 
          top: ${startPosition.y}; 
          transform: translateY(0) ${rotation ? `rotate(${rotation}deg)` : ""};
        }
        50% { 
          left: ${startPosition.x}; 
          top: ${startPosition.y}; 
          transform: translateY(-10px) ${rotation ? `rotate(${rotation}deg)` : ""};
        }
      }
    `;
  }

  // Drift animation from start to end
  const startRotate = rotation || 0;
  const endRotate = rotationAnimation ? startRotate + 360 : startRotate;

  return `
    @keyframes ${name} {
      0% { 
        left: ${startPosition.x}; 
        top: ${startPosition.y}; 
        transform: rotate(${startRotate}deg);
      }
      100% { 
        left: ${endPosition.x}; 
        top: ${endPosition.y}; 
        transform: rotate(${endRotate}deg);
      }
    }
  `;
}

export function FloatingElements({ themeId, className }: FloatingElementsProps) {
  const theme = getEmailTheme(themeId);
  const visuals = getThemeVisuals(themeId);

  // Generate all keyframes and styles
  const { keyframes, elements } = useMemo(() => {
    const keyframesList: string[] = [];
    const elementsList = visuals.floatingElements.map((el, index) => {
      const keyframeName = `float-${el.id}-${index}`;
      keyframesList.push(generateKeyframes(el, index));

      return {
        ...el,
        keyframeName,
        style: {
          position: "absolute" as const,
          width: el.size,
          height: "auto",
          opacity: el.opacity,
          left: el.startPosition.x,
          top: el.startPosition.y,
          transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
          animation: `${keyframeName} ${el.animationDuration}s linear ${el.animationDelay}s infinite`,
          color: theme.accentColor || "#ffffff",
          pointerEvents: "none" as const,
          zIndex: 1,
        },
      };
    });

    return { keyframes: keyframesList.join("\n"), elements: elementsList };
  }, [themeId, visuals.floatingElements, theme.accentColor]);

  if (visuals.floatingElements.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Inject keyframes */}
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* Ambient glow effect */}
      {visuals.ambientGlow && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${visuals.ambientGlow.color}${Math.round(visuals.ambientGlow.intensity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Render floating elements */}
      {elements.map((el) => (
        <div
          key={el.id}
          style={el.style}
          dangerouslySetInnerHTML={{ __html: el.svg }}
        />
      ))}
    </div>
  );
}
