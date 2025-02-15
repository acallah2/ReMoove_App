import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to conditionally join class names using clsx and merge Tailwind classes properly.
 *
 * @param inputs - A list of class names, boolean conditions, or undefined values.
 * @returns A single merged string of valid class names.
 */
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}
