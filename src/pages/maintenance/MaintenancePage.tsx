import { FilterMasterDetailLayout } from '@shared/layouts/FilterMasterDetailLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { PagePlaceholder } from '../_shared/PagePlaceholder'

/**
 * MaintenancePage — Phase 1 placeholder.
 * Layout: Filter Bar + Master List + Context Panel (Family 2).
 *
 * Domain note: Maintenance is about asset problems and sellability impact.
 * Maintenance != Housekeeping (readiness/turnover).
 * These must not be merged into one generic "issue board".
 *
 * Phase 2: wire maintenance case list, status filters, sellability impact indicator,
 * and context panel (case detail, space affected, Resolve Case action).
 */
export function MaintenancePage() {
  return (
    <FilterMasterDetailLayout
      header={
        <PageHeader
          title="Maintenance"
          subtitle="Asset issues and sellability impact"
        />
      }
    >
      <PagePlaceholder
        pageName="Maintenance Board"
        layoutFamily="Filter Bar + Master List + Context Panel"
        description="Maintenance case list with status filters and sellability impact. Context panel shows case detail and Resolve Case action. Maintenance != Housekeeping."
      />
    </FilterMasterDetailLayout>
  )
}
