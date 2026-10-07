import type { CSSProperties } from "react";

/**
 * Renders the HTML produced by `generateSignatureHTML` (all text and URLs are
 * escaped and every style value is normalized there, so this is safe).
 *
 * The wrapper carries `data-skin`, which exempts everything inside it from the
 * shell's squared-corner rule in globals.css. The signature is the product
 * being previewed, not part of the shell, so its circles and rounded cards
 * have to render as exported.
 */
export function SignatureHtml({
  html,
  className,
  style,
}: {
  html: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      data-skin="signature"
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
