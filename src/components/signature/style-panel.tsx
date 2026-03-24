"use client";

import { useState, useMemo, useCallback } from "react";
import { SignatureData, FONT_OPTIONS, FONT_CATEGORIES, COLOR_THEMES, ColorTheme, EditableElement, ElementStyleOverride } from "@/types/signature";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { 
  Palette, 
  Type, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Sliders,
  CircleDot,
  SquareIcon,
  RectangleHorizontal,
  Minus,
  Plus,
  Image,
  Share2,
  Layers,
  Bold,
  Italic,
  Underline,
  MousePointerClick,
} from "lucide-react";
import { EmailThemeId } from "@/lib/email-themes";
import { getThemePlaceholders } from "@/lib/theme-placeholders";

interface StylePanelProps {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
  emailTheme?: EmailThemeId;
  onActivateVisualEditor?: (element: EditableElement) => void;
}

// Collapsible section helper
function CollapsibleSection({ title, icon, defaultOpen = false, children }: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {title}
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {isOpen && <CardContent className="pt-0 pb-4">{children}</CardContent>}
    </Card>
  );
}

const ELEMENT_LABELS: Record<EditableElement, string> = {
  fullName: "Full Name",
  jobTitle: "Job Title",
  company: "Company",
  department: "Department",
  email: "Email",
  phone: "Phone",
  website: "Website",
  address: "Address",
  disclaimer: "Disclaimer",
};

const ALL_EDITABLE_ELEMENTS: EditableElement[] = [
  "fullName", "jobTitle", "company", "department",
  "email", "phone", "website", "address", "disclaimer",
];

