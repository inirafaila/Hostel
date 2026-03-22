import type { BedState } from './BedStatusBadge'
import './DormInventoryCard.css'

interface DormInventoryCardProps {
  name: string
  dormType: string
  totalBeds: number
  /** Bed count by operational state */
  byState: Partial<Record<BedState, number>>
  onClick?: () => void
  className?: string
}

const STATE_LABELS: Partial<Record<BedState, string>> = {
  available:    'Available',
  occupied:     'Occupied',
  reserved:     'Reserved',
  dirty:        'Dirty',
  maintenance:  'Maintenance',
  'out-of-order': 'Out of Order',
}

/**
 * DormInventoryCard — dorm/room summary with bed count breakdown by state.
 * Shows bed-level truth — not just a single room status.
 * Preserves bed-first design rule: bed count breakdown is first-class information.
 *
 * Domain note: The card shows the inventory asset state breakdown.
 * Assignment ≠ Inventory Asset. This card shows the asset (the dorm/beds).
 */
export function DormInventoryCard({
  name,
  dormType,
  totalBeds,
  byState,
  onClick,
  className = '',
}: DormInventoryCardProps) {
  return (
    <div
      className={`dorm-card ${onClick ? 'dorm-card--clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="dorm-card__header">
        <div>
          <p className="dorm-card__name">{name}</p>
          <p className="dorm-card__type">{dormType} · {totalBeds} beds</p>
        </div>
      </div>

      {/* Bed count breakdown — bed-first truth display */}
      <div className="dorm-card__bed-breakdown">
        {(Object.keys(STATE_LABELS) as BedState[]).map(state => {
          const count = byState[state]
          if (!count) return null
          return (
            <div key={state} className={`dorm-card__bed-state dorm-card__bed-state--${state}`}>
              <span className="dorm-card__bed-count">{count}</span>
              <span className="dorm-card__bed-state-label">{STATE_LABELS[state]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
