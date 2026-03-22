import './RowActionGroup.css'

export interface RowAction {
  id: string
  label: string
  icon?: string
  onClick: () => void
  variant?: 'default' | 'destructive'
  disabled?: boolean
}

interface RowActionGroupProps {
  actions: RowAction[]
  /** When true, actions are always visible (not just on hover) */
  alwaysVisible?: boolean
  className?: string
}

/**
 * RowActionGroup — compact inline action zone for table rows.
 * Shows 1–3 actions. Visible on row hover by default.
 * Always-visible mode for selected rows or accessibility contexts.
 *
 * Calling context provides labels and handlers.
 * This component is purely a layout/presentation shell.
 */
export function RowActionGroup({
  actions,
  alwaysVisible = false,
  className = '',
}: RowActionGroupProps) {
  return (
    <div className={`row-action-group ${alwaysVisible ? 'row-action-group--visible' : ''} ${className}`}>
      {actions.slice(0, 3).map(action => (
        <button
          key={action.id}
          className={`row-action-btn ${action.variant === 'destructive' ? 'row-action-btn--destructive' : ''}`}
          onClick={e => { e.stopPropagation(); action.onClick() }}
          disabled={action.disabled}
          title={action.label}
          aria-label={action.label}
        >
          {action.icon && (
            <span className="row-action-btn__icon" aria-hidden="true">{action.icon}</span>
          )}
          <span className="row-action-btn__label">{action.label}</span>
        </button>
      ))}
    </div>
  )
}
