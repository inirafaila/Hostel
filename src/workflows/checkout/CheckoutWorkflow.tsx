import { useState } from 'react'
import { StickyConfirmFooter } from '@shared/ui/StickyConfirmFooter'
import { Button } from '@shared/ui/Button'
import { ValidationSummaryBlock } from '@shared/ui/ValidationSummaryBlock'
import { AlertShell } from '@shared/ui/AlertShell'

export interface CheckoutWorkflowProps {
  stayId: string
  guestName: string
  currentBed: string
  folioBalance: number
  onClose: () => void
}

/**
 * CheckoutWorkflow — Guided, review-first checkout orchestration.
 * Surfaces Housekeeping turnover consequence (bed -> dirty) and Folio balance warnings explicitly.
 * Checkout transforms Stay context into Checked-out context.
 */
export function CheckoutWorkflow({ stayId, guestName, currentBed, folioBalance, onClose }: CheckoutWorkflowProps) {
  const [step, setStep] = useState<1 | 2>(1)

  const hasBalance = folioBalance > 0
  const hasNegativeBalance = folioBalance < 0

  return (
    <div className="wf-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="wf-modal" style={{ backgroundColor: 'var(--color-surface)', width: '600px', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        <header style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Checkout Guest</h2>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{guestName} · {stayId}</span>
        </header>

        <div style={{ padding: 'var(--space-4)', overflowY: 'auto' }}>
          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              <ValidationSummaryBlock
                title="Checkout Assessment"
                items={[
                  ...(hasBalance ? [{ id: 'f1', severity: 'warning' as const, message: `Open balance of $${folioBalance.toFixed(2)}.` }] : []),
                  ...(hasNegativeBalance ? [{ id: 'f2', severity: 'warning' as const, message: `Guest is owed a refund of $${Math.abs(folioBalance).toFixed(2)}.` }] : []),
                  { id: 'h1', severity: 'info' as const, message: `Bed ${currentBed} will be marked Dirty for Housekeeping.` }
                ]}
              />

              {(hasBalance || hasNegativeBalance) && (
                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 var(--space-3) 0' }}>Resolve Folio Before Departure</h3>
                  <Button variant="secondary" style={{ width: '100%' }}>Launch Folio UI</Button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>Review Checkout</h3>
              {hasBalance && (
                <AlertShell tier="warning" title="Unpaid Departure">
                  Checking out without settling the balance will convert the folio into an Open Receivable.
                </AlertShell>
              )}
            </div>
          )}
        </div>

        {step === 1 ? (
          <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={() => setStep(2)}>Review & Confirm</Button>
          </footer>
        ) : (
          <StickyConfirmFooter
            consequences={[
              { label: 'Action', value: 'Complete Active Stay' },
              { label: 'Housekeeping', value: `${currentBed} → Dirty`, emphasis: 'strong' },
              hasBalance ? { label: 'Financial Action', value: `Create Receivable for $${folioBalance.toFixed(2)}`, emphasis: 'warning' } : { label: 'Folio status', value: 'Settled ($0.00)' },
            ]}
            primaryAction={<Button variant="primary" onClick={onClose}>Checkout Guest</Button>}
            secondaryAction={<Button variant="secondary" onClick={() => setStep(1)}>Back</Button>}
          />
        )}
      </div>
    </div>
  )
}
