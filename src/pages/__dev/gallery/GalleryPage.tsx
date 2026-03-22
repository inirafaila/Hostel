// ── Shared primitives ─────────────────────────────────────────
import { AlertShell } from '@shared/ui/AlertShell'
import { StatusBadge } from '@shared/ui/StatusBadge'
import { Button } from '@shared/ui/Button'
import { EmptyStateBlock } from '@shared/ui/EmptyStateBlock'
import { ValidationSummaryBlock } from '@shared/ui/ValidationSummaryBlock'
import { ActionMenu } from '@shared/ui/ActionMenu'
import { RowActionGroup } from '@shared/ui/RowActionGroup'
import { SidebarActionRail } from '@shared/ui/SidebarActionRail'
import { StickyConfirmFooter } from '@shared/ui/StickyConfirmFooter'
// ── Entity modules ────────────────────────────────────────────
import { ReservationSummaryCard } from '@entities/reservation/ReservationSummaryCard'
import { ReservationStatusBadge } from '@entities/reservation/ReservationStatusBadge'
import { StaySummaryCard } from '@entities/stay/StaySummaryCard'
import { AssignmentCard } from '@entities/assignment/AssignmentCard'
import { BedTile } from '@entities/bed/BedTile'
import { BedStatusBadge } from '@entities/bed/BedStatusBadge'
import { DormInventoryCard } from '@entities/bed/DormInventoryCard'
import { FolioTotalsBox } from '@entities/folio/FolioTotalsBox'
import { PaymentSummaryStrip } from '@entities/folio/PaymentSummaryStrip'
import { ReceivableRow } from '@entities/receivable/ReceivableRow'
import { MaintenanceImpactCard } from '@entities/maintenance-case/MaintenanceImpactCard'
import { MaintenanceStatusTimeline } from '@entities/maintenance-case/MaintenanceStatusTimeline'
import { HousekeepingTaskRow } from '@entities/housekeeping-task/HousekeepingTaskRow'
import './GalleryPage.css'

/**
 * GalleryPage — DEV ONLY.
 * Route: /__dev/gallery
 * Not linked in NavRail or product information architecture.
 * Visual verification scaffold for Phase 2 shared primitives and entity modules.
 * Remove in a later phase when real pages exist.
 */
