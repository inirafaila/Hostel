/**
 * lib/formatting.ts — General text / label formatting utilities.
 * Phase 1: placeholder stubs.
 */

/** Convert snake_case or kebab-case to Title Case */
export function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

/** Truncate a string to maxLength with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}…`
}
