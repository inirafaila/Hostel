import './PaymentSummaryStrip.css'

export type PaymentStatus = 'settled' | 'pending' | 'voided' | 'reversed'
export type PaymentMethod = 'cash' | 'card' | 'bank-transfer' | 'other'

export interface PaymentRecord {
  id: string
  method: PaymentMethod
  amount: number
  date: string
  status: PaymentStatus
  note?: string
}

interface PaymentSummaryStripProps {
  payments: PaymentRecord[]
  currency?: string
  className?: string
}

const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash',
  card: 'Card',
  'bank-transfer': 'Bank Transfer',
  other: 'Other',
}

/**
 * PaymentSummaryStrip — payment history row list.
 * Each payment is a distinct row.
 *
 * Design rule: voided/reversed rows must remain visible
 * (de-emphasized but NOT deleted from display).
 * Folio audit trail must remain intact.
 *
 * Presentational only — no mutation logic.
 */
export function PaymentSummaryStrip({
  payments,
  currency = 'USD',
  className = '',
}: PaymentSummaryStripProps) {
  if (payments.length === 0) return null

  return (
    <div className={`payment-strip ${className}`}>
      {payments.map(p => (
        <div
          key={p.id}
          className={`payment-strip__row payment-strip__row--${p.status}`}
        >
          <div className="payment-strip__left">
            <span className="payment-strip__method">{METHOD_LABELS[p.method]}</span>
            <span className="payment-strip__date">{p.date}</span>
            {p.note && <span className="payment-strip__note">{p.note}</span>}
          </div>
          <div className="payment-strip__right">
            {(p.status === 'voided' || p.status === 'reversed') ? (
              <span className="payment-strip__voided-tag">{p.status}</span>
            ) : null}
            <span className="payment-strip__amount">
              {currency} {p.amount.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
