import type { ReactNode } from 'react'
import './SummaryBoardLayout.css'

interface SummaryBoardLayoutProps {
  header: ReactNode
  /** Stats/summary strip pinned directly below header */
  summary?: ReactNode
  /** Page-level exception alert zone — pinned, between summary and board */
  exception?: ReactNode
  /** Main board content — scrolls independently */
  children: ReactNode
  /** Show loading spinner overlay over board */
  loading?: boolean
  /** Shown when board has no content and loading is false */
  emptyState?: ReactNode
  className?: string
}

/**
 * SummaryBoardLayout — Layout Family 1.
 * Dashboard, Inventory.
 *
 * Regions:
 *   header        → pinned, never scrolls
 *   summary       → pinned (stats cards, strip)
 *   exception     → pinned (page-level alert, optional)
 *   board         → scrolls independently
 */
export function SummaryBoardLayout({
  header,
  summary,
  exception,
  children,
  loading,
  emptyState,
  className = '',
}: SummaryBoardLayoutProps) {
  const showEmpty = !loading && emptyState

  return (
    <div className={`layout-sbl ${className}`}>
      <div className="layout-sbl__pinned">
        {header}
        {summary && <div className="layout-sbl__summary">{summary}</div>}
        {exception && <div className="layout-sbl__exception">{exception}</div>}
      </div>

      <div className="layout-sbl__board">
        {loading && (
          <div className="layout-sbl__loading" aria-live="polite">
            <span className="layout-spinner" aria-hidden="true" />
            <span className="sr-only">Loading…</span>
          </div>
        )}
        {showEmpty ? emptyState : !loading && children}
      </div>
    </div>
  )
}
