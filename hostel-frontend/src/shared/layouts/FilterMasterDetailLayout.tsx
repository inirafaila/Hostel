import type { ReactNode } from 'react'
import { ContextPanel } from '@shared/ui/ContextPanel'
import './FilterMasterDetailLayout.css'

interface ContextPanelConfig {
  open: boolean
  title?: string
  onClose?: () => void
  identity?: ReactNode
  warnings?: ReactNode
  summary?: ReactNode
  /** Sticky action zone at bottom of panel */
  actions?: ReactNode
  emptyState?: ReactNode
}

interface FilterMasterDetailLayoutProps {
  header: ReactNode
  /** Sticky filter/search bar — does NOT scroll with list */
  filterBar?: ReactNode
  /** Page-level alert zone, between filter bar and list */
  alert?: ReactNode
  /** Master list content — scrolls independently */
  children: ReactNode
  /** Loading state over master list */
  loading?: boolean
  /** Empty state when list has no content */
  emptyState?: ReactNode
  /** Right-side context panel configuration */
  contextPanel?: ContextPanelConfig
  className?: string
}

/**
 * FilterMasterDetailLayout — Layout Family 2.
 * Arrival Board, Housekeeping, Maintenance, Receivables, Expenses.
 *
 * Regions:
 *   header      → pinned
 *   filterBar   → sticky, does not scroll  ← KEY: see CSS sticky
 *   alert       → optional, below filter bar
 *   [master list | context panel] → both scroll independently
 *
 * Design invariant: master list is always the dominant region.
 * Context panel must not crowd out the list.
 */
export function FilterMasterDetailLayout({
  header,
  filterBar,
  alert,
  children,
  loading,
  emptyState,
  contextPanel,
  className = '',
}: FilterMasterDetailLayoutProps) {
  const showEmpty = !loading && emptyState

  return (
    <div className={`layout-fmd ${className}`}>
      {header}

      {filterBar && (
        <div className="layout-fmd__filter-bar">{filterBar}</div>
      )}

      {alert && (
        <div className="layout-fmd__alert">{alert}</div>
      )}

      <div className="layout-fmd__body">
        <div className="layout-fmd__master">
          {loading && (
            <div className="layout-fmd__loading" aria-live="polite">
              <span className="layout-spinner" aria-hidden="true" />
              <span className="sr-only">Loading…</span>
            </div>
          )}
          {showEmpty ? emptyState : !loading && children}
        </div>

        {contextPanel && (
          <ContextPanel
            open={contextPanel.open}
            title={contextPanel.title}
            onClose={contextPanel.onClose}
            identity={contextPanel.identity}
            warnings={contextPanel.warnings}
            summary={contextPanel.summary}
            actions={contextPanel.actions}
            emptyState={contextPanel.emptyState}
          />
        )}
      </div>
    </div>
  )
}
