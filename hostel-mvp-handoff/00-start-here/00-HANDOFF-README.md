# Hostel Management MVP — Handoff README

## Project Identity

This project is a desktop-first operational web application for hostel management.

It is not a generic hotel PMS, not a marketing dashboard, and not a simplified booking UI.  
It is an operational product designed for front-desk speed, operational clarity, financial visibility, and controlled workflows.

Core product scope includes:

- bed-first inventory model
- private room and dorm support
- reservation / check-in / stay / checkout lifecycle
- bed move workflow
- folio, charges, payments, refunds, receivables
- housekeeping turnover
- maintenance impact on sellability
- AI assistant for query / reporting / advisory only in MVP

---

## Non-Negotiable Product Truths

The following truths must be preserved in design and implementation:

1. **Bed-first inventory is the source of truth**
   - Room-level summary may exist, but bed-level reality remains first-class.

2. **Reservation != Stay != Bed Assignment**
   - These are distinct domain concepts and must not be collapsed into one generic booking abstraction.

3. **Assignment != Inventory Asset**
   - Assignment is a temporal occupancy/use relationship.
   - Bed and room inventory are separate asset truths.

4. **Folio != Expense**
   - Guest-facing finance and internal finance must remain separate in both UI and implementation.

5. **Housekeeping != Maintenance**
   - Housekeeping is about readiness/turnover.
   - Maintenance is about asset problem / sellability impact.

6. **Warning != Block != Override**
   - These are different interaction meanings and must remain distinct visually and behaviorally.

7. **AI Assistant is advisory only in MVP**
   - AI may answer, summarize, or suggest.
   - It must not appear as an autonomous transactional engine.

---

## UX / UI Intent

The UI must optimize for:

- front-desk speed
- operational clarity
- visible current truth
- controlled financial review
- predictable layouts
- reusable but domain-aligned components

The product should feel operational, not decorative.

---

## Architecture Constraints

Implementation must follow the approved frontend architecture.

Required top-level separation:

- `app`
- `pages`
- `workflows`
- `features`
- `entities`
- `shared`
- `services`
- `contracts`
- `lib`

Important architecture rules:

- Do not use a flat global `components/` folder.
- Do not move domain-aware components into `shared`.
- Keep workflows first-class and separate from pages.
- Keep presentational primitives separate from domain UI.
- Do not compute deep business truth inside low-level UI components.
- Do not improvise domain semantics during implementation.

---

## Priority Screens for MVP Build

Build priority is:

1. Dashboard
2. Arrival Board
3. Reservation Detail
4. Stay Detail
5. Checkout Flow
6. Folio View
7. Maintenance Board
8. Housekeeping Queue

Secondary screens and flows:

- Bed Move Flow
- Expense View
- Receivables View
- Inventory View
- AI Assistant Panel
- Post Payment / Post Refund flows
- Reservation Create/Edit flow if included in this pass

---

## Layout and Interaction Rules

Implementation must follow approved layout families and interaction semantics.

Important rules:

- Current truth must appear early above the fold.
- Primary CTA must be easy to find.
- Warnings must appear close to action.
- Blocks and overrides must be explicit.
- Checkout must clearly show bed dirty/turnover consequence.
- Folio must clearly separate charges, payments, refunds, and balance due.
- Inventory screens must preserve bed-level visibility.
- AI suggestions must remain review-based.

---

## Build Method

Do not build the whole app in one uncontrolled pass.

Build phase-by-phase:

1. architecture scaffold
2. shared foundations
3. domain display primitives
4. core pages and workflows
5. secondary/support screens
6. hardening, cleanup, and browser validation

After each phase, review architecture and UX consistency before continuing.

---

## Source of Truth Order

When ambiguity appears, use the documents in this order:

### Tier 1 — Domain Truth
- Core Operational Flows
- Hostel Business Rules
- Hostel Domain Model & Entity Map
- Hostel State Transition Map

### Tier 2 — UX / Screen / Interaction Contract
- MVP Screen Specification Pack
- Design System & Interaction Pattern Specification
- Wireframe Pack for MVP Priority Screens
- Page Layout Blueprint
- Component Specification Sheet

### Tier 3 — Build Contract
- Frontend Architecture & Folder Structure Blueprint
- Antigravity Implementation Prompt Pack

### Tier 4 — Reference Docs
- Hostel Entity Field Definition
- Entity Relationship Rules & Ownership Boundaries
- Transaction Boundaries & Service Module Design
- Command & Event Catalog
- Validation Matrix & Permission Matrix
- Screen-to-Command Mapping & UX Decision Rules

If implementation conflicts with these documents, the documents win.

---

## What Must Not Happen

Do not:

- collapse Reservation / Stay / Assignment into one model
- hide bed truth behind room-only abstractions
- treat Folio and Expense as one finance model
- merge Housekeeping and Maintenance into one issue board
- use one generic status model for all truths
- bury critical workflows inside page-local ad hoc modals
- allow architecture drift into page chaos or shared chaos
- make AI look autonomous

---

## How This Handoff Should Be Used

At the start of each implementation session:

1. read this file first
2. read the document index
3. load the relevant build contract documents
4. load the relevant UI/UX documents for the current phase
5. implement only the assigned phase or screen cluster
6. review before moving forward

This file is the entry brief.  
It does not replace the full documents.  
It anchors the implementation direction.