import type { ReactNode } from 'react'
import './SectionedTable.css'

export interface TableSection {
  id: string
  heading: string
  /** Optional count shown next to heading */
  count?: number
  rows: ReactNode
}

interface SectionedTableProps {
  /** Column header cells — rendered as <th> */
  columnHeaders: ReactNode
  sections: TableSection[]
  loading?: boolean
  emptyState?: ReactNode
  className?: string
}

/**
 * SectionedTable — grouped variant of TableShell.
 * Groups rows under section headings (colspanned group rows).
 * Used for: bed tiers in a dorm, expense categories, grouped maintenance cases.
 *
 * Column content and row content come from calling context.
 */
export function SectionedTable({
  columnHeaders,
  sections,
  loading,
  emptyState,
  className = '',
}: SectionedTableProps) {
  const hasSections = sections.length > 0 && sections.some(s => s.rows !== null)

  return (
    <div className={`sectioned-table-wrapper ${className}`}>
      {loading && (
        <div className="sectioned-table__loading" aria-live="polite">
          <span className="layout-spinner" aria-hidden="true" />
          <span className="sr-only">Loading…</span>
        </div>
      )}
      {!loading && !hasSections && emptyState}
      {!loading && hasSections && (
        <table className="sectioned-table">
          <thead className="sectioned-table__head">
            <tr>{columnHeaders}</tr>
          </thead>
          <tbody>
            {sections.map(section => (
              <>
                <tr key={`hdr-${section.id}`} className="sectioned-table__group-row">
                  <td colSpan={999} className="sectioned-table__group-heading">
                    {section.heading}
                    {section.count !== undefined && (
                      <span className="sectioned-table__group-count">{section.count}</span>
                    )}
                  </td>
                </tr>
                {section.rows}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
