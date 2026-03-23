import type { ReactNode } from 'react'
import './AlertShell.css'

/**
 * Alert tier taxonomy — aligned with Design System Alert Taxonomy:
 * - info:     Policy notes, AI summaries, contextual guidance
 * - warning:  Soft concern, pending review, partial state — NOT a block
 * - danger:   Critical unresolved issue, failed state
 * - block:    Explicit hard-block — visually heavier than danger (Warning ≠ Block)
 */
export type AlertTier = 'info' | 'warning' | 'danger' | 'block'

interface AlertShellProps {
  tier: AlertTier
  title?: string
  children: ReactNode
  /** Optional CTA or action slot */
  action?: ReactNode
  /**
   * inline variant: lighter background, no left border bar.
   * Use for inline form errors or within compact section areas.
   */
  inline?: boolean
  /**
   * Dismiss callback — when provided, renders an ✕ close button.
   * Calling context manages show/hide state.
   */
  onDismiss?: () => void
  className?: string
}

const icons: Record<AlertTier, string> = {
  info:    'ℹ',
  warning: '△',
  danger:  '⊗',
  block:   '⛔',
}

export function AlertShell({
  tier,
  title,
  children,
  action,
  inline = false,
  onDismiss,
  className = '',
}: AlertShellProps) {
  return (
    <div
      className={`alert alert--${tier} ${inline ? 'alert--inline' : ''} ${className}`}
      role="alert"
    >
      <span className="alert__tier-icon" aria-hidden="true">{icons[tier]}</span>
      <div className="alert__body">
        {title && <p className="alert__title">{title}</p>}
        <div className="alert__content">{children}</div>
      </div>
      {action && <div className="alert__action">{action}</div>}
      {onDismiss && (
        <button
          className="alert__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  )
}
