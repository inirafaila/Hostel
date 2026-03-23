# Hostel Management MVP — Document Index

## Purpose of This Index

This file explains:

- what each document is for
- in what order documents should be read
- which documents are authoritative for which kinds of decisions
- how to resolve ambiguity during implementation

This index is designed for controlled handoff into implementation.

---

# Document Hierarchy

## Tier 1 — Domain Truth

These documents define the core meaning of the product.  
They are the highest authority for product semantics.

### 1. Core Operational Flows
Defines the real operational flow of the hostel:
- reservation lifecycle
- check-in
- in-house stay
- bed move
- checkout
- housekeeping turnover
- maintenance interruption
- finance-related operational touchpoints

### 2. Hostel Business Rules
Defines the governing business rules of the MVP:
- bed-first logic
- private room vs dorm rules
- checkout with open receivable
- bed dirty after checkout
- maintenance sellability effect
- key operational and financial constraints

### 3. Hostel Domain Model & Entity Map
Defines the domain entities and their conceptual boundaries.

Important examples:
- Reservation
- Stay
- Bed Assignment
- Bed / Room / Space
- Folio
- Charge / Payment / Refund
- Expense
- Maintenance Case
- Housekeeping Task

### 4. Hostel State Transition Map
Defines state changes and valid transitions across the domain.

Use this when deciding:
- what can happen next
- what should be blocked
- what state-sensitive actions exist

---

## Tier 2 — Execution and UX Logic

These documents define how product logic becomes user-facing behavior.

### 5. Transaction Boundaries & Service Module Design
Defines operational transaction boundaries and service-oriented execution thinking.

Use this when:
- understanding action grouping
- understanding which actions should remain bounded
- deciding how workflows should remain coherent

### 6. Command & Event Catalog
Defines the language of action and outcome.

Use this when:
- mapping UI actions to commands
- understanding what events/actions matter
- checking execution semantics

### 7. Validation Matrix & Permission Matrix
Defines:
- what is allowed
- what is blocked
- what is warning-level
- what requires override
- what is role-sensitive

This is critical for:
- action visibility
- disabled states
- warning/block/override rendering

### 8. Screen-to-Command Mapping & UX Decision Rules
Defines which screens connect to which commands and which UX decision rules matter.

Use this when:
- deciding what each screen is supposed to do
- avoiding ad hoc CTA placement
- preserving screen intent

### 9. MVP Screen Specification Pack
Defines each important MVP screen at the screen-spec level:
- purpose
- required sections
- primary decisions
- primary CTA
- warnings / blocks / overrides
- in-scope vs out-of-scope

This is the main screen-level source of truth.

---

## Tier 3 — UI / Layout / Interaction Contract

These documents define how the product should look and behave structurally in the UI.

### 10. Design System & Interaction Pattern Specification
Defines:
- status semantics
- badge rules
- alert behavior
- table/form/modal/drawer patterns
- finance/inventory/readiness visualization rules
- component families at the conceptual level

Use this when:
- deciding status treatment
- deciding alert/warning/block/override behavior
- preserving visual meaning consistency

### 11. Wireframe Pack for MVP Priority Screens
Defines screen-level page architecture:
- layout structure
- above-the-fold priorities
- section breakdown
- action placement
- warning placement
- state variants

Use this when:
- building screens
- deciding section order
- deciding screen composition

### 12. Page Layout Blueprint
Defines shared layout rules across the application:
- layout families
- page shell patterns
- summary strip placement
- filter/table/context panel rules
- sticky zones
- confirmation zones
- responsive collapse logic

Use this when:
- implementing layouts
- creating layout primitives
- preserving consistency across screens

### 13. Component Specification Sheet
Defines reusable UI building blocks and their boundaries:
- shared components
- structural components
- state/feedback components
- action components
- domain-specific components

Use this when:
- building UI components
- deciding what belongs in shared vs entity vs feature
- preventing component sprawl

---

## Tier 4 — Build Contract

These documents define how implementation should be organized and executed.

### 14. Frontend Architecture & Folder Structure Blueprint
Defines implementation architecture:
- top-level layers
- responsibilities of app/pages/workflows/features/entities/shared/services/contracts/lib
- view model responsibilities
- command wiring boundaries
- anti-patterns to avoid

