import { FilterMasterDetailLayout } from '@shared/layouts/FilterMasterDetailLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { PagePlaceholder } from '../_shared/PagePlaceholder'

/**
 * ReceivablesPage — Phase 1 placeholder.
 * Layout: Filter Bar + Master List + Context Panel (Family 2).
 *
 * Domain note: Receivables are open balances remaining after checkout.
 * Receivable is distinct from an open Folio and from an Expense.
 *
 * Phase 2: wire receivable list, aging filter, payment status filter,
 * and context panel with guest/folio link and follow-up actions.
 */
export function ReceivablesPage() {
  return (
    <FilterMasterDetailLayout
      header={
        <PageHeader
          title="Receivables"
          subtitle="Open post-checkout balances"
        />
      }
    >
      <PagePlaceholder
        pageName="Receivables"
        layoutFamily="Filter Bar + Master List + Context Panel"
        description="Post-checkout open balance list with aging and payment status filters. Receivable is distinct from Folio and Expense."
      />
    </FilterMasterDetailLayout>
  )
}
