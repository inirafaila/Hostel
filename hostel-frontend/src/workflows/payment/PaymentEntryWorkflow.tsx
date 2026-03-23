import { useState } from 'react'
import { StickyConfirmFooter } from '@shared/ui/StickyConfirmFooter'
import { Button } from '@shared/ui/Button'
import { AlertShell } from '@shared/ui/AlertShell'

export interface PaymentEntryWorkflowProps {
  folioId: string
  currentBalance: number
  onClose: () => void
}

/**
 * PaymentEntryWorkflow — Guided MVP Payment Surface.
 * Payment != Refund.
 * Presentational workflow orchestration overlay.
 */
export function PaymentEntryWorkflow({ folioId, currentBalance, onClose }: PaymentEntryWorkflowProps) {
  const [step, setStep] = useState<1 | 2>(1)

  return (
    <div className="wf-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="wf-modal" style={{ backgroundColor: 'var(--color-surface)', width: '480px', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        <header style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Post Payment</h2>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>Folio: {folioId}</span>
        </header>

        <div style={{ padding: 'var(--space-4)', overflowY: 'auto' }}>
          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <AlertShell tier="info" inline>
                Current balance due: <strong>${currentBalance.toFixed(2)}</strong>
              </AlertShell>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Amount</label>
                <input type="number" defaultValue={currentBalance.toFixed(2)} style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Method</label>
                <select style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <option value="card">Card (Terminal)</option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Reference / Note (Optional)</label>
                <input type="text" placeholder="Terminal auth code..." style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>Review Payment</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                You are posting a payment that will reduce the folio balance.
              </p>
            </div>
          )}
        </div>

        {step === 1 ? (
          <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={() => setStep(2)}>Review Payment</Button>
          </footer>
        ) : (
          <StickyConfirmFooter
            consequences={[
              { label: 'Payment Amount', value: '$' + currentBalance.toFixed(2), emphasis: 'strong' },
              { label: 'New Balance Due', value: '$0.00' },
            ]}
            primaryAction={<Button variant="primary" onClick={onClose}>Post Payment</Button>}
            secondaryAction={<Button variant="secondary" onClick={() => setStep(1)}>Back</Button>}
          />
        )}
      </div>
    </div>
  )
}
