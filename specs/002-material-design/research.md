# Research: Material Design 3 Integration

**Feature**: 002-material-design
**Date**: 2025-12-02
**Purpose**: Resolve technical decisions for M3 implementation with Tailwind CSS v4

## Color System

### Decision: M3 Tonal Palette from Pink (#ec4899)

**Rationale**: Generate complete M3 color scheme from the brand primary color using tonal palette methodology. M3 uses 13 tonal levels (0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100) for each key color.

**Alternatives Considered**:
- Manual color picking: Rejected - inconsistent and doesn't guarantee accessibility
- Using @material/material-color-utilities: Rejected - adds JS dependency, violates simplicity principle
- Pre-computed static palette: **Selected** - no runtime dependency, predictable, CSS-only

### M3 Color Roles Mapping

| M3 Role | Light Mode | Dark Mode | Usage |
|---------|------------|-----------|-------|
| Primary | Pink-40 (#ec4899) | Pink-80 (#f9a8d4) | Main actions, FABs |
| On-Primary | White (#ffffff) | Pink-20 (#9d174d) | Text on primary |
| Primary-Container | Pink-90 (#fce7f3) | Pink-30 (#be185d) | Secondary surfaces |
| On-Primary-Container | Pink-10 (#831843) | Pink-90 (#fce7f3) | Text on containers |
| Secondary | Gray-40 (#6b7280) | Gray-80 (#e5e7eb) | Less prominent actions |
| Tertiary | Purple-40 (#8b5cf6) | Purple-80 (#c4b5fd) | Accent, variety |
| Error | Red-40 (#ef4444) | Red-80 (#fca5a5) | Error states |
| Surface | Gray-99 (#fafafa) | Gray-10 (#1f2937) | Backgrounds |
| On-Surface | Gray-10 (#111827) | Gray-90 (#f3f4f6) | Body text |

**Source**: [M3 Color System](https://m3.material.io/styles/color/system/how-the-system-works)

---

## Typography Scale

### Decision: M3 15-Token Typography System

**Rationale**: M3 defines 5 roles (Display, Headline, Title, Body, Label) × 3 sizes (Large, Medium, Small) = 15 tokens. This provides comprehensive coverage for all content types.

**Alternatives Considered**:
- Custom scale: Rejected - M3 scale is research-backed and accessibility-tested
- Tailwind default scale: Rejected - doesn't map to M3 semantic roles
- M3 standard scale: **Selected** - proven, accessible, consistent

### Typography Token Values

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| Display Large | 57px | 64px | 400 | Hero sections |
| Display Medium | 45px | 52px | 400 | Large headlines |
| Display Small | 36px | 44px | 400 | Section titles |
| Headline Large | 32px | 40px | 400 | Page titles |
| Headline Medium | 28px | 36px | 400 | Section headers |
| Headline Small | 24px | 32px | 400 | Card titles |
| Title Large | 22px | 28px | 400 | Article titles |
| Title Medium | 16px | 24px | 500 | Subtitles |
| Title Small | 14px | 20px | 500 | Small titles |
| Body Large | 16px | 24px | 400 | Primary content |
| Body Medium | 14px | 20px | 400 | Secondary content |
| Body Small | 12px | 16px | 400 | Captions |
| Label Large | 14px | 20px | 500 | Buttons |
| Label Medium | 12px | 16px | 500 | Chips, tabs |
| Label Small | 11px | 16px | 500 | Badges |

**Font Family**: System fonts with Google Sans fallback (already preconnected)
```css
font-family: 'Google Sans', system-ui, -apple-system, sans-serif;
```

**Source**: [M3 Typography Scale](https://m3.material.io/styles/typography/type-scale-tokens)

---

## Spacing Scale

### Decision: 4px Base Unit

**Rationale**: M3 uses 4px as the base unit. All spacing values are multiples of 4px for visual rhythm and consistency.

**Spacing Tokens**:
| Token | Value | Usage |
|-------|-------|-------|
| --spacing-0 | 0px | None |
| --spacing-1 | 4px | Tight |
| --spacing-2 | 8px | Compact |
| --spacing-3 | 12px | Default inner |
| --spacing-4 | 16px | Default |
| --spacing-5 | 20px | Comfortable |
| --spacing-6 | 24px | Spacious |
| --spacing-8 | 32px | Section gaps |
| --spacing-10 | 40px | Large gaps |
| --spacing-12 | 48px | Layout sections |
| --spacing-16 | 64px | Major sections |

**Alignment with Tailwind**: Tailwind's default scale (1=4px, 2=8px, etc.) already matches M3 base unit.

---

## Dark Mode Implementation

### Decision: CSS Custom Properties with prefers-color-scheme

**Rationale**: Pure CSS approach using media queries. No JavaScript toggle needed (per spec assumption). System preference respected automatically.

**Alternatives Considered**:
- JavaScript toggle: Rejected - adds complexity, violates simplicity principle
- Class-based toggle (.dark): Rejected - requires JS for persistence
- Media query only: **Selected** - simplest, no JS, respects user preference

**Implementation Pattern**:
```css
:root {
  --color-surface: #fafafa;
  --color-on-surface: #111827;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: #1f2937;
    --color-on-surface: #f3f4f6;
  }
}
```

---

## Accessibility Compliance

### Decision: WCAG 2.1 AA as Minimum Standard

**Rationale**: AA is the widely accepted standard for web accessibility. AAA is aspirational but not always achievable with brand colors.

**Contrast Requirements**:
| Element Type | Minimum Ratio | M3 Compliance |
|--------------|---------------|---------------|
| Normal text (<18px) | 4.5:1 | ✅ All color pairs verified |
| Large text (≥18px bold, ≥24px) | 3:1 | ✅ All color pairs verified |
| UI components | 3:1 | ✅ Interactive elements |
| Focus indicators | 3:1 | ✅ Visible on all backgrounds |

**Verification**: Automated testing via Playwright + axe-core integration.

---

## Responsive Breakpoints

### Decision: Mobile-First with 3 Breakpoints

**Rationale**: Aligns with M3 layout guidance and Tailwind defaults. Mobile-first approach ensures base styles work everywhere.

| Breakpoint | Width | Tailwind Prefix | Layout Behavior |
|------------|-------|-----------------|-----------------|
| Mobile | <768px | (default) | Single column, full-width cards |
| Tablet | ≥768px | `md:` | 2-column grid, sidebar optional |
| Desktop | ≥1024px | `lg:` | 3-column grid, full navigation |
| Wide | ≥1280px | `xl:` | Max-width container, centered |

**Source**: Existing Tailwind v4 breakpoints (no changes needed)

---

## Implementation Approach

### Decision: CSS Custom Properties in global.css

**Rationale**: Tailwind CSS v4 supports native CSS custom properties. Define M3 tokens as CSS variables, reference via Tailwind's `var()` or custom utilities.

**Alternatives Considered**:
- Tailwind config extension: Rejected - Tailwind v4 uses CSS-based configuration
- Separate CSS file: Rejected - adds HTTP request, complexity
- Inline in global.css: **Selected** - single source of truth, already imported

**No New Dependencies Required**:
- Tailwind CSS v4: ✅ Already installed
- Google Fonts: ✅ Already preconnected
- axe-core (for testing): ✅ Playwright integration available

---

## References

- [Material Design 3 Color System](https://m3.material.io/styles/color/system/how-the-system-works)
- [Material Design 3 Typography Scale](https://m3.material.io/styles/typography/type-scale-tokens)
- [Material Web Typography](https://material-web.dev/theming/typography/)
- [LogicUI M3 Color Generator](https://www.logicui.com/colorgenerator)
- [M3 Typography Cheatsheet](https://medium.com/@vosarat1995/material-3-you-typography-cheatsheet-ffc58c540181)
