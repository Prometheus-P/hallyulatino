# Data Model: M3 Design Tokens

**Feature**: 002-material-design
**Date**: 2025-12-02
**Purpose**: Define design token schema for Material Design 3 integration

## Overview

Design tokens are the atomic visual values that define the design system. This document specifies the token naming conventions, value types, and relationships for the M3 implementation.

## Token Naming Convention

```
--md-{category}-{role}-{variant}
```

Examples:
- `--md-color-primary` - Primary color
- `--md-color-on-primary` - Text color on primary
- `--md-typo-headline-large` - Headline large font size
- `--md-spacing-md` - Medium spacing value

## Color Tokens

### Primary Palette (Pink #ec4899)

| Token | Light Value | Dark Value | Description |
|-------|-------------|------------|-------------|
| `--md-color-primary` | #ec4899 | #f9a8d4 | Main brand color |
| `--md-color-on-primary` | #ffffff | #9d174d | Text on primary |
| `--md-color-primary-container` | #fce7f3 | #be185d | Secondary surfaces |
| `--md-color-on-primary-container` | #831843 | #fce7f3 | Text on container |

### Secondary Palette (Gray)

| Token | Light Value | Dark Value | Description |
|-------|-------------|------------|-------------|
| `--md-color-secondary` | #6b7280 | #9ca3af | Secondary actions |
| `--md-color-on-secondary` | #ffffff | #1f2937 | Text on secondary |
| `--md-color-secondary-container` | #f3f4f6 | #374151 | Secondary surfaces |
| `--md-color-on-secondary-container` | #374151 | #e5e7eb | Text on container |

### Tertiary Palette (Purple)

| Token | Light Value | Dark Value | Description |
|-------|-------------|------------|-------------|
| `--md-color-tertiary` | #8b5cf6 | #c4b5fd | Accent color |
| `--md-color-on-tertiary` | #ffffff | #4c1d95 | Text on tertiary |
| `--md-color-tertiary-container` | #ede9fe | #5b21b6 | Accent surfaces |
| `--md-color-on-tertiary-container` | #4c1d95 | #ede9fe | Text on container |

### Error Palette

| Token | Light Value | Dark Value | Description |
|-------|-------------|------------|-------------|
| `--md-color-error` | #ef4444 | #fca5a5 | Error states |
| `--md-color-on-error` | #ffffff | #7f1d1d | Text on error |
| `--md-color-error-container` | #fee2e2 | #991b1b | Error surfaces |
| `--md-color-on-error-container` | #7f1d1d | #fecaca | Text on container |

### Surface & Background

| Token | Light Value | Dark Value | Description |
|-------|-------------|------------|-------------|
| `--md-color-surface` | #fafafa | #111827 | Page background |
| `--md-color-on-surface` | #111827 | #f9fafb | Body text |
| `--md-color-surface-variant` | #f3f4f6 | #1f2937 | Cards, elevated |
| `--md-color-on-surface-variant` | #4b5563 | #d1d5db | Secondary text |
| `--md-color-outline` | #d1d5db | #4b5563 | Borders |
| `--md-color-outline-variant` | #e5e7eb | #374151 | Subtle borders |

## Typography Tokens

### Font Family

| Token | Value | Description |
|-------|-------|-------------|
| `--md-typo-font-family` | 'Google Sans', system-ui, sans-serif | Primary font |
| `--md-typo-font-family-mono` | 'Google Sans Mono', monospace | Code font |

### Display Scale

| Token | Size | Line Height | Weight |
|-------|------|-------------|--------|
| `--md-typo-display-large-size` | 57px | 64px | 400 |
| `--md-typo-display-medium-size` | 45px | 52px | 400 |
| `--md-typo-display-small-size` | 36px | 44px | 400 |

### Headline Scale

| Token | Size | Line Height | Weight |
|-------|------|-------------|--------|
| `--md-typo-headline-large-size` | 32px | 40px | 400 |
| `--md-typo-headline-medium-size` | 28px | 36px | 400 |
| `--md-typo-headline-small-size` | 24px | 32px | 400 |

