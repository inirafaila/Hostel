import { StatusBadge } from '@shared/ui/StatusBadge'
import './ReceivableRow.css'

export type ReceivableStatus = 'open' | 'partial' | 'collected'

interface ReceivableRowProps {
  id: string
  guestName: string
  checkOutDate: string
  amount: number
  /** Days since checkout */
  agingDays: number
  status: ReceivableStatus
  currency?: string
  onRowClick?: () => void
  className?: string
}

/**
 * ReceivableRow — post-checkout open balance row.
 * Receivable ≠ Folio. The folio may be closed, but the receivable
 * tracks the external collection lifecycle separately.
 *
 * Aging days communicate urgency — older receivables need attention.
 * Presentational only — no mutation logic.
 */
export function ReceivableRow({
  guestName,
  checkOutDate,
  amount,
  agingDays,
  status,
  currency = 'USD',
  onRowClick,
  className = '',
}: ReceivableRowProps) {
  const agingClass =
    agingDays >= 30 ? 'receivable-row--aging-critical'
    : agingDays >= 14 ? 'receivable-row--aging-warn'
    : ''

  const statusVariant = status === 'collected' ? 'success'
    : status === 'partial' ? 'warning'
    : 'danger'

  return (
    <div
      className={`receivable-row ${agingClass} ${onRowClick ? 'receivable-row--clickable' : ''} ${className}`}
      onClick={onRowClick}
      role={onRowClick ? 'button' : undefined}
      tabIndex={onRowClick ? 0 : undefined}
    >
      <div className="receivable-row__guest">
        <span className="receivable-row__name">{guestName}</span>
        <span className="receivable-row__date">Checkout: {checkOutDate}</span>
      </div>

      <div className="receivable-row__aging">
        <span className="receivable-row__aging-days">{agingDays}d</span>
        <span className="receivable-row__aging-label">overdue</span>
      </div>

      <StatusBadge variant={statusVariant} label={status === 'open' ? 'Open' : status === 'partial' ? 'Partial' : 'Collected'} />

      <span className="receivable-row__amount">
        {currency} {amount.toFixed(2)}
      </span>
    </div>
  )
}
