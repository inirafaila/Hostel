import { StatusBadge } from '@shared/ui/StatusBadge'
import type { BadgeVariant } from '@shared/ui/StatusBadge'

/**
 * Stay lifecycle status → badge variant mapping.
 * Stay is DISTINCT from Reservation and from Bed Assignment.
 * Stay = in-house guest occupancy lifecycle.
 */
export type StayStatus = 'in-house' | 'due-out-today' | 'overdue' | 'checked-out'

const STAY_STATUS_MAP: Record<StayStatus, { variant: BadgeVariant; label: string }> = {
  'in-house':      { variant: 'success', label: 'In House' },
  'due-out-today': { variant: 'warning', label: 'Due Out Today' },
  'overdue':       { variant: 'danger',  label: 'Overdue' },
  'checked-out':   { variant: 'neutral', label: 'Checked Out' },
}

interface StayStatusBadgeProps {
  status: StayStatus
  size?: 'sm' | 'md' | 'dot'
  className?: string
}

/**
 * StayStatusBadge — thin domain adapter over StatusBadge.
 * Maps stay lifecycle status → badge variant.
 * Stay ≠ Reservation. This badge is for in-house tracking, not reservation state.
 */
export function StayStatusBadge({ status, size = 'md', className }: StayStatusBadgeProps) {
  const mapping = STAY_STATUS_MAP[status] ?? { variant: 'neutral' as BadgeVariant, label: status }
  return (
    <StatusBadge variant={mapping.variant} label={mapping.label} size={size} className={className} />
  )
}
