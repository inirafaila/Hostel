# CURRENT-EXECUTION-STATE

## Status

Approved execution baseline for the Hostel Management Web App project.

## Project Scope Snapshot

Desktop-first Hostel Management Web App MVP with:

* bed-first inventory
* reservation / check-in / stay / checkout lifecycle
* bed move workflow
* folio / payment / refund / receivable
* expense
* maintenance
* housekeeping
* advisory-only AI in MVP

## Authority Chain

Always resolve ambiguity in this order:

### Tier 1 — Domain Truth

* 01-Core Operational Flows
* 02-Hostel Business Rules
* 03-Hostel Domain Model & Entity Map
* 04-Hostel State Transition Map

### Tier 2 — Execution / Action Logic

* 05-Hostel Entity Field Definition
* 06-Entity Relationship Rules & Ownership Boundaries
* 07-Transaction Boundaries & Service Module Design
* 08-Command & Event Catalog
* 09-Validation Matrix & Permission Matrix
* 10-Screen-to-command Mapping & UX Decision Rules
* 11-MVP Screen Specification Pack

### Tier 3 — UI / Interaction / Layout Contract

* 12-Design System & Interaction Pattern Specification
* 13-Wireframe Pack For MVP Priority Screens
* 14-Page Layout Blueprint
* 15-Component Specification Sheet

### Tier 4 — Build / Architecture Contract

* 16-Frontend Architecture & Folder Structure Blueprint
* 17-Antigravity Implementation Prompt Pack

### Handoff Control Docs

* 00-HANDOFF-README.md
* 01-DOC-INDEX.md
* CURRENT-EXECUTION-STATE.md

## Non-Negotiable Truths

* Bed-first inventory is first-class truth
* Reservation != Stay != Bed Assignment
* Assignment != Inventory Asset
* Folio != Expense
* Housekeeping != Maintenance
* Warning != Block != Override
* AI Assistant is advisory only in MVP

## Current Repo State

Root repo is now the project root monorepo shape:

* `hostel-frontend/`
* `hostel-backend/`
* `hostel-mvp-handoff/`

Git root is the project root repo, not the frontend subfolder.

## Frontend Execution Status

Frontend MVP baseline is complete and hardened enough for backend integration planning.

### Completed frontend milestones

* Phase 1: scaffold and shell
* Phase 2: shared/layout refinement + entity display modules
* Phase 3: priority screen composition
* Phase 4: folio + operational workflows
* Phase 5: support screens + bed move
* Phase 6: hardening, cleanup, consistency pass, runtime safety
* Final UX / Operator Confidence mini-pass completed

### Frontend screens/workflows already present

* Dashboard
* Arrival Board
* Inventory
* Reservation Detail
* Stay Detail
* Folio
* Housekeeping
* Maintenance
* Receivables
* Expenses
* Check-in workflow
* Checkout workflow
* Payment entry workflow
* Refund entry workflow
* Bed move workflow

## Backend Execution Status

Backend track has started.

### Approved backend planning artifacts

* Backend Integration Planning Report approved
* Vertical Slice 1 planning approved
* `18-VS1-CheckIn-Implementation-Plan.md` saved as approved baseline

### Current backend slice

* Backend Vertical Slice 1
* Slice focus: Check-in orchestration

### Slice definition

Reservation -> Stay activation -> Bed Assignment -> Folio opening/readiness

### Backend substep status

* Substep 1: complete and approved

  * contract + entrypoint skeleton
  * backend folder structure stabilized
  * occupancy / guest-finance / infrastructure separated
  * TypeScript baseline passes

* Substep 2: complete and approved

  * check-in validation contract shape established
  * hard block vs overrideable block distinction established
  * override-aware validation scaffolding implemented
  * invalid / unused override inputs are surfaced explicitly
  * reservation state validity is scaffolded
  * bed occupancy / severe maintenance / dirty bed / gender mismatch validation is scaffolded
  * persistence remains mostly stubbed
  * strict TypeScript verification passed in `hostel-backend` via manual terminal execution

* Substep 3: complete and approved

  * minimum repository / data-model scaffolding introduced for VS1 check-in
  * occupancy persistence boundaries scaffolded for Reservation / Stay / Assignment
  * guest-finance folio boundary scaffolding introduced for later transaction wiring
  * transaction context contract introduced for compile-safe persistence coordination
  * approved real-repo manual fix applied in `hostel-backend/src/modules/guest-finance/domain/FolioEnsureService.ts` import path
  * strict TypeScript verification passed in `hostel-backend` via manual terminal execution

* Substep 4: complete and approved

  * `CheckInCommandHandler` is transaction-wired against the approved repository contracts
  * reservation operational update is wired inside the atomic transaction
  * stay creation and assignment creation are wired inside the atomic transaction
  * folio ensure call remains behind the guest-finance boundary
  * event publish remains positioned after transaction completion
  * validation consumption from Substep 2 remains intact
  * strict TypeScript verification passed in `hostel-backend` via manual terminal execution

