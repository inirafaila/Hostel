# 18. Vertical Slice 1 Implementation Plan

**Title:** Vertical Slice 1 Implementation Plan - Check-In Orchestration
**Status:** Approved Planning Baseline
**Scope:** Backend Vertical Slice 1 — Check-In Orchestration
**Depends On:** Backend Integration Planning Report + core authority docs
**Out of Scope:** payment/refund/checkout/receivables/housekeeping progression/maintenance lifecycle/auth engine

---

### 1. Slice objective and exact scope
The objective of this slice is to implement the backend orchestration required to securely transition a Reservation into an active in-house Stay. 

**Exact Inclusion Scope:**
- Readiness and eligibility check (target bed availability, gender rules, dirtiness).
- Handling of the `CheckInGuest` command.
- Transactional activation/creation of the Stay record.
- Transactional creation of the precise Bed Assignment.
- Updating the Reservation's operational state to 'In-House'.
- Ensuring a default Folio is opened (or verified open) and linked to the Stay.
- Capturing, validating, and recording explicit override reasons when soft business rules are bypassed.

**Exact Exclusion Scope:**
- Payment posting or collection.
- Refund posting.
- Checkout workflows.
- Receivable collection.
- Housekeeping progression (e.g., actually cleaning a bed).
- Maintenance lifecycle changes (e.g., repairing a bed).
- Full permission/RBAC engine implementation.
- Analytics, AI processing, or background jobs.

### 2. Assumed backend architecture for this slice
To preserve domain boundaries without over-engineering, this slice assumes a modular, vertical-slice-oriented architecture relying on clear domain boundaries:

- **Command Entry Layer (Route/Controller):** Receives the HTTP request, performs basic payload shape validation, and unwraps the DTO.
- **Validation/Policy Layer:** Encapsulates business rule logic (e.g., `BedReadinessValidator`). Emits structured validation failures if rules trip without overrides.
- **Command Handler Layer:** Orchestrates the core logic. Receives the validated command and coordinates the domain entities.
- **Repository/Data Access Layer:** Abstracts the persistence mechanism, allowing the handler to fetch aggregates (Reservation, Configuration) and persist changes atomically.
- **Orchestration/Service Layer:** Coordinates cross-module boundaries (e.g., invoking `FolioEnsureService` after the Stay is activated).
- **Event/Audit Emission Layer:** Captures the outcome (including override reasons) and flushes domain events internally for trailing audit logs.

### 3. Files/modules to create or modify
This slice relies on the foundational separation of concerns. Recommended files/modules:

- `CheckInGuestRequest` (DTO): Defines the incoming payload shape including the `overrides` array.
- `CheckInController` (Entrypoint): HTTP boundary mapping the POST request to the internal command execution.
- `CheckInCommandHandler`: The primary orchestrator running the exact check-in transactional script.
- `CheckInReadinessValidator`: Evaluates target bed state, maintenance blocks, and gender rule matches. Evaluates provided overrides against these rules.
- `StayFactory` / `AssignmentFactory`: Domain services to safely instantiate the Stay and bind it to the Bed Assignment.
- `FolioEnsureService`: A boundary module in the Guest Finance context that the Handler calls to verify or create the Folio identity.
- `UnitOfWork` / `TransactionCoordinator`: Wraps the DB updates (Reservation, Stay, Assignment) into an atomic commit.
- `GuestCheckedInEvent` (Model): Defines the event emitted post-commit, capturing exactly who checked in, where, and why any overrides were executed.

### 4. Internal responsibility map
- **Occupancy & Reservation Context (Driver):** Completely owns the Check-In command execution. Owns updates to the Reservation, creation of the Stay, and creation of the Bed Assignment.
- **Inventory & Asset Context (Read-Only validation):** Provides real-time bed status (Occupied? Out of Order? Maintenance Blocked?) to the Occupancy context. Does *not* receive writes during check-in.
- **Guest Finance Context (Synchronous Receiver):** Provides the `FolioEnsureService`. Completely owns Folio creation and balance logic. Must *not* assume payment collection has occurred in this slice.
- **Payment Collection Context:** Completely isolated and out of bounds for this slice.

