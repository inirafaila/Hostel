import './StatusBadge.css'

/**
 * StatusBadge semantic variant families.
 * Five families — each maps to a distinct operational meaning:
 *
 * - neutral: inactive, archived, draft, secondary info
 * - success: completed, paid, resolved, clean, ready
 * - warning: partial, pending, soft concern — NOT a block
 * - danger:  blocked, failed, critical, hard stop
 * - info:    informational, AI-related, advisory
 *
 * Domain-specific status → BadgeVariant mappings belong in entity modules,
 * not here. This component is domain-unaware.
 */
export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

/**
 * Size variants:
 * - md (default): pill with text label
 * - sm: smaller pill
 * - dot: colored circle only, no text (compact indicators)
 */
export type BadgeSize = 'sm' | 'md' | 'dot'

interface StatusBadgeProps {
  variant: BadgeVariant
  label: string
  icon?: string
  size?: BadgeSize
  className?: string
}

export function StatusBadge({
  variant,
  label,
  icon,
  size = 'md',
  className = '',
}: StatusBadgeProps) {
  if (size === 'dot') {
    return (
      <span
        className={`badge badge--dot badge--${variant} ${className}`}
        aria-label={label}
        title={label}
        role="img"
      />
    )
  }

  return (
    <span className={`badge badge--${size} badge--${variant} ${className}`} aria-label={label}>
      {icon && <span className="badge__icon" aria-hidden="true">{icon}</span>}
      <span className="badge__label">{label}</span>
    </span>
  )
}
