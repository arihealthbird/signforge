"use client";

import { SignatureData, EditableElement, ElementStyleOverride } from "@/types/signature";
import { TemplateId } from "@/lib/templates";
import { escapeHtml, validateUrl, sanitizeColor } from "@/lib/security";
import { Linkedin, Twitter, Facebook, Instagram, Github, Youtube, Globe, Phone, Mail, Calendar, MapPin } from "lucide-react";
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
  
  const textPrimary = isDark ? "#f4f4f5" : "#333333";
  const textSecondary = isDark ? "#a1a1aa" : "#666666";
  const textMuted = isDark ? "#71717a" : "#999999";

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary }}>
      <tbody>
        <tr>
          {data.profilePhotoUrl && (
            <td style={{ paddingRight: "16px", verticalAlign: "top" }}>
              <img
                src={validateUrl(data.profilePhotoUrl) || undefined}
                alt={data.fullName}
                style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
              />
            </td>
          )}
          <td style={{ verticalAlign: "top", borderLeft: `3px solid ${safeColor}`, paddingLeft: "16px" }}>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={{ paddingBottom: "4px" }}>
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
                      { paddingBottom: "8px", color: textSecondary },
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
                      { fontWeight: "bold", color: textPrimary, paddingBottom: "8px" },
                      getOverride(data, "company"),
                      data.fontSize
                    )}
                  >
                    {data.company || "Company Name"}
                  </td>
                </tr>
                {data.email && (
                  <tr>
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
                {hasAddress && (
                  <tr>
                    <td 
                      data-editable="address"
                      style={applyStyleOverride(
                        { paddingTop: "4px", color: textSecondary, fontSize: `${data.fontSize - 1}px` },
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
                    <td style={{ paddingTop: "12px" }}>
                      {data.socialLinks.map((link, i) => {
                        const safeUrl = validateUrl(link.url);
                        if (!safeUrl) return null;
                        return (
                          <a
                            key={i}
                            href={safeUrl}
                            style={{
                              display: "inline-block",
                              marginRight: "8px",
                              color: safeColor,
                              textDecoration: "none",
                            }}
                          >
                            <SocialIcon platform={link.platform} />
                          </a>
                        );
                      })}
                    </td>
                  </tr>
                )}
                {data.logoUrl && (
                  <tr>
                    <td style={{ paddingTop: "12px" }}>
                      <img src={validateUrl(data.logoUrl) || undefined} alt={data.company} style={{ maxHeight: "40px", maxWidth: "120px" }} />
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
  
  const textPrimary = isDark ? "#f4f4f5" : "#333333";
  const textSecondary = isDark ? "#a1a1aa" : "#666666";
  const textMuted = isDark ? "#71717a" : "#999999";
  
  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary }}>
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
          <td style={{ paddingTop: "4px", paddingBottom: "8px", borderBottom: `2px solid ${safeColor}` }}>
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
          <td style={{ paddingTop: "8px" }}>
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
            <td style={{ paddingTop: "8px" }}>
              {data.socialLinks.map((link, i) => {
                const safeUrl = validateUrl(link.url);
                if (!safeUrl) return null;
                return (
                  <a
                    key={i}
                    href={safeUrl}
                    style={{
                      display: "inline-block",
                      marginRight: "12px",
                      color: textSecondary,
                      textDecoration: "none",
                    }}
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                );
              })}
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
  
  const textPrimary = isDark ? "#f4f4f5" : "#333333";
  const textBold = isDark ? "#fafafa" : "#1a1a1a";
  const textSecondary = isDark ? "#a1a1aa" : "#666666";
  
  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary }}>
      <tbody>
        <tr>
          {data.logoUrl && (
            <td style={{ paddingRight: "20px", verticalAlign: "middle", borderRight: `2px solid ${safeColor}` }}>
              <img src={validateUrl(data.logoUrl) || undefined} alt={data.company} style={{ maxHeight: "60px", maxWidth: "150px" }} />
            </td>
          )}
          <td style={{ paddingLeft: data.logoUrl ? "20px" : "0", verticalAlign: "top" }}>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={{ paddingBottom: "2px" }}>
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
                      { paddingBottom: "4px", color: safeColor, fontWeight: "600", textTransform: "uppercase", fontSize: `${data.fontSize - 1}px`, letterSpacing: "0.5px" },
                      getOverride(data, "jobTitle"),
                      data.fontSize - 1
                    )}
                  >
                    {data.jobTitle || "Job Title"}
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingBottom: "8px" }}>
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
            <td colSpan={2} style={{ paddingTop: "12px" }}>
              {data.socialLinks.map((link, i) => {
                const safeUrl = validateUrl(link.url);
                if (!safeUrl) return null;
                return (
                  <a
                    key={i}
                    href={safeUrl}
                    style={{
                      display: "inline-block",
                      marginRight: "10px",
                      padding: "6px",
                      backgroundColor: safeColor,
                      borderRadius: "4px",
                      color: "#ffffff",
                      textDecoration: "none",
                    }}
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                );
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
  
  const textPrimary = isDark ? "#f4f4f5" : "#333333";
  const textBold = isDark ? "#fafafa" : "#1a1a1a";
  const bgGradient = isDark 
    ? `linear-gradient(135deg, ${safeColor}20, ${safeColor}10)` 
    : `linear-gradient(135deg, ${safeColor}15, ${safeColor}05)`;
  
  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary }}>
      <tbody>
        <tr>
          <td style={{ 
            background: bgGradient,
            padding: "16px",
            borderRadius: "8px",
            borderLeft: `4px solid ${safeColor}`
          }}>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {data.profilePhotoUrl && (
                    <td style={{ paddingRight: "16px", verticalAlign: "top" }}>
                      <img
                        src={validateUrl(data.profilePhotoUrl) || undefined}
                        alt={data.fullName}
                        style={{ width: "70px", height: "70px", borderRadius: "12px", objectFit: "cover" }}
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
                          <td style={{ paddingBottom: "8px" }}>
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
                            <td style={{ paddingTop: "4px" }}>
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
            <td style={{ paddingTop: "8px" }}>
              {data.socialLinks.map((link, i) => {
                const safeUrl = validateUrl(link.url);
                if (!safeUrl) return null;
                return (
                  <a
                    key={i}
                    href={safeUrl}
                    style={{
                      display: "inline-block",
                      marginRight: "8px",
                      color: safeColor,
                      textDecoration: "none",
                    }}
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                );
              })}
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
  
  const textPrimary = isDark ? "#f4f4f5" : "#333333";
  const textBold = isDark ? "#fafafa" : "#1a1a1a";
  const textSecondary = isDark ? "#a1a1aa" : "#666666";
  
  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary }}>
      <tbody>
        <tr>
          <td style={{ textAlign: "center", paddingBottom: "12px" }}>
            {data.profilePhotoUrl && (
              <img
                src={validateUrl(data.profilePhotoUrl) || undefined}
                alt={data.fullName}
                style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: `3px solid ${safeColor}` }}
              />
            )}
          </td>
        </tr>
        <tr>
          <td style={{ textAlign: "center", paddingBottom: "4px" }}>
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
          <td style={{ textAlign: "center", paddingBottom: "8px" }}>
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
          <td style={{ textAlign: "center", paddingBottom: "12px" }}>
            <div style={{ width: "60px", height: "2px", backgroundColor: safeColor, margin: "0 auto" }} />
          </td>
        </tr>
        <tr>
          <td 
            data-editable="company"
            style={applyStyleOverride(
              { textAlign: "center", fontWeight: "500", paddingBottom: "12px" },
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
            <td style={{ textAlign: "center", paddingTop: "12px" }}>
              {data.socialLinks.map((link, i) => {
                const safeUrl = validateUrl(link.url);
                if (!safeUrl) return null;
                return (
                  <a
                    key={i}
                    href={safeUrl}
                    style={{
                      display: "inline-block",
                      marginLeft: "8px",
                      marginRight: "8px",
                      color: textSecondary,
                      textDecoration: "none",
                    }}
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                );
              })}
            </td>
          </tr>
        )}
        {data.logoUrl && (
          <tr>
            <td style={{ textAlign: "center", paddingTop: "16px" }}>
              <img src={validateUrl(data.logoUrl) || undefined} alt={data.company} style={{ maxHeight: "35px", maxWidth: "100px" }} />
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
  
  const textPrimary = isDark ? "#f4f4f5" : "#333333";
  const textSecondary = isDark ? "#a1a1aa" : "#666666";
  const bgSecondary = isDark ? "#27272a" : "#f5f5f5";
  
  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily: data.fontFamily, fontSize: `${data.fontSize}px`, color: textPrimary }}>
      <tbody>
        <tr>
          <td style={{ paddingBottom: "8px" }}>
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {data.logoUrl && (
                    <td style={{ paddingRight: "12px", verticalAlign: "middle" }}>
                      <img src={validateUrl(data.logoUrl) || undefined} alt={data.company} style={{ maxHeight: "32px", maxWidth: "100px" }} />
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
          <td style={{ paddingBottom: "12px" }}>
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
            <td style={{ paddingTop: "10px" }}>
              {data.socialLinks.map((link, i) => {
                const safeUrl = validateUrl(link.url);
                if (!safeUrl) return null;
                return (
                  <a
                    key={i}
                    href={safeUrl}
                    style={{
                      display: "inline-block",
                      marginRight: "6px",
                      padding: "4px 8px",
                      backgroundColor: bgSecondary,
                      borderRadius: "4px",
                      color: textSecondary,
                      textDecoration: "none",
                      fontSize: `${data.fontSize - 2}px`,
                    }}
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                );
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
      default:
        return <ProfessionalClassic data={data} isDark={isDark} />;
    }
  };

  return (
    <div 
      id="signature-preview" 
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

// Export function to generate HTML string for copying
export function generateSignatureHTML(data: SignatureData, templateId: TemplateId): string {
  const container = document.getElementById("signature-preview");
  if (!container) return "";
  
  // Clone and clean up the HTML
  const clone = container.cloneNode(true) as HTMLElement;
  
  // Remove any React-specific attributes
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
