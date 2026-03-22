import { FilterMasterDetailLayout } from '@shared/layouts/FilterMasterDetailLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { PagePlaceholder } from '../_shared/PagePlaceholder'

/**
 * HousekeepingPage — Phase 1 placeholder.
 * Layout: Filter Bar + Master List + Context Panel (Family 2).
 *
 * Domain note: Housekeeping is about readiness and turnover after checkout.
 * Housekeeping != Maintenance (asset problem / sellability impact).
 *
 * Phase 2: wire housekeeping task queue, status filters (Dirty, Cleaning,
 * Inspect, Ready), quick-action buttons (Start, Complete, Reopen).
 */
export function HousekeepingPage() {
  return (
    <FilterMasterDetailLayout
      header={
        <PageHeader
          title="Housekeeping"
          subtitle="Bed and room readiness queue"
        />
      }
    >
      <PagePlaceholder
        pageName="Housekeeping Queue"
        layoutFamily="Filter Bar + Master List + Context Panel"
        description="Housekeeping task queue with readiness filters and quick-action controls. Housekeeping != Maintenance."
      />
    </FilterMasterDetailLayout>
  )
}
