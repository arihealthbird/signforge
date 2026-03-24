"use client";

import { SignatureData, EditableElement, ElementStyleOverride } from "@/types/signature";
import { TemplateId } from "@/lib/templates";
import { escapeHtml, validateUrl, sanitizeColor } from "@/lib/security";
import { Linkedin, Twitter, Facebook, Instagram, Github, Youtube, Globe, Phone, Mail, Calendar, MapPin, Music } from "lucide-react";
import { CSSProperties } from "react";

// Helper to merge base styles with visual editor overrides
function applyStyleOverride(
  baseStyle: CSSProperties,
  override: ElementStyleOverride | undefined,
  baseFontSize: number
): CSSProperties {
  if (!override) return baseStyle;
  
  const merged: CSSProperties = { ...baseStyle };
  
  if (override.fontWeight) merged.fontWeight = override.fontWeight;
  if (override.fontStyle) merged.fontStyle = override.fontStyle;
  if (override.textDecoration) merged.textDecoration = override.textDecoration;
  if (override.color) merged.color = override.color;
  if (override.textAlign) merged.textAlign = override.textAlign;
  if (override.letterSpacing) merged.letterSpacing = override.letterSpacing;
  if (override.marginTop !== undefined) merged.marginTop = `${override.marginTop}px`;
  if (override.marginBottom !== undefined) merged.marginBottom = `${override.marginBottom}px`;
  
  // Font size is relative adjustment
  if (override.fontSize !== undefined) {
    const currentSize = typeof baseStyle.fontSize === 'string' 
      ? parseInt(baseStyle.fontSize) 
      : (baseStyle.fontSize as number) || baseFontSize;
    merged.fontSize = `${currentSize + override.fontSize}px`;
  }
  
  return merged;
}

// --- Custom style helpers ---

function getPhotoRadius(shape?: string): string {
  switch (shape) {
    case "square": return "0";
    case "rounded": return "8px";
    case "circle":
    default: return "50%";
  }
}

function getPhotoDimensions(data: SignatureData, defaultSize: number): { width: string; height: string } {
  const size = data.profilePhotoSize ?? defaultSize;
  return { width: `${size}px`, height: `${size}px` };
}

function getLogoMaxWidth(data: SignatureData, defaultWidth: number): string {
  return `${data.logoWidth ?? defaultWidth}px`;
}

function getDividerBorder(data: SignatureData, fallbackColor: string, orientation: "top" | "left" | "right" | "bottom" = "top"): string {
  const style = data.dividerStyle ?? "solid";
  if (style === "none") return "none";
  const width = data.dividerWidth ?? 2;
  const color = data.dividerColor || fallbackColor;
  return `${width}px ${style} ${color}`;
}

function getContentSpacing(density?: string): { section: string; element: string } {
  switch (density) {
    case "compact": return { section: "8px", element: "2px" };
    case "relaxed": return { section: "20px", element: "8px" };
    case "normal":
    default: return { section: "12px", element: "4px" };
  }
}

function getEffectiveTextColor(data: SignatureData, isDark: boolean, fallbackDark = "#f4f4f5", fallbackLight = "#333333"): string {
  if (data.textColor) return data.textColor;
  return isDark ? fallbackDark : fallbackLight;
}

function getSocialIconBg(shape?: string, color?: string): CSSProperties {
  if (!shape || shape === "none") return {};
  const bg = color ? `${color}15` : "transparent";
  const radius = shape === "circle" ? "50%" : shape === "rounded" ? "6px" : "0";
  return {
    backgroundColor: bg,
    borderRadius: radius,
    padding: "6px",
  };
}

function renderSocialLinks(
  links: SignatureData["socialLinks"],
  data: SignatureData,
  accentColor: string,
  textColor: string,
  baseStyle?: CSSProperties,
) {
  const iconStyle = data.socialIconStyle ?? "icon";
  const iconShape = data.socialIconShape ?? "none";
  const shapeBg = getSocialIconBg(iconShape, accentColor);

  return links.map((link, i) => {
    const safeUrl = validateUrl(link.url);
    if (!safeUrl) return null;
    const label = SOCIAL_PLATFORM_LABELS[link.platform] || link.platform;
    return (
      <a
        key={i}
        href={safeUrl}
        style={{
          display: "inline-block",
          marginRight: "8px",
          color: accentColor,
          textDecoration: "none",
          verticalAlign: "middle",
          ...shapeBg,
          ...baseStyle,
        }}
      >
        {(iconStyle === "icon" || iconStyle === "icon-text") && <SocialIcon platform={link.platform} />}
        {iconStyle === "icon-text" && <span style={{ marginLeft: "4px", fontSize: "12px" }}>{label}</span>}
        {iconStyle === "text" && <span style={{ fontSize: "12px", fontWeight: 500 }}>{label}</span>}
      </a>
    );
  });
}

const SOCIAL_PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "𝕏",
  facebook: "Facebook",
  instagram: "Instagram",
  github: "GitHub",
  youtube: "YouTube",
  tiktok: "TikTok",
  website: "Web",
};

interface SignaturePreviewProps {
  data: SignatureData;
  templateId: TemplateId;
  previewTheme?: "light" | "dark";
}

const SocialIcon = ({ platform }: { platform: string }) => {
  const iconClass = "w-4 h-4";
  switch (platform) {
    case "linkedin": return <Linkedin className={iconClass} />;
    case "twitter": return <Twitter className={iconClass} />;
    case "facebook": return <Facebook className={iconClass} />;
    case "instagram": return <Instagram className={iconClass} />;
    case "github": return <Github className={iconClass} />;
    case "youtube": return <Youtube className={iconClass} />;
    case "tiktok": return <Music className={iconClass} />;
    default: return <Globe className={iconClass} />;
  }
};

// Helper function to get style override for an element
function getOverride(data: SignatureData, element: EditableElement): ElementStyleOverride | undefined {
  return data.styleOverrides?.[element];
}