* Substep 5: complete and approved

  * `FolioEnsureService` now depends on the guest-finance repository boundary instead of a static stub
  * folio ensure/open behavior is explicit and compile-safe for VS1 check-in
  * occupancy continues to depend only on the guest-finance boundary service, not finance repositories directly
  * txContext-compatible folio persistence is preserved for the approved check-in transaction flow
  * no payment / refund / receivable / checkout logic was introduced
  * strict TypeScript verification passed in `hostel-backend` via manual terminal execution

* Substep 6: complete and approved

  * `CheckInController` is aligned with the approved `CheckInCommandHandler` flow
  * request DTO and override payload semantics remain compile-safe
  * validation failure surfacing is preserved through the controller boundary
  * controller remains thin and does not absorb handler/repository business logic
  * strict TypeScript verification passed in `hostel-backend` via manual terminal execution

* Substep 7: complete and approved

  * frontend check-in flow is wired to the backend check-in command path
  * submit behavior remains non-optimistic until server confirmation
  * validation failure / override-required feedback is surfaced from backend responses
  * Arrival Board context selection and reservation-detail routing were corrected during QA unblock fixes
  * frontend/backend command-id alignment was corrected during QA unblock fixes
  * strict TypeScript verification passed in `hostel-frontend` via manual terminal execution

* Step 8: manual QA complete

  * override-required dirty-bed scenario passed
  * clean success scenario passed
  * hard-block occupied-bed scenario passed
  * backend dev runtime bootstrap was used successfully for end-to-end local QA
  * repeated execution against the same in-memory fixture correctly produced stateful follow-up blocking
  * note: stay-detail routing after success works, but stay-detail content remains mock/static-bound

* Next exact step: **Post-VS1 Review: execution-state cleanup, document alignment review, and runtime/containerization planning**

## Current Approved Backend Scope

Vertical Slice 1 includes only:

* check-in readiness evaluation
* CheckInGuest command handling path
* stay activation/creation
* bed assignment creation
* reservation operational update as needed
* folio ensure/open handling
* override reason handling
* response/read refresh planning for frontend integration

## Explicitly Out of Scope Right Now

Do NOT expand into these during the Post-VS1 review and planning pass:

* payment posting
* refund posting
* checkout implementation
* receivable collection
* housekeeping progression
* maintenance lifecycle changes
* auth / RBAC implementation
* analytics / AI
* multilingual / RTL
* broad backend scaffolding outside the slice

## Anti-Drift Reminders

* Do not collapse stay and assignment semantics
* Do not treat inventory as ownership source for occupancy; inventory is validation/read truth for this slice
* Do not turn open balance into automatic hard check-in block unless docs explicitly require it
* Do not merge payment collection ownership into folio ownership
* Do not lose override reason/accountability requirements
* Do not let implementation convenience override authority docs
* If docs and implementation ideas conflict, docs win
* Approved manual repo fixes that restore compile correctness must be treated as part of the current baseline and explicitly carried forward in later prompts

## Deferred Items

Deferred beyond current slice unless explicitly revisited later:

* payment/refund backend implementation
* checkout orchestration backend implementation
* receivable collection engine
* housekeeping progression backend logic
* maintenance resolution backend logic
* audit trail persistence depth beyond minimum slice needs
* role/permission enforcement engine
* AI assistant integration
* i18n / RTL
* analytics / reporting

## Current Manual QA Notes

* Frontend baseline is usable and navigation context has been improved
* Folio discoverability is now available via receivables context
* Check-in override reason behavior is present in UI
* Bed-move override edge-case should still be kept in manual QA awareness during future backend wiring

## Next Exact Step

Proceed with:
**Post-VS1 Review: execution-state cleanup, document alignment review, and runtime/containerization planning**

Expected focus:

* mark VS1 check-in slice as manually QA-validated
* record the temporary backend dev runtime bootstrap used for QA
* record the frontend QA-unblock fixes that were required during manual testing
* record the known note that stay-detail routing works but stay-detail content is still mock/static-bound
* review authority docs and current execution artifacts before starting the next implementation slice
* decide when and how Dockerization should be introduced without disrupting the approved architecture

## Continuation Rule For New Chats

When continuing in a new chat:

1. attach `00-HANDOFF-README.md`
2. attach `01-DOC-INDEX.md`
3. attach `CURRENT-EXECUTION-STATE.md`
4. attach the latest approved slice plan relevant to the current step
5. explicitly state that this is a continuation, not a new project start
6. state the current exact step: `Post-VS1 Review: execution-state cleanup, document alignment review, and runtime/containerization planning`

## Suggested Update Rule

Update this file only when one of these happens:

* a phase is completed and approved
* a backend slice or substep is completed and approved
* repo structure changes materially
* a new approved planning baseline is created
* a major scope/defer decision is made


## Execution Discipline
- This project must always be treated as continuation work, not a restart
- Authority docs override implementation convenience
- Work must stay inside the currently approved phase / slice / substep
- Approved architecture/file boundaries should not be redesigned without explicit approval
- No silent semantic drift is allowed
- Each meaningful implementation step should end with explicit verification
- When editor-integrated command execution is unreliable, verification commands must be run manually in terminal and the real output must be captured before approval