import { DetailSidebarLayout } from '@shared/layouts/DetailSidebarLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { Button } from '@shared/ui/Button'
import { SummaryStrip } from '@shared/ui/SummaryStrip'
import { AlertShell } from '@shared/ui/AlertShell'
import { SidebarActionRail } from '@shared/ui/SidebarActionRail'
import { SectionShell } from '@shared/ui/SectionShell'

import { ReservationStatusBadge } from '@entities/reservation/ReservationStatusBadge'
import { AssignmentCard } from '@entities/assignment/AssignmentCard'
import { ValidationSummaryBlock } from '@shared/ui/ValidationSummaryBlock'
import { FolioTotalsBox } from '@entities/folio/FolioTotalsBox'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useState } from 'react'

import { CheckInWorkflow } from '@workflows/check-in/CheckInWorkflow'

export function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)

  const MOCK_DB: Record<string, any> = {
    'r1': { backendResId: 'reservation-clean-1', backendBedId: 'bed-dirty-1', ref: 'R-00123', name: 'Alice Mbeki', checkIn: '22 Mar', checkOut: '25 Mar', nights: 3, bedLabel: 'D4-B2', dormLabel: 'Dorm 4', balanceDue: 45.00, bedReady: false, status: 'confirmed' },
    'r2': { backendResId: 'reservation-clean-2', backendBedId: 'bed-clean-1', ref: 'R-00456', name: 'James Okafor', checkIn: '22 Mar', checkOut: '24 Mar', nights: 2, bedLabel: 'Unassigned', dormLabel: 'To be assigned', balanceDue: 0, bedReady: true, status: 'tentative' },
    'r3': { backendResId: 'reservation-occupied-1', backendBedId: 'bed-occupied-1', ref: 'R-00789', name: 'Priya Nair', checkIn: '22 Mar', checkOut: '23 Mar', nights: 1, bedLabel: 'D2-B1', dormLabel: 'Dorm 2', balanceDue: 0, bedReady: true, status: 'confirmed' }
  }

  const data = MOCK_DB[id || 'r1'] || MOCK_DB['r1']

  const header = (
    <PageHeader
      title={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <Link to="/arrivals" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>← Arrivals Panel</Link>
          <span>{data.name}</span>
        </div>
      }
      subtitle={`Ref: ${data.ref}`}
      actions={<Button variant="secondary" disabled title="Cancellation is an upcoming feature">Cancel Reservation</Button>}
    />
  )

  const summaryStrip = (
    <SummaryStrip
      items={[
        { label: 'Check In', value: `${data.checkIn} 2026` },
        { label: 'Check Out', value: `${data.checkOut} 2026` },
        { label: 'Nights', value: `${data.nights}` },
        { label: 'Source', value: 'Booking.com' },
      ]}
    />
  )

  const pageAlert = (
    <AlertShell tier="info">
      Guest has requested a bottom bunk. Confirmed subject to availability.
    </AlertShell>
  )

  const mainContent = (
    <>
      <SectionShell title="Guest Details">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
          <div><span style={{ color: 'var(--color-text-muted)' }}>Email:</span> alice@example.com</div>
          <div><span style={{ color: 'var(--color-text-muted)' }}>Phone:</span> +1 555-0100</div>
          <div><span style={{ color: 'var(--color-text-muted)' }}>Nationality:</span> South Africa</div>
        </div>
      </SectionShell>

      <SectionShell title="Bed Assignment">
        <AssignmentCard bedLabel={data.bedLabel} dormLabel={data.dormLabel} checkIn={data.checkIn} checkOut={data.checkOut} isCurrent />
      </SectionShell>
    </>
  )

  const sidebar = (
    <SidebarActionRail
      sections={[
        {
          id: 'status',
          title: 'Status',
          children: <ReservationStatusBadge status={data.status} />
        },
        {
          id: 'readiness',
          title: 'Check-In Readiness',
          children: (
            <>
              <ValidationSummaryBlock
                items={[
                  ...(data.balanceDue > 0 ? [{ id: '1', severity: 'warning' as const, message: `Balance of $${data.balanceDue.toFixed(2)} due` }] : [])
                ]}
              />
              <Button variant="primary" onClick={() => setIsCheckInOpen(true)}>Proceed to Check In</Button>
            </>
          )
        },
        {
          id: 'finance',
          title: 'Folio Summary',
          children: <FolioTotalsBox chargesTotal={100 + data.balanceDue} paymentsTotal={100.00} refundsTotal={0} balanceDue={data.balanceDue} />
        },
        {
          id: 'ops',
          title: 'Operations',
          children: (
            <>
              <Button variant="secondary" onClick={() => navigate('/stays/s1')}>View Active Stay</Button>
              <Button variant="secondary" disabled title="Date modification is an upcoming feature">Modify Dates</Button>
              <Button variant="secondary" disabled title="Manual assignment modification is an upcoming feature">Change Bed Assignment</Button>
            </>
          )
        }
      ]}
    />
  )

  return (
    <DetailSidebarLayout
      header={header}
      summaryStrip={summaryStrip}
      pageAlert={pageAlert}
      sidebar={sidebar}
    >
      {mainContent}

      {isCheckInOpen && (
        <CheckInWorkflow
          reservationId={data.backendResId}
          targetBedId={data.backendBedId}
          displayRef={data.ref}
          guestName={data.name}
          assignedBed={data.bedLabel}
          balanceDue={data.balanceDue}
          bedReady={data.bedReady}
          onClose={() => setIsCheckInOpen(false)}
          onSuccess={(stayId) => {
            console.log("Invalidating caches: ['ReservationDetail'], ['InventoryMatrix']")
            navigate(`/stays/${stayId}`)
          }}
        />
      )}
    </DetailSidebarLayout>
  )
}
