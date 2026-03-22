/**
 * contracts/entities.ts
 *
 * Phase 1: Placeholder DTO/view model type stubs for key domain entities.
 * These are intentionally minimal neutral shapes — NOT real backend contracts.
 *
 * Phase 2+: These will be refined to match the actual API shapes from:
 * - Hostel Entity Field Definition (doc 05)
 * - Entity Relationship Rules & Ownership Boundaries (doc 06)
 *
 * Domain boundaries preserved in naming:
 * - Reservation != Stay != BedAssignment
 * - Folio != Expense
 * - HousekeepingTask != MaintenanceCase
 */

// ── Identity primitives ───────────────────────────────────────
export type EntityId = string

// ── Reservation ───────────────────────────────────────────────
export interface ReservationStub {
  id: EntityId
  status: string  // e.g. 'confirmed' | 'tentative' | 'cancelled' | 'no-show'
}

// ── Stay ─────────────────────────────────────────────────────
// Stay = in-house guest lifecycle. DISTINCT from Reservation.
export interface StayStub {
  id: EntityId
  status: string  // e.g. 'in-house' | 'checked-out'
}

// ── BedAssignment ─────────────────────────────────────────────
// Assignment = temporal occupancy/use relationship. NOT the inventory asset.
export interface BedAssignmentStub {
  id: EntityId
  bedId: EntityId
  stayId: EntityId
}

// ── Bed / Room ────────────────────────────────────────────────
export interface BedStub {
  id: EntityId
  label: string
  operationalStatus: string  // 'available' | 'occupied' | 'reserved' | 'dirty' | 'maintenance' | 'out-of-order'
}

// ── Folio ─────────────────────────────────────────────────────
// Guest-facing finance. DISTINCT from Expense (internal finance).
export interface FolioStub {
  id: EntityId
  status: string  // e.g. 'open' | 'closed' | 'closure-ready'
  balanceDue: number
}

// ── MaintenanceCase ───────────────────────────────────────────
// Asset problem with sellability impact. NOT housekeeping.
export interface MaintenanceCaseStub {
  id: EntityId
  status: string  // 'open' | 'in-progress' | 'blocked' | 'resolved' | 'closed'
  affectsSellability: boolean
}

// ── HousekeepingTask ──────────────────────────────────────────
// Readiness/turnover. NOT maintenance.
export interface HousekeepingTaskStub {
  id: EntityId
  status: string  // 'dirty' | 'cleaning' | 'inspect' | 'ready'
  bedId: EntityId
}

// ── Expense ───────────────────────────────────────────────────
// Internal operational cost. DISTINCT from Folio/guest finance.
export interface ExpenseStub {
  id: EntityId
  amount: number
  category: string
}

// ── Receivable ────────────────────────────────────────────────
// Open post-checkout balance. DISTINCT from Folio (which may be closed).
export interface ReceivableStub {
  id: EntityId
  stayId: EntityId
  amountDue: number
  status: string  // 'open' | 'partial' | 'collected'
}
