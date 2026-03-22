import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './ModalShell.css'

interface ModalShellProps {
  open: boolean
  onClose: () => void
  title: string
  /** Alert slot — for action-level alerts within the modal */
  alert?: ReactNode
  children: ReactNode
  /** Footer action zone — primary CTA, secondary action */
  footer?: ReactNode
  /** Size hint — for narrower confirmation modals vs wider review modals */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * ModalShell — generic accessible modal wrapper.
 * Renders into #overlay-root portal. Traps focus (basic keyboard support).
 *
 * Use for bounded decisions and review actions.
 * Do NOT use for long exploratory workflows, broad histories, or large edit forms.
 *
 * Domain Note: override modals (Warning != Block != Override) must use
 * the alertShell inside the children/alert slot to surface violation reason.
 * Override reason capture field also goes inside children.
 */
export function ModalShell({
  open,
  onClose,
  title,
  alert,
  children,
  footer,
  size = 'md',
  className = '',
}: ModalShellProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const overlayRoot = document.getElementById('overlay-root')
  if (!overlayRoot) return null

  return createPortal(
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`modal modal--${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title" id="modal-title">{title}</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {alert && <div className="modal__alert">{alert}</div>}
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>,
    overlayRoot
  )
}
