"use client";

import { useState, useCallback, useEffect } from "react";
import { SignatureData, DEFAULT_SIGNATURE_DATA } from "@/types/signature";
import { TemplateId } from "@/lib/templates";
import { SignatureForm } from "@/components/signature/signature-form";
import { SignaturePreview, generateSignatureHTML } from "@/components/signature/signature-preview";
import { TemplateSelector } from "@/components/signature/template-selector";
import { StylePanel } from "@/components/signature/style-panel";
import { AIGenerator } from "@/components/signature/ai-generator";
import { ExportPanel } from "@/components/signature/export-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { 
  Sparkles, Download, RotateCcw, SendHorizontal,
  Layout, Palette, FileText, Wand2, PanelLeft, PanelLeftClose,
  ZoomIn, ZoomOut, Maximize2, Minimize2, MousePointerClick,
  Menu, X, ChevronLeft, ChevronRight
} from "lucide-react";
import { 
  DevicePreviewSwitcher, 
  DeviceFrame, 
  DeviceQuickToggle,
  DeviceType, 
  DEVICE_CONFIGS 
} from "@/components/ui/device-preview-switcher";
import { PreviewThemeSwitch } from "@/components/ui/preview-theme-switch";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { SparkleButton } from "@/components/ui/sparkle-button";
import { EmailThemeSelector } from "@/components/ui/email-theme-selector";
import { EmailPreviewMock } from "@/components/signature/email-preview-mock";
import { EmailThemeId } from "@/lib/email-themes";
import { ThemeCanvasEffects } from "@/components/ui/theme-canvas-effects";
import { DonationBanner, MobileDonationButton } from "@/components/ui/donation-banner";
import { DonateModal } from "@/components/ui/donate-modal";
import { ExportDonationModal } from "@/components/ui/export-donation-modal";
import { CelebrationModal } from "@/components/ui/celebration-modal";
import { ResetConfirmationModal } from "@/components/ui/reset-confirmation-modal";
import { ShareModal } from "@/components/ui/share-modal";
import { SharedTemplateBanner } from "@/components/ui/shared-template-banner";
import { 
  VisualEditorProvider, 
  VisualEditorWrapper, 
  VisualEditorToolbar,
  useVisualEditorSafe 
} from "@/components/visual-editor";
import { useResponsive } from "@/hooks/use-responsive";
import { useSharedSignature } from "@/hooks/use-shared-signature";
import { MobileNav, MobileTab } from "@/components/ui/mobile-nav";
import { Footer } from "@/components/ui/footer";

type LeftTab = "templates" | "style";
type RightTab = "content" | "ai" | "export";

