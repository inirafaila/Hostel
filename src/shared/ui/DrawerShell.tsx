import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './DrawerShell.css'

interface DrawerShellProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Footer action zone for quick actions */
  footer?: ReactNode
  className?: string
}

/**
 * DrawerShell — right-slide context-preserving drawer.
 * Use for quick-context review without losing list/board context.
 * Examples: reservation quick detail, guest profile, maintenance case quick view.
 *
 * Do NOT use DrawerShell for full workflow orchestration.
 * Do NOT let the drawer become a mini full-detail page (see design rules).
 */
export function DrawerShell({
  open,
  onClose,
  title,
  children,
  footer,
  className = '',
}: DrawerShellProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const overlayRoot = document.getElementById('overlay-root')
  if (!overlayRoot) return null

  return createPortal(
    <>
      {open && (
        <div className="drawer-scrim" onClick={onClose} aria-hidden="true" />
      )}
      <div
        className={`drawer ${open ? 'drawer--open' : ''} ${className}`}
        role="complementary"
        aria-label={title}
      >
        <div className="drawer__header">
          <h2 className="drawer__title">{title}</h2>
          <button
            className="drawer__close"
            onClick={onClose}
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>
        <div className="drawer__body">{children}</div>
        {footer && <div className="drawer__footer">{footer}</div>}
      </div>
    </>,
    overlayRoot
  )
}
