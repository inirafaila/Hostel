import './FolioTotalsBox.css'

interface FolioTotalsBoxProps {
  chargesTotal: number
  paymentsTotal: number
  refundsTotal: number
  /** Balance due = charges - payments + refunds */
  balanceDue: number
  currency?: string
  className?: string
}

function fmt(amount: number, currency: string) {
  return `${currency} ${Math.abs(amount).toFixed(2)}`
}

/**
 * FolioTotalsBox — financial summary breakdown for a folio.
 * Shows charges / payments / refunds / balance due as distinct labeled rows.
 * Balance due is visually prominent — the most operationally critical number.
 *
 * Domain note: Folio ≠ Expense.
 * This is guest-facing finance (charges, payments, refunds on a guest stay).
 * Expense is internal operational cost — not displayed here.
 *
 * Charges, payments, and refunds must NOT be visually merged.
 * Presentational only — no computation logic (props carry pre-computed totals).
 */
export function FolioTotalsBox({
  chargesTotal,
  paymentsTotal,
  refundsTotal,
  balanceDue,
  currency = 'USD',
  className = '',
}: FolioTotalsBoxProps) {
  const isCredit = balanceDue < 0
  const isPending = balanceDue > 0

  return (
    <div className={`folio-totals ${className}`}>
      <div className="folio-totals__rows">
        <div className="folio-totals__row">
          <span className="folio-totals__label">Charges</span>
          <span className="folio-totals__value folio-totals__value--charges">
            {fmt(chargesTotal, currency)}
          </span>
        </div>

        <div className="folio-totals__row">
          <span className="folio-totals__label">Payments</span>
          <span className="folio-totals__value folio-totals__value--payments">
            − {fmt(paymentsTotal, currency)}
          </span>
        </div>

        {refundsTotal > 0 && (
          <div className="folio-totals__row">
            <span className="folio-totals__label">Refunds</span>
            <span className="folio-totals__value folio-totals__value--refunds">
              + {fmt(refundsTotal, currency)}
            </span>
          </div>
        )}

        <div className="folio-totals__divider" />

        {/* Balance due — most prominent element */}
        <div className="folio-totals__row folio-totals__row--balance">
          <span className="folio-totals__balance-label">Balance Due</span>
          <span className={`folio-totals__balance-value ${isPending ? 'folio-totals__balance-value--pending' : isCredit ? 'folio-totals__balance-value--credit' : 'folio-totals__balance-value--zero'}`}>
            {isCredit ? '(' : ''}{fmt(balanceDue, currency)}{isCredit ? ')' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
