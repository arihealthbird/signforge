"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useVisualEditor } from "./visual-editor-context";
import { clsx } from "clsx";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Minus,
  Palette,
  X,
  Type,
  MoveVertical,
} from "lucide-react";

const ELEMENT_LABELS: Record<string, string> = {
  fullName: "Name",
  jobTitle: "Job Title",
  company: "Company",
  department: "Department",
  email: "Email",
  phone: "Phone",
  website: "Website",
  address: "Address",
  disclaimer: "Disclaimer",
};

export function VisualEditorToolbar() {
  const {
    selectedElement,
    elementRect,
    updateElementStyle,
    getElementStyle,
    setSelectedElement,
    isInlineEditing,
    wrapperRef,
    refreshElementRect,
  } = useVisualEditor();
  
  const toolbarRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState("#000000");

  // ── Position calculation ────────────────────────────────────────────
  const computePosition = useCallback(() => {
    if (!elementRect || !toolbarRef.current) return;

    const toolbar = toolbarRef.current;
    const toolbarRect = toolbar.getBoundingClientRect();
    
    // Position above the element
    let top = elementRect.top - toolbarRect.height - 8;
    let left = elementRect.left + (elementRect.width / 2) - (toolbarRect.width / 2);
    
    // Keep within viewport
    const padding = 8;
    if (top < padding) {
      top = elementRect.bottom + 8; // Position below if not enough space above
    }
    if (left < padding) {
      left = padding;
    }
    if (left + toolbarRect.width > window.innerWidth - padding) {
      left = window.innerWidth - toolbarRect.width - padding;
    }
    
    setPosition({ top, left });
  }, [elementRect]);

  // Recompute whenever the stored rect changes
  useEffect(() => {
    computePosition();
  }, [computePosition]);

  // ── RAF polling: keeps toolbar in sync when zoom, data, or layout changes
  useEffect(() => {
    if (!selectedElement || !wrapperRef.current) return;

    let rafId: number;
    let prevTop = 0;
    let prevLeft = 0;
    let prevWidth = 0;
    let prevHeight = 0;

    const poll = () => {
      const el = wrapperRef.current?.querySelector(
        `[data-editable="${selectedElement}"]`
      );
      if (el) {
        const rect = el.getBoundingClientRect();
        // Only update state when the rect actually moved (avoids re-renders)
        if (
          rect.top !== prevTop ||
          rect.left !== prevLeft ||
          rect.width !== prevWidth ||
          rect.height !== prevHeight
        ) {
          prevTop = rect.top;
          prevLeft = rect.left;
          prevWidth = rect.width;
          prevHeight = rect.height;
          refreshElementRect();
        }
      }
      rafId = requestAnimationFrame(poll);
    };

    rafId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafId);
  }, [selectedElement, wrapperRef, refreshElementRect]);

  // ── Close color picker on outside click ─────────────────────────────
  useEffect(() => {
    if (!showColorPicker) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(e.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    // Use capture so we catch it before other stopPropagation calls
    document.addEventListener("mousedown", handleOutsideClick, true);
    return () =>
      document.removeEventListener("mousedown", handleOutsideClick, true);
  }, [showColorPicker]);

  // ── ESC: close color picker first, then deselect ────────────────────
  useEffect(() => {
    if (!selectedElement) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showColorPicker) {
        e.stopPropagation(); // prevent wrapper ESC handler from also firing
        setShowColorPicker(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [selectedElement, showColorPicker]);

  // Close color picker when element selection changes
  useEffect(() => {
    setShowColorPicker(false);
  }, [selectedElement]);

  if (!selectedElement || !elementRect) return null;

  const currentStyle = getElementStyle(selectedElement) || {};
  
  const isBold = currentStyle.fontWeight === "bold" || currentStyle.fontWeight === "700";
  const isItalic = currentStyle.fontStyle === "italic";
  const isUnderline = currentStyle.textDecoration === "underline";
  
  const toggleBold = () => {
    updateElementStyle(selectedElement, {
      fontWeight: isBold ? "normal" : "bold",
    });
  };

  const toggleItalic = () => {
    updateElementStyle(selectedElement, {
      fontStyle: isItalic ? "normal" : "italic",
    });
  };

  const toggleUnderline = () => {
    updateElementStyle(selectedElement, {
      textDecoration: isUnderline ? "none" : "underline",
    });
  };

  const setAlignment = (align: "left" | "center" | "right") => {
    updateElementStyle(selectedElement, { textAlign: align });
  };

  const adjustFontSize = (delta: number) => {
    const currentSize = currentStyle.fontSize || 0;
    updateElementStyle(selectedElement, {
      fontSize: Math.max(-6, Math.min(12, currentSize + delta)),
    });
  };

  const adjustSpacing = (delta: number) => {
    const currentTop = currentStyle.marginTop || 0;
    const currentBottom = currentStyle.marginBottom || 0;
    updateElementStyle(selectedElement, {
      marginTop: Math.max(0, currentTop + delta),
      marginBottom: Math.max(0, currentBottom + delta),
    });
  };

  const setColor = (color: string) => {
    updateElementStyle(selectedElement, { color });
    setShowColorPicker(false);
  };

  const quickColors = [
    "#000000", "#374151", "#6B7280", "#9CA3AF",
    "#2563eb", "#7c3aed", "#059669", "#ea580c", 
    "#e11d48", "#d97706",
  ];

  return (
    <div
      ref={toolbarRef}
      className={clsx(
        "fixed z-[200] flex flex-col gap-2 p-2 bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl",
        "animate-in fade-in-0 zoom-in-95 duration-150"
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with element name and close button */}
      <div className="flex items-center justify-between gap-4 px-1 pb-1 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground">
          Editing: <span className="text-foreground">{ELEMENT_LABELS[selectedElement] || selectedElement}</span>
        </span>
        <button
          onClick={() => setSelectedElement(null)}
          className="p-0.5 rounded hover:bg-secondary transition-colors"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Main toolbar row */}
      <div className="flex items-center gap-1">
        {/* Text formatting */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-border">
          <ToolbarButton
            active={isBold}
            onClick={toggleBold}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={isItalic}
            onClick={toggleItalic}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={isUnderline}
            onClick={toggleUnderline}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 px-2 border-r border-border">
          <ToolbarButton
            active={currentStyle.textAlign === "left"}
            onClick={() => setAlignment("left")}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={currentStyle.textAlign === "center"}
            onClick={() => setAlignment("center")}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            active={currentStyle.textAlign === "right"}
            onClick={() => setAlignment("right")}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Font size */}
        <div className="flex items-center gap-0.5 px-2 border-r border-border">
          <ToolbarButton
            onClick={() => adjustFontSize(-1)}
            title="Decrease Font Size"
          >
            <Minus className="w-3 h-3" />
          </ToolbarButton>
          <span className="text-xs text-muted-foreground w-6 text-center flex items-center justify-center gap-0.5">
            <Type className="w-3 h-3" />
            {currentStyle.fontSize !== undefined ? (currentStyle.fontSize > 0 ? `+${currentStyle.fontSize}` : currentStyle.fontSize) : "0"}
          </span>
          <ToolbarButton
            onClick={() => adjustFontSize(1)}
            title="Increase Font Size"
          >
            <Plus className="w-3 h-3" />
          </ToolbarButton>
        </div>

        {/* Spacing */}
        <div className="flex items-center gap-0.5 px-2 border-r border-border">
          <ToolbarButton
            onClick={() => adjustSpacing(-2)}
            title="Decrease Spacing"
          >
            <MoveVertical className="w-3.5 h-3.5" />
            <Minus className="w-2.5 h-2.5 absolute bottom-0 right-0" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => adjustSpacing(2)}
            title="Increase Spacing"
          >
            <MoveVertical className="w-3.5 h-3.5" />
            <Plus className="w-2.5 h-2.5 absolute bottom-0 right-0" />
          </ToolbarButton>
        </div>

        {/* Color picker */}
        <div className="relative pl-2" ref={colorPickerRef}>
          <ToolbarButton
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
            <div 
              className="w-3 h-1 rounded-full absolute bottom-1" 
              style={{ backgroundColor: currentStyle.color || "currentColor" }}
            />
          </ToolbarButton>
          
          {showColorPicker && (
            <div 
              className="absolute top-full right-0 mt-2 p-3 bg-background border border-border rounded-lg shadow-xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-5 gap-1.5 mb-3">
                {quickColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setColor(color)}
                    className={clsx(
                      "w-6 h-6 rounded-md border-2 transition-all hover:scale-110",
                      currentStyle.color === color
                        ? "border-foreground"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <button
                  onClick={() => setColor(customColor)}
                  className="flex-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hint text */}
      {!isInlineEditing && (
        <div className="text-[10px] text-muted-foreground text-center pt-1 border-t border-border">
          Double-click element to edit text
        </div>
      )}
    </div>
  );
}

interface ToolbarButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  title: string;
}

function ToolbarButton({ children, active, onClick, title }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        "relative p-1.5 rounded-md transition-all",
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
