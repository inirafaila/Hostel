import { FilterMasterDetailLayout } from '@shared/layouts/FilterMasterDetailLayout'
import { PageHeader } from '@shared/ui/PageHeader'
import { PagePlaceholder } from '../_shared/PagePlaceholder'

/**
 * ExpensesPage — Phase 1 placeholder.
 * Layout: Filter Bar + Master List + Context Panel (Family 2).
 *
 * Domain note: Expenses are internal operational costs.
 * Expense != Folio (guest-facing finance). Must remain visually and conceptually separate.
 *
 * Phase 2: wire expense list, vendor filter, category filter,
 * and context panel with expense detail.
 */
export function ExpensesPage() {
  return (
    <FilterMasterDetailLayout
      header={
        <PageHeader
          title="Expenses"
          subtitle="Internal operational costs"
        />
      }
    >
      <PagePlaceholder
        pageName="Expenses"
        layoutFamily="Filter Bar + Master List + Context Panel"
        description="Internal expense list with vendor and category filters. Expense != Folio (guest finance)."
      />
    </FilterMasterDetailLayout>
  )
}
