# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React 19 government platform application using:
- **React 19** with React Compiler enabled
- **TypeScript** with strict path aliases
- **TailwindCSS v4** with OKLCH color space
- **Vite** for build tooling
- **Zustand** for state management
- **TanStack Query** for server state
- **Storybook** for component documentation
- **Vitest** for testing

## Common Commands

```bash
# Development
pnpm dev              # Start dev server (port 3000)
pnpm build            # Build for production
pnpm orval            # Generate API clients from OpenAPI spec

# Code Quality
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier

# Testing
pnpm test             # Run tests in watch mode
pnpm test:run         # Run tests once
pnpm test:ui          # Run tests with UI

# Storybook
pnpm storybook        # Start Storybook (port 6006)
pnpm storybook:build  # Build Storybook static
```

**Always run `pnpm format` and `pnpm lint:fix` before committing.**

## Architecture

### Directory Structure

```
src/
├── api/                    # API layer
│   ├── client.ts          # Axios instance with interceptors
│   ├── services/          # API service functions
│   └── generated/         # Orval-generated API clients
├── app/                    # Application setup
│   ├── providers.tsx      # React Query provider
│   ├── queryClient.ts     # Query client configuration
│   └── router.tsx         # React Router setup
├── components/
│   ├── common/            # Reusable design system components
│   └── layout/            # Layout components
├── features/               # Feature-specific components by domain
├── store/                  # Zustand stores
├── styles/                 # Design system tokens (see below)
└── test/                   # Test setup
```

### Path Aliases

```typescript
@/*              → src/*
@api/*           → src/api/*
@components/*    → src/components/*
@features/*      → src/features/*
@styles/*        → src/styles/*
```

## Design System

**Always reference `src/styles/README.md` before styling.**

### Token Usage

```tsx
// ✅ GOOD - Use design tokens from @/styles
import { buttonVariants, semanticColorClasses, padding } from '@/styles'

<button className={buttonVariants.primary} />
<span className={semanticColorClasses.success} />
<div className={padding.buttonMd} />

// ❌ BAD - Hardcoded values
<button style={{ backgroundColor: '#3B82F6', padding: '8px 16px' }} />
```

### Available from @/styles

```typescript
import {
  // Colors
  rawColors, darkModeColors, semanticColorClasses, buttonVariants,
  statusColors, colorPalettes, themeColors, shadows,

  // Typography
  textCombinations, fontWeights, lineHeights, letterSpacings,
  transitions, durations, easings,

  // Icons
  icons, iconSizes, iconVariants,

  // Spacing
  spacingScale, padding, margin, gap, layouts,
  borderRadius, breakpoints, zIndex,

  // Types
  type ButtonVariant, type StatusType, type ThemeMode, ...
} from '@/styles'
```

### Key Principles

1. **No hardcoded colors** - Use `@/styles` exports
2. **No hardcoded spacing** - Use spacing scale
3. **No hardcoded fonts** - Use typography tokens
4. **CSS Modules only for complex component-specific styles**
5. **Tailwind for layout and utilities**

## Coding Rules (Cursor Rules)

**This project enforces strict coding rules via Cursor. Before making changes, read:**

| Rule File | Purpose | Applied To |
|-----------|---------|------------|
| `.cursor/rules/common-component-rule.mdc` | 공통 컴포넌트 작성 규칙 | `src/components/common/**/*` |
| `.cursor/rules/feature-component-rule.mdc` | 피처 컴포넌트 작성 규칙 | `src/features/**/*` |
| `.cursor/rules/git-commit-rule.mdc` | Git 커밋·브랜치 규칙 | Always |

### Key Points from Rules

**Common Components (`src/components/common`):**
- Strict file structure with `.type.ts`, `.module.css`, `.stories.tsx`, `.test.tsx`
- CSS Modules required, no `className` prop
- Storybook with CSF3 + `useArgs`
- React 19 patterns (ref as prop, not `forwardRef`)

**Feature Components (`src/features`):**
- **Reuse common components first** - don't duplicate logic
- Structure based on complexity (single file vs folder)
- Tailwind preferred, CSS Modules optional
- Tests only for business logic

**Git Workflow:**
- Korean commit messages: `type(scope): 한글 요약 (50자 이내)`
- Branch format: `type/description` or `type/ISSUE-NUMBER-description`

## API Layer

- **Client**: `src/api/client.ts` - Axios with interceptors
- **Auth**: Auto token from `localStorage`
- **401 Handling**: Redirects to `/login`
- **Dev Proxy**: `/api` → `localhost:8080`
- **Generation**: `pnpm orval` for typed clients from OpenAPI

## React Hook Form Integration

Form components should support both patterns:

```tsx
// RHF pattern
<Component control={control} name="field" rules={{ required: true }} />

// Controlled pattern
<Component value={value} onChange={setValue} onBlur={handleBlur} />
```

For nested forms, use `useFormContext()`.

## Build & Test Configuration

### Vite
- **React Compiler** enabled via Babel plugin
- **Source maps**: dev only
- **Minification**: production only
- **Port**: 3000 (dev), 6006 (Storybook)

### Vitest
- **Environment**: jsdom
- **Setup**: `src/test/setup.ts`
- **Coverage threshold**: 80%
- **Globals**: Enabled (no import needed for `describe`, `it`, `expect`)

### ESLint
- TypeScript strict mode
- React + React Hooks rules
- Import sorting (`simple-import-sort`)
- Prettier integration
- TanStack Query plugin

### Storybook
- **Framework**: React Vite
- **Docs**: Auto-generated with `autodocs` tag
- **Addons**: Essentials, Interactions, Themes, A11y
- **TypeScript**: `react-docgen-typescript` for props
