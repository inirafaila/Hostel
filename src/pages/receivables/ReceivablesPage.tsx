import { useState } from 'react'
import { FilterMasterDetailLayout } from '@shared/layouts/FilterMasterDetailLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { Button } from '@shared/ui/Button'
import { FilterBar } from '@shared/ui/FilterBar'
import { AlertShell } from '@shared/ui/AlertShell'

/** Local MVP support layout */
function ReceivableRow({ entityName, id, folioId, amount, due, status, onClick }: any) {
  return (
    <div onClick={onClick} style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <strong style={{ fontSize: 'var(--font-size-base)' }}>{entityName}</strong>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Recv: {id} · Folio: {folioId}</span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-base)' }}>${amount.toFixed(2)}</div>
        <span style={{ fontSize: 'var(--font-size-xs)', color: status === 'overdue' ? 'var(--color-error-600)' : 'var(--color-text-secondary)' }}>
          {status === 'overdue' ? `Overdue (${due})` : `Due ${due}`}
        </span>
      </div>
    </div>
  )
}

export function ReceivablesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const header = (
    <PageHeader
      title="Receivables"
      description="Unpaid post-stay funds & direct bills"
      actions={<Button variant="secondary" disabled title="Exporting reports is an upcoming feature">Export Aging Report</Button>}
    />
  )

  const filterBar = (
    <FilterBar
      search={<input type="search" placeholder="Search guest or agency..." style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} />}
      filters={
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <select style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            <option value="all">Status: Open</option>
            <option value="overdue">Status: Overdue</option>
          </select>
        </div>
      }
    />
  )

  const masterList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <ReceivableRow id="RCV-01" entityName="Hostelworld (OTA)" folioId="F-9900" amount={450.00} due="10 days" status="open" onClick={() => setSelectedId('RCV-01')} />
      <ReceivableRow id="RCV-02" entityName="James Okafor" folioId="F-9901" amount={45.00} due="30 days" status="overdue" onClick={() => setSelectedId('RCV-02')} />
    </div>
  )

  const contextPanel = selectedId ? {
    open: true,
    title: 'Receivable Detail',
    onClose: () => setSelectedId(null),
    identity: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0 }}>{selectedId === 'RCV-01' ? 'Hostelworld (OTA)' : 'James Okafor'}</h3>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Balance: ${selectedId === 'RCV-01' ? '450.00' : '45.00'}</span>
      </div>
    ),
    warnings: selectedId === 'RCV-02' ? (
      <AlertShell tier="warning" title="Collections Risk">
        Guest departed 30 days ago with unpaid incidentals.
      </AlertShell>
    ) : undefined,
    actions: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Button variant="primary" disabled title="Recording collection directly is an upcoming feature">Record Collection</Button>
        <Button variant="secondary" disabled title="Direct Folio deep-linking is currently deferred">View Original Folio</Button>
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
