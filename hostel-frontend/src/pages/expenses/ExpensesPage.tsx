import { useState } from 'react'
import { FilterMasterDetailLayout } from '@shared/layouts/FilterMasterDetailLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { Button } from '@shared/ui/Button'
import { FilterBar } from '@shared/ui/FilterBar'

function ExpenseRow({ id, vendor, category, date, amount, onClick }: any) {
  return (
    <div onClick={onClick} style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <strong style={{ fontSize: 'var(--font-size-base)' }}>{vendor}</strong>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{category} · {date}</span>
      </div>
      <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-base)' }}>${amount.toFixed(2)}</div>
    </div>
  )
}

export function ExpensesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const header = (
    <PageHeader
      title="Operating Expenses"
      description="Hostel business costs. Not guest folios."
      actions={<Button variant="primary" disabled title="Logging operating expenses is an upcoming feature">Log Expense</Button>}
    />
  )

  const filterBar = (
    <FilterBar
      search={<input type="search" placeholder="Search vendor..." style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} />}
    />
  )

  const masterList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <ExpenseRow id="E-101" vendor="City Utilities" category="Electricity" date="20 Mar 2026" amount={420.50} onClick={() => setSelectedId('E-101')} />
      <ExpenseRow id="E-102" vendor="Local Plumber" category="Maintenance" date="18 Mar 2026" amount={150.00} onClick={() => setSelectedId('E-102')} />
    </div>
  )

  const contextPanel = selectedId ? {
    open: true,
    title: 'Expense Detail',
    onClose: () => setSelectedId(null),
    identity: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0 }}>{selectedId === 'E-101' ? 'City Utilities' : 'Local Plumber'}</h3>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Date: {selectedId === 'E-101' ? '20 Mar 2026' : '18 Mar 2026'}</span>
      </div>
    ),
    summary: (
      <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--color-background)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
        <span>Total Logged</span>
        <span>${selectedId === 'E-101' ? '420.50' : '150.00'}</span>
      </div>
    ),
    actions: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Button variant="secondary" disabled title="Editing expense records is an upcoming feature">Edit Record</Button>
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
