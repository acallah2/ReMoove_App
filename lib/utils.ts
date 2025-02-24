import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Do not read the `.value` property; if the input is a reanimated shared value,
 * we return an empty string.
 */
function resolveValue(input: any) {
  if (input && typeof input === "object" && Object.prototype.hasOwnProperty.call(input, "value")) {
    return "";
  }
  return input;
}

export function cn(...inputs: (string | undefined | null | boolean | { value: string })[]) {
  const resolvedInputs = inputs.map(resolveValue);
  return twMerge(clsx(resolvedInputs));
}