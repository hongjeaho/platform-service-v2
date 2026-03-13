# Storybook Design System - Summary

## Overview

Comprehensive Storybook design specifications have been added to `docs/design-spec.md` as **Section 8**. This addition provides enterprise-grade component development and documentation infrastructure.

---

## What Was Added

### 8.1 Purpose and Benefits
- **Component Isolation**: Develop components in isolation
- **Visual Documentation**: Living documentation of all component variations
- **Interactive Development**: Fast iteration with hot reload
- **Design System**: Build and maintain a consistent design system
- **Testing**: Visual regression testing and component testing
- **Collaboration**: Bridge between designers, developers, and stakeholders

### 8.2 Technology Stack
**Core Packages (all added to devDependencies):**
- `storybook`: ^8.5.0 - Storybook core
- `@storybook/react-vite`: ^8.5.0 - React + Vite builder
- `@storybook/addon-essentials`: ^8.5.0 - Essential addons
- `@storybook/addon-interactions`: ^8.5.0 - Interaction testing
- `@storybook/addon-themes`: ^8.5.0 - Theme switching
- `@storybook/addon-a11y`: ^8.5.0 - Accessibility testing
- `@storybook/addon-links`: ^8.5.0 - Story linking
- `@storybook/blocks`: ^8.5.0 - MDX documentation blocks
- `storybook-dark-mode`: ^4.0.0 - Dark mode toggle

### 8.3 Project Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx       # NEW: Storybook stories
│   │   │   └── index.ts
│   │   └── ...

.storybook/
├── main.ts                        # Storybook configuration
├── preview.ts                     # Global decorators/parameters
└── manager.ts                     # Manager configuration

storybook-static/                  # Built Storybook output (gitignored)
```

### 8.4 Storybook Configuration
**Complete configuration files provided:**
- `main.ts` - Core configuration with TypeScript support
- `preview.ts` - Global decorators, themes, and parameters
- `manager.ts` - UI configuration

**Key Features:**
- Auto-generated documentation with `autodocs: "tag"`
- TypeScript integration with `react-docgen-typescript`
- Theme switching (light/dark mode)
- Centered layout with padding decorator
- Controls for interactive prop editing
- Actions for event handler logging

### 8.5 Story Writing Patterns
**Complete example for Button component:**
```typescript
import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./Button"

const meta: Meta<typeof Button> = {
  title: "Common/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select" },
    size: { control: "radio" },
    onClick: { action: "clicked" },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
}

// More stories: Secondary, Danger, Small, Medium, Large,
// Loading, Disabled, Interactive, ButtonGroup
```

### 8.6 Story Organization
**Hierarchical structure:**
```
Common/
├── Button/
│   ├── Primary
│   ├── Secondary
│   ├── Danger
│   └── All Variants
├── Input/
│   ├── Default
│   ├── With Error
│   └── Disabled

Layout/
├── Layout/
│   ├── Default
│   └── With Sidebar

Features/
├── User/
│   ├── UserCard/
│   │   ├── Default
│   │   ├── Expanded
│   │   └── With Actions
│   └── UserList/
│       ├── Loading
│       ├── With Data
│       └── Empty State
```

**Naming Conventions:**
- PascalCase for exports: `Primary`, `Secondary`, `Loading`
- Descriptive names for complex stories
- State prefixes: `Loading`, `Error`, `Success`, `Disabled`

### 8.7 Advanced Story Patterns
**Examples provided for:**
- Stories with Hooks and Context (QueryClient integration)
- Stories with Mock Data
- Interaction Testing with `play` function
- Using `within` from `@storybook/test`
- Step-by-step test visualization

### 8.8 Documentation Stories
**MDX documentation pattern:**
```markdown
import { Meta, Story, Canvas, Controls } from "@storybook/blocks"

<Meta title="Docs/Button Documentation" of={Button} />

# Button Component

## Variants
<Canvas>
  <Story of={Button} name="Primary" />
</Canvas>

## Props
<Controls of={Button} />
```

### 8.9 Addons Configuration
**Essential addons documented:**
1. **Actions** - Event handler logging
2. **Controls** - Interactive props editing
3. **Docs** - Auto-generated documentation
4. **Interactions** - Visual test flows
5. **Themes** - Dark/light mode switching
6. **Accessibility** - WCAG compliance checks

### 8.10 Testing Integration
**Visual Regression Testing:**
```typescript
import { composeStories } from "@storybook/react"
import * as stories from "./Button.stories"

const { Primary } = composeStories(stories)

