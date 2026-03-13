# Storybook Implementation Guide

## Overview

Storybook has been successfully integrated into the React Workspace project for component development, visual testing, and documentation.

---

## Installation Summary

### Installed Packages

All Storybook packages have been added to `devDependencies`:
- `storybook` ^10.2.17
- `@storybook/react-vite` ^10.2.17
- `@storybook/addon-essentials` ^8.6.14
- `@storybook/addon-interactions` ^8.6.14
- `@storybook/addon-themes` ^10.2.17
- `@storybook/addon-a11y` ^10.2.17
- `@storybook/addon-links` ^10.2.17
- `@storybook/blocks` ^8.6.14
- `storybook-dark-mode` ^5.0.0

---

## Configuration Files

### `.storybook/main.ts`

Core Storybook configuration with:
- Story discovery from `src/**/*.stories.@(js|jsx|ts|tsx)` and `src/**/*.mdx`
- Addons: links, essentials, interactions, themes, a11y, dark mode
- React + Vite framework
- Auto-generated documentation (`autodocs: "tag"`)
- TypeScript integration with react-docgen-typescript

### `.storybook/preview.ts`

Global configuration with:
- Actions for event handlers (`^on[A-Z].*`)
- Controls for interactive props editing
- Background colors (light/dark)
- Theme switching toolbar (light/dark mode)
- Center layout decorator with padding
- Global styles import (`globals.css`)

### `.storybook/manager.ts`

Storybook manager UI configuration.

---

## Available Stories

### 1. Common/Button (11 Stories)

**Stories:**
- `Primary` - Primary button variant
- `Secondary` - Secondary button variant
- `Danger` - Danger button variant
- `Small` - Small size button
- `Medium` - Medium size button
- `Large` - Large size button
- `Loading` - Button with loading spinner
- `Disabled` - Disabled button
- `Interactive` - Interactive button with expanded controls
- `ButtonGroup` - Group of buttons
- `AllVariants` - Complete button showcase

**File:** `src/components/common/Button/Button.stories.tsx`

### 2. Layout/Layout (1 Story)

**Stories:**
- `Default` - Full layout component

**File:** `src/components/layout/Layout.stories.tsx`

### 3. Features/User/UserCard (7 Stories)

**Stories:**
- `Default` - Default user card
- `Expanded` - User card with expanded details
- `WithoutToggle` - User card without toggle
- `Interactive` - Interactive user card
- `MultipleUsers` - Grid of multiple user cards
- `LoadingState` - Skeleton loading cards
- `ErrorState` - Error state display

**File:** `src/features/user/components/UserCard.stories.tsx`

---

## Running Storybook

### Development Mode

```bash
yarn storybook
```

Opens Storybook at `http://localhost:6006`

### Production Build

```bash
yarn build-storybook
```

Builds Storybook to `storybook-static/` directory

---

## Features

### 1. Auto-Generated Documentation

All components with `tags: ["autodocs"]` automatically generate documentation including:
- Props table
- Controls panel
- Description from JSDoc comments
- Stories showcase

### 2. Interactive Controls

Change component props dynamically in the Storybook UI:
- Button variant (select)
- Button size (radio)
- Loading state (toggle)
- Disabled state (toggle)
- User object (object)

### 3. Theme Switching

Toggle between light and dark themes using the toolbar button.

### 4. Accessibility Testing

Each story is automatically tested for accessibility issues using axe-core.

### 5. Actions Logging

Event handlers are logged in the Actions panel:
- Button clicks
- Toggle interactions
- Custom events

---

## Component Development Workflow

### 1. Create Component

```typescript
// src/components/common/MyComponent.tsx
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  return <div>{/* component implementation */}</div>
}
```

### 2. Write Stories

```typescript
// src/components/common/MyComponent.stories.tsx
import type { Meta, StoryObj } from "@storybook/react"
import { MyComponent } from "./MyComponent"

const meta: Meta<typeof MyComponent> = {
  title: "Common/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
  argTypes: {
    prop1: { control: "text" },
    prop2: { control: "number" },
  },
}

export default meta
type Story = StoryObj<typeof MyComponent>

export const Default: Story = {
  args: {
    prop1: "Hello",
    prop2: 42,
  },
}
```

