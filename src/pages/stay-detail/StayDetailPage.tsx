import { DetailSidebarLayout } from '@shared/layouts/DetailSidebarLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { Button } from '@shared/ui/Button'
import { SummaryStrip } from '@shared/ui/SummaryStrip'
import { SidebarActionRail } from '@shared/ui/SidebarActionRail'
import { SectionShell } from '@shared/ui/SectionShell'
import { AlertShell } from '@shared/ui/AlertShell'

import { StayStatusBadge } from '@entities/stay/StayStatusBadge'
import { AssignmentCard } from '@entities/assignment/AssignmentCard'
import { HousekeepingTaskRow } from '@entities/housekeeping-task/HousekeepingTaskRow'
import { FolioTotalsBox } from '@entities/folio/FolioTotalsBox'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CheckoutWorkflow } from '@workflows/checkout/CheckoutWorkflow'
import { BedMoveWorkflow } from '@workflows/bed-move/BedMoveWorkflow'

export function StayDetailPage() {
  const navigate = useNavigate()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isMoveOpen, setIsMoveOpen] = useState(false)

  const header = (
    <PageHeader
      title="Carlos Ruiz"
      subtitle="In House · D2-B5"
      actions={<Button variant="primary" onClick={() => setIsCheckoutOpen(true)}>Proceed to Checkout</Button>}
    />
  )

  const summaryStrip = (
    <SummaryStrip
      items={[
        { label: 'In', value: '21 Mar 2026' },
        { label: 'Due Out', value: '22 Mar 2026 Today!', emphasis: 'warning' },
        { label: 'Bed', value: 'D2-B5', emphasis: 'success' },
      ]}
    />
  )

  const mainContent = (
    <>
      <SectionShell title="Current Assignment">
        <AssignmentCard bedLabel="D2-B5" dormLabel="Dorm 2" checkIn="21 Mar" checkOut="22 Mar" isCurrent />
      </SectionShell>

      <SectionShell title="Bed Ops Status">
        <AlertShell tier="info" inline>
          This bed is marked for turnover today upon checkout.
        </AlertShell>
        <HousekeepingTaskRow
          id="hk2" bedLabel="D2-B5" dormLabel="Dorm 2" status="dirty" updatedAt="Not started"
        />
      </SectionShell>

      <SectionShell title="Assignment History">
        <AssignmentCard bedLabel="D1-B1" dormLabel="Dorm 1" checkIn="19 Mar" checkOut="21 Mar" />
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginTop: 'var(--space-2)' }}>
          Guest was moved requested by operator on 21 Mar.
        </span>
      </SectionShell>
    </>
  )

  const sidebar = (
    <SidebarActionRail
      sections={[
        {
          id: 'status',
          title: 'Stay Status',
          children: <StayStatusBadge status="due-out-today" />
        },
        {
          id: 'finance',
          title: 'Folio Balance',
          children: <FolioTotalsBox chargesTotal={78.50} paymentsTotal={0} refundsTotal={0} balanceDue={78.50} />
        },
        {
          id: 'ops',
          title: 'Operations',
          children: (
            <>
              <Button variant="secondary" onClick={() => navigate('/reservations/r1')}>View Origin Reservation</Button>
              <Button variant="secondary" disabled title="Charges must be posted from the Folio page">Post Charge</Button>
              <Button variant="secondary" disabled title="Stay extensions are an upcoming feature">Extend Stay</Button>
              <Button variant="secondary" onClick={() => setIsMoveOpen(true)}>Move Bed</Button>
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
      sidebar={sidebar}
    >
      {mainContent}

      {isCheckoutOpen && (
        <CheckoutWorkflow
          stayId="S-99120"
          guestName="Carlos Ruiz"
          currentBed="D2-B5"
          folioBalance={78.50}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

      {isMoveOpen && (
        <BedMoveWorkflow
          stayId="S-99120"
          guestName="Carlos Ruiz"
          currentBed="D2-B5"
          onClose={() => setIsMoveOpen(false)}
        />
      )}
    </DetailSidebarLayout>
  )
}
