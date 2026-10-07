import { clsx, type ClassValue } from "clsx";

/** Joins class names. Kept in its own module so low-level components (icons)
 *  can use it without importing the UI kit. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
