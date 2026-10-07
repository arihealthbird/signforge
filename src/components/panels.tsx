"use client";

import { useMemo, useState } from "react";
import {
  COLOR_THEMES,
  FONT_CATEGORIES,
  FONT_OPTIONS,
  SOCIAL_PLATFORMS,
  SignatureData,
  SocialLink,
} from "@/types/signature";
import {
  SIGNATURE_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type TemplateCategory,
  type TemplateId,
} from "@/lib/templates";
import { generateSignatureHTML } from "@/lib/signature-html";
import { validateUrl } from "@/lib/security";
import {
  Button,
  PanelSection,
  Segmented,
  Switch,
  TextArea,
  TextField,
  cn,
  selectClass,
} from "@/components/ui";
import { Icon } from "@/components/icons";
import { SignatureHtml } from "@/components/signature-html";
import { giphyEnabled } from "@/components/giphy";

type Patch = (patch: Partial<SignatureData>) => void;

/* ── Design ───────────────────────────────────────────────────────────── */

function TemplateThumb({
  data,
  id,
  name,
  description,
  active,
  onSelect,
}: {
  data: SignatureData;
  id: TemplateId;
  name: string;
  description: string;
  active: boolean;
  onSelect: () => void;
}) {
  const html = useMemo(
    () => generateSignatureHTML(data, id, { preserveFontVars: true }),
    [data, id]
  );
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      title={description}
      className={cn(
        "group relative overflow-hidden border-2 bg-paper text-left transition-[border-color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40",
        active
          ? "pixel-neon-xs border-ink"
          : "border-line hover:-translate-x-px hover:-translate-y-px hover:border-ink"
      )}
    >
      {/* Always a white card: a signature is designed for a light inbox. */}
      <div className="pointer-events-none h-[104px] overflow-hidden bg-white px-3 pt-3" aria-hidden>
        <SignatureHtml
          html={html}
          style={{ width: "300%", transform: "scale(0.3333)", transformOrigin: "top left" }}
        />
      </div>
      <div className="border-t border-line px-3 py-2 text-[12px] font-semibold text-ink">{name}</div>
      {active ? (
        <span className="absolute right-2 top-2 flex size-5 items-center justify-center border border-ink bg-neon text-neon-ink">
          <Icon name="check" size="xs" />
        </span>
      ) : null}
    </button>
  );
}

