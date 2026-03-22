import { useState, useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './ActionMenu.css'

export interface ActionMenuItem {
  id: string
  label: string
  icon?: string
  onClick: () => void
  destructive?: boolean
  disabled?: boolean
}

interface ActionMenuProps {
  /** Trigger element — usually a ⋯ button */
  trigger: ReactNode
  items: ActionMenuItem[]
  /** Horizontal alignment of the menu relative to trigger */
  align?: 'left' | 'right'
}

/**
 * ActionMenu — contextual floating action menu.
 * Generic, domain-unaware. Actions are passed from the calling context.
 * Renders into #overlay-root, closes on Escape and outside click.
 *
 * Usage: row-level actions, record-level kebab menus.
 */
export function ActionMenu({ trigger, items, align = 'right' }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  function openMenu() {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setPosition({
      top: rect.bottom + 4 + window.scrollY,
      left: align === 'right' ? rect.right - 180 : rect.left,
    })
    setOpen(true)
  }

  // Close on Escape and outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent | MouseEvent) => {
      if (e instanceof KeyboardEvent && e.key === 'Escape') { setOpen(false); return }
      if (e instanceof MouseEvent) {
        const target = e.target as Node
        if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
          setOpen(false)
        }
      }
    }
    window.addEventListener('keydown', handler)
    window.addEventListener('mousedown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      window.removeEventListener('mousedown', handler)
    }
  }, [open])

  const overlayRoot = document.getElementById('overlay-root')

  return (
    <div className="action-menu-trigger" ref={triggerRef}>
      <div
        role="button"
        tabIndex={0}
        onClick={openMenu}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openMenu() }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </div>

      {open && overlayRoot && createPortal(
        <div
          ref={menuRef}
          className="action-menu"
          role="menu"
          style={{ top: position.top, left: position.left }}
        >
          {items.map(item => (
            <button
              key={item.id}
              className={`action-menu__item ${item.destructive ? 'action-menu__item--destructive' : ''}`}
              role="menuitem"
              disabled={item.disabled}
              onClick={() => { item.onClick(); setOpen(false) }}
            >
              {item.icon && (
                <span className="action-menu__icon" aria-hidden="true">{item.icon}</span>
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>,
        overlayRoot
      )}
    </div>
  )
}
