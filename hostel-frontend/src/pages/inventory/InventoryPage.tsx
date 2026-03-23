import { useState } from 'react'
import { SummaryBoardLayout } from '@shared/layouts/SummaryBoardLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { Button } from '@shared/ui/Button'
import { SummaryStrip } from '@shared/ui/SummaryStrip'

import { DormInventoryCard } from '@entities/bed/DormInventoryCard'
import { BedTile } from '@entities/bed/BedTile'

export function InventoryPage() {
  const [selectedBed, setSelectedBed] = useState<string | null>(null)

  const header = (
    <PageHeader
      title="Inventory Board"
      description="Real-time bed capability and operational status"
      actions={<Button variant="primary">Add Out Of Order Block</Button>}
    />
  )

  const summary = (
    <SummaryStrip
      items={[
        { label: 'Total Beds', value: '42' },
        { label: 'Available', value: '18', emphasis: 'success' },
        { label: 'Occupied', value: '20' },
        { label: 'Maintenance/OOO', value: '2', emphasis: 'danger' },
        { label: 'Dirty', value: '2', emphasis: 'warning' },
      ]}
    />
  )

  const dorm4Beds = [
    { label: 'D4-B1', state: 'available' as const },
    { label: 'D4-B2', state: 'reserved' as const },
    { label: 'D4-B3', state: 'occupied' as const, guest: 'Alice M.' },
    { label: 'D4-B4', state: 'dirty' as const },
    { label: 'D4-B5', state: 'maintenance' as const },
    { label: 'D4-B6', state: 'out-of-order' as const },
  ]

  const dorm2Beds = [
    { label: 'D2-B1', state: 'available' as const },
    { label: 'D2-B2', state: 'available' as const },
    { label: 'D2-B3', state: 'occupied' as const, guest: 'Priya N.' },
    { label: 'D2-B4', state: 'occupied' as const, guest: 'Zara T.' },
  ]

  const boardContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Dorm 4 Group */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <DormInventoryCard
          name="Dorm 4" dormType="Mixed 6-Bed" totalBeds={6}
          byState={{ available: 1, reserved: 1, occupied: 1, dirty: 1, maintenance: 1, 'out-of-order': 1 }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
          {dorm4Beds.map(b => (
            <BedTile
              key={b.label} bedLabel={b.label} state={b.state} guestName={b.guest}
              selected={selectedBed === b.label} onClick={() => setSelectedBed(b.label)}
            />
          ))}
        </div>
      </section>

      {/* Dorm 2 Group */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <DormInventoryCard
          name="Dorm 2" dormType="Female 4-Bed" totalBeds={4}
          byState={{ available: 2, occupied: 2 }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
          {dorm2Beds.map(b => (
            <BedTile
              key={b.label} bedLabel={b.label} state={b.state} guestName={b.guest}
              selected={selectedBed === b.label} onClick={() => setSelectedBed(b.label)}
            />
          ))}
        </div>
      </section>
    </div>
  )

  return (
    <SummaryBoardLayout
      header={header}
      summary={summary}
    >
      {boardContent}
    </SummaryBoardLayout>
  )
}
