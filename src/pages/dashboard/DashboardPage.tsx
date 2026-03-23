import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@shared/ui/PageHeader'
import { SummaryStrip } from '@shared/ui/SummaryStrip'
import { SectionShell } from '@shared/ui/SectionShell'
import { AlertShell } from '@shared/ui/AlertShell'
import { Button } from '@shared/ui/Button'

// Reused Entity Modules
import { ReservationSummaryCard } from '@entities/reservation/ReservationSummaryCard'
import { HousekeepingTaskRow } from '@entities/housekeeping-task/HousekeepingTaskRow'
import { AssignmentCard } from '@entities/assignment/AssignmentCard'

export function DashboardPage() {
  const navigate = useNavigate()

  const header = (
    <PageHeader
      title="Daily Operations"
      description="22 Mar 2026 · Front Desk Overview"
      actions={<Button variant="primary" onClick={() => navigate('/arrivals')}>Process Arrivals</Button>}
    />
  )

  const summaryStrip = (
    <SummaryStrip
      items={[
        { label: 'Arrivals', value: '14' },
        { label: 'Departures', value: '8' },
        { label: 'In-House', value: '42' },
        { label: 'Available Beds', value: '18', emphasis: 'success' },
        { label: 'Dirty Beds', value: '5', emphasis: 'warning' },
        { label: 'Out of Order', value: '2', emphasis: 'warning' },
        { label: 'Open Receivables', value: '$495.00' },
      ]}
    />
  )

  const alerts = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
      <AlertShell tier="block" title="Inventory Block Conflict">
        Maintenance Case M-001 (Dorm 2 AC) is blocking 2 arriving reservations today. Immediate reallocation required.
      </AlertShell>
      <AlertShell tier="warning" title="Unpaid Departure Risk">
        3 guests due out today have unpaid folio balances totaling $120.00.
      </AlertShell>
    </div>
  )

  return (
    <div style={{ padding: 'var(--space-container)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {header}
      {summaryStrip}
      {alerts}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 'var(--space-5)' }}>
        
        {/* Left Column: Immediate Operational Queues */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <SectionShell 
            title="Next Arrivals" 
            action={<Button variant="ghost" onClick={() => navigate('/arrivals')}>View All 14</Button>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <ReservationSummaryCard
                id="r1" ref="R-00123" guestName="Alice Mbeki"
                checkIn="22 Mar" checkOut="25 Mar" nights={3}
                status="confirmed" bedLabel="D4-B2" roomLabel="Dorm 4"
                onClick={() => navigate('/reservations/r1')}
              />
              <ReservationSummaryCard
                id="r3" ref="R-00789" guestName="Priya Nair"
                checkIn="22 Mar" checkOut="23 Mar" nights={1}
                status="confirmed" bedLabel="D2-B1" roomLabel="Dorm 2"
                onClick={() => navigate('/reservations/r3')}
              />
            </div>
          </SectionShell>

          <SectionShell 
            title="Departures & Due Out" 
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <AssignmentCard bedLabel="D2-B5" dormLabel="Dorm 2" checkIn="21 Mar" checkOut="22 Mar" isCurrent />
              <Button variant="secondary" onClick={() => navigate('/stays/s1')}>View Active Stay associated with Carlos</Button>
            </div>
          </SectionShell>
        </div>

        {/* Right Column: Support Queues & Exceptions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <SectionShell 
            title="Housekeeping Priority"
            action={<Button variant="ghost" onClick={() => navigate('/housekeeping')}>Board</Button>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <HousekeepingTaskRow id="t1" bedLabel="D2-B1" locationLabel="Dorm 2" status="dirty" urgency="high" isCheckoutTurnover={true} />
              <HousekeepingTaskRow id="t2" bedLabel="D4-B4" locationLabel="Dorm 4" status="cleaning" urgency="normal" />
            </div>
          </SectionShell>

          <SectionShell 
            title="Maintenance Blockers"
            action={<Button variant="ghost" onClick={() => navigate('/maintenance')}>Log</Button>}
          >
            <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-error-200)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>Broken AC Unit</strong>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Dorm 2</div>
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'bold', color: 'var(--color-error-700)', background: 'var(--color-error-100)', padding: '2px 6px', borderRadius: '4px', height: 'fit-content' }}>BLOCKING</span>
            </div>
          </SectionShell>

          <SectionShell 
            title="Financial Support"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Button variant="secondary" onClick={() => navigate('/receivables')}>View Open Receivables ($495.00)</Button>
              <Button variant="secondary" onClick={() => navigate('/expenses')}>Operating Expenses</Button>
            </div>
          </SectionShell>

          <SectionShell title="Inventory">
             <Button variant="secondary" onClick={() => navigate('/inventory')} style={{ width: '100%' }}>Live Bed Matrix</Button>
          </SectionShell>
        </div>

      </div>
    </div>
  )
}
