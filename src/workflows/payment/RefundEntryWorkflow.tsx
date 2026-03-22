import { useState } from 'react'
import { StickyConfirmFooter } from '@shared/ui/StickyConfirmFooter'
import { Button } from '@shared/ui/Button'
import { AlertShell } from '@shared/ui/AlertShell'

export interface RefundEntryWorkflowProps {
  folioId: string
  refundableAmount: number
  onClose: () => void
}

/**
 * RefundEntryWorkflow — Guided MVP Refund Surface.
 * Refund != Negative Payment. Distinct UI explicitly tracking outgoing funds reason.
 */
export function RefundEntryWorkflow({ folioId, refundableAmount, onClose }: RefundEntryWorkflowProps) {
  const [step, setStep] = useState<1 | 2>(1)

  return (
    <div className="wf-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="wf-modal" style={{ backgroundColor: 'var(--color-surface)', width: '480px', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        <header style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Issue Refund</h2>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>Folio: {folioId}</span>
        </header>

        <div style={{ padding: 'var(--space-4)', overflowY: 'auto' }}>
          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <AlertShell tier="warning" inline>
                Refunds deduct collected revenue. Maximum refundable: <strong>${refundableAmount.toFixed(2)}</strong>
              </AlertShell>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Refund Amount</label>
                <input type="number" defaultValue={0.00} max={refundableAmount} style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Refund Reason (Required)</label>
                <select style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <option value="">Select reason...</option>
                  <option value="overcharge">Operator Error - Overcharge</option>
                  <option value="cancellation">Cancellation Policy Reversal</option>
                  <option value="complaint">Guest Complaint / Compensation</option>
                  <option value="deposit">Deposit Return</option>
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>Review Refund</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                This action is final and will record outgoing funds.
              </p>
            </div>
          )}
        </div>

        {step === 1 ? (
          <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={() => setStep(2)}>Review Refund</Button>
          </footer>
        ) : (
          <StickyConfirmFooter
            consequences={[
              { label: 'Refund Amount', value: '- $20.00', emphasis: 'strong' },
              { label: 'Reason', value: 'Operator Error - Overcharge' },
            ]}
            primaryAction={<Button variant="primary" onClick={onClose}>Issue Refund</Button>}
            secondaryAction={<Button variant="secondary" onClick={() => setStep(1)}>Back</Button>}
          />
        )}
      </div>
    </div>
  )
}
