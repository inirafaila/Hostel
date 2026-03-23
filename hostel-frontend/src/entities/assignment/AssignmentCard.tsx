import './AssignmentCard.css'

interface AssignmentCardProps {
  /** Bed label — the primary identity of an assignment (bed-first) */
  bedLabel: string
  dormLabel?: string
  checkIn: string
  checkOut: string
  /** Guest name — may be absent if pre-assigned without guest yet */
  guestName?: string
  /** Whether this is the current active assignment */
  isCurrent?: boolean
  className?: string
}

/**
 * AssignmentCard — bed assignment display card.
 * Shows the temporal bed occupancy record: which bed, for which period, for which guest.
 *
 * Domain note: Assignment is DISTINCT from Stay and from Reservation.
 * - Assignment = temporal bed occupancy relationship
 * - A Stay may have multiple Assignments (e.g. bed move)
 * - Assignment is NOT the inventory asset (the Bed is)
 *
 * Presentational only — no command logic.
 */
export function AssignmentCard({
  bedLabel,
  dormLabel,
  checkIn,
  checkOut,
  guestName,
  isCurrent = false,
  className = '',
}: AssignmentCardProps) {
  return (
    <div className={`assignment-card ${isCurrent ? 'assignment-card--current' : ''} ${className}`}>
      <div className="assignment-card__bed">
        <span className="assignment-card__bed-label">🛏 {bedLabel}</span>
        {dormLabel && <span className="assignment-card__dorm">{dormLabel}</span>}
        {isCurrent && (
          <span className="assignment-card__current-tag">Current</span>
        )}
      </div>
      <div className="assignment-card__period">
        <span>{checkIn}</span>
        <span className="assignment-card__arrow">→</span>
        <span>{checkOut}</span>
      </div>
      {guestName && (
        <p className="assignment-card__guest">{guestName}</p>
      )}
    </div>
  )
}
