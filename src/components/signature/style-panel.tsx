"use client";

import { useState, useMemo } from "react";
import { SignatureData, FONT_OPTIONS, FONT_CATEGORIES, COLOR_THEMES, ColorTheme } from "@/types/signature";
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
  Paintbrush
} from "lucide-react";
import { EmailThemeId } from "@/lib/email-themes";
import { getThemePlaceholders } from "@/lib/theme-placeholders";

interface StylePanelProps {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
  emailTheme?: EmailThemeId;
}

export function StylePanel({ data, onChange, emailTheme = "professional" }: StylePanelProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("sans-serif");
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [activeTab, setActiveTab] = useState<"themes" | "fonts" | "custom">("themes");
  
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
      {/* Tab Navigation */}
      <div className="flex gap-0.5 p-1 bg-secondary/50 rounded-xl border border-border">
        <button
          onClick={() => setActiveTab("themes")}
          className={clsx(
            "flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all min-w-0",
            activeTab === "themes"
              ? "bg-background text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
          <span className="truncate">Themes</span>
        </button>
        <button
          onClick={() => setActiveTab("fonts")}
          className={clsx(
            "flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all min-w-0",
            activeTab === "fonts"
              ? "bg-background text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          <Type className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
          <span className="truncate">Fonts</span>
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={clsx(
            "flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all min-w-0",
            activeTab === "custom"
              ? "bg-background text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
          <span className="truncate">Custom</span>
        </button>
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
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-primary" />
              Custom Styling
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Fine-tune your signature appearance
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color Picker */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Primary Color
              </label>
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <input
                    type="color"
                    value={data.primaryColor}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                    className="sr-only"
                    id="color-picker"
                  />
                  <label
                    htmlFor="color-picker"
                    className="block w-12 h-12 rounded-xl cursor-pointer border-2 border-border shadow-sm hover:shadow-md transition-shadow"
                    style={{ backgroundColor: data.primaryColor }}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={data.primaryColor}
                    onChange={(e) => updateField("primaryColor", e.target.value)}
                    placeholder="#6366f1"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              
            {/* Quick Color Presets */}
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {["#2563eb", "#7c3aed", "#059669", "#ea580c", "#e11d48", "#18181b"].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => updateField("primaryColor", color)}
                      className={clsx(
                        "w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 transition-all hover:scale-110",
                        data.primaryColor === color
                          ? "border-foreground shadow-md"
                          : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Font Size
                </span>
                <span className="text-muted-foreground font-mono text-xs">
                  {data.fontSize}px
                </span>
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="10"
                  max="18"
                  value={data.fontSize}
                  onChange={(e) => updateField("fontSize", parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
              </div>
              
              {/* Font Size Preview */}
              <div 
                className="p-3 rounded-lg bg-secondary/30 border border-border"
                style={{ 
                  fontFamily: data.fontFamily,
                  fontSize: `${data.fontSize}px`
                }}
              >
                <span style={{ color: data.primaryColor, fontWeight: 600 }}>
                  {PREVIEW_NAME}
                </span>
                <span className="text-muted-foreground"> · </span>
                <span className="text-foreground/80">Product Designer</span>
              </div>
            </div>
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
