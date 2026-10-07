/**
 * The page-wide "textured wall" backdrop, ported from the TheoVex shell.
 *
 * A fixed, pointer-events-none layer behind all content: a warm wash that is
 * lightest where the hero sits, one faint glow in the product accent, and a
 * fine grain. No hard edges and no animation, so it is safe under reduced
 * motion and costs nothing after paint.
 */
export function PageBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* The top stop uses the themed paper token: bright on light, a soft raised glow on dark. */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_-10%,var(--paper)_0%,var(--canvas)_46%,var(--canvas-2)_100%)]" />

      {/* One faint glow in the SignForge accent for a little colour and depth. */}
      <div className="absolute -left-24 -top-32 size-[30rem] bg-neon/[0.07] blur-[130px] dark:bg-neon/[0.04]" />

      {/* Fine grain. Soft-light reads on the light canvas, overlay on the dark one. */}
      <div className="grain absolute inset-0 opacity-[0.5] mix-blend-soft-light dark:opacity-[0.4] dark:mix-blend-overlay" />
    </div>
  );
}
