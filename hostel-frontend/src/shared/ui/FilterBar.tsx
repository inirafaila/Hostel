import type { ReactNode } from 'react'
import './FilterBar.css'

interface FilterBarProps {
  /** Date/period filter slot */
  dateFilter?: ReactNode
  /** Text search slot */
  search?: ReactNode
  /** Secondary filter slots (status, category, etc.) */
  filters?: ReactNode
  /** Clear/reset action */
  clearAction?: ReactNode
  className?: string
}

/**
 * FilterBar — generic filter and search bar shell.
 * Used in list-heavy screens: Arrival Board, Housekeeping, Maintenance, Receivables, Expenses.
 * Content (filter inputs, search) is composed by the calling page — not defined here.
 * Filter bar appears directly below the page header per Page Layout Blueprint.
 */
export function FilterBar({
  dateFilter,
  search,
  filters,
  clearAction,
  className = '',
}: FilterBarProps) {
  return (
    <div className={`filter-bar ${className}`} role="search">
      <div className="filter-bar__controls">
        {dateFilter && (
          <div className="filter-bar__date-filter">{dateFilter}</div>
        )}
        {search && (
          <div className="filter-bar__search">{search}</div>
        )}
        {filters && (
          <div className="filter-bar__filters">{filters}</div>
        )}
      </div>
      {clearAction && (
        <div className="filter-bar__clear">{clearAction}</div>
      )}
    </div>
  )
}