### 5. Request/response contract draft for CheckInGuest
**Endpoint:** `POST /api/stays/check-in`

**Expected Request Shape:**
```json
{
  "reservationId": "uuid-1234",
  "targetBedId": "uuid-5678",
  "overrides": [
    {
      "rule": "GenderMismatch",
      "reason": "Approved by manager upon guest request"
    }
  ],
  "operatorId": "uuid-agent-99"
}
```

**Expected Success Response (`201 Created` or `200 OK`):**
```json
{
  "stayId": "uuid-stay-1",
  "assignmentId": "uuid-assign-1",
  "folioId": "uuid-folio-1",
  "status": "In-House"
}
```

**Expected Validation Failure / Soft Block Response (`422 Unprocessable Entity` or `409 Conflict`):**
```json
{
  "error": "ValidationFailed",
  "requiresOverride": true,
  "violations": [
    { "rule": "BedDirty", "message": "Target bed is marked dirty." }
  ]
}
```

**Expected Hard Block Response (`409 Conflict`):**
Returns failure without a `requiresOverride: true` flag if the bed is unequivocally occupied or blocked by severe maintenance.

### 6. Validation pipeline design
The validation sequence strictly governs check-in safety:
1. **Pre-handler Request Shape Validation:** Ensure required IDs are valid UUIDs and structurally sound.
2. **Entity Existence Check:** Verify Reservation exists and is in a state allowing check-in (e.g., 'Confirmed' or 'Arriving', not 'Checked-In' or 'Cancelled').
3. **Hard Block Checks:** Ask the Inventory module: Is the bed occupied right now? Is there an active Maintenance Block affecting readiness that cannot be bypassed? If yes -> throw Hard Block.
4. **Overrideable Block / Warning Checks:** Ask the Inventory module: Is the bed designated a different gender? Is the housekeeping status 'Dirty'? 
5. **Override Matching:** If an overrideable block trips, explicitly check if the incoming `overrides` array contains a valid `reason` for that specific rule. If missing -> throw Validation Failure requiring override. If present -> proceed.

### 7. Transaction orchestration design
The database transaction perfectly models the atomic necessity of Occupancy.
- **Begin Transaction**
- **Write 1:** Update `Reservation` state to 'In-House'.
- **Write 2:** Insert new `Stay` entity derived from the Reservation.
- **Write 3:** Insert new `Assignment` entity binding the new `Stay` to the requested `targetBedId`.
- **Pre-Commit Action:** Invoke the `FolioEnsureService` to guarantee the database writes an open Folio linked to the new Stay. (This must occur within the same transaction or distributed transaction boundary to prevent stranded stays without a finance container).
- **Commit Transaction:** If anything fails, all components (Reservation, Stay, Assignment, Folio) roll back together.
- **Post-Commit Action:** Emit the `GuestCheckedInEvent` containing the captured override reasons out to the system bus.

### 8. Folio ensure/open design
- **Folio Readiness Meaning:** The Folio identity entity is successfully created in the database and linked to the active Stay. It starts with a Balance of $0.00 (or assumes existing reservation balances if charges were pre-calculated upstream).
- **Execution:** The Guest Finance module exposes a synchronous boundary (e.g., `EnsureFolioCommand`). If the folio does not exist for the Stay, it is instantiated. If it exists (e.g., pre-stay deposit mapping earlier), it is verified as 'Open'.
- **Avoidance of Payment Coupling:** Opening the Folio explicitly does *not* demand or orchestrate payment capture. Collection remains a completely separate command invoked by a separate workflow.

