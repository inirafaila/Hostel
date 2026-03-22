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
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { CheckInWorkflow } from '@workflows/check-in/CheckInWorkflow'

export function ReservationDetailPage() {
  const navigate = useNavigate()
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)

  const header = (
    <PageHeader
      title="Alice Mbeki"
      subtitle="Ref: R-00123"
      actions={<Button variant="secondary">Cancel Reservation</Button>}
    />
  )

  const summaryStrip = (
    <SummaryStrip
      items={[
        { label: 'Check In', value: '22 Mar 2026' },
        { label: 'Check Out', value: '25 Mar 2026' },
        { label: 'Nights', value: '3' },
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
        <AssignmentCard bedLabel="D4-B2" dormLabel="Dorm 4" checkIn="22 Mar" checkOut="25 Mar" isCurrent />
      </SectionShell>
    </>
  )

  const sidebar = (
    <SidebarActionRail
      sections={[
        {
          id: 'status',
          title: 'Status',
          children: <ReservationStatusBadge status="confirmed" />
        },
        {
          id: 'readiness',
          title: 'Check-In Readiness',
          children: (
            <>
              <ValidationSummaryBlock
                items={[
                  { id: '1', severity: 'warning', message: 'Balance of $45.00 due' }
                ]}
              />
              <Button variant="primary" onClick={() => setIsCheckInOpen(true)}>Proceed to Check In</Button>
            </>
          )
        },
        {
          id: 'finance',
          title: 'Folio Summary',
          children: <FolioTotalsBox chargesTotal={145.00} paymentsTotal={100.00} refundsTotal={0} balanceDue={45.00} />
        },
        {
          id: 'ops',
          title: 'Operations',
          children: (
            <>
              <Button variant="secondary" onClick={() => navigate('/stays/s1')}>View Active Stay</Button>
              <Button variant="secondary">Modify Dates</Button>
              <Button variant="secondary">Change Bed Assignment</Button>
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
          reservationId="R-00123"
          guestName="Alice Mbeki"
          assignedBed="D4-B2"
          balanceDue={45.00}
          bedReady={false}
          onClose={() => setIsCheckInOpen(false)}
        />
      )}
    </DetailSidebarLayout>
  )
}
