import type { ReactNode } from 'react'
import './StickyConfirmFooter.css'

export interface ConsequenceItem {
  label: string
  value: ReactNode
  /** Emphasis for critical values (e.g. balance due, bed assignment change) */
  emphasis?: 'normal' | 'strong' | 'warning'
}

interface StickyConfirmFooterProps {
  /** Primary CTA — should be a command label e.g. "Check In Guest" */
  primaryAction: ReactNode
  /** Secondary safe action — "Back", "Cancel" */
  secondaryAction?: ReactNode
  /**
   * Consequence items — tabular key/value summary shown before the CTA.
   * Ensures operator sees the outcome before confirming.
   */
  consequences?: ConsequenceItem[]
  /** Warning or block signal adjacent to CTA */
  warning?: ReactNode
  /**
   * Override slot — shown when operator proceeds despite a block.
   * Override ≠ Warning ≠ Block — must be visually distinct.
   * Override reason capture and confirmation go here.
   */
  override?: ReactNode
  className?: string
}

/**
 * StickyConfirmFooter — sticky confirmation zone for GuidedReviewLayout.
 * Final CTA must always be visible without scrolling past review content.
 *
 * Design rules:
 * - Consequence summary appears BEFORE the CTA
 * - Warning/block adjacent to CTA
 * - Override slot is separate from warning (Override ≠ Warning ≠ Block)
 * - This is a display shell — no workflow logic lives here
 */
export function StickyConfirmFooter({
  primaryAction,
  secondaryAction,
  consequences,
  warning,
  override: overrideSlot,
  className = '',
}: StickyConfirmFooterProps) {
  return (
    <footer className={`sticky-footer ${className}`}>
      {/* Override slot — shown above everything when present */}
      {overrideSlot && (
        <div className="sticky-footer__override">{overrideSlot}</div>
      )}

      <div className="sticky-footer__content">
        {/* Consequence summary — left side */}
        {consequences && consequences.length > 0 && (
          <div className="sticky-footer__consequences">
            {consequences.map((item, i) => (
              <div key={i} className="sticky-footer__consequence-item">
                <span className="sticky-footer__consequence-label">{item.label}</span>
                <span className={`sticky-footer__consequence-value sticky-footer__consequence-value--${item.emphasis ?? 'normal'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Warning + actions — right side */}
        <div className="sticky-footer__right">
          {warning && (
            <div className="sticky-footer__warning">{warning}</div>
          )}
          <div className="sticky-footer__actions">
            {secondaryAction && (
              <div className="sticky-footer__secondary">{secondaryAction}</div>
            )}
            <div className="sticky-footer__primary">{primaryAction}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