### 9. Event/audit handling inside the slice
- **Immediate Emission:** The core handler emits a `GuestCheckedInEvent` immediately after the transaction commits. 
- **Audit Requirement:** The `GuestCheckedInEvent` payload must explicitly embed the `overrides` array submitted by the frontend, ensuring an immutable log of who bypassed the dirty/gender rule and the exact string reason they typed.
- **Future Audit:** The broader audit platform (listening for these events to construct a UI-facing history timeline) is left for future slices, but the data must be rigorously emitted here.

### 10. Frontend integration plan after backend slice is built
- **Current Capability:** The React frontend already displays the target bed, detects warnings, captures the text reason via the `BedMoveWorkflow/CheckInWorkflow`, and controls the CTA via the `Check-In Process`.
- **Wiring on Submit:** The frontend will `POST` the collected ids and override array to the new backend endpoint.
- **Non-Optimistic UI:** The frontend must lock the UI with a distinct loading/processing state. It must *not* optimistically assume success, as hard concurrent blocks (e.g., double booking) must be definitively evaluated by the server.
- **After Success:** The frontend parses the resulting `stayId` and utilizes it to route the user instantly to the Stay Detail Page (`/stays/{stayId}`).
- **Re-fetch Requirement:** The global 'Arrival Board' cache and the global 'Inventory Matrix' cache must be invalidated/refetched via React Query to represent the newly occupied bed.

### 11. Safe implementation order
1. **Contract Freeze:** Formalize the JSON payload shape and validation strings with the frontend integration point.
2. **Validation Scaffolding:** Implement the stateless business rule validators (Gender logic, Dirty logic).
3. **Repository/Data Models:** Scaffold the ORM/Data structures representing Reservation, Stay, Assignment, and Folio.
4. **Command Handler & DB Transaction:** Implement the atomic core script executing the writes.
5. **Folio Ensure Mock/Stub:** Quickly establish the Guest Finance boundary before fully building out the Folio service.
6. **Command Entrypoint (HTTP):** Expose the route, unwrap the DTO, pass to the handler.
7. **Frontend Wiring:** Point the existing React Check-In flow to the live endpoint.
8. **Manual QA:** Attempt a clean check-in, an override check-in, and a hard-blocked double-assignment check-in natively through the API.

### 12. Risks, traps, and anti-drift rules
- **Trap:** *Merging Stay and Assignment semantics in the DB.* Anti-drift rule: A Stay represents the continuous in-house financial entity; an Assignment strictly represents the mapping to `Bed A` from `Time X to Y`. They must be two distinct tables/entities. 
- **Trap:** *Using Inventory as an active ledger.* Anti-drift rule: The `Bed` table should not aggressively store `currentStayId`. The `Assignment` table is the source of truth for who is where.
- **Trap:** *Turning open balances into Hard Blocks casually.* Anti-drift rule: Financial dependencies are warnings unless explicit Hostel Policy mandates prepayments. Do not block check-in exclusively due to balance without product justification.
- **Trap:** *Forgetting the override reason.* Anti-drift rule: If the UI captures the text, but the API accepts a boolean `force: true`, the audit trail dies. The API must require the text string.
- **Trap:** *Partial commits.* Anti-drift rule: The UI must never encounter a state where the Reservation says 'In-House' but the `Assignment` failed to write, leading to ghost stays. The transaction coordinator is absolutely mandatory.

### 13. Explicitly deferred items
These are intentionally out of scope for Vertical Slice 1:
- Payment posting, collection routing, and tokenization.
- Refund and charge posting mechanisms.
- The Checkout Orchestrator (billing validation, receivable emission, un-assigning).
- Receivable capture rules.
- Transitioning Housekeeping tasks from Pending -> Complete based on checkout.
- Managing Maintenance lifecycles (cases can block a check-in, but cannot be resolved in this slice).
- A full auth/RBAC engine implementation (security layers are bypassed/mocked at the controller level during this slice).
- Full background timeline tracking dashboards.
