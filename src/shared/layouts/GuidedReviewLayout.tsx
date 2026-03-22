import type { ReactNode } from 'react'
import './GuidedReviewLayout.css'

interface GuidedReviewLayoutProps {
  /** Compact header — action title + current record identity */
  header: ReactNode
  /** Optional alert zone pinned above review stack (for blocks/overrides) */
  topAlert?: ReactNode
  /** Review content — stacked, scrollable */
  children: ReactNode
  /**
   * Sticky confirm footer — OUTSIDE the scroll container.
   * CTA must never be buried below unrelated scrollable content.
   */
  confirmFooter?: ReactNode
  className?: string
}

/**
 * GuidedReviewLayout — Layout Family 4.
 * Check-In Flow, Checkout Flow, Bed Move, Payment, Refund.
 *
 * Regions:
 *   header       → pinned
 *   topAlert     → pinned (block/override signal before review)
 *   review stack → scrolls
 *   confirmFooter → STICKY at bottom, outside scroll container
 *
 * Critical design rule: confirmFooter is NOT inside the scroll container.
 * The CTA must always be visible without scrolling past review content.
 */
export function GuidedReviewLayout({
  header,
  topAlert,
  children,
  confirmFooter,
  className = '',
}: GuidedReviewLayoutProps) {
  return (
    <div className={`layout-grl ${className}`}>
      <div className="layout-grl__pinned">
        {header}
        {topAlert && (
          <div className="layout-grl__top-alert">{topAlert}</div>
        )}
      </div>

      <div className="layout-grl__review-stack">
        {children}
      </div>

      {confirmFooter && (
        <div className="layout-grl__footer">
          {confirmFooter}
        </div>
      )}
    </div>
  )
}
