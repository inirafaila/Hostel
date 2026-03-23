import { useState } from 'react'
import { FilterMasterDetailLayout } from '@shared/layouts/FilterMasterDetailLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { Button } from '@shared/ui/Button'
import { FilterBar } from '@shared/ui/FilterBar'
import { ValidationSummaryBlock } from '@shared/ui/ValidationSummaryBlock'
import { AlertShell } from '@shared/ui/AlertShell'

/** Local UI mapping for MVP */
function MaintenanceRow({ id, title, location, severity, status, onClick }: any) {
  const getBadge = () => {
    switch (severity) {
      case 'block': return <span style={{ padding: '2px 6px', background: 'var(--color-error-100)', color: 'var(--color-error-700)', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>BLOCKING</span>
      case 'reduce': return <span style={{ padding: '2px 6px', background: 'var(--color-warning-100)', color: 'var(--color-warning-700)', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>REDUCED</span>
      default: return null
    }
  }

  return (
    <div onClick={onClick} style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <strong style={{ fontSize: 'var(--font-size-base)' }}>{title}</strong>
          {getBadge()}
        </div>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{location} · {id}</span>
      </div>
      <div>
        <span style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--space-1) var(--space-2)', background: 'var(--color-background)', borderRadius: 'var(--radius-sm)', textTransform: 'capitalize' }}>
          {status}
        </span>
      </div>
    </div>
  )
}

export function MaintenancePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const header = (
    <PageHeader
      title="Maintenance"
      description="Asset issues & inventory impact"
      actions={<Button variant="primary" disabled title="Reporting an issue is an upcoming feature">Report Issue</Button>}
    />
  )

  const filterBar = (
    <FilterBar
      search={<input type="search" placeholder="Search issues..." style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} />}
      filters={
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <select style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            <option value="all">Impact: All</option>
            <option value="block">Impact: Blocking Sellability</option>
          </select>
        </div>
      }
    />
  )

  const masterList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <MaintenanceRow id="M-001" title="Broken AC Unit" location="Dorm 2" severity="block" status="open" onClick={() => setSelectedId('M-001')} />
      <MaintenanceRow id="M-002" title="Leaking Faucet" location="Shared Bath A" severity="reduce" status="in-progress" onClick={() => setSelectedId('M-002')} />
      <MaintenanceRow id="M-003" title="Squeaky Hinge" location="D4-B2" severity="none" status="open" onClick={() => setSelectedId('M-003')} />
    </div>
  )

  const contextPanel = selectedId ? {
    open: true,
    title: 'Maintenance Case',
    onClose: () => setSelectedId(null),
    identity: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0 }}>{selectedId === 'M-001' ? 'Broken AC Unit' : selectedId === 'M-002' ? 'Leaking Faucet' : 'Squeaky Hinge'}</h3>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Reported 2 days ago</span>
      </div>
    ),
    warnings: selectedId === 'M-001' ? (
      <AlertShell tier="block" title="Inventory Impact">
        This completely blocks 6 beds from being sold. (Dorm 2 is Out of Order).
      </AlertShell>
    ) : undefined,
    actions: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Button variant="primary" disabled title="Status progression is an upcoming feature">Mark In-Progress</Button>
        <Button variant="secondary" disabled title="Status progression is an upcoming feature">Mark Resolved</Button>
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