### Title Scale

| Token | Size | Line Height | Weight |
|-------|------|-------------|--------|
| `--md-typo-title-large-size` | 22px | 28px | 400 |
| `--md-typo-title-medium-size` | 16px | 24px | 500 |
| `--md-typo-title-small-size` | 14px | 20px | 500 |

### Body Scale

| Token | Size | Line Height | Weight |
|-------|------|-------------|--------|
| `--md-typo-body-large-size` | 16px | 24px | 400 |
| `--md-typo-body-medium-size` | 14px | 20px | 400 |
| `--md-typo-body-small-size` | 12px | 16px | 400 |

### Label Scale

| Token | Size | Line Height | Weight |
|-------|------|-------------|--------|
| `--md-typo-label-large-size` | 14px | 20px | 500 |
| `--md-typo-label-medium-size` | 12px | 16px | 500 |
| `--md-typo-label-small-size` | 11px | 16px | 500 |

## Spacing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--md-spacing-none` | 0 | No spacing |
| `--md-spacing-xs` | 4px | Tight elements |
| `--md-spacing-sm` | 8px | Compact spacing |
| `--md-spacing-md` | 16px | Default spacing |
| `--md-spacing-lg` | 24px | Comfortable spacing |
| `--md-spacing-xl` | 32px | Section gaps |
| `--md-spacing-2xl` | 48px | Major sections |
| `--md-spacing-3xl` | 64px | Page sections |

## Shape Tokens (Border Radius)

| Token | Value | Usage |
|-------|-------|-------|
| `--md-shape-none` | 0 | Sharp corners |
| `--md-shape-xs` | 4px | Subtle rounding |
| `--md-shape-sm` | 8px | Small components |
| `--md-shape-md` | 12px | Cards, buttons |
| `--md-shape-lg` | 16px | Dialogs |
| `--md-shape-xl` | 28px | Large containers |
| `--md-shape-full` | 9999px | Pills, avatars |

## Elevation Tokens (Box Shadow)

| Token | Value | Usage |
|-------|-------|-------|
| `--md-elevation-0` | none | Flat |
| `--md-elevation-1` | 0 1px 2px rgba(0,0,0,0.05) | Raised slightly |
| `--md-elevation-2` | 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06) | Cards |
| `--md-elevation-3` | 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06) | Hover states |
| `--md-elevation-4` | 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05) | Dialogs |
| `--md-elevation-5` | 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04) | Navigation |

## State Layer Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--md-state-hover-opacity` | 0.08 | Hover overlay |
| `--md-state-focus-opacity` | 0.12 | Focus overlay |
| `--md-state-pressed-opacity` | 0.12 | Active/pressed |
| `--md-state-dragged-opacity` | 0.16 | Drag state |

## Motion Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--md-motion-duration-short` | 100ms | Micro interactions |
| `--md-motion-duration-medium` | 250ms | Standard transitions |
| `--md-motion-duration-long` | 400ms | Page transitions |
| `--md-motion-easing-standard` | cubic-bezier(0.2, 0, 0, 1) | Standard easing |
| `--md-motion-easing-decelerate` | cubic-bezier(0, 0, 0, 1) | Enter animations |
| `--md-motion-easing-accelerate` | cubic-bezier(0.3, 0, 1, 1) | Exit animations |

## Token Relationships

```
Color System:
  primary → on-primary (text contrast)
  primary → primary-container (lighter variant)
  surface → on-surface (content text)
  error → on-error (error text)

Typography Hierarchy:
  Display > Headline > Title > Body > Label
  Large > Medium > Small (within each category)

Spacing Rhythm:
  xs(4) → sm(8) → md(16) → lg(24) → xl(32) → 2xl(48) → 3xl(64)
  All values are multiples of 4px base unit
```

## Validation Rules

1. **Color Contrast**: All on-* colors must have ≥4.5:1 contrast with their base
2. **Typography Scale**: Sizes must follow M3 progression (no custom intermediate sizes)
3. **Spacing**: All spacing values must be multiples of 4px
4. **Dark Mode**: Every light token must have a corresponding dark variant
