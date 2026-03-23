import type { ReactNode } from 'react'
import './DetailSidebarLayout.css'

interface DetailSidebarLayoutProps {
  header: ReactNode
  /** Summary strip — pinned under header, does NOT scroll (current-truth bar) */
  summaryStrip?: ReactNode
  /** Page-level alert — pinned below summary strip */
  pageAlert?: ReactNode
  /** Main scrollable detail content — stacked sections */
  children: ReactNode
  /** Sidebar action rail — independently scrollable, right side */
  sidebar?: ReactNode
  className?: string
}

/**
 * DetailSidebarLayout — Layout Family 3.
 * Reservation Detail, Stay Detail, Folio.
 *
 * Regions:
 *   header         → pinned
 *   summaryStrip   → pinned (current truth — MUST be above detail)
 *   pageAlert      → pinned (page-level warning/block)
 *   [main | sidebar] → both scroll independently
 *
 * Design invariant: summary strip is ALWAYS above detail sections.
 * Current operational truth comes first, then deeper detail.
 */
export function DetailSidebarLayout({
  header,
  summaryStrip,
  pageAlert,
  children,
  sidebar,
  className = '',
}: DetailSidebarLayoutProps) {
  return (
    <div className={`layout-dsl ${className}`}>
      <div className="layout-dsl__pinned">
        {header}
        {summaryStrip && (
          <div className="layout-dsl__strip">{summaryStrip}</div>
        )}
        {pageAlert && (
          <div className="layout-dsl__page-alert">{pageAlert}</div>
        )}
      </div>

      <div className="layout-dsl__body">
        <div className="layout-dsl__main">
          {children}
        </div>
        {sidebar && (
          <aside className="layout-dsl__sidebar" aria-label="Record actions">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  )
}