Use this when:
- scaffolding project structure
- reviewing architecture
- deciding where code belongs

### 15. Antigravity Implementation Prompt Pack
Defines the actual build contract for Antigravity / Gemini:
- build phases
- implementation constraints
- build order
- anti-patterns
- definition of done
- prompt skeleton

Use this when:
- starting implementation
- assigning phases
- reviewing build output

---

## Tier 5 — Reference Documents

These documents are important supporting references.  
They are not always the first thing to read, but they should be consulted when deeper precision is needed.

### 16. Hostel Entity Field Definition
Use when field-level clarity is needed for entity rendering or forms.

### 17. Entity Relationship Rules & Ownership Boundaries
Use when relationship ownership or cross-entity responsibility becomes ambiguous.

### 18. Transaction Boundaries & Service Module Design
Reference again when implementation decisions risk breaking action boundaries.

### 19. Command & Event Catalog
Reference again when command/event naming or intent becomes fuzzy.

### 20. Validation Matrix & Permission Matrix
Reference again when action gating or override behavior becomes unclear.

### 21. Screen-to-Command Mapping & UX Decision Rules
Reference again when screen purpose drifts or CTA design becomes inconsistent.

---

# Recommended Reading Order for Implementation

## Before starting the project scaffold
Read in this order:

1. Handoff README
2. This Document Index
3. Frontend Architecture & Folder Structure Blueprint
4. Antigravity Implementation Prompt Pack

## Before building core screens
Read or load:

1. MVP Screen Specification Pack
2. Design System & Interaction Pattern Specification
3. Wireframe Pack for MVP Priority Screens
4. Page Layout Blueprint
5. Component Specification Sheet

## When ambiguity appears in domain meaning
Go back to:

1. Core Operational Flows
2. Hostel Business Rules
3. Hostel Domain Model & Entity Map
4. Hostel State Transition Map

## When ambiguity appears in action behavior
Go back to:

1. Validation Matrix & Permission Matrix
2. Command & Event Catalog
3. Screen-to-Command Mapping & UX Decision Rules

---

# Decision Resolution Rules

If there is ambiguity, resolve in this order:

## 1. Domain Truth overrides UI guesswork
If implementation convenience conflicts with domain documents, domain documents win.

## 2. Screen and interaction contract override ad hoc layout decisions
If a developer or agent wants to improvise a layout that conflicts with the wireframe/layout/design docs, the docs win.

## 3. Architecture contract overrides convenience-driven code placement
If a quick implementation shortcut breaks the approved architecture layering, the architecture contract wins.

## 4. Reference documents clarify edge cases
When a detail is unclear, use the reference docs instead of inventing a new interpretation.

---

# Practical Usage Rules for Antigravity / Gemini

## Use this index at the start of each phase
Before implementation of a new phase or screen cluster:
- review this index
- load only the documents relevant to the current phase
- avoid unnecessary context overload

## Do not ask the agent to infer document priority
Priority is already defined here.

## Do not allow implementation to invent product semantics
If the implementation starts redefining domain concepts, stop and reconcile with Tier 1 and Tier 2 docs.

---

# Quick Mapping from Question Type to Document

## “What does this concept mean?”
Go to:
- Domain Model
- Business Rules
- State Transition Map

## “What should this screen do?”
Go to:
- MVP Screen Specification Pack
- Screen-to-Command Mapping & UX Decision Rules

## “How should this screen be laid out?”
Go to:
- Wireframe Pack
- Page Layout Blueprint

## “How should this interaction behave?”
Go to:
- Design System & Interaction Pattern Specification
- Validation Matrix & Permission Matrix

## “What component should we use/build?”
Go to:
- Component Specification Sheet

## “Where should this code/module live?”
Go to:
- Frontend Architecture & Folder Structure Blueprint

## “How should we ask Antigravity to build this?”
Go to:
- Antigravity Implementation Prompt Pack

---

# Final Rule

This document set is intended to prevent implementation drift.

The implementation should behave like:
- a builder constrained by product and architecture documents

It should not behave like:
- a free-form redesign of the product

If conflict appears, follow the documented chain of authority.