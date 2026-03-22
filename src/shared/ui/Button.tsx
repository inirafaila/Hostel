import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  /** Loading state — disables interaction and shows indicator */
  loading?: boolean
}

/**
 * Button — generic shared UI primitive.
 * Domain-unaware. Accepts variant for semantic coloring.
 *
 * Labels should be command-oriented at the usage site.
 * Example: "Check In Guest", "Post Payment", "Resolve Case"
 * Never label from here — labels come from the calling context.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${loading ? 'btn--loading' : ''} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      <span className={loading ? 'btn__content--hidden' : 'btn__content'}>
        {children}
      </span>
    </button>
  )
}