export default function Home() {
  const [signatureData, setSignatureData] = useState<SignatureData>(DEFAULT_SIGNATURE_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("professional-classic");
  const [leftTab, setLeftTab] = useState<LeftTab>("templates");
  const [rightTab, setRightTab] = useState<RightTab>("content");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [previewZoom, setPreviewZoom] = useState(90); // Default 90% for better mobile visibility
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [emailTheme, setEmailTheme] = useState<EmailThemeId>("professional");
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isExportDonationModalOpen, setIsExportDonationModalOpen] = useState(false);
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("preview");
  const [tabletDrawerOpen, setTabletDrawerOpen] = useState<"left" | "right" | null>(null);
  const [previewDevice, setPreviewDevice] = useState<DeviceType>("desktop");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Handle shared signature from URL
  const { 
    sharedData, 
    isSharedTemplate, 
    clearShared, 
    markAsUsed, 
    hasBeenCustomized 
  } = useSharedSignature();

  // Load shared signature data when detected
  useEffect(() => {
    if (sharedData) {
      setSignatureData(sharedData.s);
      setSelectedTemplate(sharedData.t);
      if (sharedData.e) {
        setEmailTheme(sharedData.e);
      }
    }
  }, [sharedData]);

  const handleAIGenerate = (generatedData: Partial<SignatureData>, suggestedTemplate?: TemplateId | null) => {
    setSignatureData((prev) => ({ ...prev, ...generatedData }));
    // If AI suggests a template, apply it
    if (suggestedTemplate) {
      setSelectedTemplate(suggestedTemplate);
    }
  };

  const handleAIGenerationComplete = () => {
    // Switch to content tab so user can edit the generated signature
    setRightTab("content");
  };

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const handleResetConfirm = () => {
    setSignatureData(DEFAULT_SIGNATURE_DATA);
    setSelectedTemplate("professional-classic");
  };

  const getSignatureHTML = useCallback(() => {
    return generateSignatureHTML(signatureData, selectedTemplate);
  }, [signatureData, selectedTemplate]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle export click - show donation modal first
  const handleExportClick = () => {
    setIsExportDonationModalOpen(true);
  };

  // After donation modal interaction, proceed to export
  const handleExportContinue = () => {
    setRightTab("export");
  };

  // Handle first export action - show celebration
  const handleFirstExport = () => {
    setIsCelebrationModalOpen(true);
  };

  const leftTabs = [
    { id: "templates" as LeftTab, label: "Templates", icon: Layout },
    { id: "style" as LeftTab, label: "Style", icon: Palette },
  ];

  const rightTabs = [
    { id: "content" as RightTab, label: "Content", icon: FileText },
    { id: "ai" as RightTab, label: "AI", icon: Wand2 },
    { id: "export" as RightTab, label: "Export", icon: Download },
  ];

  return (
    <VisualEditorProvider
      signatureData={signatureData}
      onSignatureDataChange={setSignatureData}
    >
      <HomeContent
        signatureData={signatureData}
        setSignatureData={setSignatureData}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        leftTab={leftTab}
        setLeftTab={setLeftTab}
        rightTab={rightTab}
        setRightTab={setRightTab}
        leftPanelOpen={leftPanelOpen}
        setLeftPanelOpen={setLeftPanelOpen}
        previewZoom={previewZoom}
        setPreviewZoom={setPreviewZoom}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        previewTheme={previewTheme}
        setPreviewTheme={setPreviewTheme}
        isAIGenerating={isAIGenerating}
        setIsAIGenerating={setIsAIGenerating}
        emailTheme={emailTheme}
        setEmailTheme={setEmailTheme}
        isDonateModalOpen={isDonateModalOpen}
        setIsDonateModalOpen={setIsDonateModalOpen}
        isExportDonationModalOpen={isExportDonationModalOpen}
        setIsExportDonationModalOpen={setIsExportDonationModalOpen}
        isCelebrationModalOpen={isCelebrationModalOpen}
        setIsCelebrationModalOpen={setIsCelebrationModalOpen}
        isResetModalOpen={isResetModalOpen}
        setIsResetModalOpen={setIsResetModalOpen}
        handleResetConfirm={handleResetConfirm}
        handleFirstExport={handleFirstExport}
        isVisualEditMode={isVisualEditMode}
        setIsVisualEditMode={setIsVisualEditMode}
        mobileTab={mobileTab}
        setMobileTab={setMobileTab}
        tabletDrawerOpen={tabletDrawerOpen}
        setTabletDrawerOpen={setTabletDrawerOpen}
        previewDevice={previewDevice}
        setPreviewDevice={setPreviewDevice}
        handleAIGenerate={handleAIGenerate}
        handleAIGenerationComplete={handleAIGenerationComplete}
        handleReset={handleReset}
        getSignatureHTML={getSignatureHTML}
        toggleFullscreen={toggleFullscreen}
        handleExportClick={handleExportClick}
        handleExportContinue={handleExportContinue}
        leftTabs={leftTabs}
        rightTabs={rightTabs}
        isShareModalOpen={isShareModalOpen}
        setIsShareModalOpen={setIsShareModalOpen}
        isSharedTemplate={isSharedTemplate}
        sharedCreatorName={sharedData?.s.fullName}
        hasBeenCustomized={hasBeenCustomized}
        onSharedTemplateDismiss={clearShared}
        onSharedTemplateUse={markAsUsed}
      />
    </VisualEditorProvider>
  );
}

interface HomeContentProps {
  signatureData: SignatureData;
  setSignatureData: (data: SignatureData) => void;
  selectedTemplate: TemplateId;
  setSelectedTemplate: (id: TemplateId) => void;
  leftTab: LeftTab;
  setLeftTab: (tab: LeftTab) => void;
  rightTab: RightTab;
  setRightTab: (tab: RightTab) => void;
  leftPanelOpen: boolean;
  setLeftPanelOpen: (open: boolean) => void;
  previewZoom: number;
  setPreviewZoom: (zoom: number) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  previewTheme: "light" | "dark";
  setPreviewTheme: (theme: "light" | "dark") => void;
  isAIGenerating: boolean;
  setIsAIGenerating: (generating: boolean) => void;
  emailTheme: EmailThemeId;
  setEmailTheme: (theme: EmailThemeId) => void;
  isDonateModalOpen: boolean;
  setIsDonateModalOpen: (open: boolean) => void;
  isExportDonationModalOpen: boolean;
  setIsExportDonationModalOpen: (open: boolean) => void;
  isCelebrationModalOpen: boolean;
  setIsCelebrationModalOpen: (open: boolean) => void;
  isResetModalOpen: boolean;
  setIsResetModalOpen: (open: boolean) => void;
  handleResetConfirm: () => void;
  handleFirstExport: () => void;
  isVisualEditMode: boolean;
  setIsVisualEditMode: (editMode: boolean) => void;
  mobileTab: MobileTab;
  setMobileTab: (tab: MobileTab) => void;
  tabletDrawerOpen: "left" | "right" | null;
  setTabletDrawerOpen: (drawer: "left" | "right" | null) => void;
  previewDevice: DeviceType;
  setPreviewDevice: (device: DeviceType) => void;
  handleAIGenerate: (data: Partial<SignatureData>, template?: TemplateId | null) => void;
  handleAIGenerationComplete: () => void;
  handleReset: () => void;
  getSignatureHTML: () => string;
  toggleFullscreen: () => void;
  handleExportClick: () => void;
  handleExportContinue: () => void;
  leftTabs: { id: LeftTab; label: string; icon: typeof Layout }[];
  rightTabs: { id: RightTab; label: string; icon: typeof FileText }[];
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  isSharedTemplate: boolean;
  sharedCreatorName?: string;
  hasBeenCustomized: boolean;
  onSharedTemplateDismiss: () => void;
  onSharedTemplateUse: () => void;
}

function HomeContent({
  signatureData,
  setSignatureData,
  selectedTemplate,
  setSelectedTemplate,
  leftTab,
  setLeftTab,
  rightTab,
  setRightTab,
  leftPanelOpen,
  setLeftPanelOpen,
  previewZoom,
  setPreviewZoom,
  isFullscreen,
  setIsFullscreen,
  previewTheme,
  setPreviewTheme,
  isAIGenerating,
  setIsAIGenerating,
  emailTheme,
  setEmailTheme,
  isDonateModalOpen,
  setIsDonateModalOpen,
  isExportDonationModalOpen,
  setIsExportDonationModalOpen,
  isCelebrationModalOpen,
  setIsCelebrationModalOpen,
  isResetModalOpen,
  setIsResetModalOpen,
  handleResetConfirm,
  handleFirstExport,
  isVisualEditMode,
  setIsVisualEditMode,
  mobileTab,
  setMobileTab,
  tabletDrawerOpen,
  setTabletDrawerOpen,
  previewDevice,
  setPreviewDevice,
  handleAIGenerate,
  handleAIGenerationComplete,
  handleReset,
  getSignatureHTML,
  toggleFullscreen,
  handleExportClick,
  handleExportContinue,
  leftTabs,
  rightTabs,
  isShareModalOpen,
  setIsShareModalOpen,
  isSharedTemplate,
  sharedCreatorName,
  hasBeenCustomized,
  onSharedTemplateDismiss,
  onSharedTemplateUse,
}: HomeContentProps) {
  const visualEditor = useVisualEditorSafe();
  const { layoutMode, isMobile, isTablet, isDesktop } = useResponsive();

  // Sync visual edit mode with context
  useEffect(() => {
    if (visualEditor) {
      visualEditor.setIsEditMode(isVisualEditMode);
    }
  }, [isVisualEditMode, visualEditor]);

  // Apply email theme attribute to document for CSS targeting
  useEffect(() => {
    document.documentElement.setAttribute('data-email-theme', emailTheme);
    return () => {
      document.documentElement.removeAttribute('data-email-theme');
    };
  }, [emailTheme]);

  // Track banner visibility for layout calculations
  const [donationBannerVisible, setDonationBannerVisible] = useState(false);
  const [sharedBannerVisible, setSharedBannerVisible] = useState(isSharedTemplate);

  // Update shared banner visibility when isSharedTemplate changes
  useEffect(() => {
    setSharedBannerVisible(isSharedTemplate);
  }, [isSharedTemplate]);

  // Calculate top offset based on visible banners
  // Base header: 56px (h-14), Donation banner: ~32px, Shared banner: ~48px
  const getTopOffset = () => {
    let offset = 56; // base header height
    if (donationBannerVisible) offset += 32;
    if (sharedBannerVisible) offset += 48;
    return offset;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Visual Editor Toolbar - floating */}
      {isVisualEditMode && <VisualEditorToolbar />}
      
      {/* Unified Header + Banner Container */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl">
        {/* Donation Banner - hidden on mobile, shown on tablet/desktop */}
        <DonationBanner 
          onDonateClick={() => setIsDonateModalOpen(true)} 
          onVisibilityChange={setDonationBannerVisible}
        />

        {/* Main Header Bar */}
        <div className="border-b border-border">
          {/* Mobile Header - Clean and Minimal */}
          {isMobile && (
            <div className="px-3 h-12 flex items-center justify-between">
              {/* Left: Logo + Title */}
              <div className="flex items-center gap-2">
                <AnimatedLogo />
                <h1 className="font-semibold text-sm tracking-tight">SignForge</h1>
              </div>
              
              {/* Right: Minimal actions */}
              <div className="flex items-center gap-1">
                {/* Compact donation button on mobile */}
                <MobileDonationButton onDonateClick={() => setIsDonateModalOpen(true)} />
                {/* Share button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsShareModalOpen(true)}
                >
                  <SendHorizontal className="w-4 h-4" />
                </Button>
                {/* Theme toggle */}
                <ThemeToggle />
              </div>
            </div>
          )}

          {/* Tablet/Desktop Header - Full featured */}
          {!isMobile && (
            <div className="px-3 md:px-4 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <AnimatedLogo />
                  <div>
                    <h1 className="font-semibold text-sm tracking-tight">Signature Forge</h1>
                    <a 
                      href="https://www.openinsurance.ai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      by <span className="font-medium">OpenOS</span>
                    </a>
                  </div>
                </div>
                
                {/* Toggle Left Panel - Desktop only */}
                {isDesktop && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                  >
                    {leftPanelOpen ? (
                      <PanelLeftClose className="w-4 h-4" />
                    ) : (
                      <PanelLeft className="w-4 h-4" />
                    )}
                  </Button>
                )}
                
                {/* Tablet drawer toggles */}
                {isTablet && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTabletDrawerOpen(tabletDrawerOpen === "left" ? null : "left")}
                      className={clsx(
                        tabletDrawerOpen === "left" && "bg-primary/10 text-primary"
                      )}
                    >
                      <Layout className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTabletDrawerOpen(tabletDrawerOpen === "right" ? null : "right")}
                      className={clsx(
                        tabletDrawerOpen === "right" && "bg-primary/10 text-primary"
                      )}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* AI Assist - visible on tablet/desktop */}
                <SparkleButton
                  size="sm"
                  onClick={() => setRightTab("ai")}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden lg:inline">AI Assist</span>
                </SparkleButton>
                {/* Share button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-auto px-3 text-muted-foreground hover:text-foreground transition-colors group share-btn-hover"
                  onClick={() => setIsShareModalOpen(true)}
                >
                  <SendHorizontal className="w-4 h-4 share-icon" />
                  <span className="hidden md:inline ml-2 group-hover:text-rainbow-animated">Share</span>
                </Button>
                {/* Export button */}
                <Button
                  size="sm"
                  className="btn-elegant relative overflow-hidden group"
                  onClick={handleExportClick}
                >
                  <Download className="w-4 h-4 mr-2 group-hover:text-[var(--gradient-mid-3)] transition-colors" />
                  <span className="group-hover:text-rainbow-animated transition-all">Export</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[var(--gradient-start)]/0 via-[var(--gradient-mid-3)]/10 to-[var(--gradient-end)]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button variant="ghost" size="icon" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>

        {/* Shared Template Banner - inside header */}
        {isSharedTemplate && sharedBannerVisible && (
          <SharedTemplateBanner
            creatorName={sharedCreatorName}
            hasStartedEditing={hasBeenCustomized}
            onDismiss={() => {
              setSharedBannerVisible(false);
              onSharedTemplateDismiss();
            }}
            onStartEditing={onSharedTemplateUse}
          />
        )}
      </header>

      {/* Main Builder Layout */}
      {/* ======================= MOBILE LAYOUT ======================= */}
      {isMobile && (
        <div className="flex-1 flex flex-col overflow-hidden pb-[88px] safe-area-bottom min-h-screen-mobile">
          {/* Mobile Panel Content */}
          <div className="flex-1 overflow-y-auto scroll-touch">
            {/* Preview Panel */}
            {mobileTab === "preview" && (
              <div className="h-full bg-secondary/30 flex flex-col">
                {/* Minimal mobile preview toolbar */}
                <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
                  <div className="h-10 flex items-center justify-between px-2">
                    {/* Left: Theme selector */}
                    <EmailThemeSelector value={emailTheme} onChange={setEmailTheme} />
                    
                    {/* Right: Essential controls only */}
                    <div className="flex items-center gap-1">
                      {/* Compact zoom - just buttons, no label */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 touch-manipulation"
                        onClick={() => setPreviewZoom(Math.max(50, previewZoom - 15))}
                        disabled={previewZoom <= 50}
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 touch-manipulation"
                        onClick={() => setPreviewZoom(Math.min(150, previewZoom + 15))}
                        disabled={previewZoom >= 150}
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </Button>
                      <div className="w-px h-5 bg-border mx-0.5" />
                      {/* Preview theme toggle */}
                      <PreviewThemeSwitch
                        isDark={previewTheme === "dark"}
                        onChange={(isDark) => setPreviewTheme(isDark ? "dark" : "light")}
                      />
                      {/* Fullscreen */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 touch-manipulation"
                        onClick={toggleFullscreen}
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Preview Area - with proper spacing for toolbar */}
                <div className="flex-1 flex items-start justify-center p-3 overflow-auto relative scroll-touch scroll-smooth-mobile">
                  <ThemeCanvasEffects
                    themeId={emailTheme}
                    className="absolute inset-0 overflow-hidden"
                  />
                  {/* Preview container with responsive sizing */}
                  <div 
                    className="relative z-10 w-full mx-auto" 
                    style={{ 
                      transform: `scale(${previewZoom / 100})`, 
                      transformOrigin: 'top center',
                      maxWidth: previewZoom > 100 ? 'none' : '100%',
                    }}
                  >
                    <div 
                      className={clsx(
                        "canvas-container rounded-xl shadow-2xl overflow-hidden transition-all relative",
                        emailTheme === "the-office" 
                          ? "office-cork-board"
                          : emailTheme === "parks-and-recreation"
                            ? "parks-document-frame"
                            : emailTheme === "surfer-dude"
                              ? "surfer-beach-frame"
                              : emailTheme === "darth-vader"
                                ? "vader-hologram-frame"
                                : emailTheme === "yoda"
                                  ? "yoda-dagobah-frame"
                                  : emailTheme === "spider-man"
                                    ? "spidey-web-frame"
                                    : previewTheme === "light" ? "bg-white" : "bg-zinc-900",
                        isAIGenerating && "border-rainbow-animated ai-pulse-glow"
                      )}
                    >
                      <EmailPreviewMock
                        emailTheme={emailTheme}
                        previewTheme={previewTheme}
                        senderEmail={signatureData.email}
                        isAIGenerating={isAIGenerating}
                      >
                        <VisualEditorWrapper>
                          <SignaturePreview data={signatureData} templateId={selectedTemplate} previewTheme={previewTheme} />
                        </VisualEditorWrapper>
                      </EmailPreviewMock>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content/Form Panel */}
            {mobileTab === "content" && (
              <div className="p-3 sm:p-4">
                <SignatureForm data={signatureData} onChange={setSignatureData} emailTheme={emailTheme} />
              </div>
            )}

            {/* Templates Panel */}
            {mobileTab === "templates" && (
              <div className="p-3 sm:p-4">
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onSelect={(id) => {
                    setSelectedTemplate(id);
                    setMobileTab("preview");
                  }}
                />
              </div>
            )}

            {/* Style Panel */}
            {mobileTab === "style" && (
              <div className="p-3 sm:p-4">
                <StylePanel data={signatureData} onChange={setSignatureData} emailTheme={emailTheme} />
              </div>
            )}

            {/* AI Panel */}
            {mobileTab === "ai" && (
              <div className="p-3 sm:p-4">
                <AIGenerator
                  currentData={signatureData}
                  onGenerate={handleAIGenerate}
                  onGeneratingChange={setIsAIGenerating}
                  onGenerationComplete={() => setMobileTab("preview")}
                  emailTheme={emailTheme}
                />
              </div>
            )}

            {/* Export Panel */}
            {mobileTab === "export" && (
              <div className="p-3 sm:p-4">
                <ExportPanel onCopyHTML={getSignatureHTML} onFirstExport={handleFirstExport} />
              </div>
            )}
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileNav activeTab={mobileTab} onTabChange={setMobileTab} className="safe-area-bottom" />
        </div>
      )}

      {/* ======================= TABLET LAYOUT ======================= */}
      {isTablet && (
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Drawer - wider on larger tablets/small laptops */}
          <aside 
            className={clsx(
              "absolute left-0 top-0 bottom-0 z-30 border-r border-border bg-card flex flex-col transition-all duration-300",
              tabletDrawerOpen === "left" ? "w-72 md:w-80 lg:w-[340px] translate-x-0" : "w-72 md:w-80 lg:w-[340px] -translate-x-full"
            )}
          >
            <div className="flex items-center justify-between p-3 border-b border-border">
              <span className="font-medium text-sm">Design</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTabletDrawerOpen(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex border-b border-border">
              {leftTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setLeftTab(tab.id)}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium transition-all border-b-2",
                    leftTab === tab.id
                      ? "border-primary text-foreground bg-background"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {leftTab === "templates" && (
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onSelect={setSelectedTemplate}
                />
              )}
              {leftTab === "style" && (
                <StylePanel data={signatureData} onChange={setSignatureData} emailTheme={emailTheme} />
              )}
            </div>
          </aside>

          {/* Right Drawer - wider on larger tablets/small laptops */}
          <aside 
            className={clsx(
              "absolute right-0 top-0 bottom-0 z-30 border-l border-border bg-card flex flex-col transition-all duration-300",
              tabletDrawerOpen === "right" ? "w-80 md:w-[340px] lg:w-96 translate-x-0" : "w-80 md:w-[340px] lg:w-96 translate-x-full"
            )}
          >
            <div className="flex items-center justify-between p-3 border-b border-border">
              <span className="font-medium text-sm">Editor</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTabletDrawerOpen(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex border-b border-border">
              {rightTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => tab.id === "export" ? handleExportClick() : setRightTab(tab.id)}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 px-2 py-2.5 text-sm font-medium transition-all border-b-2",
                    rightTab === tab.id
                      ? "border-primary text-foreground bg-background"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-xs">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {rightTab === "content" && (
                <SignatureForm data={signatureData} onChange={setSignatureData} emailTheme={emailTheme} />
              )}
              {rightTab === "ai" && (
                <AIGenerator
                  currentData={signatureData}
                  onGenerate={handleAIGenerate}
                  onGeneratingChange={setIsAIGenerating}
                  onGenerationComplete={handleAIGenerationComplete}
                  emailTheme={emailTheme}
                />
              )}
            {rightTab === "export" && (
                <ExportPanel onCopyHTML={getSignatureHTML} onFirstExport={handleFirstExport} />
              )}
            </div>
          </aside>

          {/* Overlay when drawer is open */}
          {tabletDrawerOpen && (
            <div 
              className="absolute inset-0 z-20 bg-black/20 backdrop-blur-sm"
              onClick={() => setTabletDrawerOpen(null)}
            />
          )}

          {/* Center - Canvas/Preview */}
          <main className="flex-1 bg-secondary/30 flex flex-col">
            <div className="h-11 border-b border-border bg-background/50 flex items-center justify-between px-2 lg:px-4">
              <div className="flex items-center gap-1.5 lg:gap-2">
                <span className="text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:block">Preview</span>
                <span className="text-[10px] lg:text-xs text-muted-foreground px-1.5 py-0.5 bg-secondary rounded border border-border capitalize truncate max-w-[80px] lg:max-w-[120px]">
                  {selectedTemplate.replace(/-/g, " ")}
                </span>
                <EmailThemeSelector value={emailTheme} onChange={setEmailTheme} />
                {/* Device switcher for larger tablets */}
                <div className="hidden lg:block">
                  <DevicePreviewSwitcher value={previewDevice} onChange={setPreviewDevice} />
                </div>
              </div>
              <div className="flex items-center gap-0.5 lg:gap-1">
                <button
                  onClick={() => setIsVisualEditMode(!isVisualEditMode)}
                  className={clsx(
                    "visual-edit-btn relative flex items-center gap-1 h-7 lg:h-8 px-2 rounded-lg text-sm font-medium transition-all",
                    isVisualEditMode ? "visual-edit-btn-active" : "visual-edit-btn-inactive"
                  )}
                >
                  <MousePointerClick className={clsx(
                    "w-3.5 h-3.5 lg:w-4 lg:h-4 transition-all",
                    isVisualEditMode ? "text-white animate-pulse" : "text-[var(--gradient-mid-4)]"
                  )} />
                  <span className={clsx(
                    "hidden lg:inline text-xs",
                    isVisualEditMode ? "text-white" : "text-foreground"
                  )}>
                    {isVisualEditMode ? "Editing" : "Edit"}
                  </span>
                </button>
                <PreviewThemeSwitch
                  isDark={previewTheme === "dark"}
                  onChange={(isDark) => setPreviewTheme(isDark ? "dark" : "light")}
                />
                <div className="w-px h-5 bg-border mx-0.5 lg:mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 lg:h-8 lg:w-8"
                  onClick={() => setPreviewZoom(Math.max(50, previewZoom - 25))}
                  disabled={previewZoom <= 50}
                >
                  <ZoomOut className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                </Button>
                <span className="text-[10px] lg:text-xs text-muted-foreground w-8 lg:w-10 text-center">{previewZoom}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 lg:h-8 lg:w-8"
                  onClick={() => setPreviewZoom(Math.min(200, previewZoom + 25))}
                  disabled={previewZoom >= 200}
                >
                  <ZoomIn className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                </Button>
                <div className="w-px h-5 bg-border mx-0.5" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 lg:h-8 lg:w-8"
                  onClick={toggleFullscreen}
                >
                  <Maximize2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 flex items-start justify-center p-3 lg:p-4 overflow-auto relative">
              <ThemeCanvasEffects themeId={emailTheme} className="absolute inset-0 overflow-hidden" />
              <div className="relative z-10" style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top center' }}>
                <div 
                  className={clsx(
                    "canvas-container rounded-xl shadow-2xl overflow-hidden transition-all relative",
                    emailTheme === "the-office" 
                      ? "office-cork-board"
                      : emailTheme === "parks-and-recreation"
                        ? "parks-document-frame"
                        : emailTheme === "surfer-dude"
                          ? "surfer-beach-frame"
                          : emailTheme === "darth-vader"
                            ? "vader-hologram-frame"
                            : emailTheme === "yoda"
                              ? "yoda-dagobah-frame"
                              : emailTheme === "spider-man"
                                ? "spidey-web-frame"
                                : previewTheme === "light" ? "bg-white" : "bg-zinc-900",
                    isAIGenerating && "border-rainbow-animated ai-pulse-glow"
                  )}
                >
                  <EmailPreviewMock
                    emailTheme={emailTheme}
                    previewTheme={previewTheme}
                    senderEmail={signatureData.email}
                    isAIGenerating={isAIGenerating}
                  >
                    <VisualEditorWrapper>
                      <SignaturePreview data={signatureData} templateId={selectedTemplate} previewTheme={previewTheme} />
                    </VisualEditorWrapper>
                  </EmailPreviewMock>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ======================= DESKTOP LAYOUT (Original) ======================= */}
      {isDesktop && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Design Tools */}
          <aside 
            className={clsx(
              "border-r border-border bg-card flex flex-col transition-all duration-300 flex-shrink-0",
              leftPanelOpen ? "w-64 xl:w-72 2xl:w-80" : "w-0 overflow-hidden"
            )}
          >
            {/* Left Tabs */}
            <div className="flex border-b border-border">
              {leftTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setLeftTab(tab.id)}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-4 py-2.5 text-xs xl:text-sm font-medium transition-all border-b-2",
                    leftTab === tab.id
                      ? "border-primary text-foreground bg-background"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Left Tab Content */}
            <div className="flex-1 overflow-y-auto p-3 xl:p-4">
              {leftTab === "templates" && (
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onSelect={setSelectedTemplate}
                />
              )}
              {leftTab === "style" && (
                <StylePanel data={signatureData} onChange={setSignatureData} emailTheme={emailTheme} />
              )}
            </div>
          </aside>

          {/* Center - Canvas/Preview (Fixed) */}
          <main 
            className={clsx(
              "fixed bg-secondary/30 flex flex-col z-40 bottom-10",
              "transition-[left,top] duration-300 ease-in-out",
              "right-72 xl:right-80 2xl:right-96",
              leftPanelOpen ? "left-64 xl:left-72 2xl:left-80" : "left-0"
            )}
            style={{ top: `${getTopOffset()}px` }}
          >
          {/* Canvas Toolbar - Responsive */}
          <div className="h-11 border-b border-l border-r border-border bg-background/50 flex items-center justify-between px-2 xl:px-4">
            <div className="flex items-center gap-1.5 xl:gap-3">
              <span className="text-[10px] xl:text-xs font-medium text-muted-foreground uppercase tracking-wide hidden xl:block">
                Preview
              </span>
              <span className="text-[10px] xl:text-xs text-muted-foreground px-1.5 xl:px-2 py-0.5 bg-secondary rounded border border-border capitalize truncate max-w-[100px] xl:max-w-none">
                {selectedTemplate.replace(/-/g, " ")}
              </span>
              <div className="w-px h-4 bg-border hidden xl:block" />
              <EmailThemeSelector value={emailTheme} onChange={setEmailTheme} />
              <div className="w-px h-4 bg-border hidden 2xl:block" />
              <div className="hidden 2xl:block">
                <DevicePreviewSwitcher value={previewDevice} onChange={setPreviewDevice} />
              </div>
            </div>
            <div className="flex items-center gap-0.5 xl:gap-1">
              {/* Visual Edit Mode Toggle */}
              <button
                onClick={() => setIsVisualEditMode(!isVisualEditMode)}
                className={clsx(
                  "visual-edit-btn relative flex items-center gap-1 xl:gap-2 h-7 xl:h-8 px-2 xl:px-3 rounded-lg text-sm font-medium transition-all",
                  isVisualEditMode 
                    ? "visual-edit-btn-active" 
                    : "visual-edit-btn-inactive"
                )}
                title={isVisualEditMode ? "Exit Visual Edit Mode" : "Enter Visual Edit Mode"}
              >
                <MousePointerClick className={clsx(
                  "w-3.5 h-3.5 xl:w-4 xl:h-4 transition-all",
                  isVisualEditMode 
                    ? "text-white animate-pulse" 
                    : "text-[var(--gradient-mid-4)]"
                )} />
                <span className={clsx(
                  "hidden 2xl:inline text-xs transition-all",
                  isVisualEditMode ? "text-white" : "text-foreground"
                )}>
                  {isVisualEditMode ? "Editing" : "Edit"}
                </span>
                {/* Sparkle indicators when active */}
                {isVisualEditMode && (
                  <>
                    <span className="visual-edit-sparkle sparkle-1" />
                    <span className="visual-edit-sparkle sparkle-2" />
                    <span className="visual-edit-sparkle sparkle-3" />
                  </>
                )}
              </button>
              <div className="w-px h-5 bg-border mx-0.5 xl:mx-1" />
              {/* Preview Theme Toggle */}
              <PreviewThemeSwitch
                isDark={previewTheme === "dark"}
                onChange={(isDark) => setPreviewTheme(isDark ? "dark" : "light")}
              />
              <div className="w-px h-5 bg-border mx-0.5 xl:mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 xl:h-8 xl:w-8"
                onClick={() => setPreviewZoom(Math.max(50, previewZoom - 25))}
                disabled={previewZoom <= 50}
              >
                <ZoomOut className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              </Button>
              <span className="text-[10px] xl:text-xs text-muted-foreground w-8 xl:w-10 text-center">
                {previewZoom}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 xl:h-8 xl:w-8"
                onClick={() => setPreviewZoom(Math.min(200, previewZoom + 25))}
                disabled={previewZoom >= 200}
              >
                <ZoomIn className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              </Button>
              <div className="w-px h-5 bg-border mx-0.5" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 xl:h-8 xl:w-8"
                onClick={toggleFullscreen}
                title="Toggle fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex items-start justify-center p-4 pt-4 lg:pt-6 overflow-auto relative">
            {/* Theme Canvas Effects - rendered behind the preview */}
            <ThemeCanvasEffects
              themeId={emailTheme}
              className="absolute inset-0 overflow-hidden"
            />
            {/* Preview wrapper with device frame */}
            <div className="relative z-10" style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top center' }}>
              <DeviceFrame 
                device={previewDevice} 
                scale={previewDevice === "desktop" ? 1 : 1}
              >
                <div 
                  className={clsx(
                    "canvas-container overflow-hidden transition-all relative w-full h-full",
                    previewDevice === "desktop" && "rounded-xl shadow-2xl",
                    emailTheme === "the-office" 
                      ? "office-cork-board"
                      : emailTheme === "parks-and-recreation"
                        ? "parks-document-frame"
                        : emailTheme === "surfer-dude"
                          ? "surfer-beach-frame"
                          : emailTheme === "darth-vader"
                            ? "vader-hologram-frame"
                            : emailTheme === "yoda"
                              ? "yoda-dagobah-frame"
                              : emailTheme === "spider-man"
                                ? "spidey-web-frame"
                                : previewTheme === "light" ? "bg-white" : "bg-zinc-900",
                    isAIGenerating 
                      ? "border-rainbow-animated ai-pulse-glow" 
                      : previewDevice === "desktop" && (
                          emailTheme === "the-office" 
                            ? "border-2 border-amber-800/30" 
                            : emailTheme === "parks-and-recreation"
                              ? "border-2 border-amber-600/40"
                              : emailTheme === "surfer-dude"
                                ? "border-2 border-cyan-500/40"
                                : emailTheme === "darth-vader"
                                  ? "border-2 border-red-900/50"
                                  : emailTheme === "yoda"
                                    ? "border-2 border-green-800/40"
                                    : emailTheme === "spider-man"
                                      ? ""
                                      : "border border-border"
                        )
                  )}
                  style={{ 
                    ...(previewDevice === "desktop" ? {} : {
                      width: '100%',
                      height: '100%',
                    }),
                    ...(emailTheme === "the-office" ? {
                      background: previewTheme === "dark" 
                        ? "linear-gradient(135deg, #2a2318 0%, #1f1a12 50%, #171310 100%)"
                        : "linear-gradient(135deg, #c9a86c 0%, #b8956a 50%, #a88558 100%)",
                    } : emailTheme === "parks-and-recreation" ? {
                      background: previewTheme === "dark" 
                        ? "linear-gradient(135deg, #1c1915 0%, #242019 50%, #1a1714 100%)"
                        : "linear-gradient(135deg, #faf8f5 0%, #f5f2ed 50%, #efe9e0 100%)",
                    } : emailTheme === "surfer-dude" ? {
                      background: previewTheme === "dark" 
                        ? "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)"
                        : "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fffbeb 100%)",
                    } : emailTheme === "darth-vader" ? {
                      background: previewTheme === "dark" 
                        ? "linear-gradient(135deg, #050508 0%, #0a0a0f 50%, #050508 100%)"
                        : "linear-gradient(135deg, #12121a 0%, #1a1a25 50%, #12121a 100%)",
                    } : emailTheme === "yoda" ? {
                      background: previewTheme === "dark" 
                        ? "linear-gradient(135deg, #0d1a12 0%, #12231a 50%, #0d1a12 100%)"
                        : "linear-gradient(135deg, #f7f9f4 0%, #eef3e8 50%, #f7f9f4 100%)",
                    } : {})
                    /* Spider-Man notebook styling is handled entirely via CSS */
                  }}
                >
                <EmailPreviewMock
                    emailTheme={emailTheme}
                    previewTheme={previewTheme}
                    senderEmail={signatureData.email}
                    isAIGenerating={isAIGenerating}
                    deviceWidth={previewDevice !== "desktop" ? DEVICE_CONFIGS[previewDevice].width : undefined}
                  >
                    <VisualEditorWrapper>
                      <SignaturePreview data={signatureData} templateId={selectedTemplate} previewTheme={previewTheme} />
                    </VisualEditorWrapper>
                  </EmailPreviewMock>
                </div>
              </DeviceFrame>
            </div>
          </div>
        </main>

        {/* Spacer for fixed preview */}
        <div className="flex-1 min-w-0" />

        {/* Right Sidebar - Content Editor */}
        <aside className="w-72 xl:w-80 2xl:w-96 border-l border-border bg-card flex flex-col flex-shrink-0">
          {/* Right Tabs */}
          <div className="flex border-b border-border">
            {rightTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.id === "export" ? handleExportClick() : setRightTab(tab.id)}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-2.5 text-xs xl:text-sm font-medium transition-all",
                  rightTab === tab.id
                    ? tab.id === "ai" 
                      ? "rainbow-underline text-foreground bg-background border-b-0" 
                      : "border-b-2 border-primary text-foreground bg-background"
                    : "border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <tab.icon className={clsx(
                  "w-3.5 h-3.5 xl:w-4 xl:h-4",
                  rightTab === tab.id && tab.id === "ai" && "text-[var(--gradient-mid-4)]"
                )} />
                <span className={clsx(
                  rightTab === tab.id && tab.id === "ai" && "text-rainbow"
                )}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Right Tab Content */}
          <div className="flex-1 overflow-y-auto p-3 xl:p-4">
            {rightTab === "content" && (
              <SignatureForm data={signatureData} onChange={setSignatureData} emailTheme={emailTheme} />
            )}
            {rightTab === "ai" && (
              <AIGenerator
                currentData={signatureData}
                onGenerate={handleAIGenerate}
                onGeneratingChange={setIsAIGenerating}
                onGenerationComplete={handleAIGenerationComplete}
                emailTheme={emailTheme}
              />
            )}
            {rightTab === "export" && (
              <ExportPanel onCopyHTML={getSignatureHTML} onFirstExport={handleFirstExport} />
            )}
          </div>
        </aside>
        </div>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={isCelebrationModalOpen}
        onClose={() => setIsCelebrationModalOpen(false)}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfirm}
      />

      {/* Donate Modal */}
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
      />

      {/* Export Donation Modal */}
      <ExportDonationModal
        isOpen={isExportDonationModalOpen}
        onClose={() => setIsExportDonationModalOpen(false)}
        onContinue={handleExportContinue}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        signatureData={signatureData}
        templateId={selectedTemplate}
        emailTheme={emailTheme}
      />

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && setIsFullscreen(false)}
        >
          <div className="relative w-full h-full flex flex-col">
            {/* Mobile Close Button - Floating at top right */}
            {isMobile && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-3 right-3 z-50 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                aria-label="Close fullscreen"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {/* Fullscreen Header - Hidden on mobile for more space */}
            <div className={clsx(
              "bg-background/95 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 md:px-6 relative z-10",
              isMobile ? "h-12" : "h-14"
            )}>
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-xs md:text-sm font-medium">{isMobile ? "Preview" : "Email Preview"}</span>
                {!isMobile && (
                  <>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded border border-border capitalize">
                      {selectedTemplate.replace(/-/g, " ")}
                    </span>
                    <EmailThemeSelector value={emailTheme} onChange={setEmailTheme} />
                    <div className="w-px h-5 bg-border" />
                    <DevicePreviewSwitcher value={previewDevice} onChange={setPreviewDevice} />
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                {/* Visual Edit Mode Toggle in Fullscreen - Hidden on mobile */}
                {!isMobile && (
                  <>
                    <button
                      onClick={() => setIsVisualEditMode(!isVisualEditMode)}
                      className={clsx(
                        "visual-edit-btn relative flex items-center gap-2 h-8 px-3 rounded-lg text-sm font-medium transition-all",
                        isVisualEditMode 
                          ? "visual-edit-btn-active" 
                          : "visual-edit-btn-inactive"
                      )}
                    >
                      <MousePointerClick className={clsx(
                        "w-4 h-4 transition-all",
                        isVisualEditMode 
                          ? "text-white animate-pulse" 
                          : "text-[var(--gradient-mid-4)]"
                      )} />
                      <span className={clsx(
                        "transition-all",
                        isVisualEditMode ? "text-white" : "text-foreground"
                      )}>
                        {isVisualEditMode ? "Editing" : "Edit"}
                      </span>
                      {isVisualEditMode && (
                        <>
                          <span className="visual-edit-sparkle sparkle-1" />
                          <span className="visual-edit-sparkle sparkle-2" />
                          <span className="visual-edit-sparkle sparkle-3" />
                        </>
                      )}
                    </button>
                    <div className="w-px h-6 bg-border mx-1" />
                  </>
                )}
                {/* Preview Theme Toggle in Fullscreen */}
                <PreviewThemeSwitch
                  isDark={previewTheme === "dark"}
                  onChange={(isDark) => setPreviewTheme(isDark ? "dark" : "light")}
                />
                <div className="w-px h-6 bg-border mx-1" />
                {/* Zoom Controls */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:h-8 md:w-8"
                  onClick={() => setPreviewZoom(Math.max(50, previewZoom - 25))}
                  disabled={previewZoom <= 50}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-[10px] md:text-xs text-muted-foreground w-8 md:w-12 text-center">
                  {previewZoom}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:h-8 md:w-8"
                  onClick={() => setPreviewZoom(Math.min(200, previewZoom + 25))}
                  disabled={previewZoom >= 200}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                {/* Exit Button - Desktop only (mobile has floating button) */}
                {!isMobile && (
                  <>
                    <div className="w-px h-6 bg-border" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFullscreen(false)}
                      className="gap-2"
                    >
                      <Minimize2 className="w-4 h-4" />
                      <span className="text-xs">Exit</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Fullscreen Content */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto relative">
              {/* Theme Canvas Effects for Fullscreen */}
              <ThemeCanvasEffects
                themeId={emailTheme}
                className="absolute inset-0 overflow-hidden"
              />
              <div 
                className="relative z-10"
                style={{ 
                  transform: `scale(${previewZoom / 100})`,
                  transformOrigin: 'center center',
                }}
              >
                <DeviceFrame 
                  device={previewDevice} 
                  scale={previewDevice === "desktop" ? 1 : 0.8}
                >
                  <div 
                    className={clsx(
                      "canvas-container overflow-hidden transition-all relative",
                      previewDevice === "desktop" && "rounded-xl shadow-2xl",
                      emailTheme === "the-office"
                        ? "office-cork-board"
                        : emailTheme === "parks-and-recreation"
                          ? "parks-document-frame"
                          : emailTheme === "surfer-dude"
                            ? "surfer-beach-frame"
                            : emailTheme === "darth-vader"
                              ? "vader-hologram-frame"
                              : emailTheme === "yoda"
                                ? "yoda-dagobah-frame"
                                : emailTheme === "spider-man"
                                  ? "spidey-web-frame"
                                  : previewTheme === "light" ? "bg-white" : "bg-zinc-900",
                      isAIGenerating 
                        ? "border-rainbow-animated ai-pulse-glow" 
                        : previewDevice === "desktop" && (
                            emailTheme === "the-office"
                              ? "border-2 border-amber-800/30"
                              : emailTheme === "parks-and-recreation"
                                ? "border-2 border-amber-600/40"
                                : emailTheme === "surfer-dude"
                                  ? "border-2 border-cyan-500/40"
                                  : emailTheme === "darth-vader"
                                    ? "border-2 border-red-900/50"
                                    : emailTheme === "yoda"
                                      ? "border-2 border-green-800/40"
                                      : emailTheme === "spider-man"
                                        ? "border-2 border-red-600/50"
                                        : previewTheme === "light" 
                                          ? "border border-gray-200" 
                                          : "border border-zinc-700"
                          )
                    )}
                    style={{ 
                      width: previewDevice !== "desktop" ? DEVICE_CONFIGS[previewDevice].width : undefined,
                      minHeight: previewDevice !== "desktop" ? DEVICE_CONFIGS[previewDevice].height : undefined,
                      ...(emailTheme === "the-office" ? {
                        background: previewTheme === "dark" 
                          ? "linear-gradient(135deg, #2a2318 0%, #1f1a12 50%, #171310 100%)"
                          : "linear-gradient(135deg, #c9a86c 0%, #b8956a 50%, #a88558 100%)",
                      } : emailTheme === "parks-and-recreation" ? {
                        background: previewTheme === "dark" 
                          ? "linear-gradient(135deg, #1c1915 0%, #242019 50%, #1a1714 100%)"
                          : "linear-gradient(135deg, #faf8f5 0%, #f5f2ed 50%, #efe9e0 100%)",
                      } : emailTheme === "surfer-dude" ? {
                        background: previewTheme === "dark" 
                          ? "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)"
                          : "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fffbeb 100%)",
                      } : emailTheme === "darth-vader" ? {
                        background: previewTheme === "dark" 
                          ? "linear-gradient(135deg, #050508 0%, #0a0a0f 50%, #050508 100%)"
                          : "linear-gradient(135deg, #12121a 0%, #1a1a25 50%, #12121a 100%)",
                      } : emailTheme === "yoda" ? {
                        background: previewTheme === "dark" 
                          ? "linear-gradient(135deg, #0d1a12 0%, #12231a 50%, #0d1a12 100%)"
                          : "linear-gradient(135deg, #f7f9f4 0%, #eef3e8 50%, #f7f9f4 100%)",
                      } : emailTheme === "spider-man" ? {
                        background: previewTheme === "dark" 
                          ? "linear-gradient(135deg, #050a14 0%, #0a1628 50%, #050a14 100%)"
                          : "linear-gradient(135deg, #f0f4f8 0%, #e8eef5 50%, #f0f4f8 100%)",
                      } : {})
                    }}
                  >
                    <EmailPreviewMock
                      emailTheme={emailTheme}
                      previewTheme={previewTheme}
                      senderEmail={signatureData.email}
                      isAIGenerating={isAIGenerating}
                      deviceWidth={previewDevice !== "desktop" ? DEVICE_CONFIGS[previewDevice].width : undefined}
                    >
                      <VisualEditorWrapper>
                        <SignaturePreview data={signatureData} templateId={selectedTemplate} previewTheme={previewTheme} />
                      </VisualEditorWrapper>
                    </EmailPreviewMock>
                  </div>
                </DeviceFrame>
              </div>
            </div>
            
            {/* Hint - Different for mobile vs desktop */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 safe-area-bottom">
              <span className="text-xs text-muted-foreground bg-background/80 px-3 py-1.5 rounded-full border border-border">
                {isMobile ? "Tap ✕ or outside to exit" : "Press ESC or click outside to exit"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer - hidden on mobile since it's in the scroll area */}
      {!isMobile && <Footer />}
    </div>
  );
}
