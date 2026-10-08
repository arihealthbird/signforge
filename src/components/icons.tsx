import type { CSSProperties } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clapperboard,
  ClipboardCheck,
  Code2,
  Copy,
  Download,
  Drama,
  Github,
  Hand,
  Handshake,
  Info,
  LayoutTemplate,
  Link2,
  Loader2,
  Lock,
  Mail,
  MessageSquareText,
  Mic,
  Monitor,
  Moon,
  Orbit,
  Palette,
  PartyPopper,
  Paperclip,
  Plus,
  RotateCcw,
  Rocket,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Ship,
  Shuffle,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Sprout,
  Stethoscope,
  Sun,
  Type,
  UserRound,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react";
import { PICTOGRAMS, isPictogramName, type PictogramName } from "@/lib/pictograms";
import { isBright } from "@/lib/color";
import { cn } from "@/lib/cn";

/**
 * The icon system.
 *
 * Lucide is the base: the same family theovex.com uses, ISC licensed. Every
 * icon in the UI goes through this registry by a semantic name
 * (`<Icon name="copy" />`), with one fixed stroke and a short list of sizes, so
 * nothing in the app imports Lucide directly and nothing is an emoji. A few
 * subjects Lucide does not draw come from `src/lib/pictograms.ts`, drawn on the
 * same grid and stroke.
 */

const LUCIDE = {
  // Actions and navigation
  "arrow-down": ArrowDown,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-up-right": ArrowUpRight,
  check: Check,
  "chevron-down": ChevronDown,
  code: Code2,
  copy: Copy,
  download: Download,
  github: Github,
  info: Info,
  link: Link2,
  loader: Loader2,
  plus: Plus,
  retry: RotateCcw,
  search: Search,
  shuffle: Shuffle,
  mic: Mic,
  x: X,

  // Studio and preview
  chat: MessageSquareText,
  design: Palette,
  details: UserRound,
  extras: Sparkles,
  desktop: Monitor,
  phone: Smartphone,
  sun: Sun,
  moon: Moon,
  attach: Paperclip,
  send: Send,

  // Landing
  export: ClipboardCheck,
  refine: SlidersHorizontal,
  lock: Lock,
  shield: ShieldCheck,
  templates: LayoutTemplate,
  fonts: Type,
  scenes: Clapperboard,
  wave: Hand,
  party: PartyPopper,
  sparkles: Sparkles,

  // Scenes and example chips
  mail: Mail,
  ship: Ship,
  drama: Drama,
  orbit: Orbit,
  waves: Waves,
  sprout: Sprout,
  rocket: Rocket,
  stethoscope: Stethoscope,
  scale: Scale,
  palette: Palette,
  handshake: Handshake,
} as const satisfies Record<string, LucideIcon>;

type LucideName = keyof typeof LUCIDE;

export type IconName = LucideName | PictogramName;

export const ICON_NAMES: readonly IconName[] = [
  ...(Object.keys(LUCIDE) as LucideName[]),
  ...(Object.keys(PICTOGRAMS) as PictogramName[]),
];

export function isIconName(value: string): value is IconName {
  return isPictogramName(value) || Object.prototype.hasOwnProperty.call(LUCIDE, value);
}

/** Every icon uses the same stroke so the set reads as one family. */
export const ICON_STROKE = 2;

const SIZES = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 } as const;
export type IconSize = keyof typeof SIZES;

export interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  /** Set when the icon stands alone and needs a name. Decorative icons omit it. */
  label?: string;
}

export function Icon({ name, size = "md", className, label }: IconProps) {
  const px = SIZES[size];
  const a11y = label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true } as const);

  if (isPictogramName(name)) {
    const pictogram = PICTOGRAMS[name] as {
      strokes: readonly string[];
      solids?: readonly string[];
      transform?: string;
    };
    return (
      <svg
        viewBox="0 0 24 24"
        width={px}
        height={px}
        fill="none"
        stroke="currentColor"
        strokeWidth={ICON_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("shrink-0", className)}
        {...a11y}
      >
        <g transform={pictogram.transform}>
          {pictogram.strokes.map((d) => (
            <path key={d} d={d} />
          ))}
          {pictogram.solids?.map((d) => (
            <path key={d} d={d} fill="currentColor" stroke="none" />
          ))}
        </g>
      </svg>
    );
  }

  const Glyph = LUCIDE[name];
  return (
    <Glyph
      width={px}
      height={px}
      strokeWidth={ICON_STROKE}
      className={cn("shrink-0", className)}
      {...a11y}
    />
  );
}

const TILES = {
  xs: { box: "size-6", icon: "xs" },
  sm: { box: "size-8", icon: "sm" },
  md: { box: "size-10", icon: "md" },
  lg: { box: "size-12", icon: "lg" },
  xl: { box: "size-16", icon: "xl" },
} as const satisfies Record<string, { box: string; icon: IconSize }>;

export interface IconTileProps {
  name: IconName;
  /** A 6-digit hex. Tints the tile and, unless it is bright, the glyph. */
  tint: string;
  size?: keyof typeof TILES;
  className?: string;
  label?: string;
}

/**
 * A tinted square tile with a line icon in it, like the stack cards on
 * theovex.com. Bright tints (neon, amber, cream) get an ink glyph so they stay
 * readable on light surfaces; darker tints colour the glyph and mix in a little
 * ink so it also holds up on the dark canvas.
 */
export function IconTile({ name, tint, size = "md", className, label }: IconTileProps) {
  const tile = TILES[size];
  const bright = isBright(tint);
  const style: CSSProperties = {
    backgroundColor: `color-mix(in srgb, ${tint} ${bright ? 30 : 14}%, transparent)`,
    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tint} ${bright ? 55 : 32}%, transparent)`,
    color: bright ? "var(--ink)" : `color-mix(in srgb, ${tint} 72%, var(--ink))`,
  };
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", tile.box, className)}
      style={style}
    >
      <Icon name={name} size={tile.icon} label={label} />
    </span>
  );
}
