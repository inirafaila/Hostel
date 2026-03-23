import type { ReactNode } from 'react'
import './EmptyStateBlock.css'

interface EmptyStateBlockProps {
  /** Emoji or SVG element */
  icon?: ReactNode
  title: string
  description?: string
  /** Optional CTA — e.g., "Clear filters", "Add record" */
  action?: ReactNode
  /** Size variant — full takes more vertical space */
  size?: 'sm' | 'full'
  className?: string
}

/**
 * EmptyStateBlock — structured empty / null state panel.
 * Used for: empty list, no results, no selection, cleared filter state.
 * Domain-unaware — icons, labels, and CTAs come from calling context.
 */
export function EmptyStateBlock({
  icon,
  title,
  description,
  action,
  size = 'full',
  className = '',
}: EmptyStateBlockProps) {
  return (
    <div className={`empty-state empty-state--${size} ${className}`} role="status">
      {icon && (
        <div className="empty-state__icon" aria-hidden="true">{icon}</div>
      )}
      <p className="empty-state__title">{title}</p>
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      {action && (
        <div className="empty-state__action">{action}</div>
      )}
    </div>
  )
}
