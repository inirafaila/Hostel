import type { ReactNode } from 'react'
import './SideUtilityPanelLayout.css'

interface SideUtilityPanelLayoutProps {
  /** Main transactional content — must remain visually dominant */
  main: ReactNode
  /** Panel title */
  panelTitle: string
  /** Panel body content */
  panel: ReactNode
  /** Panel open/close toggle */
  panelOpen?: boolean
  /** Callback when panel close button is clicked */
  onPanelClose?: () => void
  /** Panel width in px — defaults to 360 */
  panelWidth?: number
  className?: string
}

/**
 * SideUtilityPanelLayout — Layout Family 5.
 * AI Assistant, supporting utility panels.
 *
 * Design invariant:
 * - Panel must NOT visually overpower the main transactional page
 * - Main content scrolls independently
 * - Panel scrolls independently
 * - Panel can be closed — sliding out without disturbing main area
 */
export function SideUtilityPanelLayout({
  main,
  panelTitle,
  panel,
  panelOpen = true,
  onPanelClose,
  panelWidth = 360,
  className = '',
}: SideUtilityPanelLayoutProps) {
  return (
    <div className={`layout-sup ${className}`}>
      <div className="layout-sup__main">{main}</div>

      <aside
        className={`layout-sup__panel ${panelOpen ? 'layout-sup__panel--open' : ''}`}
        style={{ '--sup-panel-width': `${panelWidth}px` } as React.CSSProperties}
        aria-label={panelTitle}
        hidden={!panelOpen}
      >
        <div className="layout-sup__panel-header">
          <h2 className="layout-sup__panel-title">{panelTitle}</h2>
          {onPanelClose && (
            <button
              className="layout-sup__panel-close"
              onClick={onPanelClose}
              aria-label={`Close ${panelTitle}`}
            >
              ✕
            </button>
          )}
        </div>
        <div className="layout-sup__panel-body">{panel}</div>
      </aside>
    </div>
  )
}