export function StylePanel({ data, onChange, emailTheme = "professional", onActivateVisualEditor }: StylePanelProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("sans-serif");
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [activeTab, setActiveTab] = useState<"themes" | "fonts" | "custom" | "elements">("themes");
  const [expandedElement, setExpandedElement] = useState<EditableElement | null>(null);
  
  // Get theme-specific placeholders
  const placeholders = useMemo(() => getThemePlaceholders(emailTheme), [emailTheme]);
  const PREVIEW_NAME = placeholders.previewName;
  const PREVIEW_TEXT = placeholders.previewText;

  const updateField = <K extends keyof SignatureData>(
    field: K,
    value: SignatureData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const applyTheme = (theme: ColorTheme) => {
    onChange({
      ...data,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
    });
  };

  const selectedTheme = COLOR_THEMES.find(
    (t) => t.primaryColor === data.primaryColor
  );

  const displayedThemes = showAllThemes ? COLOR_THEMES : COLOR_THEMES.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Tab Navigation — icon-only with active label */}
      <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-xl border border-border">
        <div className="flex gap-0.5">
          {([
            { id: "themes" as const, icon: Sparkles, label: "Themes" },
            { id: "fonts" as const, icon: Type, label: "Fonts" },
            { id: "custom" as const, icon: Sliders, label: "Custom" },
            { id: "elements" as const, icon: Layers, label: "Elements" },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              className={clsx(
                "flex items-center justify-center p-2 rounded-lg transition-all",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
        <span className="text-xs font-medium text-foreground truncate">
          {{ themes: "Themes", fonts: "Fonts", custom: "Custom", elements: "Elements" }[activeTab]}
        </span>
      </div>

      {/* Themes Tab */}
      {activeTab === "themes" && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Color Themes
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Choose a pre-designed color scheme
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {displayedThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => applyTheme(theme)}
                  className={clsx(
                    "relative flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:shadow-md group",
                    selectedTheme?.id === theme.id
                      ? "border-rainbow-animated shadow-md"
                      : "border-2 border-border hover:border-primary/50"
                  )}
                >
                  {/* Color Swatch Preview */}
                  <div className="flex-shrink-0 flex rounded-lg overflow-hidden shadow-sm">
                    {theme.previewColors.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  {/* Theme Info */}
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm block">{theme.name}</span>
                    <p className="text-xs text-muted-foreground truncate">
                      {theme.description}
                    </p>
                  </div>

                  {/* Live Preview Text */}
                  <div 
                    className="hidden sm:block text-xs font-medium px-2 py-1 rounded"
                    style={{ 
                      color: theme.primaryColor,
                      backgroundColor: `${theme.primaryColor}15`
                    }}
                  >
                    Aa
                  </div>
                </button>
              ))}
            </div>

            {COLOR_THEMES.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllThemes(!showAllThemes)}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                {showAllThemes ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Show {COLOR_THEMES.length - 5} More Themes
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Fonts Tab */}
      {activeTab === "fonts" && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" />
              Font Selection
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Click to preview and select a font
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {FONT_CATEGORIES.map((category) => {
              const categoryFonts = FONT_OPTIONS.filter(
                (f) => f.category === category.id
              );
              const isExpanded = expandedCategory === category.id;

              return (
                <div key={category.id} className="space-y-2">
                  <button
                    onClick={() =>
                      setExpandedCategory(isExpanded ? null : category.id)
                    }
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <span className="text-sm font-medium">{category.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {categoryFonts.length} fonts
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      {categoryFonts.map((font) => {
                        const isSelected = data.fontFamily === font.value;
                        return (
                          <button
                            key={font.value}
                            onClick={() => updateField("fontFamily", font.value)}
                            className={clsx(
                              "relative flex items-center justify-between p-3 rounded-lg text-left transition-all",
                              isSelected
                                ? "border-rainbow-animated shadow-sm"
                                : "border-2 border-transparent bg-secondary/30 hover:border-border hover:bg-secondary/50"
                            )}
                          >
                            <div className="space-y-1 flex-1 min-w-0">
                              <span className="text-xs text-muted-foreground font-medium">
                                {font.label}
                              </span>
                              {/* Font Preview */}
                              <div
                                className="text-lg truncate"
                                style={{ 
                                  fontFamily: font.value,
                                  color: data.primaryColor
                                }}
                              >
                                {PREVIEW_NAME}
                              </div>
                              <div
                                className="text-sm text-muted-foreground truncate"
                                style={{ fontFamily: font.value }}
                              >
                                {PREVIEW_TEXT}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Custom Tab */}
      {activeTab === "custom" && (
        <div className="space-y-3">
          {/* Colors Section */}
          <CollapsibleSection title="Colors" icon={<Palette className="w-4 h-4" />} defaultOpen>
            <div className="space-y-4">
              {/* Primary Color */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Primary Color</label>
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <input
                      type="color"
                      value={data.primaryColor}
                      onChange={(e) => updateField("primaryColor", e.target.value)}
                      className="sr-only"
                      id="color-picker-primary"
                    />
                    <label
                      htmlFor="color-picker-primary"
                      className="block w-9 h-9 rounded-lg cursor-pointer border-2 border-border shadow-sm hover:shadow-md transition-shadow"
                      style={{ backgroundColor: data.primaryColor }}
                    />
                  </div>
                  <Input
                    value={data.primaryColor}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                    placeholder="#6366f1"
                    className="font-mono text-xs h-9 flex-1"
                  />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {["#2563eb", "#7c3aed", "#059669", "#ea580c", "#e11d48", "#18181b", "#d97706", "#0891b2"].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() => updateField("primaryColor", color)}
                        className={clsx(
                          "w-6 h-6 rounded-md border-2 transition-all hover:scale-110",
                          data.primaryColor === color ? "border-foreground shadow-md" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </div>
              {/* Secondary Color */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Secondary Color</label>
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <input
                      type="color"
                      value={data.secondaryColor || data.primaryColor}
                      onChange={(e) => updateField("secondaryColor", e.target.value)}
                      className="sr-only"
                      id="color-picker-secondary"
                    />
                    <label
                      htmlFor="color-picker-secondary"
                      className="block w-9 h-9 rounded-lg cursor-pointer border-2 border-border shadow-sm hover:shadow-md transition-shadow"
                      style={{ backgroundColor: data.secondaryColor || data.primaryColor }}
                    />
                  </div>
                  <Input
                    value={data.secondaryColor || ""}
                    onChange={(e) => updateField("secondaryColor", e.target.value)}
                    placeholder="Auto from primary"
                    className="font-mono text-xs h-9 flex-1"
                  />
                </div>
              </div>
              {/* Text Color Override */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Text Color</label>
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <input
                      type="color"
                      value={data.textColor || "#333333"}
                      onChange={(e) => updateField("textColor", e.target.value)}
                      className="sr-only"
                      id="color-picker-text"
                    />
                    <label
                      htmlFor="color-picker-text"
                      className="block w-9 h-9 rounded-lg cursor-pointer border-2 border-border shadow-sm hover:shadow-md transition-shadow"
                      style={{ backgroundColor: data.textColor || "#333333" }}
                    />
                  </div>
                  <Input
                    value={data.textColor || ""}
                    onChange={(e) => updateField("textColor", e.target.value)}
                    placeholder="Default"
                    className="font-mono text-xs h-9 flex-1"
                  />
                  {data.textColor && (
                    <button
                      onClick={() => updateField("textColor", undefined)}
                      className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-secondary/50"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Typography Section */}
          <CollapsibleSection title="Typography" icon={<Type className="w-4 h-4" />} defaultOpen>
            <div className="space-y-4">
              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">Font Size</label>
                  <span className="text-xs font-mono text-muted-foreground">{data.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="18"
                  value={data.fontSize}
                  onChange={(e) => updateField("fontSize", parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              {/* Line Height */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">Line Height</label>
                  <span className="text-xs font-mono text-muted-foreground">{(data.lineHeight ?? 1.4).toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.1"
                  value={data.lineHeight ?? 1.4}
                  onChange={(e) => updateField("lineHeight", parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Tight</span>
                  <span>Normal</span>
                  <span>Loose</span>
                </div>
              </div>
              {/* Preview */}
              <div
                className="p-3 rounded-lg bg-secondary/30 border border-border"
                style={{
                  fontFamily: data.fontFamily,
                  fontSize: `${data.fontSize}px`,
                  lineHeight: data.lineHeight ?? 1.4,
                }}
              >
                <span style={{ color: data.primaryColor, fontWeight: 600 }}>{PREVIEW_NAME}</span>
                <span className="text-muted-foreground"> · </span>
                <span className="text-foreground/80">Product Designer</span>
              </div>
            </div>
          </CollapsibleSection>

          {/* Layout Section */}
          <CollapsibleSection title="Layout" icon={<Sliders className="w-4 h-4" />}>
            <div className="space-y-4">
              {/* Content Padding */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Content Density</label>
                <div className="flex gap-1">
                  {(["compact", "normal", "relaxed"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateField("contentPadding", p)}
                      className={clsx(
                        "flex-1 px-2 py-1.5 rounded-md text-xs font-medium capitalize transition-all",
                        data.contentPadding === p
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              {/* Divider Style */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Divider Style</label>
                <div className="flex gap-1 flex-wrap">
                  {(["solid", "dashed", "dotted", "double", "none"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateField("dividerStyle", s)}
                      className={clsx(
                        "px-2 py-1.5 rounded-md text-xs font-medium capitalize transition-all",
                        data.dividerStyle === s
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Divider Width */}
              {data.dividerStyle !== "none" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground">Divider Thickness</label>
                    <span className="text-xs font-mono text-muted-foreground">{data.dividerWidth ?? 2}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={data.dividerWidth ?? 2}
                    onChange={(e) => updateField("dividerWidth", parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              )}
              {/* Divider Color */}
              {data.dividerStyle !== "none" && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Divider Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={data.dividerColor || data.primaryColor}
                      onChange={(e) => updateField("dividerColor", e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border-2 border-border"
                    />
                    <button
                      onClick={() => updateField("dividerColor", undefined)}
                      className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-secondary/50"
                    >
                      Use Primary
                    </button>
                  </div>
                  {/* Divider Preview */}
                  <div
                    className="w-full mt-1"
                    style={{
                      borderTop: `${data.dividerWidth ?? 2}px ${data.dividerStyle ?? "solid"} ${data.dividerColor || data.primaryColor}`,
                    }}
                  />
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Photo & Logo Section */}
          <CollapsibleSection title="Photo & Logo" icon={<Image className="w-4 h-4" />}>
            <div className="space-y-4">
              {/* Photo Shape */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Photo Shape</label>
                <div className="flex gap-1">
                  {(["circle", "rounded", "square"] as const).map((shape) => (
                    <button
                      key={shape}
                      onClick={() => updateField("photoShape", shape)}
                      className={clsx(
                        "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium capitalize transition-all",
                        data.photoShape === shape
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {shape === "circle" && <CircleDot className="w-3 h-3" />}
                      {shape === "rounded" && <RectangleHorizontal className="w-3 h-3" />}
                      {shape === "square" && <SquareIcon className="w-3 h-3" />}
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
              {/* Photo Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">Photo Size</label>
                  <span className="text-xs font-mono text-muted-foreground">{data.profilePhotoSize ?? 80}px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="4"
                  value={data.profilePhotoSize ?? 80}
                  onChange={(e) => updateField("profilePhotoSize", parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              {/* Logo Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">Logo Width</label>
                  <span className="text-xs font-mono text-muted-foreground">{data.logoWidth ?? 120}px</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="200"
                  step="4"
                  value={data.logoWidth ?? 120}
                  onChange={(e) => updateField("logoWidth", parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Social Icons Section */}
          <CollapsibleSection title="Social Icons" icon={<Share2 className="w-4 h-4" />}>
            <div className="space-y-4">
              {/* Icon Display Style */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Display Style</label>
                <div className="flex gap-1">
                  {(["icon", "text", "icon-text"] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => updateField("socialIconStyle", style)}
                      className={clsx(
                        "flex-1 px-2 py-1.5 rounded-md text-xs font-medium capitalize transition-all",
                        data.socialIconStyle === style
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {style === "icon-text" ? "Icon + Text" : style === "icon" ? "Icon Only" : "Text Only"}
                    </button>
                  ))}
                </div>
              </div>
              {/* Icon Shape */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Icon Shape</label>
                <div className="flex gap-1">
                  {(["none", "circle", "rounded", "square"] as const).map((shape) => (
                    <button
                      key={shape}
                      onClick={() => updateField("socialIconShape", shape)}
                      className={clsx(
                        "flex-1 px-2 py-1.5 rounded-md text-xs font-medium capitalize transition-all",
                        data.socialIconShape === shape
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {shape === "none" ? "Plain" : shape}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Elements Tab */}
      {activeTab === "elements" && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Element Styles
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Customize each signature element individually
            </p>
          </CardHeader>
          <CardContent className="space-y-1">
            {ALL_EDITABLE_ELEMENTS.map((element) => {
              // Show element if it has a value or an override
              const fieldValue = data[element as keyof SignatureData];
              const hasValue = typeof fieldValue === "string" && fieldValue.length > 0;
              const override = data.styleOverrides?.[element];
              const hasOverride = override && Object.keys(override).length > 0;
              if (!hasValue && !hasOverride) return null;

              const isExpanded = expandedElement === element;
              const isBold = override?.fontWeight === "bold" || override?.fontWeight === "700";
              const isItalic = override?.fontStyle === "italic";
              const isUnderline = override?.textDecoration === "underline";

              const updateOverride = (style: Partial<ElementStyleOverride>) => {
                const currentOverrides = data.styleOverrides || {};
                const currentStyle = currentOverrides[element] || {};
                onChange({
                  ...data,
                  styleOverrides: {
                    ...currentOverrides,
                    [element]: { ...currentStyle, ...style },
                  },
                });
              };

              return (
                <div key={element} className="border border-border rounded-lg overflow-hidden">
                  {/* Element row header */}
                  <button
                    onClick={() => setExpandedElement(isExpanded ? null : element)}
                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{ELEMENT_LABELS[element]}</span>
                      {hasOverride && (
                        <span className="flex items-center gap-1">
                          {override?.color && (
                            <span
                              className="w-3 h-3 rounded-full border border-border"
                              style={{ backgroundColor: override.color }}
                            />
                          )}
                          {isBold && <Bold className="w-3 h-3 text-muted-foreground" />}
                          {isItalic && <Italic className="w-3 h-3 text-muted-foreground" />}
                        </span>
                      )}
                    </div>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                  {/* Expanded controls */}
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-3 border-t border-border bg-secondary/10">
                      {/* Formatting toggles */}
                      <div className="flex items-center gap-1 pt-2">
                        <button
                          onClick={() => updateOverride({ fontWeight: isBold ? "normal" : "bold" })}
                          className={clsx(
                            "p-1.5 rounded-md transition-all",
                            isBold ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground"
                          )}
                          title="Bold"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateOverride({ fontStyle: isItalic ? "normal" : "italic" })}
                          className={clsx(
                            "p-1.5 rounded-md transition-all",
                            isItalic ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground"
                          )}
                          title="Italic"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateOverride({ textDecoration: isUnderline ? "none" : "underline" })}
                          className={clsx(
                            "p-1.5 rounded-md transition-all",
                            isUnderline ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground"
                          )}
                          title="Underline"
                        >
                          <Underline className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex-1" />
                        {/* Font size adjust */}
                        <button
                          onClick={() => updateOverride({ fontSize: Math.max(-6, (override?.fontSize || 0) - 1) })}
                          className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground"
                          title="Decrease size"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[10px] font-mono text-muted-foreground w-6 text-center">
                          {override?.fontSize ? (override.fontSize > 0 ? `+${override.fontSize}` : override.fontSize) : "0"}
                        </span>
                        <button
                          onClick={() => updateOverride({ fontSize: Math.min(12, (override?.fontSize || 0) + 1) })}
                          className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground"
                          title="Increase size"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      {/* Color */}
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-medium text-muted-foreground w-10">Color</label>
                        <input
                          type="color"
                          value={override?.color || data.primaryColor}
                          onChange={(e) => updateOverride({ color: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer border border-border"
                        />
                        {override?.color && (
                          <button
                            onClick={() => updateOverride({ color: undefined })}
                            className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded bg-secondary/50"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      {/* Edit in Preview button */}
                      {onActivateVisualEditor && (
                        <button
                          onClick={() => onActivateVisualEditor(element)}
                          className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                        >
                          <MousePointerClick className="w-3 h-3" />
                          Edit in Preview
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {ALL_EDITABLE_ELEMENTS.every((el) => {
              const v = data[el as keyof SignatureData];
              return !(typeof v === "string" && v.length > 0);
            }) && (
              <p className="text-xs text-muted-foreground text-center py-4">
                Fill in signature fields to see element controls here.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Current Style Summary */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Current Style
          </span>
          <div 
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: data.primaryColor }}
          />
        </div>
        <div 
          className="text-lg font-semibold"
          style={{ fontFamily: data.fontFamily, color: data.primaryColor }}
        >
          {PREVIEW_NAME}
        </div>
        <div 
          className="text-sm text-muted-foreground mt-0.5"
          style={{ fontFamily: data.fontFamily }}
        >
          {placeholders.previewSubtitle}
        </div>
      </div>
    </div>
  );
}
