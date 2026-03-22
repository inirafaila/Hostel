import { BedStatusBadge } from './BedStatusBadge'
import type { BedState } from './BedStatusBadge'
import './BedTile.css'

interface BedTileProps {
  bedLabel: string
  dormLabel?: string
  state: BedState
  /** Guest name if occupied */
  guestName?: string
  onClick?: () => void
  /** Selected state — e.g. in bed selector flows */
  selected?: boolean
  /** Disabled state — e.g. not eligible in bed-move flow */
  disabled?: boolean
  className?: string
}

/**
 * BedTile — bed operational state tile.
 * Used in inventory grid, dorm views, bed selector.
 * Each state has distinct color/icon via BedStatusBadge.
 *
 * Bed identity MUST be clearly visible — bed-first display rule.
 * Presentational only — no command logic.
 */
export function BedTile({
  bedLabel,
  dormLabel,
  state,
  guestName,
  onClick,
  selected = false,
  disabled = false,
  className = '',
}: BedTileProps) {
  return (
    <div
      className={[
        'bed-tile',
        `bed-tile--${state}`,
        selected ? 'bed-tile--selected' : '',
        disabled ? 'bed-tile--disabled' : '',
        onClick && !disabled ? 'bed-tile--clickable' : '',
        className,
      ].filter(Boolean).join(' ')}
      onClick={!disabled && onClick ? onClick : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-pressed={onClick ? selected : undefined}
      aria-disabled={disabled}
    >
      {/* Bed identity — largest text, always visible */}
      <span className="bed-tile__label">{bedLabel}</span>
      {dormLabel && <span className="bed-tile__dorm">{dormLabel}</span>}

      <BedStatusBadge state={state} size="sm" className="bed-tile__badge" />

      {guestName && (
        <span className="bed-tile__guest">{guestName}</span>
      )}
    </div>
  )
}
