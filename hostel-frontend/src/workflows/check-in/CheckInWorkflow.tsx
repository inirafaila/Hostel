import { useState } from 'react'
import { StickyConfirmFooter } from '@shared/ui/StickyConfirmFooter'
import { Button } from '@shared/ui/Button'
import { ValidationSummaryBlock } from '@shared/ui/ValidationSummaryBlock'
import { AlertShell } from '@shared/ui/AlertShell'

export interface CheckInWorkflowProps {
  reservationId: string      // Backend ID
  targetBedId: string        // Backend ID
  displayRef: string         // Human-friendly ref (e.g. R-00123)
  guestName: string
  assignedBed: string        // Human-friendly label (e.g. D4-B2)
  balanceDue: number
  bedReady: boolean
  onClose: () => void
  onSuccess?: (stayId: string) => void
}

/**
 * CheckInWorkflow — Guided, review-first check-in orchestration.
 * Explicitly surfaces bed readiness, financial blockers, and operational consequence.
 * CheckIn transforms Reservation context into active Stay context.
 */
export function CheckInWorkflow({ reservationId, targetBedId, displayRef, guestName, assignedBed, balanceDue, bedReady, onClose, onSuccess }: CheckInWorkflowProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [overrideChecked, setOverrideChecked] = useState(false)
  const [overrideReason, setOverrideReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<{ message: string; failures?: any[] } | null>(null)

  const hasFinancialBlock = balanceDue > 0
  const hasBedBlock = !bedReady

  const handleExecuteCheckIn = async () => {
    setIsSubmitting(true)
    setServerError(null)

    const payload = {
      reservationId,
      targetBedId,
      operatorId: 'operator-123',
      overrides: overrideChecked && overrideReason.trim() ? [
        { rule: 'BedDirty', reason: overrideReason }
      ] : []
    }

    try {
      const CHECK_IN_API_URL = 'http://localhost:3001/api/stays/check-in'
      const res = await fetch(CHECK_IN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'ValidationFailed') {
          setServerError({
            message: data.requiresOverride ? 'Check-in blocked. Explicit overrides required.' : 'Check-in blocked by strict rules.',
            failures: data.violations
          })
          setStep(1) // kick them back to review
        } else {
          setServerError({ message: data.message || 'An unknown error occurred on the server' })
        }
      } else {
        if (onSuccess) onSuccess(data.stayId)
        onClose()
      }
    } catch (err) {
      setServerError({ message: 'Network error communicating with check-in service.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="wf-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="wf-modal" style={{ backgroundColor: 'var(--color-surface)', width: '600px', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        <header style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Check In Guest</h2>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{guestName} · {displayRef}</span>
        </header>

        <div style={{ padding: 'var(--space-4)', overflowY: 'auto' }}>
          {serverError && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <AlertShell tier="block" title={serverError.message}>
                {serverError.failures && serverError.failures.map((f, i) => (
                  <div key={i}>• [{f.ruleCode}] {f.message}</div>
                ))}
              </AlertShell>
            </div>
          )}

          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              <ValidationSummaryBlock
                title="Pre-arrival conditions"
                items={[
                  ...(hasFinancialBlock ? [{ id: 'f1', severity: 'warning' as const, message: `Guest has a balance due of $${balanceDue.toFixed(2)}` }] : []),
                  ...(hasBedBlock ? [{ id: 'b1', severity: 'error' as const, message: `Assigned bed (${assignedBed}) is not Ready (Status: Dirty)` }] : []),
                  { id: 'i1', severity: 'info' as const, message: 'Check-in is within standard hours' }
                ]}
              />

              {hasFinancialBlock && (
                <div style={{ padding: 'var(--space-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-sm)', margin: '0 0 var(--space-3) 0' }}>Settle Balance Before Entry</h3>
                  <Button variant="secondary" style={{ width: '100%' }} disabled title="Settle the balance on the Folio page prior to check-in">Launch Payment UI (Deferred)</Button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>Review Check-In</h3>
              {hasBedBlock && (
                <AlertShell tier="block" title="Bed Not Ready">
                  You are checking a guest into a dirty bed. This requires manual override.
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
              { label: 'Action', value: 'Create Active Stay from Reservation' },
              { label: 'Assigned Bed', value: assignedBed, emphasis: hasBedBlock ? 'strong' : 'normal' },
              { label: 'Balance Due', value: '$' + balanceDue.toFixed(2) },
            ]}
            override={
              hasBedBlock ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
                    <input type="checkbox" checked={overrideChecked} onChange={e => setOverrideChecked(e.target.checked)} required />
                    Override Bed Readiness Block
                  </label>
                  {overrideChecked && (
                    <input 
                      type="text" 
                      placeholder="Reason for override (required)" 
                      value={overrideReason} 
                      onChange={e => setOverrideReason(e.target.value)}
                      style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', width: '100%', fontSize: 'var(--font-size-sm)' }}
                    />
                  )}
                </div>
              ) : undefined
            }
            primaryAction={
              <Button 
                variant="primary" 
                disabled={isSubmitting || (hasBedBlock && (!overrideChecked || !overrideReason.trim()))} 
                onClick={handleExecuteCheckIn}
              >
                {isSubmitting ? 'Processing...' : 'Check In'}
              </Button>
            }
            secondaryAction={<Button variant="secondary" disabled={isSubmitting} onClick={() => setStep(1)}>Back</Button>}
          />
        )}
      </div>
    </div>
  )
}
