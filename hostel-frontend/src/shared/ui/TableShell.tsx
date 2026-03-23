import type { ReactNode } from 'react'
import './TableShell.css'

interface TableShellProps {
  /** Table column headers */
  head: ReactNode
  /** Table rows — provided by calling context */
  body: ReactNode
  /** Optional empty state — shown when body has no rows */
  emptyState?: ReactNode
  /** Loading state overlay */
  loading?: boolean
  className?: string
}

/**
 * TableShell — generic scan-first table wrapper.
 * Used in list-heavy screens. Per design rules, tables should be
 * action-aware: each row should make status, primary action, and
 * identity scannable. That responsibility is in the calling context.
 *
 * This shell handles: structural wrapper, empty state, loading state.
 * Column content, row content, and row actions are composed by the caller.
 */
export function TableShell({ head, body, emptyState, loading, className = '' }: TableShellProps) {
  return (
    <div className={`table-shell ${className}`} role="region">
      {loading && (
        <div className="table-shell__loading" aria-live="polite" aria-label="Loading…">
          <span className="table-shell__loading-indicator" aria-hidden="true" />
        </div>
      )}
      <table className="table-shell__table">
        <thead className="table-shell__head">{head}</thead>
        <tbody className="table-shell__body">{body}</tbody>
      </table>
      {emptyState && (
        <div className="table-shell__empty">{emptyState}</div>
      )}
    </div>
  )
}
