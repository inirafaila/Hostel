import { StatusBadge } from '@shared/ui/StatusBadge'
import type { BadgeVariant } from '@shared/ui/StatusBadge'

/**
 * Bed operational state set — 6 states per Design System spec.
 * Bed status is operationally DISTINCT from reservation status and folio status.
 * Do not collapse these into a generic "status" concept.
 */
export type BedState =
  | 'available'
  | 'reserved'
  | 'occupied'
  | 'dirty'
  | 'maintenance'
  | 'out-of-order'

const BED_STATE_MAP: Record<BedState, { variant: BadgeVariant; label: string; icon: string }> = {
  'available':   { variant: 'success', label: 'Available',   icon: '✓' },
  'reserved':    { variant: 'info',    label: 'Reserved',    icon: '◷' },
  'occupied':    { variant: 'neutral', label: 'Occupied',    icon: '●' },
  'dirty':       { variant: 'warning', label: 'Dirty',       icon: '◌' },
  'maintenance': { variant: 'danger',  label: 'Maintenance', icon: '⚙' },
  'out-of-order':{ variant: 'danger',  label: 'Out of Order', icon: '⊗' },
}

interface BedStatusBadgeProps {
  state: BedState
  size?: 'sm' | 'md' | 'dot'
  className?: string
}

/**
 * BedStatusBadge — maps bed operational state → StatusBadge.
 * Wraps shared/ui/StatusBadge with bed-domain mapping.
 * Bed operational status ≠ reservation status ≠ folio status.
 */
export function BedStatusBadge({ state, size = 'md', className }: BedStatusBadgeProps) {
  const mapping = BED_STATE_MAP[state] ?? { variant: 'neutral' as BadgeVariant, label: state, icon: '' }
  return (
    <StatusBadge
      variant={mapping.variant}
      label={mapping.label}
      icon={size !== 'dot' ? mapping.icon : undefined}
      size={size}
      className={className}
    />
  )
}
