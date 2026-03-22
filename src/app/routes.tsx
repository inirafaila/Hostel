import type { RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Lazy-load all page-level components.
// Pages remain thin composition shells — no domain logic here.
const DashboardPage       = lazy(() => import('@pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })))
const ArrivalBoardPage    = lazy(() => import('@pages/arrival-board/ArrivalBoardPage').then(m => ({ default: m.ArrivalBoardPage })))
const ReservationDetailPage = lazy(() => import('@pages/reservation-detail/ReservationDetailPage').then(m => ({ default: m.ReservationDetailPage })))
const StayDetailPage      = lazy(() => import('@pages/stay-detail/StayDetailPage').then(m => ({ default: m.StayDetailPage })))
const FolioPage           = lazy(() => import('@pages/folio/FolioPage').then(m => ({ default: m.FolioPage })))
const MaintenancePage     = lazy(() => import('@pages/maintenance/MaintenancePage').then(m => ({ default: m.MaintenancePage })))
const HousekeepingPage    = lazy(() => import('@pages/housekeeping/HousekeepingPage').then(m => ({ default: m.HousekeepingPage })))
const ExpensesPage        = lazy(() => import('@pages/expenses/ExpensesPage').then(m => ({ default: m.ExpensesPage })))
const ReceivablesPage     = lazy(() => import('@pages/receivables/ReceivablesPage').then(m => ({ default: m.ReceivablesPage })))
const InventoryPage       = lazy(() => import('@pages/inventory/InventoryPage').then(m => ({ default: m.InventoryPage })))

// ── DEV ONLY — not in NavRail, not in product IA ────────────
const GalleryPage = lazy(() => import('@pages/__dev/gallery/GalleryPage'))

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '200px',
      color: 'var(--color-text-muted)',
      fontSize: 'var(--font-size-sm)',
    }}>
      Loading…
    </div>
  )
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

/**
 * routes — top-level route configuration.
 * Each route maps to a placeholder page shell.
 * Routes are scoped: detail pages (reservation/:id, stay/:id, folio/:id)
 * will be navigated to contextually from list/board pages.
 */
export const routes: RouteObject[] = [
  // ── Primary operational screens ────────────────────────────
  { path: '/',                    element: withSuspense(DashboardPage) },
  { path: '/arrivals',            element: withSuspense(ArrivalBoardPage) },
  { path: '/reservations/:id',    element: withSuspense(ReservationDetailPage) },
  { path: '/stays/:id',           element: withSuspense(StayDetailPage) },
  { path: '/folios/:id',          element: withSuspense(FolioPage) },

  // ── Operations support screens ─────────────────────────────
  { path: '/maintenance',         element: withSuspense(MaintenancePage) },
  { path: '/housekeeping',        element: withSuspense(HousekeepingPage) },
  { path: '/expenses',            element: withSuspense(ExpensesPage) },
  { path: '/receivables',         element: withSuspense(ReceivablesPage) },
  { path: '/inventory',           element: withSuspense(InventoryPage) },

  // ── DEV ONLY ───────────────────────────────────────────────
  { path: '/__dev/gallery',       element: withSuspense(GalleryPage) },
]
