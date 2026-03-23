import { useState } from 'react'
import { FilterMasterDetailLayout } from '@shared/layouts/FilterMasterDetailLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { Button } from '@shared/ui/Button'
import { FilterBar } from '@shared/ui/FilterBar'
import { HousekeepingTaskRow } from '@entities/housekeeping-task/HousekeepingTaskRow'
import { ValidationSummaryBlock } from '@shared/ui/ValidationSummaryBlock'

export function HousekeepingPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const header = (
    <PageHeader
      title="Housekeeping"
      description="Turnover Priority: 14 Beds"
      actions={<Button variant="primary" disabled title="Printing the board is an upcoming feature">Print Board</Button>}
    />
  )

  const filterBar = (
    <FilterBar
      filters={
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <select style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <option value="all">Show All Needs</option>
            <option value="dirty">Only Dirty Turnovers</option>
          </select>
          <select style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}>
            <option value="all">Any Floor / Zone</option>
          </select>
        </div>
      }
    />
  )

  const masterList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div onClick={() => setSelectedId('t1')} style={{ cursor: 'pointer' }}>
        <HousekeepingTaskRow id="t1" bedLabel="D2-B1" locationLabel="Dorm 2" status="dirty" urgency="high" isCheckoutTurnover={true} />
      </div>
      <div onClick={() => setSelectedId('t2')} style={{ cursor: 'pointer' }}>
        <HousekeepingTaskRow id="t2" bedLabel="D4-B4" locationLabel="Dorm 4" status="cleaning" urgency="normal" />
      </div>
      <div onClick={() => setSelectedId('t3')} style={{ cursor: 'pointer' }}>
        <HousekeepingTaskRow id="t3" bedLabel="P1-M" locationLabel="Private 1" status="inspect" urgency="normal" />
      </div>
    </div>
  )

  const contextPanel = selectedId ? {
    open: true,
    title: 'Task Details',
    onClose: () => setSelectedId(null),
    identity: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>
          {selectedId === 't1' ? 'D2-B1' : selectedId === 't2' ? 'D4-B4' : 'P1-M'}
        </h3>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          Current Status: <strong>{selectedId === 't1' ? 'Dirty' : selectedId === 't2' ? 'Cleaning' : 'Inspect'}</strong>
        </span>
      </div>
    ),
    warnings: selectedId === 't1' ? (
      <ValidationSummaryBlock
        items={[
          { id: 'w1', severity: 'warning', message: 'High Priority: Check-in expected today.' },
          { id: 'w2', severity: 'info', message: 'Result of checkout earlier today.' }
        ]}
      />
    ) : undefined,
    actions: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {selectedId === 't1' && <Button variant="primary" disabled title="Task advancement is an upcoming feature">Start Cleaning</Button>}
        {selectedId === 't2' && <Button variant="primary" disabled title="Task advancement is an upcoming feature">Mark for Inspection</Button>}
        {selectedId === 't3' && <Button variant="primary" disabled title="Task advancement is an upcoming feature">Mark Ready</Button>}
        <Button variant="secondary" disabled title="Maintenance reporting is an upcoming feature">Report Issue (Maintenance)</Button>
      </div>
    )
  } : undefined

  return (
    <FilterMasterDetailLayout
      header={header}
      filterBar={filterBar}
      contextPanel={contextPanel}
    >
      {masterList}
    </FilterMasterDetailLayout>
  )
}