// Professional Classic Template
function ProfessionalClassic({ data, isDark = false }: { data: SignatureData; isDark?: boolean }) {
  const hasAddress = data.address || data.city || data.state;
  const addressParts = [data.address, data.city, data.state, data.zipCode, data.country].filter(Boolean);
  const safeColor = sanitizeColor(data.primaryColor);
  
  const textPrimary = getEffectiveTextColor(data, isDark);
  const textSecondary = getEffectiveTextColor(data, isDark, "#a1a1aa", "#666666");
  const textMuted = isDark ? "#71717a" : "#999999";
  const spacing = getContentSpacing(data.contentPadding);
  const photo = getPhotoDimensions(data, 80);

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary, lineHeight: data.lineHeight ?? 1.4 }}>
      <tbody>
        <tr>
          {data.profilePhotoUrl && (
            <td style={{ paddingRight: "16px", verticalAlign: "top" }}>
              <img
                src={validateUrl(data.profilePhotoUrl) || undefined}
                alt={data.fullName}
                style={{ ...photo, borderRadius: getPhotoRadius(data.photoShape), objectFit: "cover" }}
              />
            </td>
          )}
          <td style={{ verticalAlign: "top", borderLeft: getDividerBorder(data, safeColor, "left"), paddingLeft: "16px" }}>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={{ paddingBottom: spacing.element }}>
                    <span 
                      data-editable="fullName"
                      style={applyStyleOverride(
                        { fontWeight: "bold", fontSize: `${data.fontSize + 2}px`, color: safeColor },
                        getOverride(data, "fullName"),
                        data.fontSize + 2
                      )}
                    >
                      {data.fullName || "Your Name"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td 
                    data-editable="jobTitle"
                    style={applyStyleOverride(
                      { paddingBottom: spacing.section, color: textSecondary },
                      getOverride(data, "jobTitle"),
                      data.fontSize
                    )}
                  >
                    {data.jobTitle || "Job Title"}{data.department ? ` | ${data.department}` : ""}
                  </td>
                </tr>
                <tr>
                  <td 
                    data-editable="company"
                    style={applyStyleOverride(
                      { fontWeight: "bold", color: textPrimary, paddingBottom: spacing.section },
                      getOverride(data, "company"),
                      data.fontSize
                    )}
                  >
                    {data.company || "Company Name"}
                  </td>
                </tr>
                {data.email && (
                  <tr>
                    <td style={{ paddingBottom: spacing.element }}>
                      <a 
                        href={`mailto:${encodeURIComponent(data.email)}`} 
                        data-editable="email"
                        style={applyStyleOverride(
                          { color: textPrimary, textDecoration: "none" },
                          getOverride(data, "email"),
                          data.fontSize
                        )}
                      >
                        {data.email}
                      </a>
                    </td>
                  </tr>
                )}
                {data.phone && (
                  <tr>
                    <td 
                      data-editable="phone"
                      style={applyStyleOverride(
                        { paddingBottom: spacing.element },
                        getOverride(data, "phone"),
                        data.fontSize
                      )}
                    >
                      {data.phone}
                    </td>
                  </tr>
                )}
                {data.website && validateUrl(data.website) && (
                  <tr>
                    <td style={{ paddingBottom: spacing.element }}>
                      <a 
                        href={validateUrl(data.website)} 
                        data-editable="website"
                        style={applyStyleOverride(
                          { color: safeColor, textDecoration: "none" },
                          getOverride(data, "website"),
                          data.fontSize
                        )}
                      >
                        {data.website.replace(/^https?:\/\//, "")}
                      </a>
                    </td>
                  </tr>
                )}
                {hasAddress && (
                  <tr>
                    <td 
                      data-editable="address"
                      style={applyStyleOverride(
                        { paddingTop: spacing.element, color: textSecondary, fontSize: `${data.fontSize - 1}px` },
                        getOverride(data, "address"),
                        data.fontSize - 1
                      )}
                    >
                      {addressParts.join(", ")}
                    </td>
                  </tr>
                )}
                {data.socialLinks.length > 0 && (
                  <tr>
                    <td style={{ paddingTop: spacing.section }}>
                      {renderSocialLinks(data.socialLinks, data, safeColor, textPrimary)}
                    </td>
                  </tr>
                )}
                {data.logoUrl && (
                  <tr>
                    <td style={{ paddingTop: spacing.section }}>
                      <img src={validateUrl(data.logoUrl) || undefined} alt={data.company} style={{ maxHeight: "40px", maxWidth: getLogoMaxWidth(data, 120) }} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </td>
        </tr>
        {data.disclaimer && (
          <tr>
            <td 
              colSpan={2} 
              data-editable="disclaimer"
              style={applyStyleOverride(
                { paddingTop: "16px", fontSize: `${data.fontSize - 3}px`, color: textMuted },
                getOverride(data, "disclaimer"),
                data.fontSize - 3
              )}
            >
              {data.disclaimer}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// Minimal Modern Template
function MinimalModern({ data, isDark = false }: { data: SignatureData; isDark?: boolean }) {
  const safeColor = sanitizeColor(data.primaryColor);
  
  const textPrimary = getEffectiveTextColor(data, isDark);
  const textSecondary = getEffectiveTextColor(data, isDark, "#a1a1aa", "#666666");
  const textMuted = isDark ? "#71717a" : "#999999";
  const spacing = getContentSpacing(data.contentPadding);
  
  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary, lineHeight: data.lineHeight ?? 1.4 }}>
      <tbody>
        <tr>
          <td>
            <span 
              data-editable="fullName"
              style={applyStyleOverride(
                { fontWeight: "600", fontSize: `${data.fontSize + 1}px` },
                getOverride(data, "fullName"),
                data.fontSize + 1
              )}
            >
              {data.fullName || "Your Name"}
            </span>
            <span style={{ color: textMuted, margin: "0 8px" }}>|</span>
            <span 
              data-editable="jobTitle"
              style={applyStyleOverride(
                { color: textSecondary },
                getOverride(data, "jobTitle"),
                data.fontSize
              )}
            >
              {data.jobTitle || "Job Title"}
            </span>
          </td>
        </tr>
        <tr>
          <td style={{ paddingTop: spacing.element, paddingBottom: spacing.section, borderBottom: getDividerBorder(data, safeColor) }}>
            <span 
              data-editable="company"
              style={applyStyleOverride(
                { color: safeColor, fontWeight: "500" },
                getOverride(data, "company"),
                data.fontSize
              )}
            >
              {data.company || "Company"}
            </span>
          </td>
        </tr>
        <tr>
          <td style={{ paddingTop: spacing.section }}>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {data.email && (
                    <td style={{ paddingRight: "16px" }}>
                      <a 
                        href={`mailto:${encodeURIComponent(data.email)}`} 
                        data-editable="email"
                        style={applyStyleOverride(
                          { color: textPrimary, textDecoration: "none" },
                          getOverride(data, "email"),
                          data.fontSize
                        )}
                      >
                        {data.email}
                      </a>
                    </td>
                  )}
                  {data.phone && (
                    <td 
                      data-editable="phone"
                      style={applyStyleOverride(
                        { paddingRight: "16px" },
                        getOverride(data, "phone"),
                        data.fontSize
                      )}
                    >
                      {data.phone}
                    </td>
                  )}
                  {data.website && validateUrl(data.website) && (
                    <td>
                      <a 
                        href={validateUrl(data.website)} 
                        data-editable="website"
                        style={applyStyleOverride(
                          { color: safeColor, textDecoration: "none" },
                          getOverride(data, "website"),
                          data.fontSize
                        )}
                      >
                        {data.website.replace(/^https?:\/\//, "")}
                      </a>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        {data.socialLinks.length > 0 && (
          <tr>
            <td style={{ paddingTop: spacing.section }}>
              {renderSocialLinks(data.socialLinks, data, textSecondary, textPrimary)}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// Corporate Bold Template
function CorporateBold({ data, isDark = false }: { data: SignatureData; isDark?: boolean }) {
  const safeColor = sanitizeColor(data.primaryColor);
  
  const textPrimary = getEffectiveTextColor(data, isDark);
  const textBold = getEffectiveTextColor(data, isDark, "#fafafa", "#1a1a1a");
  const textSecondary = getEffectiveTextColor(data, isDark, "#a1a1aa", "#666666");
  const spacing = getContentSpacing(data.contentPadding);
  
  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary, lineHeight: data.lineHeight ?? 1.4 }}>
      <tbody>
        <tr>
          {data.logoUrl && (
            <td style={{ paddingRight: "20px", verticalAlign: "middle", borderRight: getDividerBorder(data, safeColor, "right") }}>
              <img src={validateUrl(data.logoUrl) || undefined} alt={data.company} style={{ maxHeight: "60px", maxWidth: getLogoMaxWidth(data, 150) }} />
            </td>
          )}
          <td style={{ paddingLeft: data.logoUrl ? "20px" : "0", verticalAlign: "top" }}>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={{ paddingBottom: spacing.element }}>
                    <span 
                      data-editable="fullName"
                      style={applyStyleOverride(
                        { fontWeight: "bold", fontSize: `${data.fontSize + 3}px`, color: textBold },
                        getOverride(data, "fullName"),
                        data.fontSize + 3
                      )}
                    >
                      {data.fullName || "Your Name"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td 
                    data-editable="jobTitle"
                    style={applyStyleOverride(
                      { paddingBottom: spacing.element, color: safeColor, fontWeight: "600", textTransform: "uppercase", fontSize: `${data.fontSize - 1}px`, letterSpacing: "0.5px" },
                      getOverride(data, "jobTitle"),
                      data.fontSize - 1
                    )}
                  >
                    {data.jobTitle || "Job Title"}
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingBottom: spacing.section }}>
                    <span 
                      data-editable="company"
                      style={applyStyleOverride(
                        { fontWeight: "500" },
                        getOverride(data, "company"),
                        data.fontSize
                      )}
                    >
                      {data.company || "Company Name"}
                    </span>
                    {data.department && <span style={{ color: textSecondary }}> — {data.department}</span>}
                  </td>
                </tr>
                <tr>
                  <td>
                    <table cellPadding="0" cellSpacing="0">
                      <tbody>
                        {data.email && (
                          <tr>
                            <td style={{ paddingBottom: "2px", paddingRight: "8px", color: textSecondary }}>E:</td>
                            <td style={{ paddingBottom: "2px" }}>
                              <a 
                                href={`mailto:${encodeURIComponent(data.email)}`} 
                                data-editable="email"
                                style={applyStyleOverride(
                                  { color: textPrimary, textDecoration: "none" },
                                  getOverride(data, "email"),
                                  data.fontSize
                                )}
                              >
                                {data.email}
                              </a>
                            </td>
                          </tr>
                        )}
                        {data.phone && (
                          <tr>
                            <td style={{ paddingBottom: "2px", paddingRight: "8px", color: textSecondary }}>P:</td>
                            <td 
                              data-editable="phone"
                              style={applyStyleOverride(
                                { paddingBottom: "2px" },
                                getOverride(data, "phone"),
                                data.fontSize
                              )}
                            >
                              {data.phone}
                            </td>
                          </tr>
                        )}
                        {data.website && validateUrl(data.website) && (
                          <tr>
                            <td style={{ paddingBottom: "2px", paddingRight: "8px", color: textSecondary }}>W:</td>
                            <td style={{ paddingBottom: "2px" }}>
                              <a 
                                href={validateUrl(data.website)} 
                                data-editable="website"
                                style={applyStyleOverride(
                                  { color: safeColor, textDecoration: "none" },
                                  getOverride(data, "website"),
                                  data.fontSize
                                )}
                              >
                                {data.website.replace(/^https?:\/\//, "")}
                              </a>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        {data.socialLinks.length > 0 && (
          <tr>
            <td colSpan={2} style={{ paddingTop: spacing.section }}>
              {renderSocialLinks(data.socialLinks, data, safeColor, "#ffffff", {
                padding: "6px",
                backgroundColor: safeColor,
                borderRadius: "4px",
                color: "#ffffff",
              })}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// Creative Gradient Template
function CreativeGradient({ data, isDark = false }: { data: SignatureData; isDark?: boolean }) {
  const safeColor = sanitizeColor(data.primaryColor);
  
  const textPrimary = getEffectiveTextColor(data, isDark);
  const textBold = getEffectiveTextColor(data, isDark, "#fafafa", "#1a1a1a");
  const spacing = getContentSpacing(data.contentPadding);
  const photo = getPhotoDimensions(data, 70);
  const bgGradient = isDark 
    ? `linear-gradient(135deg, ${safeColor}20, ${safeColor}10)` 
    : `linear-gradient(135deg, ${safeColor}15, ${safeColor}05)`;
  
  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary, lineHeight: data.lineHeight ?? 1.4 }}>
      <tbody>
        <tr>
          <td style={{ 
            background: bgGradient,
            padding: "16px",
            borderRadius: "8px",
            borderLeft: getDividerBorder(data, safeColor, "left")
          }}>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {data.profilePhotoUrl && (
                    <td style={{ paddingRight: "16px", verticalAlign: "top" }}>
                      <img
                        src={validateUrl(data.profilePhotoUrl) || undefined}
                        alt={data.fullName}
                        style={{ ...photo, borderRadius: getPhotoRadius(data.photoShape === "circle" ? "rounded" : data.photoShape), objectFit: "cover" }}
                      />
                    </td>
                  )}
                  <td style={{ verticalAlign: "top" }}>
                    <table cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={{ paddingBottom: "2px" }}>
                            <span 
                              data-editable="fullName"
                              style={applyStyleOverride(
                                { fontWeight: "bold", fontSize: `${data.fontSize + 2}px`, color: textBold },
                                getOverride(data, "fullName"),
                                data.fontSize + 2
                              )}
                            >
                              {data.fullName || "Your Name"}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingBottom: spacing.section }}>
                            <span 
                              data-editable="jobTitle"
                              style={applyStyleOverride(
                                { color: safeColor, fontWeight: "500" },
                                getOverride(data, "jobTitle"),
                                data.fontSize
                              )}
                            >
                              {data.jobTitle || "Job Title"}
                            </span>
                            {" @ "}
                            <span 
                              data-editable="company"
                              style={applyStyleOverride(
                                { color: safeColor, fontWeight: "500" },
                                getOverride(data, "company"),
                                data.fontSize
                              )}
                            >
                              {data.company || "Company"}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {data.email && (
                              <span style={{ marginRight: "16px" }}>
                                <a 
                                  href={`mailto:${encodeURIComponent(data.email)}`} 
                                  data-editable="email"
                                  style={applyStyleOverride(
                                    { color: textPrimary, textDecoration: "none" },
                                    getOverride(data, "email"),
                                    data.fontSize
                                  )}
                                >
                                  ✉️ {data.email}
                                </a>
                              </span>
                            )}
                            {data.phone && (
                              <span 
                                data-editable="phone"
                                style={applyStyleOverride(
                                  {},
                                  getOverride(data, "phone"),
                                  data.fontSize
                                )}
                              >
                                📱 {data.phone}
                              </span>
                            )}
                          </td>
                        </tr>
                        {data.website && validateUrl(data.website) && (
                          <tr>
                            <td style={{ paddingTop: spacing.element }}>
                              <a 
                                href={validateUrl(data.website)} 
                                data-editable="website"
                                style={applyStyleOverride(
                                  { color: safeColor, textDecoration: "none" },
                                  getOverride(data, "website"),
                                  data.fontSize
                                )}
                              >
                                🌐 {data.website.replace(/^https?:\/\//, "")}
                              </a>
                            </td>
                          </tr>
                        )}
                        {data.calendarLink && validateUrl(data.calendarLink) && (
                          <tr>
                            <td style={{ paddingTop: "8px" }}>
                              <a
                                href={validateUrl(data.calendarLink)}
                                style={{
                                  display: "inline-block",
                                  padding: "6px 12px",
                                  backgroundColor: safeColor,
                                  color: "#ffffff",
                                  borderRadius: "20px",
                                  textDecoration: "none",
                                  fontSize: `${data.fontSize - 1}px`,
                                  fontWeight: "500",
                                }}
                              >
                                📅 Book a Meeting
                              </a>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        {data.socialLinks.length > 0 && (
          <tr>
            <td style={{ paddingTop: spacing.section }}>
              {renderSocialLinks(data.socialLinks, data, safeColor, textPrimary)}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// Executive Elegant Template
function ExecutiveElegant({ data, isDark = false }: { data: SignatureData; isDark?: boolean }) {
  const safeColor = sanitizeColor(data.primaryColor);
  
  const textPrimary = getEffectiveTextColor(data, isDark);
  const textBold = getEffectiveTextColor(data, isDark, "#fafafa", "#1a1a1a");
  const textSecondary = getEffectiveTextColor(data, isDark, "#a1a1aa", "#666666");
  const spacing = getContentSpacing(data.contentPadding);
  const photo = getPhotoDimensions(data, 90);
  
  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary, lineHeight: data.lineHeight ?? 1.4 }}>
      <tbody>
        <tr>
          <td style={{ textAlign: "center", paddingBottom: spacing.section }}>
            {data.profilePhotoUrl && (
              <img
                src={validateUrl(data.profilePhotoUrl) || undefined}
                alt={data.fullName}
                style={{ ...photo, borderRadius: getPhotoRadius(data.photoShape), objectFit: "cover", border: getDividerBorder(data, safeColor) }}
              />
            )}
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: "center", paddingBottom: spacing.element }}>
            <span 
              data-editable="fullName"
              style={applyStyleOverride(
                { fontWeight: "bold", fontSize: `${data.fontSize + 4}px`, letterSpacing: "1px", color: textBold },
                getOverride(data, "fullName"),
                data.fontSize + 4
              )}
            >
              {(data.fullName || "Your Name").toUpperCase()}
            </span>
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: "center", paddingBottom: spacing.section }}>
            <span 
              data-editable="jobTitle"
              style={applyStyleOverride(
                { color: safeColor, fontStyle: "italic" },
                getOverride(data, "jobTitle"),
                data.fontSize
              )}
            >
              {data.jobTitle || "Job Title"}
            </span>
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: "center", paddingBottom: spacing.section }}>
            <div style={{ width: "60px", borderTop: getDividerBorder(data, safeColor), margin: "0 auto" }} />
          </td>
        </tr>
        <tr>
          <td 
            data-editable="company"
            style={applyStyleOverride(
              { textAlign: "center", fontWeight: "500", paddingBottom: spacing.section },
              getOverride(data, "company"),
              data.fontSize
            )}
          >
            {data.company || "Company Name"}
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: "center" }}>
            <table cellPadding="0" cellSpacing="0" style={{ margin: "0 auto" }}>
              <tbody>
                <tr>
                  {data.email && (
                    <td style={{ paddingRight: "20px" }}>
                      <a 
                        href={`mailto:${encodeURIComponent(data.email)}`} 
                        data-editable="email"
                        style={applyStyleOverride(
                          { color: textPrimary, textDecoration: "none" },
                          getOverride(data, "email"),
                          data.fontSize
                        )}
                      >
                        {data.email}
                      </a>
                    </td>
                  )}
                  {data.phone && (
                    <td 
                      data-editable="phone"
                      style={applyStyleOverride(
                        {},
                        getOverride(data, "phone"),
                        data.fontSize
                      )}
                    >
                      {data.phone}
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        {data.socialLinks.length > 0 && (
          <tr>
            <td style={{ textAlign: "center", paddingTop: spacing.section }}>
              {renderSocialLinks(data.socialLinks, data, textSecondary, textPrimary, { marginLeft: "8px" })}
            </td>
          </tr>
        )}
        {data.logoUrl && (
          <tr>
            <td style={{ textAlign: "center", paddingTop: "16px" }}>
              <img src={validateUrl(data.logoUrl) || undefined} alt={data.company} style={{ maxHeight: "35px", maxWidth: getLogoMaxWidth(data, 100) }} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// Startup Fresh Template
function StartupFresh({ data, isDark = false }: { data: SignatureData; isDark?: boolean }) {
  const safeColor = sanitizeColor(data.primaryColor);
  
  const textPrimary = getEffectiveTextColor(data, isDark);
  const textSecondary = getEffectiveTextColor(data, isDark, "#a1a1aa", "#666666");
  const bgSecondary = isDark ? "#27272a" : "#f5f5f5";
  const spacing = getContentSpacing(data.contentPadding);
  
  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary, lineHeight: data.lineHeight ?? 1.4 }}>
      <tbody>
        <tr>
          <td style={{ paddingBottom: spacing.section }}>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {data.logoUrl && (
                    <td style={{ paddingRight: "12px", verticalAlign: "middle" }}>
                      <img src={validateUrl(data.logoUrl) || undefined} alt={data.company} style={{ maxHeight: "32px", maxWidth: getLogoMaxWidth(data, 100) }} />
                    </td>
                  )}
                  <td style={{ verticalAlign: "middle" }}>
                    <span 
                      data-editable="fullName"
                      style={applyStyleOverride(
                        { fontWeight: "bold", fontSize: `${data.fontSize + 1}px` },
                        getOverride(data, "fullName"),
                        data.fontSize + 1
                      )}
                    >
                      {data.fullName || "Your Name"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style={{ paddingBottom: spacing.section }}>
            <span 
              data-editable="jobTitle"
              style={applyStyleOverride(
                { 
                  display: "inline-block",
                  padding: "2px 8px",
                  backgroundColor: `${safeColor}20`,
                  color: safeColor,
                  borderRadius: "4px",
                  fontSize: `${data.fontSize - 1}px`,
                  fontWeight: "500"
                },
                getOverride(data, "jobTitle"),
                data.fontSize - 1
              )}
            >
              {data.jobTitle || "Job Title"}
            </span>
            <span style={{ color: textSecondary, marginLeft: "8px" }}>at </span>
            <span 
              data-editable="company"
              style={applyStyleOverride(
                { color: textSecondary },
                getOverride(data, "company"),
                data.fontSize
              )}
            >
              {data.company || "Company"}
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {data.email && (
                    <td style={{ paddingRight: "16px" }}>
                      <a 
                        href={`mailto:${encodeURIComponent(data.email)}`} 
                        data-editable="email"
                        style={applyStyleOverride(
                          { color: textPrimary, textDecoration: "none" },
                          getOverride(data, "email"),
                          data.fontSize
                        )}
                      >
                        📧 {data.email}
                      </a>
                    </td>
                  )}
                  {data.phone && (
                    <td 
                      data-editable="phone"
                      style={applyStyleOverride(
                        {},
                        getOverride(data, "phone"),
                        data.fontSize
                      )}
                    >
                      📞 {data.phone}
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        {data.socialLinks.length > 0 && (
          <tr>
            <td style={{ paddingTop: spacing.section }}>
              {renderSocialLinks(data.socialLinks, data, textSecondary, textPrimary, {
                padding: "4px 8px",
                backgroundColor: bgSecondary,
                borderRadius: "4px",
                fontSize: `${data.fontSize - 2}px`,
              })}
            </td>
          </tr>
        )}
        {data.calendarLink && validateUrl(data.calendarLink) && (
          <tr>
            <td style={{ paddingTop: "12px" }}>
              <a
                href={validateUrl(data.calendarLink)}
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  backgroundColor: safeColor,
                  color: "#ffffff",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                🗓️ Schedule a call
              </a>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// Compact Horizontal Template
function CompactHorizontal({ data, isDark = false }: { data: SignatureData; isDark?: boolean }) {
  const safeColor = sanitizeColor(data.primaryColor);
  const textPrimary = getEffectiveTextColor(data, isDark);
  const textSecondary = getEffectiveTextColor(data, isDark, "#a1a1aa", "#666666");
  const textMuted = isDark ? "#71717a" : "#999999";
  const spacing = getContentSpacing(data.contentPadding);
  const photo = getPhotoDimensions(data, 48);

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary, lineHeight: data.lineHeight ?? 1.4 }}>
      <tbody>
        <tr>
          {data.profilePhotoUrl && (
            <td style={{ paddingRight: "12px", verticalAlign: "middle" }}>
              <img
                src={validateUrl(data.profilePhotoUrl) || undefined}
                alt={data.fullName}
                style={{ ...photo, borderRadius: getPhotoRadius(data.photoShape), objectFit: "cover" }}
              />
            </td>
          )}
          <td style={{ verticalAlign: "middle", paddingRight: "16px", borderRight: getDividerBorder(data, safeColor, "right") }}>
            <span
              data-editable="fullName"
              style={applyStyleOverride(
                { fontWeight: "bold", fontSize: `${data.fontSize + 1}px`, whiteSpace: "nowrap" as const },
                getOverride(data, "fullName"),
                data.fontSize + 1
              )}
            >
              {data.fullName || "Your Name"}
            </span>
            <br />
            <span
              data-editable="jobTitle"
              style={applyStyleOverride(
                { color: textSecondary, fontSize: `${data.fontSize - 1}px`, whiteSpace: "nowrap" as const },
                getOverride(data, "jobTitle"),
                data.fontSize - 1
              )}
            >
              {data.jobTitle || "Job Title"}
            </span>
          </td>
          <td style={{ verticalAlign: "middle", paddingLeft: "16px" }}>
            <table cellPadding="0" cellSpacing="0" style={{ fontSize: `${data.fontSize - 1}px` }}>
              <tbody>
                {data.email && (
                  <tr>
                    <td style={{ paddingBottom: spacing.element }}>
                      <a
                        href={`mailto:${encodeURIComponent(data.email)}`}
                        data-editable="email"
                        style={applyStyleOverride(
                          { color: textPrimary, textDecoration: "none" },
                          getOverride(data, "email"),
                          data.fontSize - 1
                        )}
                      >
                        {data.email}
                      </a>
                    </td>
                  </tr>
                )}
                {data.phone && (
                  <tr>
                    <td
                      data-editable="phone"
                      style={applyStyleOverride(
                        { paddingBottom: spacing.element, color: textSecondary },
                        getOverride(data, "phone"),
                        data.fontSize - 1
                      )}
                    >
                      {data.phone}
                    </td>
                  </tr>
                )}
                {data.website && validateUrl(data.website) && (
                  <tr>
                    <td>
                      <a
                        href={validateUrl(data.website)}
                        data-editable="website"
                        style={applyStyleOverride(
                          { color: safeColor, textDecoration: "none" },
                          getOverride(data, "website"),
                          data.fontSize - 1
                        )}
                      >
                        {data.website.replace(/^https?:\/\//, "")}
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </td>
        </tr>
        {data.disclaimer && (
          <tr>
            <td
              colSpan={3}
              data-editable="disclaimer"
              style={applyStyleOverride(
                { paddingTop: "8px", fontSize: `${data.fontSize - 3}px`, color: textMuted },
                getOverride(data, "disclaimer"),
                data.fontSize - 3
              )}
            >
              {data.disclaimer}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// Modern Card Template
function ModernCard({ data, isDark = false }: { data: SignatureData; isDark?: boolean }) {
  const safeColor = sanitizeColor(data.primaryColor);
  const textPrimary = getEffectiveTextColor(data, isDark);
  const textSecondary = getEffectiveTextColor(data, isDark, "#a1a1aa", "#666666");
  const textMuted = isDark ? "#71717a" : "#999999";
  const cardBg = isDark ? "#1c1c1e" : "#f9fafb";
  const borderColor = isDark ? "#2c2c2e" : "#e5e7eb";
  const spacing = getContentSpacing(data.contentPadding);
  const photo = getPhotoDimensions(data, 72);

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary, lineHeight: data.lineHeight ?? 1.4 }}>
      <tbody>
        <tr>
          <td style={{
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "12px",
            padding: "20px",
            borderTop: getDividerBorder(data, safeColor),
          }}>
            <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
              <tbody>
                <tr>
                  {data.profilePhotoUrl && (
                    <td style={{ paddingRight: "16px", verticalAlign: "top" }}>
                      <img
                        src={validateUrl(data.profilePhotoUrl) || undefined}
                        alt={data.fullName}
                        style={{ ...photo, borderRadius: getPhotoRadius(data.photoShape === "circle" ? "rounded" : data.photoShape), objectFit: "cover" }}
                      />
                    </td>
                  )}
                  <td style={{ verticalAlign: "top" }}>
                    <span
                      data-editable="fullName"
                      style={applyStyleOverride(
                        { fontWeight: "bold", fontSize: `${data.fontSize + 2}px`, display: "block", paddingBottom: "2px" },
                        getOverride(data, "fullName"),
                        data.fontSize + 2
                      )}
                    >
                      {data.fullName || "Your Name"}
                    </span>
                    <span
                      data-editable="jobTitle"
                      style={applyStyleOverride(
                        { color: safeColor, fontWeight: "500", display: "block", paddingBottom: "2px" },
                        getOverride(data, "jobTitle"),
                        data.fontSize
                      )}
                    >
                      {data.jobTitle || "Job Title"}
                    </span>
                    <span
                      data-editable="company"
                      style={applyStyleOverride(
                        { color: textSecondary, display: "block", paddingBottom: spacing.section },
                        getOverride(data, "company"),
                        data.fontSize
                      )}
                    >
                      {data.company || "Company"}{data.department ? ` · ${data.department}` : ""}
                    </span>
                  </td>
                  {data.logoUrl && (
                    <td style={{ verticalAlign: "top", paddingLeft: "16px", textAlign: "right" }}>
                      <img src={validateUrl(data.logoUrl) || undefined} alt={data.company} style={{ maxHeight: "36px", maxWidth: getLogoMaxWidth(data, 100) }} />
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
            {/* Divider */}
            <div style={{ borderTop: getDividerBorder(data, borderColor), margin: `${spacing.section} 0` }} />
            {/* Contact row */}
            <table cellPadding="0" cellSpacing="0" style={{ fontSize: `${data.fontSize - 1}px` }}>
              <tbody>
                <tr>
                  {data.email && (
                    <td style={{ paddingRight: "16px" }}>
                      <a
                        href={`mailto:${encodeURIComponent(data.email)}`}
                        data-editable="email"
                        style={applyStyleOverride(
                          { color: textPrimary, textDecoration: "none" },
                          getOverride(data, "email"),
                          data.fontSize - 1
                        )}
                      >
                        {data.email}
                      </a>
                    </td>
                  )}
                  {data.phone && (
                    <td
                      data-editable="phone"
                      style={applyStyleOverride(
                        { paddingRight: "16px", color: textSecondary },
                        getOverride(data, "phone"),
                        data.fontSize - 1
                      )}
                    >
                      {data.phone}
                    </td>
                  )}
                  {data.website && validateUrl(data.website) && (
                    <td>
                      <a
                        href={validateUrl(data.website)}
                        data-editable="website"
                        style={applyStyleOverride(
                          { color: safeColor, textDecoration: "none" },
                          getOverride(data, "website"),
                          data.fontSize - 1
                        )}
                      >
                        {data.website.replace(/^https?:\/\//, "")}
                      </a>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
            {data.socialLinks.length > 0 && (
              <div style={{ paddingTop: spacing.section }}>
                {renderSocialLinks(data.socialLinks, data, safeColor, textPrimary, {
                  padding: "4px 8px",
                  backgroundColor: `${safeColor}15`,
                  borderRadius: "6px",
                })}
              </div>
            )}
          </td>
        </tr>
        {data.disclaimer && (
          <tr>
            <td
              data-editable="disclaimer"
              style={applyStyleOverride(
                { paddingTop: "12px", fontSize: `${data.fontSize - 3}px`, color: textMuted },
                getOverride(data, "disclaimer"),
                data.fontSize - 3
              )}
            >
              {data.disclaimer}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// Two Column Template
function TwoColumn({ data, isDark = false }: { data: SignatureData; isDark?: boolean }) {
  const safeColor = sanitizeColor(data.primaryColor);
  const textPrimary = getEffectiveTextColor(data, isDark);
  const textSecondary = getEffectiveTextColor(data, isDark, "#a1a1aa", "#666666");
  const textMuted = isDark ? "#71717a" : "#999999";
  const spacing = getContentSpacing(data.contentPadding);
  const photo = getPhotoDimensions(data, 80);

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary, lineHeight: data.lineHeight ?? 1.4 }}>
      <tbody>
        <tr>
          {/* Left column: identity */}
          <td style={{ verticalAlign: "top", paddingRight: "20px", borderRight: getDividerBorder(data, safeColor, "right"), minWidth: "160px" }}>
            {data.profilePhotoUrl && (
              <div style={{ paddingBottom: spacing.section }}>
                <img
                  src={validateUrl(data.profilePhotoUrl) || undefined}
                  alt={data.fullName}
                  style={{ ...photo, borderRadius: getPhotoRadius(data.photoShape), objectFit: "cover" }}
                />
              </div>
            )}
            <span
              data-editable="fullName"
              style={applyStyleOverride(
                { fontWeight: "bold", fontSize: `${data.fontSize + 2}px`, display: "block", paddingBottom: spacing.element },
                getOverride(data, "fullName"),
                data.fontSize + 2
              )}
            >
              {data.fullName || "Your Name"}
            </span>
            <span
              data-editable="jobTitle"
              style={applyStyleOverride(
                { color: safeColor, display: "block", paddingBottom: spacing.element, fontWeight: "500" },
                getOverride(data, "jobTitle"),
                data.fontSize
              )}
            >
              {data.jobTitle || "Job Title"}
            </span>
            <span
              data-editable="company"
              style={applyStyleOverride(
                { color: textSecondary, display: "block" },
                getOverride(data, "company"),
                data.fontSize
              )}
            >
              {data.company || "Company"}
            </span>
            {data.logoUrl && (
              <div style={{ paddingTop: spacing.section }}>
                <img src={validateUrl(data.logoUrl) || undefined} alt={data.company} style={{ maxHeight: "32px", maxWidth: getLogoMaxWidth(data, 100) }} />
              </div>
            )}
          </td>
          {/* Right column: contact + social */}
          <td style={{ verticalAlign: "top", paddingLeft: "20px" }}>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                {data.email && (
                  <tr>
                    <td style={{ paddingBottom: spacing.element }}>
                      <a
                        href={`mailto:${encodeURIComponent(data.email)}`}
                        data-editable="email"
                        style={applyStyleOverride(
                          { color: textPrimary, textDecoration: "none" },
                          getOverride(data, "email"),
                          data.fontSize
                        )}
                      >
                        ✉ {data.email}
                      </a>
                    </td>
                  </tr>
                )}
                {data.phone && (
                  <tr>
                    <td
                      data-editable="phone"
                      style={applyStyleOverride(
                        { paddingBottom: spacing.element, color: textSecondary },
                        getOverride(data, "phone"),
                        data.fontSize
                      )}
                    >
                      ☎ {data.phone}
                    </td>
                  </tr>
                )}
                {data.website && validateUrl(data.website) && (
                  <tr>
                    <td style={{ paddingBottom: spacing.element }}>
                      <a
                        href={validateUrl(data.website)}
                        data-editable="website"
                        style={applyStyleOverride(
                          { color: safeColor, textDecoration: "none" },
                          getOverride(data, "website"),
                          data.fontSize
                        )}
                      >
                        🌐 {data.website.replace(/^https?:\/\//, "")}
                      </a>
                    </td>
                  </tr>
                )}
                {(data.address || data.city) && (
                  <tr>
                    <td
                      data-editable="address"
                      style={applyStyleOverride(
                        { paddingBottom: spacing.element, color: textMuted, fontSize: `${data.fontSize - 1}px` },
                        getOverride(data, "address"),
                        data.fontSize - 1
                      )}
                    >
                      📍 {[data.address, data.city, data.state].filter(Boolean).join(", ")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {data.socialLinks.length > 0 && (
              <div style={{ paddingTop: spacing.section }}>
                {renderSocialLinks(data.socialLinks, data, safeColor, textPrimary)}
              </div>
            )}
            {data.calendarLink && validateUrl(data.calendarLink) && (
              <div style={{ paddingTop: "12px" }}>
                <a
                  href={validateUrl(data.calendarLink)}
                  style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    backgroundColor: safeColor,
                    color: "#ffffff",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: `${data.fontSize - 1}px`,
                    fontWeight: "500",
                  }}
                >
                  📅 Book a Meeting
                </a>
              </div>
            )}
          </td>
        </tr>
        {data.disclaimer && (
          <tr>
            <td
              colSpan={2}
              data-editable="disclaimer"
              style={applyStyleOverride(
                { paddingTop: "14px", fontSize: `${data.fontSize - 3}px`, color: textMuted },
                getOverride(data, "disclaimer"),
                data.fontSize - 3
              )}
            >
              {data.disclaimer}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// Banner CTA Template
function BannerCTA({ data, isDark = false }: { data: SignatureData; isDark?: boolean }) {
  const safeColor = sanitizeColor(data.primaryColor);
  const textPrimary = getEffectiveTextColor(data, isDark);
  const textSecondary = getEffectiveTextColor(data, isDark, "#a1a1aa", "#666666");
  const textMuted = isDark ? "#71717a" : "#999999";
  const spacing = getContentSpacing(data.contentPadding);
  const photo = getPhotoDimensions(data, 64);

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary, lineHeight: data.lineHeight ?? 1.4, maxWidth: "500px" }}>
      <tbody>
        {/* Banner */}
        {data.bannerUrl && validateUrl(data.bannerUrl) && (
          <tr>
            <td style={{ paddingBottom: spacing.section }}>
              {data.bannerLink && validateUrl(data.bannerLink) ? (
                <a href={validateUrl(data.bannerLink)} style={{ textDecoration: "none" }}>
                  <img
                    src={validateUrl(data.bannerUrl) || undefined}
                    alt="Banner"
                    style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "8px", display: "block" }}
                  />
                </a>
              ) : (
                <img
                  src={validateUrl(data.bannerUrl) || undefined}
                  alt="Banner"
                  style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "8px", display: "block" }}
                />
              )}
            </td>
          </tr>
        )}
        {/* Identity row */}
        <tr>
          <td>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {data.profilePhotoUrl && (
                    <td style={{ paddingRight: "14px", verticalAlign: "top" }}>
                      <img
                        src={validateUrl(data.profilePhotoUrl) || undefined}
                        alt={data.fullName}
                        style={{ ...photo, borderRadius: getPhotoRadius(data.photoShape), objectFit: "cover", border: getDividerBorder(data, safeColor) }}
                      />
                    </td>
                  )}
                  <td style={{ verticalAlign: "top" }}>
                    <span
                      data-editable="fullName"
                      style={applyStyleOverride(
                        { fontWeight: "bold", fontSize: `${data.fontSize + 2}px`, display: "block", paddingBottom: "2px" },
                        getOverride(data, "fullName"),
                        data.fontSize + 2
                      )}
                    >
                      {data.fullName || "Your Name"}
                    </span>
                    <span
                      data-editable="jobTitle"
                      style={applyStyleOverride(
                        { color: textSecondary, display: "block", paddingBottom: "2px" },
                        getOverride(data, "jobTitle"),
                        data.fontSize
                      )}
                    >
                      {data.jobTitle || "Job Title"}
                    </span>
                    <span
                      data-editable="company"
                      style={applyStyleOverride(
                        { color: safeColor, fontWeight: "500", display: "block" },
                        getOverride(data, "company"),
                        data.fontSize
                      )}
                    >
                      {data.company || "Company"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        {/* Contact + CTA */}
        <tr>
          <td style={{ paddingTop: spacing.section }}>
            <table cellPadding="0" cellSpacing="0" style={{ fontSize: `${data.fontSize - 1}px` }}>
              <tbody>
                <tr>
                  {data.email && (
                    <td style={{ paddingRight: "16px" }}>
                      <a
                        href={`mailto:${encodeURIComponent(data.email)}`}
                        data-editable="email"
                        style={applyStyleOverride(
                          { color: textPrimary, textDecoration: "none" },
                          getOverride(data, "email"),
                          data.fontSize - 1
                        )}
                      >
                        {data.email}
                      </a>
                    </td>
                  )}
                  {data.phone && (
                    <td
                      data-editable="phone"
                      style={applyStyleOverride(
                        { color: textSecondary },
                        getOverride(data, "phone"),
                        data.fontSize - 1
                      )}
                    >
                      {data.phone}
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        {/* CTA Button */}
        {data.calendarLink && validateUrl(data.calendarLink) && (
          <tr>
            <td style={{ paddingTop: "12px" }}>
              <a
                href={validateUrl(data.calendarLink)}
                style={{
                  display: "inline-block",
                  padding: "10px 24px",
                  backgroundColor: safeColor,
                  color: "#ffffff",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: `${data.fontSize}px`,
                }}
              >
                📅 Schedule a Call
              </a>
            </td>
          </tr>
        )}
        {data.socialLinks.length > 0 && (
          <tr>
            <td style={{ paddingTop: spacing.section }}>
              {renderSocialLinks(data.socialLinks, data, textSecondary, textPrimary)}
            </td>
          </tr>
        )}
        {data.disclaimer && (
          <tr>
            <td
              data-editable="disclaimer"
              style={applyStyleOverride(
                { paddingTop: "14px", fontSize: `${data.fontSize - 3}px`, color: textMuted },
                getOverride(data, "disclaimer"),
                data.fontSize - 3
              )}
            >
              {data.disclaimer}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export function SignaturePreview({ data, templateId, previewTheme = "light" }: SignaturePreviewProps) {
  const isDark = previewTheme === "dark";
  
  const renderTemplate = () => {
    switch (templateId) {
      case "professional-classic":
        return <ProfessionalClassic data={data} isDark={isDark} />;
      case "minimal-modern":
        return <MinimalModern data={data} isDark={isDark} />;
      case "corporate-bold":
        return <CorporateBold data={data} isDark={isDark} />;
      case "creative-gradient":
        return <CreativeGradient data={data} isDark={isDark} />;
      case "executive-elegant":
        return <ExecutiveElegant data={data} isDark={isDark} />;
      case "startup-fresh":
        return <StartupFresh data={data} isDark={isDark} />;
      case "compact-horizontal":
        return <CompactHorizontal data={data} isDark={isDark} />;
      case "modern-card":
        return <ModernCard data={data} isDark={isDark} />;
      case "two-column":
        return <TwoColumn data={data} isDark={isDark} />;
      case "banner-cta":
        return <BannerCTA data={data} isDark={isDark} />;
      default:
        return <ProfessionalClassic data={data} isDark={isDark} />;
    }
  };

  return (
    <div 
      id="signature-preview" 
      data-signature-container="true"
      className={`p-6 rounded-lg transition-colors ${
        isDark ? "bg-zinc-900" : "bg-white"
      }`}
      style={{ minHeight: "200px" }}
    >
      {renderTemplate()}
      
      {/* GIF Banner */}
      {data.gifBannerUrl && validateUrl(data.gifBannerUrl) && (
        <div style={{ marginTop: "16px", borderRadius: "8px", overflow: "hidden" }}>
          <img
            src={validateUrl(data.gifBannerUrl) || undefined}
            alt="Signature GIF"
            style={{ 
              maxWidth: "100%", 
              maxHeight: "150px", 
              display: "block",
              borderRadius: "8px"
            }}
          />
        </div>
      )}
    </div>
  );
}

// Platform label map for email-safe export (SVGs are stripped by most email clients)
const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "𝕏",
  facebook: "Facebook",
  instagram: "Instagram",
  github: "GitHub",
  youtube: "YouTube",
  tiktok: "TikTok",
  website: "Web",
};

// Detect platform from a social link URL
function detectPlatformFromUrl(url: string): string | null {
  const lower = url.toLowerCase();
  if (lower.includes("linkedin.com")) return "linkedin";
  if (lower.includes("twitter.com") || lower.includes("x.com")) return "twitter";
  if (lower.includes("facebook.com")) return "facebook";
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("github.com")) return "github";
  if (lower.includes("youtube.com")) return "youtube";
  if (lower.includes("tiktok.com")) return "tiktok";
  return null;
}

// Export function to generate HTML string for copying
export function generateSignatureHTML(data: SignatureData, templateId: TemplateId): string {
  // Use specific attribute selector to prevent DOM clobbering attacks
  const container = document.querySelector('#signature-preview[data-signature-container="true"]');
  if (!container) return "";
  
  // Clone and clean up the HTML
  const clone = container.cloneNode(true) as HTMLElement;
  
  // Replace SVG icons with email-safe text labels
  // Email clients (Gmail, Outlook) strip <svg> tags entirely
  const allLinks = clone.querySelectorAll("a");
  allLinks.forEach((link) => {
    const svg = link.querySelector("svg");
    if (!svg) return;
    
    // Detect platform from href
    const href = link.getAttribute("href") || "";
    const platform = detectPlatformFromUrl(href);
    const label = platform ? PLATFORM_LABELS[platform] : PLATFORM_LABELS["website"];
    
    // Replace SVG with a styled text span
    const textNode = document.createElement("span");
    textNode.textContent = label || "Link";
    textNode.setAttribute("style", "font-size: 12px; font-weight: 500;");
    svg.replaceWith(textNode);
  });
  
  // Remove React-specific attributes and class (Tailwind) attributes
  const elements = clone.querySelectorAll("*");
  elements.forEach((el) => {
    const attrs = el.attributes;
    for (let i = attrs.length - 1; i >= 0; i--) {
      const attr = attrs[i];
      if (attr.name.startsWith("data-") || attr.name === "class") {
        el.removeAttribute(attr.name);
      }
    }
  });
  
  return clone.innerHTML;
}
