"use client";

import { useRef, useEffect, useCallback, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useVisualEditor } from "./visual-editor-context";
import { EditableElement, SignatureData } from "@/types/signature";
import { clsx } from "clsx";

interface VisualEditorWrapperProps {
  children: ReactNode;
}

// Map of data-editable attribute values to SignatureData keys
const EDITABLE_FIELD_MAP: Record<string, keyof SignatureData> = {
  fullName: "fullName",
  jobTitle: "jobTitle",
  company: "company",
  department: "department",
  email: "email",
  phone: "phone",
  website: "website",
  address: "address",
  disclaimer: "disclaimer",
};

export function VisualEditorWrapper({ children }: VisualEditorWrapperProps) {
  const {
    isEditMode,
    selectedElement,
    setSelectedElement,
    setElementRect,
    isInlineEditing,
    setIsInlineEditing,
    signatureData,
    setSignatureData,
    wrapperRef,
  } = useVisualEditor();
  
  const [editingValue, setEditingValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  // Timer ref to distinguish single-click from double-click
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Pending click target so dblclick can cancel the queued single-click
  const pendingClickElRef = useRef<HTMLElement | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────
  const selectElement = useCallback(
    (elementId: EditableElement, el: HTMLElement) => {
      setSelectedElement(elementId);
      setIsInlineEditing(false);
      setElementRect(el.getBoundingClientRect());
    },
    [setSelectedElement, setIsInlineEditing, setElementRect]
  );

  const startInlineEdit = useCallback(
    (elementId: EditableElement, el: HTMLElement) => {
      if (!signatureData) return;
      setSelectedElement(elementId);
      setIsInlineEditing(true);

      const fieldKey = EDITABLE_FIELD_MAP[elementId];
      if (fieldKey) {
        const currentValue = signatureData[fieldKey];
        setEditingValue(typeof currentValue === "string" ? currentValue : "");
      }

      setElementRect(el.getBoundingClientRect());
      // Focus after React commits the overlay
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [signatureData, setSelectedElement, setIsInlineEditing, setElementRect]
  );

  // ── Click handler (delayed to avoid conflict with dblclick) ─────────
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!isEditMode) return;

      // Block ALL navigation inside the wrapper when editing
      const anchor = (e.target as HTMLElement).closest("a");
      if (anchor) {
        e.preventDefault();
      }

      const editableEl = (e.target as HTMLElement).closest(
        "[data-editable]"
      ) as HTMLElement | null;

      if (editableEl) {
        e.preventDefault();
        e.stopPropagation();

        const elementId = editableEl.getAttribute(
          "data-editable"
        ) as EditableElement;
        if (!elementId) return;

        // Queue a single-click selection after a short delay so that an
        // incoming dblclick can cancel it and jump straight to inline edit.
        pendingClickElRef.current = editableEl;
        if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
        clickTimerRef.current = setTimeout(() => {
          clickTimerRef.current = null;
          selectElement(elementId, editableEl);
        }, 200);
      } else {
        // Clicked outside any editable element → deselect
        setSelectedElement(null);
        setIsInlineEditing(false);
      }
    },
    [isEditMode, selectElement, setSelectedElement, setIsInlineEditing]
  );

  // ── Double-click handler (cancels pending single-click) ─────────────
  const handleDoubleClick = useCallback(
    (e: MouseEvent) => {
      if (!isEditMode) return;

      // Cancel the queued single-click
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }

      const editableEl = (e.target as HTMLElement).closest(
        "[data-editable]"
      ) as HTMLElement | null;

      if (editableEl) {
        e.preventDefault();
        e.stopPropagation();

        const elementId = editableEl.getAttribute(
          "data-editable"
        ) as EditableElement;
        if (elementId) {
          startInlineEdit(elementId, editableEl);
        }
      }
    },
    [isEditMode, startInlineEdit]
  );

  // ── Attach / detach listeners ───────────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    wrapper.addEventListener("click", handleClick);
    wrapper.addEventListener("dblclick", handleDoubleClick);

    return () => {
      wrapper.removeEventListener("click", handleClick);
      wrapper.removeEventListener("dblclick", handleDoubleClick);
      // Clean up any pending timer
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    };
  }, [handleClick, handleDoubleClick, wrapperRef]);

  // ── Keep rect fresh on scroll / resize ──────────────────────────────
  useEffect(() => {
    if (!selectedElement || !wrapperRef.current) return;

    const updateRect = () => {
      const el = wrapperRef.current?.querySelector(
        `[data-editable="${selectedElement}"]`
      );
      if (el) {
        setElementRect(el.getBoundingClientRect());
      }
    };

    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);

    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [selectedElement, setElementRect, wrapperRef]);

  // ── ResizeObserver: follow the selected element if it resizes ───────
  useEffect(() => {
    if (!selectedElement || !wrapperRef.current) return;

    const el = wrapperRef.current.querySelector(
      `[data-editable="${selectedElement}"]`
    );
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setElementRect(el.getBoundingClientRect());
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [selectedElement, setElementRect, wrapperRef]);

  // ── Keyboard: ESC to deselect ───────────────────────────────────────
  useEffect(() => {
    if (!isEditMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // If inline editing, just exit inline mode (keep element selected)
        if (isInlineEditing) {
          setIsInlineEditing(false);
          return;
        }
        // Otherwise deselect entirely
        if (selectedElement) {
          setSelectedElement(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditMode, isInlineEditing, selectedElement, setSelectedElement, setIsInlineEditing]);

  // ── Inline editing submit ───────────────────────────────────────────
  const handleEditSubmit = useCallback(() => {
    if (!selectedElement || !signatureData || !setSignatureData) return;

    const fieldKey = EDITABLE_FIELD_MAP[selectedElement];
    if (fieldKey) {
      // Strip HTML tags to prevent stored XSS via inline editor
      const sanitizedValue = editingValue
        .replace(/</g, "\u003c")
        .replace(/>/g, "\u003e")
        .trim();
      setSignatureData({
        ...signatureData,
        [fieldKey]: sanitizedValue,
      });
    }
    setIsInlineEditing(false);
  }, [selectedElement, signatureData, setSignatureData, editingValue, setIsInlineEditing]);

  // Keyboard events for the inline input
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    } else if (e.key === "Escape") {
      setIsInlineEditing(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div
      ref={wrapperRef}
      className={clsx(
        "visual-editor-wrapper relative",
        isEditMode && "visual-editor-active"
      )}
      // CSS-only selection indicator via data attribute (no DOM manipulation)
      {...(selectedElement
        ? { "data-selected-element": selectedElement }
        : {})}
    >
      {children}

      {/* Inline editor overlay — portalled to <body> so that CSS transforms
          on ancestor containers don't break fixed positioning. */}
      {isInlineEditing && selectedElement && typeof document !== "undefined" &&
        createPortal(
          <InlineEditorOverlay
            inputRef={inputRef}
            value={editingValue}
            onChange={setEditingValue}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsInlineEditing(false)}
            onKeyDown={handleInputKeyDown}
            elementLabel={ELEMENT_LABELS[selectedElement] || selectedElement}
          />,
          document.body
        )}
    </div>
  );
}

// ── Inline editor overlay (portalled to <body>) ───────────────────────

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

interface InlineEditorOverlayProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  elementLabel: string;
}

function InlineEditorOverlay({
  inputRef,
  value,
  onChange,
  onSubmit,
  onCancel,
  onKeyDown,
  elementLabel,
}: InlineEditorOverlayProps) {
  const { elementRect } = useVisualEditor();
  // Track whether the user is clicking Cancel so we don't save on blur
  const cancelIntentRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  // Compute position on every elementRect change, clamped to viewport
  useEffect(() => {
    if (!elementRect) return;

    const padding = 8;
    const isMobileViewport = window.innerWidth < 768;

    if (isMobileViewport) {
      // On mobile: full-width fixed to bottom of viewport
      setPos({
        top: -1, // sentinel: means "use bottom positioning"
        left: padding,
        width: window.innerWidth - padding * 2,
      });
    } else {
      // Desktop/tablet: position directly over the element
      const overlayWidth = Math.max(elementRect.width + 8, 240);
      let left = elementRect.left - 4;
      let top = elementRect.top - 4;

      // Clamp horizontal
      if (left + overlayWidth > window.innerWidth - padding) {
        left = window.innerWidth - overlayWidth - padding;
      }
      if (left < padding) {
        left = padding;
      }

      // Clamp vertical — if the overlay would go off-screen top, push below the element
      if (top < padding) {
        top = elementRect.bottom + 4;
      }

      setPos({ top, left, width: overlayWidth });
    }
  }, [elementRect]);

  if (!elementRect || !pos) return null;

  const handleBlur = () => {
    if (cancelIntentRef.current) {
      cancelIntentRef.current = false;
      onCancel();
      return;
    }
    onSubmit();
  };

  const isMobileLayout = pos.top === -1;

  return (
    <div
      ref={overlayRef}
      className={clsx(
        "fixed z-[250] animate-in fade-in-0 duration-100",
        isMobileLayout
          ? "bottom-0 left-0 right-0 p-3 pb-[env(safe-area-inset-bottom,8px)] bg-background/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
          : "zoom-in-95"
      )}
      style={
        isMobileLayout
          ? undefined
          : {
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }
      }
      // Clicks inside the overlay must not propagate to anything beneath
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Label */}
      <div className={clsx(
        "text-xs font-medium text-muted-foreground mb-1.5",
        isMobileLayout && "text-sm"
      )}>
        Editing <span className="text-foreground">{elementLabel}</span>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={handleBlur}
        className={clsx(
          "w-full bg-background border-2 border-primary rounded-md shadow-lg",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          isMobileLayout
            ? "px-3 py-2.5 text-base" // 16px avoids iOS zoom
            : "px-2 py-1 text-sm"
        )}
        style={
          isMobileLayout
            ? undefined
            : { minHeight: Math.max(elementRect.height + 8, 32) }
        }
      />

      <div className={clsx(
        "flex gap-2 mt-2 justify-end",
        isMobileLayout && "gap-3"
      )}>
        <button
          onMouseDown={() => {
            cancelIntentRef.current = true;
          }}
          onClick={onCancel}
          className={clsx(
            "bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors",
            isMobileLayout
              ? "px-4 py-2 text-sm font-medium"
              : "px-2 py-0.5 text-xs"
          )}
        >
          Cancel
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={onSubmit}
          className={clsx(
            "bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors",
            isMobileLayout
              ? "px-4 py-2 text-sm font-medium"
              : "px-2 py-0.5 text-xs"
          )}
        >
          Save
        </button>
      </div>
    </div>
  );
}
