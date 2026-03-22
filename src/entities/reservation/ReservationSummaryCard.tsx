import { ReservationStatusBadge } from './ReservationStatusBadge'
import type { ReservationStatus } from './ReservationStatusBadge'
import './ReservationSummaryCard.css'

interface ReservationSummaryCardProps {
  id: string
  /** Human-readable reservation reference */
  ref?: string
  guestName: string
  checkIn: string
  checkOut: string
  nights: number
  status: ReservationStatus
  /** Assigned bed label — shown if assignment exists */
  bedLabel?: string
  /** Room/dorm label */
  roomLabel?: string
  onClick?: () => void
  className?: string
}

/**
 * ReservationSummaryCard — compact reservation identity card.
 * Presentational only. No command logic.
 *
 * Domain note: Reservation is NOT the same as Stay.
 * This card shows the reservation lifecycle, not the in-house stay.
 */
export function ReservationSummaryCard({
  ref: reservationRef,
  guestName,
  checkIn,
  checkOut,
  nights,
  status,
  bedLabel,
  roomLabel,
  onClick,
  className = '',
}: ReservationSummaryCardProps) {
  return (
    <div
      className={`res-card ${onClick ? 'res-card--clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="res-card__header">
        <div className="res-card__identity">
          <span className="res-card__name">{guestName}</span>
          {reservationRef && (
            <span className="res-card__ref">#{reservationRef}</span>
          )}
        </div>
        <ReservationStatusBadge status={status} />
      </div>

      <div className="res-card__dates">
        <span className="res-card__date-range">
          {checkIn} → {checkOut}
        </span>
        <span className="res-card__nights">{nights} night{nights !== 1 ? 's' : ''}</span>
      </div>

      {(bedLabel || roomLabel) && (
        <div className="res-card__assignment">
          {bedLabel && (
            <span className="res-card__bed-label">🛏 {bedLabel}</span>
          )}
          {roomLabel && (
            <span className="res-card__room-label">{roomLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}
