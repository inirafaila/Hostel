/**
 * features/ — Placeholder index for reusable interaction bundles.
 *
 * Phase 1: directory structure only. No feature bundles implemented yet.
 * Phase 3 scope: implement feature-level modules.
 *
 * Feature modules to implement in Phase 3+:
 * - features/bed-selector/           — Candidate bed selection UI with eligibility
 * - features/guest-selector/         — Guest search / create combo
 * - features/reservation-search/     — Reservation search and filter
 * - features/payment-form/           — Payment amount + method entry
 * - features/refund-form/            — Refund amount + reason entry
 * - features/open-maintenance-case/  — Open a new maintenance case
 * - features/housekeeping-task-controls/ — Start / Complete / Reopen actions
 * - features/receivable-actions/     — Follow-up and collection actions
 *
 * Architecture rules for this layer:
 * - Features are interaction bundles — NOT full route pages
 * - Features are NOT generic shared primitives
 * - Features may compose entity components + shared primitives
 * - Feature-local state/interaction logic lives HERE, not in pages
 */

// Re-exports will be added as feature modules are implemented in Phase 3+
