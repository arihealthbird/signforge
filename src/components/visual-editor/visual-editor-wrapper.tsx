"use client";

import { useRef, useEffect, useCallback, useState, ReactNode } from "react";
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
  } = useVisualEditor();
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle clicking on an editable element
  const handleElementClick = useCallback((e: MouseEvent) => {
    if (!isEditMode) return;
    
    const target = e.target as HTMLElement;
    const editableEl = target.closest("[data-editable]") as HTMLElement;
    
    if (editableEl) {
      e.preventDefault();
      e.stopPropagation();
      
      const elementId = editableEl.getAttribute("data-editable") as EditableElement;
      if (elementId && elementId !== selectedElement) {
        setSelectedElement(elementId);
        setIsInlineEditing(false);
        
        // Get position for toolbar
        const rect = editableEl.getBoundingClientRect();
        setElementRect(rect);
      }
    } else {
      // Clicked outside editable elements - deselect
      setSelectedElement(null);
      setIsInlineEditing(false);
    }
  }, [isEditMode, selectedElement, setSelectedElement, setElementRect, setIsInlineEditing]);

  // Handle double click for inline editing
  const handleDoubleClick = useCallback((e: MouseEvent) => {
    if (!isEditMode) return;
    
    const target = e.target as HTMLElement;
    const editableEl = target.closest("[data-editable]") as HTMLElement;
    
    if (editableEl) {
      e.preventDefault();
      e.stopPropagation();
      
      const elementId = editableEl.getAttribute("data-editable") as EditableElement;
      if (elementId && signatureData) {
        setSelectedElement(elementId);
        setIsInlineEditing(true);
        
        // Get current value
        const fieldKey = EDITABLE_FIELD_MAP[elementId];
        if (fieldKey) {
          const currentValue = signatureData[fieldKey];
          setEditingValue(typeof currentValue === "string" ? currentValue : "");
        }
        
        // Update rect
        const rect = editableEl.getBoundingClientRect();
        setElementRect(rect);
        
        // Focus input after render
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  }, [isEditMode, signatureData, setSelectedElement, setIsInlineEditing, setElementRect]);

  // Add/remove event listeners
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    wrapper.addEventListener("click", handleElementClick);
    wrapper.addEventListener("dblclick", handleDoubleClick);

    return () => {
      wrapper.removeEventListener("click", handleElementClick);
      wrapper.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [handleElementClick, handleDoubleClick]);

  // Update element rect on scroll/resize
  useEffect(() => {
    if (!selectedElement || !wrapperRef.current) return;

    const updateRect = () => {
      const el = wrapperRef.current?.querySelector(`[data-editable="${selectedElement}"]`);
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
  }, [selectedElement, setElementRect]);

  // Handle inline editing submit
  const handleEditSubmit = useCallback(() => {
    if (!selectedElement || !signatureData || !setSignatureData) return;
    
    const fieldKey = EDITABLE_FIELD_MAP[selectedElement];
    if (fieldKey) {
      setSignatureData({
        ...signatureData,
        [fieldKey]: editingValue,
      });
    }
    setIsInlineEditing(false);
  }, [selectedElement, signatureData, setSignatureData, editingValue, setIsInlineEditing]);

  // Handle keyboard events for inline editing
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    } else if (e.key === "Escape") {
      setIsInlineEditing(false);
    }
  };

  // Add visual indicators to editable elements when in edit mode
  useEffect(() => {
    if (!wrapperRef.current) return;
    
    const editableElements = wrapperRef.current.querySelectorAll("[data-editable]");
    
    editableElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const elementId = htmlEl.getAttribute("data-editable");
      
      if (isEditMode) {
        htmlEl.style.cursor = "pointer";
        htmlEl.style.transition = "all 0.15s ease";
        htmlEl.classList.add("visual-editor-editable");
        
        if (elementId === selectedElement) {
          htmlEl.classList.add("visual-editor-selected");
        } else {
          htmlEl.classList.remove("visual-editor-selected");
        }
      } else {
        htmlEl.style.cursor = "";
        htmlEl.classList.remove("visual-editor-editable", "visual-editor-selected");
      }
    });
  }, [isEditMode, selectedElement, children]);

  return (
    <div 
      ref={wrapperRef}
      className={clsx(
        "visual-editor-wrapper relative",
        isEditMode && "visual-editor-active"
      )}
    >
      {children}
      
      {/* Inline editor overlay */}
      {isInlineEditing && selectedElement && (
        <InlineEditorOverlay
          inputRef={inputRef}
          value={editingValue}
          onChange={setEditingValue}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsInlineEditing(false)}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
}

interface InlineEditorOverlayProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

function InlineEditorOverlay({
  inputRef,
  value,
  onChange,
  onSubmit,
  onCancel,
  onKeyDown,
}: InlineEditorOverlayProps) {
  const { elementRect } = useVisualEditor();
  
  if (!elementRect) return null;

  return (
    <div
      className="fixed z-[150] animate-in fade-in-0 zoom-in-95 duration-100"
      style={{
        top: elementRect.top - 4,
        left: elementRect.left - 4,
        width: Math.max(elementRect.width + 8, 200),
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onSubmit}
        className="w-full px-2 py-1 text-sm bg-background border-2 border-primary rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        style={{
          minHeight: elementRect.height + 8,
        }}
      />
      <div className="flex gap-1 mt-1 justify-end">
        <button
          onClick={onCancel}
          className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}
