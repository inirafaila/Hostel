import { StatusBadge } from '@shared/ui/StatusBadge'
import type { BadgeVariant } from '@shared/ui/StatusBadge'

/**
 * Reservation lifecycle status → badge variant mapping.
 * This mapping lives in entities/reservation/, not shared/.
 * shared/ui/StatusBadge is the generic primitive; this is the domain adapter.
 */
export type ReservationStatus =
  | 'confirmed'
  | 'tentative'
  | 'checked-in'
  | 'cancelled'
  | 'no-show'
  | 'modified'

const RESERVATION_STATUS_MAP: Record<ReservationStatus, { variant: BadgeVariant; label: string }> = {
  'confirmed':  { variant: 'success', label: 'Confirmed' },
  'tentative':  { variant: 'warning', label: 'Tentative' },
  'checked-in': { variant: 'info',    label: 'Checked In' },
  'cancelled':  { variant: 'neutral', label: 'Cancelled' },
  'no-show':    { variant: 'danger',  label: 'No Show' },
  'modified':   { variant: 'warning', label: 'Modified' },
}

interface ReservationStatusBadgeProps {
  status: ReservationStatus
  size?: 'sm' | 'md' | 'dot'
  className?: string
}

/**
 * ReservationStatusBadge — thin domain adapter over StatusBadge.
 * Maps reservation lifecycle states to badge visual semantics.
 * Presentational only — no command logic.
 */
export function ReservationStatusBadge({
  status,
  size = 'md',
  className,
}: ReservationStatusBadgeProps) {
  const mapping = RESERVATION_STATUS_MAP[status] ?? { variant: 'neutral' as BadgeVariant, label: status }
  return (
    <StatusBadge
      variant={mapping.variant}
      label={mapping.label}
      size={size}
      className={className}
    />
  )
}
