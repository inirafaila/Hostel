import { StayStatusBadge } from './StayStatusBadge'
import type { StayStatus } from './StayStatusBadge'
import './StaySummaryCard.css'

interface StaySummaryCardProps {
  id: string
  guestName: string
  /** Bed label — MUST be prominent (bed-first truth) */
  bedLabel: string
  dormLabel?: string
  checkInDate: string
  dueOutDate: string
  /** Folio balance due — shown prominently if non-zero */
  folioBalanceDue: number
  status: StayStatus
  onClick?: () => void
  className?: string
}

/**
 * StaySummaryCard — in-house guest snapshot.
 * Bed identity is prominently displayed (bed-first truth).
 * Folio balance is shown when non-zero — operator needs visibility.
 *
 * Domain note: Stay ≠ Reservation ≠ Bed Assignment.
 * This card is for in-house operational tracking.
 * Folio balance is a summary — full detail is on the Folio page.
 */
export function StaySummaryCard({
  guestName,
  bedLabel,
  dormLabel,
  checkInDate,
  dueOutDate,
  folioBalanceDue,
  status,
  onClick,
  className = '',
}: StaySummaryCardProps) {
  const hasBalance = folioBalanceDue > 0

  return (
    <div
      className={`stay-card ${onClick ? 'stay-card--clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="stay-card__header">
        <div className="stay-card__identity">
          <span className="stay-card__name">{guestName}</span>
          {/* Bed identity — prominently displayed per bed-first design rule */}
          <span className="stay-card__bed">🛏 {bedLabel}{dormLabel ? ` · ${dormLabel}` : ''}</span>
        </div>
        <StayStatusBadge status={status} />
      </div>

      <div className="stay-card__meta">
        <div className="stay-card__dates">
          <span className="stay-card__label">In</span>
          <span className="stay-card__value">{checkInDate}</span>
          <span className="stay-card__sep">→</span>
          <span className="stay-card__label">Due Out</span>
          <span className="stay-card__value">{dueOutDate}</span>
        </div>

        {hasBalance && (
          <div className="stay-card__balance">
            <span className="stay-card__balance-label">Balance Due</span>
            <span className="stay-card__balance-value">
              ${folioBalanceDue.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
