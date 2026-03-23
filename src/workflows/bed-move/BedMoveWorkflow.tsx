import { useState } from 'react'
import { StickyConfirmFooter } from '@shared/ui/StickyConfirmFooter'
import { Button } from '@shared/ui/Button'
import { ValidationSummaryBlock } from '@shared/ui/ValidationSummaryBlock'
import { AlertShell } from '@shared/ui/AlertShell'

export interface BedMoveWorkflowProps {
  stayId: string
  guestName: string
  currentBed: string
  onClose: () => void
}

/**
 * BedMoveWorkflow — Review-first bounded workflow to alter a strictly internal Stay Assignment.
 * Moving a bed invokes housekeeping (Current -> Dirty) and asserts allocation locks.
 */
export function BedMoveWorkflow({ stayId, guestName, currentBed, onClose }: BedMoveWorkflowProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedBed, setSelectedBed] = useState<string>('')
  const [overrideChecked, setOverrideChecked] = useState(false)
  const [overrideReason, setOverrideReason] = useState('')

  // Mock rules validation
  const ruleConflict = selectedBed === 'D1-B1' // Suppose D1 is Female Only, guest is Male

  return (
    <div className="wf-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="wf-modal" style={{ backgroundColor: 'var(--color-surface)', width: '600px', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        <header style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Move Bed Assignment</h2>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{guestName} · {stayId}</span>
        </header>

        <div style={{ padding: 'var(--space-4)', overflowY: 'auto' }}>
          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>Current Assignment</span>
                <span style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-background)' }}>{currentBed}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>Target Bed</label>
                <select 
                  value={selectedBed} 
                  onChange={(e) => setSelectedBed(e.target.value)} 
                  style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}
                >
                  <option value="">Select a ready/clean bed...</option>
                  <option value="D4-B3">Dorm 4 - Bed 3 (Mixed)</option>
                  <option value="D1-B1">Dorm 1 - Bed 1 (Female Only) - Rule Conflict Demo</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>Move Reason</label>
                <select style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <option value="guest_request">Guest Request</option>
                  <option value="maintenance">Maintenance Issue</option>
                  <option value="admin">Admin Reallocation</option>
                </select>
              </div>

              {selectedBed && (
                <ValidationSummaryBlock
                  title="Target Assessment"
                  items={[
                    ...(ruleConflict ? [{ id: 'w1', severity: 'error' as const, message: `Gender rule violation detected.` }] : []),
                    { id: 'i1', severity: 'info' as const, message: `Current bed ${currentBed} will become Dirty upon confirmed move.` }
                  ]}
                />
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>Review Bed Move</h3>
              {ruleConflict && (
                <AlertShell tier="block" title="Constraint Violation">
                  Moving a guest to a restricted dorm requires a manual rule override.
                </AlertShell>
              )}
            </div>
          )}
        </div>

        {step === 1 ? (
          <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" disabled={!selectedBed} onClick={() => setStep(2)}>Review & Confirm</Button>
          </footer>
        ) : (
          <StickyConfirmFooter
            consequences={[
              { label: 'Stay Record', value: `Assignment modified` },
              { label: 'New Current Assigment', value: selectedBed, emphasis: 'strong' },
              { label: 'Housekeeping', value: `${currentBed} → Dirty` },
            ]}
            override={
              ruleConflict ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
                    <input type="checkbox" checked={overrideChecked} onChange={e => setOverrideChecked(e.target.checked)} required />
                    Override Gender Requirement Rule
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
            primaryAction={<Button variant="primary" disabled={ruleConflict && (!overrideChecked || !overrideReason.trim())} onClick={onClose}>Confirm Move</Button>}
            secondaryAction={<Button variant="secondary" onClick={() => setStep(1)}>Back</Button>}
          />
        )}
      </div>
    </div>
  )
}
