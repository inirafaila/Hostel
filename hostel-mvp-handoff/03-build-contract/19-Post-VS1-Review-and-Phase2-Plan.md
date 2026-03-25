# 19 - Post-VS1 Review & Phase 2 Planning

## Status
VS1 Check-In Orchestration slice is fully complete, manually QA-validated, and established as the project's current baseline. This document serves as the bridging blueprint between the completed Check-In orchestration layer and the upcoming phase.

---

## 1. Execution State Record
The following architectural behaviors were observed, hardened, and locked in as project baseline during the completion of VS1 Manual QA:

* **Backend Dev Runtime Bootstrap:**
  Added `server.ts` running Express purely to bootstrap the application execution environment. `npm run dev` with `tsx` serves the process locally on `3001` for testing.
* **Frontend Master-Detail Alignment:**
  The frontend was tuned to cleanly exchange discrete backend identifiers rather than mutating frontend-only UI-display labels (e.g., mapping `reservation-clean-1` and `bed-dirty-1` effectively downstream). Arrival Board context drawer behavior is formally verified.
* **Identified Frontend Read-Model Stubbing:**
  `CheckInWorkflow` success routing correctly drops the user at `/stays/{stayId}`, but the destination Stay Detail layout remains visually mapped to static UI mock states. This is an expected artifact of focusing purely on the *write-engine* for VS1 and is formally deferred until Read-Model Queries are implemented.

---

## 2. Dockerization Runtime Strategy
**Objective:** Establish containerization infrastructure without warping the established domain execution architecture or slowing down local domain compilation feedback loops.

**Decision Plan:** 
Maintain the current local-dev Node runtime (`tsx` / `tsc --noEmit` locally) for maximum velocity while completing the next critical MVP slices. Dockerization will be explicitly kept generic and lightweight.

*Implementation Target (Deferred to Post-VS2):*
- Introduce discrete standard `Dockerfile` files constrained explicitly inside `hostel-backend` and `hostel-frontend`.
- Wrap the execution in an orchestrating `docker-compose.yml` bound cleanly to ports `3001` and `5173`.
- By introducing Docker Compose *after* Phase 2 (Guest Finance) is verified, we prevent Docker-centric networking bugs from derailing core ledger construction momentum.

---

## 3. Phase 2 Target Definition (Vertical Slice 2)
Based on the overarching Backend Planning Report sequence and the completed Check-In flow, we move to the next sequential operational priority mapping:

**Next Slice: Vertical Slice 2 (Guest Finance & Posting Orchestration)**

Given the Check-In process successfully asserts and creates Folios via `FolioEnsureService`, the required continuation is activating the underlying Folio models to accept financial arithmetic and payment events.

**VS2 Scope Includes:**
- Establishing real logic inside `Folio` persistence to act as the ledger for check-in accounts.
- Implementing the `PostPaymentCommand` and `PostRefundCommand` execution boundaries.
- Building the boundary layer required to accept payments and prompt the Folio module to accurately crunch and expose an updated total `balanceDue`.
- Wiring the Frontend 'Folio / Payments' modal layouts to execute real billing payload routes.

*Explicitly Out of Scope for VS2 (Deferred Targets):*
- Checkout Orchestration engine (VS3)
- Corporate Expense tracking (Separate bounded context entirely)
- Housekeeping Turnover engine (Operations context)
- Real third-party Payment Gateway bindings (MVP uses manual recording)
