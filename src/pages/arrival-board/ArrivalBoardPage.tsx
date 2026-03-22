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

  const header = (
    <PageHeader
      title="Arrival Board"
      description="Expected check-ins for Mar 22, 2026"
      actions={<Button variant="primary">New Reservation</Button>}
    />
  )

  const filterBar = (
    <FilterBar
      search={
        <input 
          type="search" 
          placeholder="Search name or ref..." 
          style={{ padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} 
        />
      }
      filters={
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <select style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <option value="all">Status: All expected</option>
          </select>
          <select style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <option value="due">Balance: Due</option>
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

  const contextPanel = selectedId ? {
    open: true,
    title: 'Arrival Context',
    onClose: () => setSelectedId(null),
    identity: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)' }}>Alice Mbeki</h3>
          <ReservationStatusBadge status="confirmed" size="sm" />
        </div>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>R-00123 · 3 nights (22 Mar → 25 Mar)</span>
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-brand-500)', fontWeight: 'var(--font-weight-medium)' }}>🛏 D4-B2 (Dorm 4)</span>
      </div>
    ),
    warnings: (
      <ValidationSummaryBlock
        items={[
          { id: 'w1', severity: 'warning', message: 'Balance due of $45.00 before check-in' },
        ]}
      />
    ),
    summary: (
      <FolioTotalsBox chargesTotal={145.00} paymentsTotal={100.00} refundsTotal={0} balanceDue={45.00} />
    ),
    actions: (
      <>
        <Button variant="primary" style={{ width: '100%' }}>Check In Guest</Button>
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
          <>
            <Button variant="primary" style={{ width: '100%' }} onClick={() => setIsCheckInOpen(true)}>Check In Guest</Button>
            <Button variant="secondary" style={{ width: '100%' }} onClick={() => navigate(`/reservations/${selectedId}`)}>View Full Detail</Button>
          </>
        )
      } : undefined}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <ReservationSummaryCard
          id="r1" ref="R-00123" guestName="Alice Mbeki"
          checkIn="22 Mar" checkOut="25 Mar" nights={3}
          status="confirmed" bedLabel="D4-B2" roomLabel="Dorm 4"
          onClick={() => navigate('/reservations/r1')}
        />
        <ReservationSummaryCard
          id="r2" ref="R-00456" guestName="James Okafor"
          checkIn="22 Mar" checkOut="24 Mar" nights={2}
          status="tentative"
          onClick={() => navigate('/reservations/r2')}
        />
        <ReservationSummaryCard
          id="r3" ref="R-00789" guestName="Priya Nair"
          checkIn="22 Mar" checkOut="23 Mar" nights={1}
          status="confirmed" bedLabel="D2-B1" roomLabel="Dorm 2"
          onClick={() => navigate('/reservations/r3')}
        />
      </div>

      {isCheckInOpen && selectedId && (
        <CheckInWorkflow
          reservationId={selectedId === 'r1' ? 'R-00123' : selectedId === 'r2' ? 'R-00456' : 'R-00789'}
          guestName={selectedId === 'r1' ? 'Alice Mbeki' : selectedId === 'r2' ? 'James Okafor' : 'Priya Nair'}
          assignedBed={selectedId === 'r1' ? 'D4-B2' : selectedId === 'r3' ? 'D2-B1' : 'Unassigned'}
          balanceDue={selectedId === 'r1' ? 45.00 : 0}
          bedReady={selectedId === 'r1' ? false : true}
          onClose={() => setIsCheckInOpen(false)}
        />
      )}
    </FilterMasterDetailLayout>
  )
}