test("renders primary button", async () => {
  const { container } = render(<Primary />)
  await expect(container).toMatchSnapshot()
})
```

**Component Testing:**
- Integration with Testing Library
- Interaction testing with `play` functions
- Accessibility assertions

### 8.11 Theme Integration
**Tailwind CSS v4 setup:**
- Global styles import in preview
- Dark mode with `data-theme` attribute
- Theme toggle in Storybook toolbar
- Custom theme support

### 8.12 Best Practices
**DO:**
- Write stories for all component variations
- Use autodocs tag
- Include interaction tests
- Add accessibility tests
- Use controls for exploration
- Document with MDX
- Keep stories focused

**DON'T:**
- Excessive mock data
- Mix business logic
- Duplicate stories
- Ignore accessibility warnings
- Overcomplicate decorators

### 8.13 Package Scripts
```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test-storybook": "test-storybook"
  }
}
```

### 8.14 CI/CD Integration
**GitHub Actions workflow:**
- Build Storybook
- Upload as artifact
- Deploy to static hosting

**Chromatic integration:**
- Visual regression testing
- Automated screenshot comparison
- UI review workflows

### 8.15 Performance Optimization
- Lazy load heavy dependencies
- Code splitting
- Build caching
- Parallel dev servers
- HMR utilization
- Asset optimization

---

## Implementation Steps

### 1. Install Storybook Packages
```bash
yarn add -D storybook @storybook/react-vite @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-themes @storybook/addon-a11y @storybook/addon-links @storybook/blocks storybook-dark-mode
```

### 2. Initialize Storybook
```bash
yarn storybook@latest init
```

### 3. Create Configuration Files
- `.storybook/main.ts`
- `.storybook/preview.ts`
- `.storybook/manager.ts`

### 4. Create Story Files
For each component, create `ComponentName.stories.tsx` following the patterns in section 8.5.

### 5. Run Storybook
```bash
yarn storybook
# Opens at http://localhost:6006
```

### 6. Build for Production
```bash
yarn build-storybook
# Outputs to storybook-static/
```

---

## Key Benefits for This Project

### 1. Component Library Development
- Develop Button, Input, Modal, etc. in isolation
- Visual testing of all component variations
- Interactive prop exploration

### 2. Design System Documentation
- Auto-generated docs from TypeScript types
- Live examples of all components
- Design tokens and guidelines

### 3. Testing Integration
- Visual regression tests
- Accessibility audits
- Interaction testing
- Integration with existing Vitest tests

### 4. Team Collaboration
- Designers can review components
- Stakeholders can see UI changes
- Living documentation
- Design handoff tool

### 5. Quality Assurance
- Catch visual regressions
- Accessibility compliance (WCAG)
- Consistent UI across features
- Component behavior verification

---

## Integration with Existing Architecture

### Feature-Based Structure
```
features/
├── user/
│   ├── components/
│   │   ├── UserCard.tsx
│   │   ├── UserCard.stories.tsx    # NEW
│   │   └── UserCard.test.tsx
│   └── ...
```

### Component Development Workflow
1. Create component: `Button.tsx`
2. Write tests: `Button.test.tsx`
3. Write stories: `Button.stories.tsx`
4. View in Storybook: `http://localhost:6006`
5. Document with autodocs
6. Test accessibility
7. Commit and push

### Testing Strategy Integration
```
Unit Tests (Vitest)     → Component behavior
Storybook Stories       → Visual variations
Storybook Tests         → User interactions
Visual Regression       → UI consistency
Accessibility Tests     → WCAG compliance
```

---

## Next Steps

1. **Install Storybook** using the provided command
2. **Set up configuration** files (.storybook/)
3. **Create stories** for existing components (Button, Layout)
4. **Configure themes** for dark/light mode
5. **Add MDX documentation** for complex components
6. **Set up CI/CD** for automated builds
7. **Configure Chromatic** for visual testing (optional)

---

## Resources

- **Official Docs**: https://storybook.js.org/docs
- **React Tutorial**: https://storybook.js.org/docs/react/get-started/introduction
- **Vite Integration**: https://storybook.js.org/docs/builders/vite
- **Testing Library**: https://storybook.js.org/docs/writing-tests/testing-library
- **Accessibility**: https://storybook.js.org/docs/writing-tests/accessibility-testing
- **Addons**: https://storybook.js.org/docs/addons/addon-essentials

---

**Added to Design Spec:** 2025-03-13
**Section:** 8 (Storybook Design System)
**Pages:** 15+ comprehensive subsections
**Status:** Ready for Implementation
