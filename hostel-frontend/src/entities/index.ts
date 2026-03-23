/**
 * entities/ — Placeholder index for canonical domain-aware UI modules.
 *
 * Phase 1: directory structure only. No entity components implemented yet.
 * Phase 2 scope: implement entity display components, view model mappers,
 * and status helpers for each entity module.
 *
 * Entity modules to implement in Phase 2:
 * - entities/reservation/ — Reservation display, status helpers
 * - entities/stay/        — Stay display, assignment context
 * - entities/bed/         — Bed tile, bed operational state helpers
 * - entities/folio/       — Folio totals display, charges/payments/refunds
 * - entities/maintenance-case/ — Maintenance status timeline, sellability impact
 * - entities/housekeeping-task/ — Housekeeping task row, readiness helpers
 * - entities/guest/       — Guest snapshot display
 * - entities/receivable/  — Receivable row display
 * - entities/expense/     — Expense row display
 * - entities/assignment/  — Assignment card display
 *
 * Architecture rules for this layer:
 * - Do NOT place full route pages here
 * - Do NOT place generic shared primitives here
 * - Do NOT collapse domain entities (e.g. Stay != Reservation)
 * - Status helpers must be entity-scoped (Bed status != Folio status)
 */

// Re-exports will be added as entity modules are implemented in Phase 2
