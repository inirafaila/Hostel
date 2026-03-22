import './ValidationSummaryBlock.css'

export type ValidationSeverity = 'error' | 'warning' | 'info'

export interface ValidationItem {
  id: string
  severity: ValidationSeverity
  message: string
}

interface ValidationSummaryBlockProps {
  items: ValidationItem[]
  title?: string
  className?: string
}

/**
 * ValidationSummaryBlock — pre-action validation summary.
 * Used before high-impact operations (check-in, checkout, bed move, payment).
 *
 * Design rules respected:
 * - errors and warnings render with DISTINCT visual treatment
 * - warning ≠ block — warnings allow proceed, errors prevent it
 * - info items are guidance, not concerns
 *
 * Domain-unaware: message content comes from calling context.
 */
export function ValidationSummaryBlock({
  items,
  title,
  className = '',
}: ValidationSummaryBlockProps) {
  if (items.length === 0) return null

  const severityOrder: ValidationSeverity[] = ['error', 'warning', 'info']
  const sorted = [...items].sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  )

  const icons: Record<ValidationSeverity, string> = {
    error: '⊗',
    warning: '△',
    info: 'ℹ',
  }

  return (
    <div className={`val-summary ${className}`} role="alert" aria-live="polite">
      {title && <p className="val-summary__title">{title}</p>}
      <ul className="val-summary__list" role="list">
        {sorted.map(item => (
          <li key={item.id} className={`val-summary__item val-summary__item--${item.severity}`}>
            <span className="val-summary__icon" aria-hidden="true">{icons[item.severity]}</span>
            <span className="val-summary__message">{item.message}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
