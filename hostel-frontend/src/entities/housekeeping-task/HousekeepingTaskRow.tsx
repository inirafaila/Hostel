import './HousekeepingTaskRow.css'

export type HousekeepingStatus = 'dirty' | 'cleaning' | 'inspect' | 'ready'

interface HousekeepingTaskRowProps {
  id: string
  bedLabel: string
  dormLabel?: string
  status: HousekeepingStatus
  assignedTo?: string
  updatedAt: string
  /** Quick action slot — filled by calling context in Phase 3 */
  actions?: React.ReactNode
  onClick?: () => void
  className?: string
}

const STATUS_CONFIG: Record<HousekeepingStatus, { label: string; icon: string }> = {
  dirty:    { label: 'Dirty',    icon: '◌' },
  cleaning: { label: 'Cleaning', icon: '◑' },
  inspect:  { label: 'Inspect',  icon: '◕' },
  ready:    { label: 'Ready',    icon: '●' },
}

/**
 * HousekeepingTaskRow — readiness/turnover task row.
 * Communicates bed readiness urgency (dirty → ready gradient).
 * Quick-action slot reserved for Phase 3 interactive controls.
 *
 * Domain note: Housekeeping ≠ Maintenance.
 * Housekeeping = readiness state tracking (dirty/cleaning/inspect/ready).
 * Maintenance = asset issue with sellability impact (separate entity module).
 *
 * Bed identity must be clearly visible.
 * Presentational only — no workflow orchestration.
 */
export function HousekeepingTaskRow({
  bedLabel,
  dormLabel,
  status,
  assignedTo,
  updatedAt,
  actions,
  onClick,
  className = '',
}: HousekeepingTaskRowProps) {
  const config = STATUS_CONFIG[status]

  return (
    <div
      className={`hk-row hk-row--${status} ${onClick ? 'hk-row--clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Status indicator bar — left edge communicates urgency */}
      <div className="hk-row__status-bar" aria-hidden="true" />

      <div className="hk-row__content">
        {/* Bed identity — prominently placed */}
        <div className="hk-row__bed">
          <span className="hk-row__bed-label">🛏 {bedLabel}</span>
          {dormLabel && <span className="hk-row__dorm">{dormLabel}</span>}
        </div>

        <div className="hk-row__status">
          <span className="hk-row__status-icon" aria-hidden="true">{config.icon}</span>
          <span className="hk-row__status-label">{config.label}</span>
        </div>

        <div className="hk-row__meta">
          {assignedTo && <span className="hk-row__assigned">{assignedTo}</span>}
          <span className="hk-row__updated">{updatedAt}</span>
        </div>
      </div>

      {/* Quick action slot — will be filled in Phase 3 */}
      {actions && (
        <div className="hk-row__actions">{actions}</div>
      )}
    </div>
  )
}
