import type { ReactNode } from 'react'
import './ContextPanel.css'

interface ContextPanelProps {
  open: boolean
  /** Panel title shown in header bar */
  title?: string
  /** Close callback — renders ✕ in header when provided */
  onClose?: () => void
  /** Record identity display (name, ref, dates) */
  identity?: ReactNode
  /** Warnings applicable to selected record */
  warnings?: ReactNode
  /** Summary info for the selected record */
  summary?: ReactNode
  /** Quick actions — in a sticky footer zone at the bottom of the panel */
  actions?: ReactNode
  /** Shown when nothing is selected */
  emptyState?: ReactNode
  className?: string
}

/**
 * ContextPanel — right-side context panel for FilterMasterDetailLayout.
 * Shows depth for selected row without navigating away from list.
 *
 * Design rules:
 * - Selected row remains visible in master list while panel is open
 * - Panel actions slot is sticky at the bottom (always reachable)
 * - Panel must NOT become a mini full-detail page
 * - Actions here are quick contextual actions, not full workflows
 */
export function ContextPanel({
  open,
  title,
  onClose,
  identity,
  warnings,
  summary,
  actions,
  emptyState,
  className = '',
}: ContextPanelProps) {
  const hasContent = identity || summary || warnings

  return (
    <aside
      className={`context-panel ${open ? 'context-panel--open' : ''} ${className}`}
      aria-label={title ?? 'Record context'}
    >
      {/* Header bar */}
      {(title || onClose) && (
        <div className="context-panel__header">
          {title && <span className="context-panel__title">{title}</span>}
          {onClose && (
            <button
              className="context-panel__close"
              onClick={onClose}
              aria-label="Close panel"
            >✕</button>
          )}
        </div>
      )}

      {open && hasContent ? (
        <div className="context-panel__scroll">
          {identity && (
            <div className="context-panel__identity">{identity}</div>
          )}
          {warnings && (
            <div className="context-panel__warnings">{warnings}</div>
          )}
          {summary && (
            <div className="context-panel__summary">{summary}</div>
          )}
        </div>
      ) : open ? (
        <div className="context-panel__empty">
          {emptyState ?? (
            <span className="context-panel__empty-text">Select a record to view context</span>
          )}
        </div>
      ) : null}

      {/* Sticky action footer — always anchored at bottom */}
      {open && actions && (
        <div className="context-panel__actions">{actions}</div>
      )}
    </aside>
  )
}
