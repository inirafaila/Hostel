import './MaintenanceImpactCard.css'

export type MaintenanceCaseStatus = 'open' | 'in-progress' | 'blocked' | 'resolved' | 'closed'
export type SellabilityImpact = 'none' | 'reduced' | 'blocked'

interface MaintenanceImpactCardProps {
  id: string
  title: string
  reportedAt: string
  status: MaintenanceCaseStatus
  affectedSpace: string
  sellabilityImpact: SellabilityImpact
  assignedTo?: string
  className?: string
}

const SELLABILITY_LABELS: Record<SellabilityImpact, string> = {
  none: 'No Impact',
  reduced: 'Reduced',
  blocked: 'Blocked',
}

const STATUS_LABELS: Record<MaintenanceCaseStatus, string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  blocked: 'Blocked',
  resolved: 'Resolved',
  closed: 'Closed',
}

/**
 * MaintenanceImpactCard — maintenance case + sellability impact display.
 * Sellability impact is the PRIMARY operational signal for this domain.
 *
 * Domain note: Maintenance ≠ Housekeeping.
 * Maintenance = asset issue with potential sellability consequence.
 * Housekeeping = readiness/turnover (separate workflow and display).
 *
 * Design rule: sellability impact must be visually prominent.
 * Blocked sellability means the bed/space CANNOT be sold — operator must see this.
 * Presentational only — no command logic.
 */
export function MaintenanceImpactCard({
  title,
  reportedAt,
  status,
  affectedSpace,
  sellabilityImpact,
  assignedTo,
  className = '',
}: MaintenanceImpactCardProps) {
  return (
    <div className={`maint-card maint-card--status-${status} ${className}`}>
      {/* Sellability impact — prominently displayed at top */}
      <div className={`maint-card__sellability maint-card__sellability--${sellabilityImpact}`}>
        <span className="maint-card__sellability-icon" aria-hidden="true">
          {sellabilityImpact === 'blocked' ? '⛔' : sellabilityImpact === 'reduced' ? '⚠' : '✓'}
        </span>
        <span className="maint-card__sellability-label">
          Sellability: {SELLABILITY_LABELS[sellabilityImpact]}
        </span>
      </div>

      <div className="maint-card__body">
        <div className="maint-card__header">
          <p className="maint-card__title">{title}</p>
          <span className={`maint-card__status maint-card__status--${status}`}>
            {STATUS_LABELS[status]}
          </span>
        </div>

        <p className="maint-card__space">📍 {affectedSpace}</p>

        <div className="maint-card__meta">
          <span className="maint-card__reported">Reported {reportedAt}</span>
          {assignedTo && (
            <span className="maint-card__assigned">→ {assignedTo}</span>
          )}
        </div>
      </div>
    </div>
  )
}
