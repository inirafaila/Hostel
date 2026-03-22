import './MaintenanceStatusTimeline.css'
import type { MaintenanceCaseStatus } from './MaintenanceImpactCard'

export interface MaintenanceEvent {
  status: MaintenanceCaseStatus
  timestamp: string
  note?: string
}

const STATUS_LABELS: Record<MaintenanceCaseStatus, string> = {
  open: 'Opened',
  'in-progress': 'In Progress',
  blocked: 'Blocked',
  resolved: 'Resolved',
  closed: 'Closed',
}

/**
 * MaintenanceStatusTimeline — ordered status history for a maintenance case.
 * Blocked state is visually distinct from other states.
 * Presentational only — no mutation logic.
 */
export function MaintenanceStatusTimeline({ events }: { events: MaintenanceEvent[]; className?: string }) {
  return (
    <ol className="maint-timeline" aria-label="Status history">
      {events.map((event, i) => (
        <li key={i} className={`maint-timeline__event maint-timeline__event--${event.status}`}>
          <span className="maint-timeline__dot" aria-hidden="true" />
          <div className="maint-timeline__content">
            <span className="maint-timeline__label">{STATUS_LABELS[event.status]}</span>
            <span className="maint-timeline__time">{event.timestamp}</span>
            {event.note && (
              <p className="maint-timeline__note">{event.note}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
