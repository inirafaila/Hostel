import { useState } from 'react'
import { DetailSidebarLayout } from '@shared/layouts/DetailSidebarLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { Button } from '@shared/ui/Button'
import { SummaryStrip } from '@shared/ui/SummaryStrip'
import { SidebarActionRail } from '@shared/ui/SidebarActionRail'
import { SectionShell } from '@shared/ui/SectionShell'

import { FolioTotalsBox } from '@entities/folio/FolioTotalsBox'
import { PaymentSummaryStrip } from '@entities/folio/PaymentSummaryStrip'
import { ReceivableRow } from '@entities/receivable/ReceivableRow'
import { useNavigate, Link } from 'react-router-dom'

// Workflows (stubs for this page context)
import { PaymentEntryWorkflow } from '@workflows/payment/PaymentEntryWorkflow'
import { RefundEntryWorkflow } from '@workflows/payment/RefundEntryWorkflow'

export function FolioPage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isRefundOpen, setIsRefundOpen] = useState(false)

  const header = (
    <PageHeader
      title={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <Link to="/receivables" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>← Guest Finance Open Receivables</Link>
          <span>Folio: F-10023</span>
        </div>
      }
      subtitle="Alice Mbeki · Stay: 22 Mar - 25 Mar"
      actions={<Button variant="secondary" disabled title="Printing is an upcoming feature">Print statement</Button>}
    />
  )

  const summaryStrip = (
    <SummaryStrip
      items={[
        { label: 'Total Charges', value: '$145.00' },
        { label: 'Total Payments', value: '$100.00' },
        { label: 'Balance Due', value: '$45.00', emphasis: 'warning' },
      ]}
    />
  )

  const mainContent = (
    <>
      <SectionShell title="Financial Summary">
        <FolioTotalsBox chargesTotal={145.00} paymentsTotal={100.00} refundsTotal={0} balanceDue={45.00} />
      </SectionShell>

      <SectionShell title="Payment History">
        <PaymentSummaryStrip
          payments={[
            { id: 'p1', method: 'card', amount: 100.00, date: '21 Mar 2026', status: 'settled' },
            { id: 'p2', method: 'cash', amount: 45.00,  date: '21 Mar 2026', status: 'voided', note: 'Operator error' },
          ]}
        />
      </SectionShell>

      <SectionShell title="Receivables / Direct Bill">
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
          No open receivables tied to this folio.
        </p>
      </SectionShell>
    </>
  )

  const sidebar = (
    <SidebarActionRail
      sections={[
        {
          id: 'status',
          title: 'Folio Status',
          children: <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-warning-500)' }}>Open (Balance Due)</span>
        },
        {
          id: 'ops',
          title: 'Guest Transactions',
          children: (
            <>
              <Button variant="primary" onClick={() => setIsPaymentOpen(true)}>Post Payment</Button>
              <Button variant="secondary" onClick={() => setIsRefundOpen(true)}>Issue Refund</Button>
              <Button variant="secondary" disabled title="Manual charge entry is an upcoming feature">Add Charge</Button>
            </>
          )
        }
      ]}
    />
  )

  return (
    <>
      <DetailSidebarLayout
        header={header}
        summaryStrip={summaryStrip}
        sidebar={sidebar}
      >
        {mainContent}
      </DetailSidebarLayout>

      {/* Workflows spawned by page actions */}
      {isPaymentOpen && (
        <PaymentEntryWorkflow
          folioId="F-10023"
          currentBalance={45.00}
          onClose={() => setIsPaymentOpen(false)}
        />
      )}
      {isRefundOpen && (
        <RefundEntryWorkflow
          folioId="F-10023"
          refundableAmount={100.00}
          onClose={() => setIsRefundOpen(false)}
        />
      )}
    </>
  )
}
