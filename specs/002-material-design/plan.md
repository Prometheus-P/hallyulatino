# Implementation Plan: Material Design 3 Integration

**Branch**: `002-material-design` | **Date**: 2025-12-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-material-design/spec.md`

## Summary

Implement Material Design 3 design system for HallyuLatino using Tailwind CSS v4's native CSS custom properties. The integration establishes a consistent visual language with Pink (#ec4899) as the primary brand color, M3 typography scale, accessible color contrast, and responsive layouts. This is a CSS-focused enhancement with no new dependencies or JavaScript requirements.

## Technical Context

**Language/Version**: TypeScript 5.x (existing)
**Primary Dependencies**: Tailwind CSS 4.x (existing), Astro 5.x (existing)
**Storage**: N/A (styling only)
**Testing**: Playwright E2E (existing) for visual regression and accessibility
**Target Platform**: Web (SSG via Astro to Cloudflare Pages)
**Project Type**: Web - static site with content collections
**Performance Goals**: Lighthouse Performance 90+, CSS bundle ≤50KB, FCP increase ≤100ms
**Constraints**: No client-side JavaScript for styling, must maintain SSG, WCAG 2.1 AA compliance
**Scale/Scope**: ~15 Astro components, 2 layouts, 5 page types, 4 content collections

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Compliance Notes |
|-----------|--------|------------------|
| I. SEO-First Development | ✅ PASS | CSS-only changes preserve SSG; no impact on meta tags or structured data |
| II. TDD (NON-NEGOTIABLE) | ✅ PASS | E2E tests for visual consistency and accessibility will be written first |
| III. Content Collection Integrity | ✅ PASS | No content schema changes; styling only |
| IV. Performance Budget | ✅ PASS | CSS custom properties approach minimizes bundle size; no new JS |
| V. Simplicity & YAGNI | ✅ PASS | Using existing Tailwind CSS v4; no new dependencies; CSS variables only |

**Technology Alignment:**
- Astro 5.x: ✅ Core - no changes
- Tailwind CSS 4.x: ✅ Preferred - native CSS custom properties for design tokens
- TypeScript 5.x: ✅ Required - no changes
- Playwright: ✅ Core - will add visual/accessibility tests

**Gate Result**: PASSED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/002-material-design/
├── plan.md              # This file
├── research.md          # Phase 0: M3 token mapping research
├── data-model.md        # Phase 1: Design token schema
├── quickstart.md        # Phase 1: Testing/verification guide
├── contracts/           # Phase 1: CSS custom property contracts
│   └── design-tokens.css
└── tasks.md             # Phase 2: Implementation tasks
```

### Source Code (repository root)

```text
src/
├── styles/
│   └── global.css           # M3 design tokens (CSS custom properties)
├── layouts/
│   ├── BaseLayout.astro     # Apply M3 tokens, dark mode support
│   └── ArticleLayout.astro  # Typography scale application
├── components/
│   ├── ui/                  # Existing UI components to style
│   └── ...
└── pages/
    └── ...                  # Pages inherit from layouts

tests/
└── e2e/
    ├── visual-consistency.spec.ts  # M3 visual consistency tests
    └── accessibility.spec.ts       # WCAG 2.1 AA compliance tests
```

**Structure Decision**: Single project web application. Design tokens defined in `src/styles/global.css` using CSS custom properties, applied through Tailwind utility classes and component styles. No structural changes to existing Astro architecture.

## Complexity Tracking

No complexity violations. This feature:
- Uses existing Tailwind CSS v4 (no new dependencies)
- Implements via CSS custom properties (simplest approach)
- No JavaScript required for core functionality
- No new abstractions - direct CSS variable usage
