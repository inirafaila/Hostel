import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FilterMasterDetailLayout } from '@shared/layouts/FilterMasterDetailLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { Button } from '@shared/ui/Button'
import { FilterBar } from '@shared/ui/FilterBar'
import { AlertShell } from '@shared/ui/AlertShell'

import { ReservationSummaryCard } from '@entities/reservation/ReservationSummaryCard'
import { ReservationStatusBadge } from '@entities/reservation/ReservationStatusBadge'
import { FolioTotalsBox } from '@entities/folio/FolioTotalsBox'
import { ValidationSummaryBlock } from '@shared/ui/ValidationSummaryBlock'

import { CheckInWorkflow } from '@workflows/check-in/CheckInWorkflow'

export function ArrivalBoardPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)

  const MOCK_DB: Record<string, any> = {
    'r1': { backendResId: 'reservation-clean-1', backendBedId: 'bed-dirty-1', ref: 'R-00123', name: 'Alice Mbeki', checkIn: '22 Mar', checkOut: '25 Mar', nights: 3, bedLabel: 'D4-B2', dormLabel: 'Dorm 4', balanceDue: 45.00, bedReady: false, status: 'confirmed' },
    'r2': { backendResId: 'reservation-clean-2', backendBedId: 'bed-clean-1', ref: 'R-00456', name: 'James Okafor', checkIn: '22 Mar', checkOut: '24 Mar', nights: 2, bedLabel: 'Unassigned', dormLabel: 'To be assigned', balanceDue: 0, bedReady: true, status: 'tentative' },
    'r3': { backendResId: 'reservation-occupied-1', backendBedId: 'bed-occupied-1', ref: 'R-00789', name: 'Priya Nair', checkIn: '22 Mar', checkOut: '23 Mar', nights: 1, bedLabel: 'D2-B1', dormLabel: 'Dorm 2', balanceDue: 0, bedReady: true, status: 'confirmed' }
  }

  const selectedData = selectedId ? MOCK_DB[selectedId] : null

  const header = (
    <PageHeader
      title="Arrival Board"
      description="Expected check-ins for Mar 22, 2026"
      actions={<Button variant="primary" disabled title="Creating reservations is an upcoming feature">New Reservation</Button>}
    />
  )

  const filterBar = (
    <FilterBar
      search={
        <input 
          type="search" 
          placeholder="Search name or ref..." 
          style={{ padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', flex: 1 }} 
        />
      }
      filters={
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <select style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}>
            <option value="all">Unpaid Balance Only</option>
          </select>
        </div>
      }
    />
  )

  const alert = (
    <AlertShell tier="info" inline>
      3 arrivals are arriving outside standard check-in hours.
    </AlertShell>
  )

  const masterList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <ReservationSummaryCard
        id="r1" ref="R-00123" guestName="Alice Mbeki"
        checkIn="22 Mar" checkOut="25 Mar" nights={3}
        status="confirmed" bedLabel="D4-B2" roomLabel="Dorm 4"
        onClick={() => setSelectedId('r1')}
      />
      <ReservationSummaryCard
        id="r2" ref="R-00456" guestName="James Okafor"
        checkIn="22 Mar" checkOut="24 Mar" nights={2}
        status="tentative"
        onClick={() => setSelectedId('r2')}
      />
      <ReservationSummaryCard
        id="r3" ref="R-00789" guestName="Priya Nair"
        checkIn="22 Mar" checkOut="23 Mar" nights={1}
        status="confirmed" bedLabel="D2-B1" roomLabel="Dorm 2"
        onClick={() => setSelectedId('r3')}
      />
    </div>
  )

  const contextPanel = selectedData ? {
    open: true,
    title: 'Arrival Context',
    onClose: () => setSelectedId(null),
    identity: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)' }}>{selectedData.name}</h3>
          <ReservationStatusBadge status={selectedData.status} size="sm" />
        </div>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{selectedData.ref} · {selectedData.nights} nights ({selectedData.checkIn} → {selectedData.checkOut})</span>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-brand-500)', fontWeight: 'var(--font-weight-medium)' }}>🛏 {selectedData.bedLabel} ({selectedData.dormLabel})</span>
      </div>
    ),
    warnings: selectedData.balanceDue > 0 ? (
      <ValidationSummaryBlock
        items={[
          { id: 'w1', severity: 'warning', message: `Balance due of $${selectedData.balanceDue.toFixed(2)} before check-in` },
        ]}
      />
    ) : null,
    summary: (
      <FolioTotalsBox chargesTotal={100 + selectedData.balanceDue} paymentsTotal={100.00} refundsTotal={0} balanceDue={selectedData.balanceDue} />
    ),
    actions: (
      <>
        <Button variant="primary" style={{ width: '100%', padding: 'var(--space-3)', fontSize: 'var(--font-size-base)' }}>Process Check-In</Button>
        <Button variant="secondary" style={{ width: '100%' }}>View Full Detail</Button>
      </>
    )
  } : undefined

  const navigate = useNavigate()

  return (
    <FilterMasterDetailLayout
      header={header}
      filterBar={filterBar}
      alert={alert}
      contextPanel={selectedId ? {
        ...contextPanel,
        actions: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Button variant="primary" style={{ width: '100%', padding: 'var(--space-3)', fontSize: 'var(--font-size-base)' }} onClick={() => setIsCheckInOpen(true)}>Process Check-In</Button>
            <Button variant="secondary" style={{ width: '100%' }} onClick={() => navigate(`/reservations/${selectedId}`)}>View Reservation Detail</Button>
          </div>
        )
      } : undefined}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <ReservationSummaryCard
          id="r1" ref="R-00123" guestName="Alice Mbeki"
          checkIn="22 Mar" checkOut="25 Mar" nights={3}
          status="confirmed" bedLabel="D4-B2" roomLabel="Dorm 4"
          onClick={() => setSelectedId('r1')}
        />
        <ReservationSummaryCard
          id="r2" ref="R-00456" guestName="James Okafor"
          checkIn="22 Mar" checkOut="24 Mar" nights={2}
          status="tentative"
          onClick={() => setSelectedId('r2')}
        />
        <ReservationSummaryCard
          id="r3" ref="R-00789" guestName="Priya Nair"
          checkIn="22 Mar" checkOut="23 Mar" nights={1}
          status="confirmed" bedLabel="D2-B1" roomLabel="Dorm 2"
          onClick={() => setSelectedId('r3')}
        />
      </div>

      {isCheckInOpen && selectedData && (
        <CheckInWorkflow
          reservationId={selectedData.backendResId}
          targetBedId={selectedData.backendBedId}
          displayRef={selectedData.ref}
          guestName={selectedData.name}
          assignedBed={selectedData.bedLabel}
          balanceDue={selectedData.balanceDue}
          bedReady={selectedData.bedReady}
          onClose={() => setIsCheckInOpen(false)}
          onSuccess={(stayId) => {
            // Cache invalidation stubs (e.g. react-query)
            console.log("Invalidating caches: ['ArrivalBoard'], ['InventoryMatrix']")
            navigate(`/stays/${stayId}`)
          }}
        />
      )}
    </FilterMasterDetailLayout>
  )
}

