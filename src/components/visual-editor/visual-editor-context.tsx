"use client";

import { createContext, useContext, useState, useCallback, useRef, RefObject, ReactNode } from "react";
import { EditableElement, ElementStyleOverride, SignatureData } from "@/types/signature";

interface VisualEditorContextType {
  // Edit mode state
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  
  // Selected element
  selectedElement: EditableElement | null;
  setSelectedElement: (element: EditableElement | null) => void;
  
  // Element position for toolbar
  elementRect: DOMRect | null;
  setElementRect: (rect: DOMRect | null) => void;
  
  // Inline editing state
  isInlineEditing: boolean;
  setIsInlineEditing: (value: boolean) => void;
  
  // Style update helper
  updateElementStyle: (
    element: EditableElement,
    style: Partial<ElementStyleOverride>
  ) => void;
  
  // Get current style for element
  getElementStyle: (element: EditableElement) => ElementStyleOverride | undefined;
  
  // Data reference (set by parent)
  signatureData: SignatureData | null;
  setSignatureData: ((data: SignatureData) => void) | null;

  // Wrapper ref so toolbar can query elements inside it
  wrapperRef: RefObject<HTMLDivElement | null>;

  // Re-read the selected element's rect from the DOM
  refreshElementRect: () => void;
}

const VisualEditorContext = createContext<VisualEditorContextType | null>(null);

export function useVisualEditor() {
  const context = useContext(VisualEditorContext);
  if (!context) {
    throw new Error("useVisualEditor must be used within a VisualEditorProvider");
  }
  return context;
}

// Safe hook that doesn't throw when used outside provider
export function useVisualEditorSafe() {
  return useContext(VisualEditorContext);
}

interface VisualEditorProviderProps {
  children: ReactNode;
  signatureData: SignatureData;
  onSignatureDataChange: (data: SignatureData) => void;
}

export function VisualEditorProvider({
  children,
  signatureData,
  onSignatureDataChange,
}: VisualEditorProviderProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<EditableElement | null>(null);
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const updateElementStyle = useCallback(
    (element: EditableElement, style: Partial<ElementStyleOverride>) => {
      const currentOverrides = signatureData.styleOverrides || {};
      const currentStyle = currentOverrides[element] || {};
      
      onSignatureDataChange({
        ...signatureData,
        styleOverrides: {
          ...currentOverrides,
          [element]: {
            ...currentStyle,
            ...style,
          },
        },
      });
    },
    [signatureData, onSignatureDataChange]
  );

  const getElementStyle = useCallback(
    (element: EditableElement): ElementStyleOverride | undefined => {
      return signatureData.styleOverrides?.[element];
    },
    [signatureData.styleOverrides]
  );

  // Re-read the selected element's bounding rect from the DOM
  const refreshElementRect = useCallback(() => {
    if (!selectedElement || !wrapperRef.current) return;
    const el = wrapperRef.current.querySelector(
      `[data-editable="${selectedElement}"]`
    );
    if (el) {
      setElementRect(el.getBoundingClientRect());
    }
  }, [selectedElement]);

  // Clear selection when exiting edit mode
  const handleSetEditMode = useCallback((value: boolean) => {
    setIsEditMode(value);
    if (!value) {
      setSelectedElement(null);
      setElementRect(null);
      setIsInlineEditing(false);
    }
  }, []);

  return (
    <VisualEditorContext.Provider
      value={{
        isEditMode,
        setIsEditMode: handleSetEditMode,
        selectedElement,
        setSelectedElement,
        elementRect,
        setElementRect,
        isInlineEditing,
        setIsInlineEditing,
        updateElementStyle,
        getElementStyle,
        signatureData,
        setSignatureData: onSignatureDataChange,
        wrapperRef,
        refreshElementRect,
      }}
    >
      {children}
    </VisualEditorContext.Provider>
  );
}