export function DesignPanel({
  data,
  templateId,
  onChange,
  onTemplateChange,
}: {
  data: SignatureData;
  templateId: TemplateId;
  onChange: Patch;
  onTemplateChange: (id: TemplateId) => void;
}) {
  const [category, setCategory] = useState<"all" | TemplateCategory>("all");
  const sections = TEMPLATE_CATEGORIES.map((group) => ({
    ...group,
    templates: SIGNATURE_TEMPLATES.filter((template) => template.category === group.id),
  })).filter((group) => category === "all" || group.id === category);
  return (
    <div className="space-y-8 p-5">
      <PanelSection
        index={1}
        title="Template"
        hint="Live previews with your details. Tap one to switch."
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
            className={cn(
              "shrink-0 border px-2.5 py-1.5 text-[11px] font-semibold transition-colors",
              category === "all" ? "border-ink bg-ink text-paper" : "border-line bg-paper text-muted hover:text-ink"
            )}
          >
            All {SIGNATURE_TEMPLATES.length}
          </button>
          {TEMPLATE_CATEGORIES.map((group) => {
            const count = SIGNATURE_TEMPLATES.filter((template) => template.category === group.id).length;
            return (
              <button
                key={group.id}
                type="button"
                aria-pressed={category === group.id}
                onClick={() => setCategory(group.id)}
                className={cn(
                  "shrink-0 border px-2.5 py-1.5 text-[11px] font-semibold transition-colors",
                  category === group.id
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-muted hover:text-ink"
                )}
              >
                {group.label} {count}
              </button>
            );
          })}
        </div>
        <div className="space-y-5">
          {sections.map((section) => (
            <section key={section.id}>
              <div className="mono-label-xs mb-2 flex items-center justify-between text-muted/80">
                <span>{section.label}</span>
                <span>{section.templates.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {section.templates.map((template) => (
                  <TemplateThumb
                    key={template.id}
                    data={data}
                    id={template.id}
                    name={template.name}
                    description={template.description}
                    active={template.id === templateId}
                    onSelect={() => onTemplateChange(template.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </PanelSection>

      <PanelSection index={2} title="Color">
        <div className="flex flex-wrap gap-2.5">
          {COLOR_THEMES.map((c) => {
            const active = data.primaryColor.toLowerCase() === c.primaryColor.toLowerCase();
            return (
              <button
                key={c.id}
                type="button"
                title={c.name}
                aria-label={c.name}
                aria-pressed={active}
                onClick={() => onChange({ primaryColor: c.primaryColor, secondaryColor: c.secondaryColor })}
                style={{ backgroundColor: c.primaryColor }}
                className={cn(
                  "size-8 border border-ink/25 transition-transform hover:-translate-x-px hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40",
                  active && "outline outline-2 outline-offset-2 outline-ink"
                )}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ColorInput
            label="Main"
            value={data.primaryColor}
            onChange={(v) => onChange({ primaryColor: v })}
          />
          <ColorInput
            label="Accent line"
            value={data.secondaryColor ?? data.primaryColor}
            onChange={(v) => onChange({ secondaryColor: v })}
          />
        </div>
      </PanelSection>

      <PanelSection
        index={3}
        title="Typography"
        hint="Email apps use the font if it's installed, otherwise a safe fallback."
      >
        {FONT_CATEGORIES.map((cat) => (
          <div key={cat.id}>
            <div className="mono-label-xs mb-1.5 text-muted/80">{cat.label}</div>
            <div className="grid grid-cols-3 gap-2">
              {FONT_OPTIONS.filter((f) => f.category === cat.id).map((f) => {
                const active = data.fontFamily === f.value;
                return (
                  <button
                    key={f.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onChange({ fontFamily: f.value })}
                    className={cn(
                      "flex h-[54px] flex-col items-center justify-center border-2 px-1 transition-[border-color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40",
                      active
                        ? "pixel-neon-xs border-ink bg-paper"
                        : "border-line bg-paper hover:-translate-x-px hover:-translate-y-px hover:border-ink"
                    )}
                  >
                    <span className="text-lg leading-none text-ink" style={{ fontFamily: f.value }}>
                      Aa
                    </span>
                    <span className="mt-1 max-w-full truncate text-[10px] text-muted">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <label className="flex flex-col gap-2 pt-1">
          <span className="flex items-center justify-between text-xs font-medium text-muted">
            Text size
            <span className="font-mono text-ink">{data.fontSize}px</span>
          </span>
          <input
            type="range"
            min={10}
            max={18}
            step={1}
            value={data.fontSize}
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            className="w-full accent-ink"
          />
        </label>
      </PanelSection>

      <PanelSection
        index={4}
        title="Layout"
        hint="Spacing and divider apply to every design. A few minimal designs show a photo but never initials."
      >
        <Row label="Divider">
          <Segmented
            value={data.dividerStyle ?? "solid"}
            onChange={(v) => onChange({ dividerStyle: v })}
            ariaLabel="Divider style"
            options={[
              { value: "solid", label: "Solid" },
              { value: "dashed", label: "Dashed" },
              { value: "dotted", label: "Dotted" },
              { value: "none", label: "None" },
            ]}
          />
        </Row>
        <Row label="Photo shape">
          <Segmented
            value={data.photoShape ?? "circle"}
            onChange={(v) => onChange({ photoShape: v })}
            ariaLabel="Photo shape"
            options={[
              { value: "circle", label: "Circle" },
              { value: "rounded", label: "Rounded" },
              { value: "square", label: "Square" },
            ]}
          />
        </Row>
        <Row label="Spacing">
          <Segmented
            value={data.contentPadding ?? "normal"}
            onChange={(v) => onChange({ contentPadding: v })}
            ariaLabel="Spacing"
            options={[
              { value: "compact", label: "Tight" },
              { value: "normal", label: "Normal" },
              { value: "relaxed", label: "Airy" },
            ]}
          />
        </Row>
        <Switch
          checked={data.showMonogram !== false}
          onChange={(v) => onChange({ showMonogram: v })}
          label="Show your initials when there's no photo"
        />
      </PanelSection>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-muted">{label}</div>
      {children}
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-3 border border-line bg-paper-soft p-2 pr-3 text-xs font-medium text-muted">
      <span className="relative size-8 shrink-0 overflow-hidden border border-ink/25">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute -inset-2 h-12 w-12 cursor-pointer border-0 bg-transparent p-0"
        />
      </span>
      <span className="min-w-0">
        <span className="block">{label}</span>
        <span className="block font-mono text-[11px] uppercase text-ink">{value}</span>
      </span>
    </label>
  );
}

/* ── Details ──────────────────────────────────────────────────────────── */

export function DetailsPanel({
  data,
  onChange,
  onSocialLinksChange,
}: {
  data: SignatureData;
  onChange: Patch;
  onSocialLinksChange: (links: SocialLink[]) => void;
}) {
  return (
    <div className="space-y-8 p-5">
      <PanelSection index={1} title="You">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField label="Full name" value={data.fullName} onChange={(e) => onChange({ fullName: e.target.value })} />
          <TextField label="Job title" value={data.jobTitle} onChange={(e) => onChange({ jobTitle: e.target.value })} />
          <TextField label="Company" value={data.company} onChange={(e) => onChange({ company: e.target.value })} />
          <TextField label="Department" value={data.department ?? ""} onChange={(e) => onChange({ department: e.target.value })} />
        </div>
      </PanelSection>

      <PanelSection index={2} title="Contact">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField label="Email" type="email" value={data.email} onChange={(e) => onChange({ email: e.target.value })} />
          <TextField label="Phone" value={data.phone ?? ""} onChange={(e) => onChange({ phone: e.target.value })} />
          <TextField className="sm:col-span-2" label="Website" placeholder="yourcompany.com" value={data.website ?? ""} onChange={(e) => onChange({ website: e.target.value })} />
        </div>
      </PanelSection>

      <PanelSection index={3} title="Social links">
        <div className="space-y-2">
          {data.socialLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="relative w-[7.5rem] shrink-0">
                <select
                  aria-label="Platform"
                  className={selectClass}
                  value={link.platform}
                  onChange={(e) => {
                    const next = [...data.socialLinks];
                    next[i] = { ...next[i], platform: e.target.value as SocialLink["platform"] };
                    onSocialLinksChange(next);
                  }}
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  size="sm"
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
              <TextField
                aria-label="Link URL"
                placeholder="https://"
                className="min-w-0 flex-1"
                value={link.url}
                onChange={(e) => {
                  const next = [...data.socialLinks];
                  next[i] = { ...next[i], url: e.target.value };
                  onSocialLinksChange(next);
                }}
              />
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Remove link"
                onClick={() => onSocialLinksChange(data.socialLinks.filter((_, idx) => idx !== i))}
              >
                <Icon name="x" size="sm" />
              </Button>
            </div>
          ))}
          {data.socialLinks.length < 8 ? (
            <Button
              variant="soft"
              size="sm"
              onClick={() => onSocialLinksChange([...data.socialLinks, { platform: "linkedin", url: "" }])}
            >
              <Icon name="plus" size="sm" />
              Add link
            </Button>
          ) : null}
        </div>
      </PanelSection>

      <PanelSection index={4} title="Address" hint="Optional.">
        <div className="grid grid-cols-2 gap-3">
          <TextField className="col-span-2" label="Street" value={data.address ?? ""} onChange={(e) => onChange({ address: e.target.value })} />
          <TextField label="City" value={data.city ?? ""} onChange={(e) => onChange({ city: e.target.value })} />
          <TextField label="State" value={data.state ?? ""} onChange={(e) => onChange({ state: e.target.value })} />
          <TextField label="ZIP" value={data.zipCode ?? ""} onChange={(e) => onChange({ zipCode: e.target.value })} />
          <TextField label="Country" value={data.country ?? ""} onChange={(e) => onChange({ country: e.target.value })} />
        </div>
      </PanelSection>

      <PanelSection
        index={5}
        title="Images"
        hint="Paste a public https link. Email apps load images from the web, so they can't be uploaded here. Square images look best."
      >
        <div className="grid gap-3">
          <TextField label="Profile photo URL" placeholder="https://…/headshot.jpg" value={data.profilePhotoUrl ?? ""} onChange={(e) => onChange({ profilePhotoUrl: e.target.value })} />
          <TextField label="Logo URL" placeholder="https://…/logo.png" value={data.logoUrl ?? ""} onChange={(e) => onChange({ logoUrl: e.target.value })} />
        </div>
      </PanelSection>
    </div>
  );
}

/* ── Extras ───────────────────────────────────────────────────────────── */

export function ExtrasPanel({
  data,
  onChange,
  onOpenGifPicker,
}: {
  data: SignatureData;
  onChange: Patch;
  onOpenGifPicker: () => void;
}) {
  const gifSrc = validateUrl(data.gifBannerUrl);

  return (
    <div className="space-y-8 p-5">
      <PanelSection
        index={1}
        title="Animated GIF"
        hint="A looping banner under your signature. Outlook for Windows shows only the first frame."
      >
        {gifSrc ? (
          <div className="border border-line bg-paper-soft p-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gifSrc} alt="Your GIF banner" className="mx-auto max-h-44" />
            <div className="mt-2.5 flex gap-2">
              {giphyEnabled ? (
                <Button variant="soft" size="sm" onClick={onOpenGifPicker}>
                  <Icon name="sparkles" size="xs" />
                  Change GIF
                </Button>
              ) : null}
              <Button variant="ghost" size="sm" onClick={() => onChange({ gifBannerUrl: "" })}>
                Remove
              </Button>
            </div>
          </div>
        ) : giphyEnabled ? (
          <Button variant="outline" size="lg" className="w-full" onClick={onOpenGifPicker}>
            <Icon name="sparkles" size="sm" />
            Browse GIFs
          </Button>
        ) : null}
        <TextField
          label={giphyEnabled ? "Or paste a GIF URL" : "GIF URL"}
          placeholder="https://media.giphy.com/…/giphy.gif"
          value={data.gifBannerUrl ?? ""}
          onChange={(e) => onChange({ gifBannerUrl: e.target.value })}
        />
      </PanelSection>

      <PanelSection index={2} title="Banner image" hint="A static promo image. If you also add a GIF, the GIF is shown.">
        <div className="grid gap-3">
          <TextField label="Image URL" placeholder="https://…/banner.png" value={data.bannerUrl ?? ""} onChange={(e) => onChange({ bannerUrl: e.target.value })} />
          <TextField label="Where it links" placeholder="https://yourcompany.com/launch" value={data.bannerLink ?? ""} onChange={(e) => onChange({ bannerLink: e.target.value })} />
        </div>
      </PanelSection>

      <PanelSection index={3} title="Booking button" hint="Adds a booking button to your signature.">
        <TextField label="Calendar link" placeholder="https://cal.com/you" value={data.calendarLink ?? ""} onChange={(e) => onChange({ calendarLink: e.target.value })} />
      </PanelSection>

      <PanelSection index={4} title="Disclaimer">
        <TextArea
          placeholder="Optional confidentiality note shown in small print"
          value={data.disclaimer ?? ""}
          onChange={(e) => onChange({ disclaimer: e.target.value })}
        />
      </PanelSection>
    </div>
  );
}
