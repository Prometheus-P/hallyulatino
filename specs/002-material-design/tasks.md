# Tasks: Material Design 3 Integration

**Input**: Design documents from `/specs/002-material-design/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/design-tokens.css, research.md, quickstart.md

**Tests**: E2E tests using Playwright are REQUIRED per constitution (TDD mandate).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths follow existing Astro structure per plan.md

---

## Phase 1: Setup

**Purpose**: Establish M3 design token foundation

- [ ] T001 Copy design tokens from specs/002-material-design/contracts/design-tokens.css to src/styles/global.css
- [ ] T002 [P] Verify Tailwind CSS v4 imports design tokens correctly (build test)
- [ ] T003 [P] Create E2E test directory structure at tests/e2e/ if not exists

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core design token infrastructure that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Add M3 color tokens (primary, secondary, tertiary, error, surface) to src/styles/global.css
- [ ] T005 [P] Add M3 typography tokens (display, headline, title, body, label scales) to src/styles/global.css
- [ ] T006 [P] Add M3 spacing tokens (xs through 3xl) to src/styles/global.css
- [ ] T007 [P] Add M3 shape tokens (border radius scale) to src/styles/global.css
- [ ] T008 [P] Add M3 elevation tokens (box shadow scale) to src/styles/global.css
- [ ] T009 [P] Add M3 motion tokens (duration, easing) to src/styles/global.css
- [ ] T010 Add dark mode color tokens via prefers-color-scheme media query in src/styles/global.css
- [ ] T011 Add reduced-motion support via prefers-reduced-motion media query in src/styles/global.css
- [ ] T012 Build site and verify CSS tokens are applied (pnpm build)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Consistent Visual Identity (Priority: P1)

**Goal**: Visitors experience cohesive visual design with consistent colors, typography, and spacing across all pages

**Independent Test**: Navigate homepage → article → search results, verify consistent color palette, typography hierarchy, component styling

### Tests for User Story 1 (TDD - Write First, Must Fail)

- [ ] T013 [P] [US1] Create E2E test file at tests/e2e/visual-consistency.spec.ts
- [ ] T014 [US1] Write test: homepage uses M3 color tokens for primary, surface, on-surface
- [ ] T015 [US1] Write test: article page typography uses M3 headline/body scale
- [ ] T016 [US1] Write test: navigation bar uses consistent M3 styling across pages
- [ ] T017 [US1] Write test: interactive elements (buttons, links) have consistent visual treatment
- [ ] T018 [US1] Run tests and verify they FAIL (Red phase)

### Implementation for User Story 1

- [ ] T019 [US1] Apply M3 surface colors to BaseLayout.astro body element
- [ ] T020 [US1] Apply M3 typography tokens to BaseLayout.astro global text styles
- [ ] T021 [P] [US1] Update navigation component with M3 color and spacing tokens
- [ ] T022 [P] [US1] Update footer component with M3 color and spacing tokens
- [ ] T023 [US1] Apply M3 headline scale to ArticleLayout.astro headings (h1-h6)
- [ ] T024 [US1] Apply M3 body scale to ArticleLayout.astro paragraph and prose content
- [ ] T025 [P] [US1] Style article cards with M3 surface-variant, elevation, and shape tokens
- [ ] T026 [P] [US1] Style buttons and links with M3 primary color and hover states
- [ ] T027 [US1] Ensure search feature components use M3 design tokens (FR-014)
- [ ] T028 [US1] Run E2E tests and verify they PASS (Green phase)

**Checkpoint**: User Story 1 complete - visual consistency is functional and testable independently

---

## Phase 4: User Story 2 - Accessible Content Experience (Priority: P2)

**Goal**: Users with varying abilities can fully access and navigate content with WCAG 2.1 AA compliance

**Independent Test**: Run accessibility audit, test keyboard navigation, verify screen reader compatibility

### Tests for User Story 2 (TDD - Write First, Must Fail)

- [ ] T029 [P] [US2] Create E2E test file at tests/e2e/accessibility.spec.ts
- [ ] T030 [US2] Write test: all text has minimum 4.5:1 contrast ratio (FR-004)
- [ ] T031 [US2] Write test: all interactive elements have visible focus indicators (FR-005)
- [ ] T032 [US2] Write test: keyboard navigation follows logical tab order
- [ ] T033 [US2] Write test: skip-to-content link is functional (FR-012)
- [ ] T034 [US2] Write test: reduced-motion preference disables animations (FR-009)
- [ ] T035 [US2] Run tests and verify they FAIL (Red phase)

### Implementation for User Story 2

- [ ] T036 [US2] Audit and fix color contrast issues using M3 on-surface/on-primary tokens
- [ ] T037 [US2] Add visible focus ring styles using M3 primary color and outline tokens
- [ ] T038 [US2] Verify and fix logical tab order in BaseLayout.astro navigation
- [ ] T039 [US2] Verify skip-to-content link exists and works in BaseLayout.astro (FR-012)
- [ ] T040 [US2] Add prefers-reduced-motion styles to disable all transitions (FR-009)
- [ ] T041 [P] [US2] Audit all images for meaningful alt text (FR-011)
- [ ] T042 [US2] Run E2E tests and verify they PASS (Green phase)

**Checkpoint**: User Story 2 complete - accessibility is functional and testable independently

---

## Phase 5: User Story 3 - Responsive Layout Across Devices (Priority: P3)

**Goal**: Site adapts optimally to mobile (<768px), tablet (768-1024px), and desktop (>1024px) viewports

**Independent Test**: Access site at 375px, 768px, 1280px widths and verify layout adapts without horizontal scrolling

### Tests for User Story 3 (TDD - Write First, Must Fail)

- [ ] T043 [P] [US3] Create E2E test file at tests/e2e/responsive-layout.spec.ts
- [ ] T044 [US3] Write test: mobile viewport (375px) shows single-column layout without horizontal scroll
- [ ] T045 [US3] Write test: tablet viewport (768px) shows appropriate grid layout
- [ ] T046 [US3] Write test: desktop viewport (1280px) has max-width container and comfortable line length
- [ ] T047 [US3] Write test: touch targets are ≥44px on mobile
- [ ] T048 [US3] Run tests and verify they FAIL (Red phase)

### Implementation for User Story 3

- [ ] T049 [US3] Update BaseLayout.astro container with responsive max-width and padding
- [ ] T050 [US3] Add responsive typography scaling (smaller on mobile, larger on desktop)
- [ ] T051 [P] [US3] Update homepage grid layout for mobile/tablet/desktop breakpoints
- [ ] T052 [P] [US3] Update article card grid for responsive column counts
- [ ] T053 [US3] Ensure navigation collapses appropriately on mobile
- [ ] T054 [US3] Add comfortable line-length constraints (max-ch) for article content
- [ ] T055 [US3] Verify touch target sizes meet 44px minimum on mobile
- [ ] T056 [US3] Run E2E tests and verify they PASS (Green phase)

**Checkpoint**: User Story 3 complete - responsive layout is functional and testable independently

---

## Phase 6: User Story 4 - Enhanced Interactive Feedback (Priority: P4)

**Goal**: Clear visual feedback for all user interactions (hover, focus, active, loading states)

**Independent Test**: Interact with buttons, links, forms and observe visual state changes

### Tests for User Story 4 (TDD - Write First, Must Fail)

- [ ] T057 [P] [US4] Create E2E test file at tests/e2e/interactive-feedback.spec.ts
- [ ] T058 [US4] Write test: buttons show hover state with color/elevation change
- [ ] T059 [US4] Write test: links show hover state with underline or color change
- [ ] T060 [US4] Write test: form inputs show focus state with border/outline change
- [ ] T061 [US4] Write test: cards show hover state with elevation change
- [ ] T062 [US4] Run tests and verify they FAIL (Red phase)

### Implementation for User Story 4

- [ ] T063 [US4] Add button hover/active states using M3 state layer opacity tokens
- [ ] T064 [US4] Add link hover states using M3 primary color variants
- [ ] T065 [P] [US4] Add form input focus states using M3 outline and primary tokens
- [ ] T066 [P] [US4] Add card hover states using M3 elevation tokens
- [ ] T067 [US4] Add smooth transitions using M3 motion duration and easing tokens
- [ ] T068 [US4] Run E2E tests and verify they PASS (Green phase)

**Checkpoint**: User Story 4 complete - interactive feedback is functional and testable independently

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, edge cases, and performance optimization

- [ ] T069 [P] Implement dark mode color scheme toggle via prefers-color-scheme (FR-013)
- [ ] T070 [P] Add font-display: swap to prevent render blocking (FR-007)
- [ ] T071 [P] Add fallback system fonts for graceful degradation (FR-008)
- [ ] T072 [P] Handle long titles (50+ chars) with text truncation or wrapping
- [ ] T073 [P] Add image loading placeholder/skeleton states
- [ ] T074 Run Lighthouse audit and verify Accessibility score ≥95 (SC-001)
- [ ] T075 Run Lighthouse audit and verify Performance score ≥90 (Constitution IV)
- [ ] T076 Verify CSS bundle size ≤50KB (Constitution IV)
- [ ] T077 Verify FCP increase ≤100ms compared to baseline (SC-005)
- [ ] T078 Run full E2E test suite: `pnpm test:e2e tests/e2e/*.spec.ts`
- [ ] T079 Manual verification per quickstart.md checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1): Can start after Phase 2
  - US2 (P2): Can start after Phase 2 (parallel with US1 if desired)
  - US3 (P3): Can start after Phase 2 (parallel with US1/US2 if desired)
  - US4 (P4): Can start after Phase 2 (parallel with others if desired)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

All user stories can technically proceed in parallel after Phase 2, but recommended order:
- **US1 (P1)**: Start first - establishes core visual foundation used by others
- **US2 (P2)**: After US1 - accessibility builds on visual tokens
- **US3 (P3)**: After US1 - responsive layouts use same tokens
- **US4 (P4)**: After US1 - interactive states use same color system

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD Red phase)
- Implementation MUST make tests pass (TDD Green phase)
- All tests marked [P] within a phase can run in parallel
- CSS token tasks marked [P] can run in parallel (different token categories)

### Parallel Opportunities

- All token definition tasks (T004-T009) can run in parallel
- All test file creation tasks marked [P] can run in parallel
- Component styling tasks within same phase marked [P] can run in parallel

---

## Parallel Example: Phase 2 Foundational

```bash
# Launch all token definition tasks in parallel:
Task T004: Color tokens in src/styles/global.css
Task T005: Typography tokens in src/styles/global.css
Task T006: Spacing tokens in src/styles/global.css
Task T007: Shape tokens in src/styles/global.css
Task T008: Elevation tokens in src/styles/global.css
Task T009: Motion tokens in src/styles/global.css
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test US1 independently
5. Deploy/demo if ready - visual consistency is functional

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Test independently → Deploy (MVP!)
3. Add US2 → Test independently → Deploy (accessible)
4. Add US3 → Test independently → Deploy (responsive)
5. Add US4 → Test independently → Deploy (interactive)
6. Polish → Final validation → Release

### Parallel Team Strategy

With multiple developers:
1. All complete Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (visual consistency)
   - Developer B: US2 (accessibility) - can start after A completes tokens
3. After US1 complete:
   - Developer A: US3 (responsive)
   - Developer B: US4 (interactive)

---

## Notes

- [P] tasks = different files or CSS sections, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- TDD is MANDATORY: Write tests FIRST, verify they FAIL, then implement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