### 3. View in Storybook

```bash
yarn storybook
```

Navigate to `http://localhost:6006` and view your component.

### 4. Document with JSDoc

```typescript
/**
 * MyComponent does something amazing
 *
 * @param prop1 - The first prop
 * @param prop2 - The second prop
 */
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // ...
}
```

### 5. Test Accessibility

Storybook automatically runs accessibility tests. View the "Accessibility" tab for results.

---

## Best Practices

### DO

- Write stories for all component variations
- Use descriptive story names (PascalCase)
- Add JSDoc comments for documentation
- Use `tags: ["autodocs"]` for auto-generated docs
- Test with different prop combinations
- Include loading and error states
- Add accessibility descriptions
- Group related stories logically

### DON'T

- Overcomplicate stories
- Mix business logic with presentation
- Duplicate stories (use compositions)
- Ignore accessibility warnings
- Skip documentation for complex props

---

## Story Organization

### Current Hierarchy

```
Common/
├── Button/
│   ├── Primary
│   ├── Secondary
│   ├── Danger
│   └── ...

Layout/
├── Layout/
│   └── Default

Features/
├── User/
│   ├── UserCard/
│   │   ├── Default
│   │   ├── Expanded
│   │   └── ...
```

### Naming Conventions

- Use PascalCase for story exports: `Primary`, `Secondary`, `Loading`
- Prefix with state: `Loading`, `Error`, `Success`, `Disabled`
- Use descriptive names for complex stories: `MultipleUsers`, `LoadingState`

---

## Addons Guide

### Actions

Logs function calls in the Actions panel. Automatically detects `on*` props.

### Controls

Interactive props editing. Change prop values in real-time.

### Docs

Auto-generated documentation from JSDoc comments and TypeScript types.

### Interactions

Visualize test flows and user interactions.

### Themes

Switch between light and dark themes.

### Accessibility

WCAG compliance checks with axe-core.

### Links

Link between stories for navigation.

---

## Troubleshooting

### Storybook won't start

1. Clear Storybook cache: `rm -rf node_modules/.cache/storybook`
2. Reinstall dependencies: `yarn install`
3. Check for port conflicts: `lsof -i :6006`

### Styles not loading

1. Ensure `globals.css` is imported in `.storybook/preview.ts`
2. Check Tailwind CSS configuration
3. Verify CSS import order

### TypeScript errors

1. Check `tsconfig.json` configuration
2. Ensure type definitions are installed
3. Verify component exports match story imports

---

## Next Steps

### Recommended Additions

1. **More Components**
   - Input component with stories
   - Modal component
   - Card component
   - Badge component

2. **MDX Documentation**
   - Create component usage guides
   - Add design system documentation
   - Write migration guides

3. **Visual Testing**
   - Set up Chromatic for visual regression
   - Add screenshot testing to CI/CD
   - Configure branch previews

4. **Performance**
   - Optimize story loading
   - Lazy load heavy dependencies
   - Monitor bundle size

5. **Integration**
   - Add to CI/CD pipeline
   - Deploy to static hosting (Netlify, Vercel)
   - Configure automated builds

---

## Resources

- **Official Docs**: https://storybook.js.org/docs
- **React Tutorial**: https://storybook.js.org/docs/react/get-started/introduction
- **Vite Integration**: https://storybook.js.org/docs/builders/vite
- **Testing Library**: https://storybook.js.org/docs/writing-tests/testing-library
- **Accessibility**: https://storybook.js.org/docs/writing-tests/accessibility-testing
- **Addons**: https://storybook.js.org/docs/addons/addon-essentials

---

## Support

For issues or questions:
1. Check the official Storybook documentation
2. Search existing GitHub issues
3. Ask in the Storybook Discord community
4. Review the design spec: `docs/design-spec.md` Section 8

---

**Implementation Date:** 2025-03-13
**Status:** ✅ Complete and Ready to Use
**Version:** Storybook 10.2.17
