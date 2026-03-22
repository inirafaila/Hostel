import type { ReactNode } from 'react'
import './SummaryStrip.css'

interface SummaryStripItem {
  label: string
  value: ReactNode
  /** Optional emphasis — for critical values like balance due */
  emphasis?: 'normal' | 'strong' | 'warning'
}

interface SummaryStripProps {
  items: SummaryStripItem[]
  /** Primary CTA slot — rendered right-aligned in the strip */
  primaryAction?: ReactNode
  className?: string
}

/**
 * SummaryStrip — persistent current-truth bar.
 * Placed immediately below the page header in detail screens.
 * Shows key facts (status, dates, balance, bed, etc.) — content provided by caller.
 *
 * Domain note: what facts appear here depend on the entity context
 * (e.g., Reservation, Stay, Folio). The calling page/entity module decides.
 */
export function SummaryStrip({ items, primaryAction, className = '' }: SummaryStripProps) {
  return (
    <div className={`summary-strip ${className}`}>
      <div className="summary-strip__items">
        {items.map((item, idx) => (
          <div key={idx} className="summary-strip__item">
            <span className="summary-strip__label">{item.label}</span>
            <span className={`summary-strip__value summary-strip__value--${item.emphasis ?? 'normal'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
      {primaryAction && (
        <div className="summary-strip__action">{primaryAction}</div>
      )}
    </div>
  )
}
