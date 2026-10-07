/**
 * A soft radial wash painted on the stage behind the mock window. `rgb` is a
 * "r,g,b" triple; the two numbers are the light and dark opacities.
 */
export function wash(rgb: string, light: number, dark: number): { light: string; dark: string } {
  const paint = (a: number) => `radial-gradient(60% 55% at 50% 0%, rgba(${rgb},${a}), transparent 70%)`;
  return { light: paint(light), dark: paint(dark) };
}
