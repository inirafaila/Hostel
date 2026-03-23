/**
 * lib/money.ts — Currency formatting and calculation utilities.
 * Phase 1: placeholder stubs. Phase 2+: implement with Intl.NumberFormat.
 *
 * No domain business logic here — pure formatting.
 * Financial presentation rules (charges / payments / refunds / balance due)
 * live in entity/folio and workflow/checkout — not here.
 */

/** Format amount as currency string: "$1,234.56" */
export function formatCurrency(amount: number, currency = 'USD'): string {
  // Phase 2: implement with Intl.NumberFormat
  return `${currency} ${amount.toFixed(2)}`
}

/** Check if an amount is effectively zero */
export function isZeroBalance(amount: number): boolean {
  return Math.abs(amount) < 0.01
}