export default function GalleryPage() {
  return (
    <div className="gallery">
      <div className="gallery__banner">
        ⚠ DEV ONLY — Component Gallery · Not part of product IA · Route: /__dev/gallery
      </div>

      <div className="gallery__content">
        <h1 className="gallery__title">Phase 2 Component Gallery</h1>

        {/* ── Section A: Alert Tiers ──────────────────────────── */}
        <Section title="AlertShell — 4 Tiers">
          <AlertShell tier="info" title="Advisory">AI-generated suggestion. Review before confirming.</AlertShell>
          <AlertShell tier="warning" title="Soft Concern">Guest has an unpaid balance from a prior stay.</AlertShell>
          <AlertShell tier="danger" title="Critical Issue" onDismiss={() => {}}>Bed assignment not confirmed. Check-in is blocked.</AlertShell>
          <AlertShell tier="block" title="Hard Block">Gender rule violation — cannot assign this bed to this guest without override.</AlertShell>
          <AlertShell tier="warning" inline>Inline warning — compact form for field-level context.</AlertShell>
        </Section>

        {/* ── Section B: Status Badge Families ──────────────────── */}
        <Section title="StatusBadge — 5 Families + Sizes">
          <Row>
            <StatusBadge variant="neutral" label="Neutral" size="md" />
            <StatusBadge variant="success" label="Success" size="md" />
            <StatusBadge variant="warning" label="Warning" size="md" />
            <StatusBadge variant="danger"  label="Danger"  size="md" />
            <StatusBadge variant="info"    label="Info"    size="md" />
          </Row>
          <Row>
            <StatusBadge variant="neutral" label="Neutral" size="sm" />
            <StatusBadge variant="success" label="Success" size="sm" />
            <StatusBadge variant="warning" label="Warning" size="sm" />
          </Row>
          <Row label="Dot variants:">
            <StatusBadge variant="neutral" label="Neutral" size="dot" />
            <StatusBadge variant="success" label="Success" size="dot" />
            <StatusBadge variant="warning" label="Warning" size="dot" />
            <StatusBadge variant="danger"  label="Danger"  size="dot" />
            <StatusBadge variant="info"    label="Info"    size="dot" />
          </Row>
        </Section>

        {/* ── Section C: ValidationSummaryBlock ────────────────── */}
        <Section title="ValidationSummaryBlock — Warning ≠ Block">
          <ValidationSummaryBlock
            title="Pre-check-in validation"
            items={[
              { id: '1', severity: 'error',   message: 'Assigned bed is in maintenance — cannot check in' },
              { id: '2', severity: 'warning', message: 'Guest has an unpaid balance of $45.00 from prior stay' },
              { id: '3', severity: 'info',    message: 'Check-in is 2 hours before standard time' },
            ]}
          />
        </Section>

        {/* ── Section D: Action Primitives ─────────────────────── */}
        <Section title="ActionMenu + RowActionGroup">
          <Row>
            <ActionMenu
              trigger={<Button variant="secondary" size="sm">⋯ Actions</Button>}
              items={[
                { id: 'view',   label: 'View Detail',  icon: '👁', onClick: () => {} },
                { id: 'edit',   label: 'Edit',          icon: '✏', onClick: () => {} },
                { id: 'void',   label: 'Void',          icon: '⊗', onClick: () => {}, destructive: true },
              ]}
            />
          </Row>
          <div style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
            <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>Hover this row to reveal RowActionGroup →</span>
            <RowActionGroup
              actions={[
                { id: 'check-in', label: 'Check In', icon: '→', onClick: () => {} },
                { id: 'view',     label: 'View',      icon: '👁', onClick: () => {} },
              ]}
            />
          </div>
        </Section>

        {/* ── Section E: SidebarActionRail ─────────────────────── */}
        <Section title="SidebarActionRail">
          <SidebarActionRail
            sections={[
              { id: 'primary', title: 'Primary Actions', children: (
                <><Button variant="primary" size="sm">Check In Guest</Button>
                  <Button variant="secondary" size="sm">Edit Reservation</Button></>
              )},
              { id: 'status', title: 'Record Status', children: (
                <ReservationStatusBadge status="confirmed" />
              )},
            ]}
          />
        </Section>

        {/* ── Section F: StickyConfirmFooter ───────────────────── */}
        <Section title="StickyConfirmFooter — Consequence Before CTA">
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <StickyConfirmFooter
              consequences={[
                { label: 'Bed', value: 'D4-B2 → Dirty after checkout', emphasis: 'strong' },
                { label: 'Balance Due', value: '$0.00', emphasis: 'normal' },
              ]}
              warning={<AlertShell tier="warning" inline>1 open charge pending final posting</AlertShell>}
              primaryAction={<Button variant="primary">Confirm Checkout</Button>}
              secondaryAction={<Button variant="ghost">Back</Button>}
            />
          </div>
        </Section>

        {/* ── Section G: EmptyStateBlock ───────────────────────── */}
        <Section title="EmptyStateBlock">
          <EmptyStateBlock
            icon="📭"
            title="No arrivals today"
            description="There are no reservations with a check-in date of today."
            size="sm"
          />
        </Section>

        {/* ── ENTITY MODULES ─────────────────────────────────── */}
        <h2 className="gallery__subtitle">Reservation Entity</h2>

        <Section title="ReservationSummaryCard">
          <Row>
            <ReservationSummaryCard id="r1" ref="R-00123" guestName="Alice Mbeki" checkIn="22 Mar 2026" checkOut="25 Mar 2026" nights={3} status="confirmed" bedLabel="D4-B2" roomLabel="Dorm 4" />
            <ReservationSummaryCard id="r2" ref="R-00456" guestName="James Okafor" checkIn="22 Mar 2026" checkOut="24 Mar 2026" nights={2} status="tentative" />
            <ReservationSummaryCard id="r3" ref="R-00789" guestName="Priya Nair" checkIn="20 Mar 2026" checkOut="22 Mar 2026" nights={2} status="no-show" />
          </Row>
        </Section>

        <Section title="ReservationStatusBadge — all states">
          <Row>
            {(['confirmed','tentative','checked-in','cancelled','no-show','modified'] as const).map(s => (
              <ReservationStatusBadge key={s} status={s} />
            ))}
          </Row>
        </Section>

        <h2 className="gallery__subtitle">Stay Entity</h2>

        <Section title="StaySummaryCard">
          <Row>
            <StaySummaryCard id="s1" guestName="Alice Mbeki" bedLabel="D4-B2" dormLabel="Dorm 4" checkInDate="20 Mar 2026" dueOutDate="25 Mar 2026" folioBalanceDue={0} status="in-house" />
            <StaySummaryCard id="s2" guestName="Carlos Ruiz" bedLabel="D2-B5" checkInDate="21 Mar 2026" dueOutDate="22 Mar 2026" folioBalanceDue={78.50} status="due-out-today" />
            <StaySummaryCard id="s3" guestName="Mei Lin" bedLabel="D1-B3" checkInDate="18 Mar 2026" dueOutDate="21 Mar 2026" folioBalanceDue={145.00} status="overdue" />
          </Row>
        </Section>

        <h2 className="gallery__subtitle">Assignment Entity</h2>

        <Section title="AssignmentCard — Assignment ≠ Stay">
          <Row>
            <AssignmentCard bedLabel="D4-B2" dormLabel="Dorm 4" checkIn="20 Mar" checkOut="25 Mar" guestName="Alice Mbeki" isCurrent />
            <AssignmentCard bedLabel="D4-B1" dormLabel="Dorm 4" checkIn="18 Mar" checkOut="20 Mar" guestName="Alice Mbeki" />
          </Row>
        </Section>

        <h2 className="gallery__subtitle">Bed Entity</h2>

        <Section title="BedTile — 6 operational states">
          <div className="gallery__bed-grid">
            {([
              { state: 'available'  , bedLabel: 'D4-B1', guestName: undefined },
              { state: 'reserved'   , bedLabel: 'D4-B2', guestName: undefined },
              { state: 'occupied'   , bedLabel: 'D4-B3', guestName: 'Alice M.' },
              { state: 'dirty'      , bedLabel: 'D4-B4', guestName: undefined },
              { state: 'maintenance', bedLabel: 'D4-B5', guestName: undefined },
              { state: 'out-of-order', bedLabel: 'D4-B6', guestName: undefined },
            ] as const).map(({ state, bedLabel, guestName }) => (
              <BedTile key={bedLabel} state={state} bedLabel={bedLabel} dormLabel="Dorm 4" guestName={guestName} />
            ))}
          </div>
        </Section>

        <Section title="BedStatusBadge — all states">
          <Row>
            {(['available','reserved','occupied','dirty','maintenance','out-of-order'] as const).map(s => (
              <BedStatusBadge key={s} state={s} />
            ))}
          </Row>
        </Section>

        <Section title="DormInventoryCard">
          <Row>
            <DormInventoryCard
              name="Dorm 4"
              dormType="Mixed 8-Bed"
              totalBeds={8}
              byState={{ available: 3, occupied: 3, dirty: 1, maintenance: 1 }}
            />
            <DormInventoryCard
              name="Dorm 2"
              dormType="Female 6-Bed"
              totalBeds={6}
              byState={{ available: 6 }}
            />
          </Row>
        </Section>

        <h2 className="gallery__subtitle">Folio Entity</h2>

        <Section title="FolioTotalsBox — Folio ≠ Expense">
          <Row>
            <FolioTotalsBox chargesTotal={320.00} paymentsTotal={250.00} refundsTotal={0} balanceDue={70.00} />
            <FolioTotalsBox chargesTotal={180.00} paymentsTotal={180.00} refundsTotal={0} balanceDue={0} />
            <FolioTotalsBox chargesTotal={200.00} paymentsTotal={230.00} refundsTotal={30.00} balanceDue={-30} />
          </Row>
        </Section>

        <Section title="PaymentSummaryStrip — voided rows remain visible">
          <PaymentSummaryStrip
            payments={[
              { id: 'p1', method: 'card',  amount: 120.00, date: '20 Mar', status: 'settled' },
              { id: 'p2', method: 'cash',  amount: 80.00,  date: '21 Mar', status: 'voided', note: 'Operator error' },
              { id: 'p3', method: 'card',  amount: 80.00,  date: '21 Mar', status: 'settled' },
            ]}
          />
        </Section>

        <h2 className="gallery__subtitle">Receivable Entity</h2>

        <Section title="ReceivableRow — aging urgency indicators">
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '6px', overflow: 'hidden' }}>
            <ReceivableRow id="rcv1" guestName="James Okafor" checkOutDate="20 Mar" amount={145.00} agingDays={2}  status="open" />
            <ReceivableRow id="rcv2" guestName="Priya Nair"   checkOutDate="8 Mar"  amount={78.50}  agingDays={14} status="partial" />
            <ReceivableRow id="rcv3" guestName="Chen Wei"     checkOutDate="18 Feb" amount={290.00} agingDays={32} status="open" />
            <ReceivableRow id="rcv4" guestName="Ana Garcia"   checkOutDate="15 Feb" amount={55.00}  agingDays={35} status="collected" />
          </div>
        </Section>

        <h2 className="gallery__subtitle">Maintenance Entity (≠ Housekeeping)</h2>

        <Section title="MaintenanceImpactCard — sellability is primary signal">
          <Row>
            <MaintenanceImpactCard id="m1" title="Broken bunk ladder — upper bed unusable" reportedAt="21 Mar" status="open" affectedSpace="D4-B6 (Upper Bunk)" sellabilityImpact="blocked" />
            <MaintenanceImpactCard id="m2" title="Leaking faucet in Dorm 2 bathroom" reportedAt="19 Mar" status="in-progress" affectedSpace="Dorm 2 Bathroom" sellabilityImpact="reduced" assignedTo="Facilities Team" />
            <MaintenanceImpactCard id="m3" title="Light bulb replacement" reportedAt="20 Mar" status="resolved" affectedSpace="Reception Desk" sellabilityImpact="none" />
          </Row>
        </Section>

        <Section title="MaintenanceStatusTimeline — blocked state visually distinct">
          <MaintenanceStatusTimeline
            events={[
              { status: 'open',        timestamp: '19 Mar 14:00', note: 'Reported by housekeeper' },
              { status: 'in-progress', timestamp: '20 Mar 09:30' },
              { status: 'blocked',     timestamp: '20 Mar 16:00', note: 'Waiting for replacement part — ETA unknown' },
            ]}
          />
        </Section>

        <h2 className="gallery__subtitle">Housekeeping Entity (≠ Maintenance)</h2>

        <Section title="HousekeepingTaskRow — dirty→ready urgency gradient">
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '6px', overflow: 'hidden' }}>
            <HousekeepingTaskRow id="hk1" bedLabel="D4-B3" dormLabel="Dorm 4" status="dirty"    updatedAt="09:15" assignedTo="Ana G." />
            <HousekeepingTaskRow id="hk2" bedLabel="D2-B1" dormLabel="Dorm 2" status="cleaning"  updatedAt="09:30" assignedTo="Carlos R." />
            <HousekeepingTaskRow id="hk3" bedLabel="D1-B2" dormLabel="Dorm 1" status="inspect"   updatedAt="09:45" />
            <HousekeepingTaskRow id="hk4" bedLabel="D3-B4" dormLabel="Dorm 3" status="ready"     updatedAt="10:00" />
          </div>
        </Section>

      </div>
    </div>
  )
}

// ── Local helper sub-components for gallery layout ───────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="gallery__section">
      <h3 className="gallery__section-title">{title}</h3>
      <div className="gallery__section-body">{children}</div>
    </section>
  )
}

function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="gallery__row">
      {label && <span className="gallery__row-label">{label}</span>}
      {children}
    </div>
  )
}
