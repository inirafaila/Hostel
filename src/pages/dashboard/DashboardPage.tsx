import { SummaryBoardLayout } from '@shared/layouts/SummaryBoardLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { PagePlaceholder } from '../_shared/PagePlaceholder'

/**
 * DashboardPage — Phase 1 placeholder.
 * Layout: Summary + Board (Family 1 from Page Layout Blueprint).
 * Phase 2: wire operational summary cards and exception clusters.
 */
export function DashboardPage() {
  return (
    <SummaryBoardLayout
      header={
        <PageHeader
          title="Dashboard"
          subtitle="Operational overview"
        />
      }
    >
      <PagePlaceholder
        pageName="Dashboard"
        layoutFamily="Summary + Board Layout"
        description="Today's arrivals/departures summary, bed occupancy overview, housekeeping pending, and maintenance exceptions."
      />
    </SummaryBoardLayout>
  )
}
