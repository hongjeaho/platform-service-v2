# React Workspace - Architecture Design Specification

## Project Overview

**Project Name:** React Workspace
**Type:** Enterprise React Application
**Architecture:** Feature-based, Layered Architecture
**Build Tool:** Vite
**Target:** Enterprise-grade scalable web application

---

## 1. Technology Stack

### Core Framework
- **React 19** - UI library with React Compiler support
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server

### Routing
- **React Router v7** (Data Mode)
  - Single package import: `react-router`
  - `createBrowserRouter` + `RouterProvider` pattern
  - Lazy loading with `route.lazy` pattern

### State Management
- **TanStack Query (React Query)** - Server state management
  - Automatic caching, refetching, background updates
  - DevTools integration for debugging
- **Zustand** - Client state management
  - Lightweight, simple API
  - No Provider boilerplate

### Data Fetching
- **Axios** - HTTP client with interceptors
- **Orval** - OpenAPI/Swagger client generator
  - Type-safe API clients from OpenAPI specs
  - React Query integration

### Styling
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
  - Utility-first CSS
  - Zero runtime in production

### Testing
- **Vitest** - Unit testing framework
- **Testing Library** - Component testing
  - @testing-library/react
  - @testing-library/jest-dom
  - @testing-library/user-event
- **jsdom** - DOM simulation

### Build Optimization
- **React Compiler** (babel-plugin-react-compiler)
  - Automatic memoization
  - No manual useMemo/useCallback needed

---

## 2. Architecture Principles

### 2.1 Feature-Based Structure
```
src/
├── features/              # Feature modules (business logic)
│   ├── home/
│   │   ├── components/    # Feature-specific components
│   │   ├── hooks/         # Feature-specific hooks
│   │   ├── pages/         # Route pages
│   │   └── types/         # Feature-specific types
│   └── user/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       └── types/
```

**Benefits:**
- High cohesion - related code grouped together
- Easy to delete/move features
- Clear boundaries between features

### 2.2 Shared Layers
```
src/
├── api/                   # API layer (data access)
│   ├── client.ts          # Axios instance config
│   ├── services/          # Service functions
│   └── generated/         # Orval auto-generated clients
├── app/                   # Application-level setup
│   ├── router.tsx         # Route configuration
│   ├── providers.tsx      # Context providers
│   └── queryClient.ts     # TanStack Query config
├── components/            # Shared UI components
│   ├── common/            # Generic components (Button, Input, etc.)
│   └── layout/            # Layout components
├── store/                 # Global state (Zustand)
├── styles/                # Global styles
└── test/                  # Test configuration
```

### 2.3 Data Flow Pattern

```
Component → Custom Hook → Service → API Client → Backend API
     ↓           ↓           ↓           ↓
  UI         useQuery    userService   axios
  Render     useMutation              (with interceptors)
```

**Separation of Concerns:**
- **Components:** UI rendering only
- **Custom Hooks:** Data fetching logic (TanStack Query)
- **Services:** API endpoint definitions
- **API Client:** HTTP configuration (auth, error handling)

---

## 3. Routing Architecture

### 3.1 React Router v7 Data Mode

**Configuration Pattern:**
```typescript
export const router = createBrowserRouter([
  {
    // Layout Route (no path = applies to all children)
    Component: Layout,
    children: [
      {
        path: "/",
        index: true,
        HydrateFallback: PageLoader,
        lazy: {
          Component: async () =>
            (await import("../features/home/pages/HomePage")).Component,
        },
      },
    ],
  },
])
```

**Key Decisions:**
1. **Data Mode:** Uses `Component` prop instead of `element`
2. **Lazy Loading:** Route-based code splitting via `route.lazy`
3. **Named Exports:** Pages export `Component` function (not default)
4. **HydrateFallback:** SSR-safe loading states

**Route Naming Convention:**
- Pages: `src/features/{feature}/pages/{PageName}.tsx`
- Export: `export function Component() { ... }`
- Import: `lazy: { Component: async () => (await import("...")).Component }`

### 3.2 Route Structure

| Path | Component | Feature | Purpose |
|------|-----------|---------|---------|
| `/` | HomePage | home | Landing page, tech stack showcase |
| `/users` | UserListPage | user | User list with filtering, search |
| `/login` | LoginPage | auth (future) | Authentication |
| `*` | NotFoundPage | common | 404 page |

### 3.3 Navigation Pattern
```typescript
// Use NavLink for active states
import { NavLink } from "react-router"

<NavLink to="/users" className={({ isActive }) =>
  isActive ? "text-indigo-600" : "text-gray-600"
}>
  Users
</NavLink>
```

---

## 4. State Management Strategy

### 4.1 Server State (TanStack Query)

**Responsibilities:**
- API response caching
- Background refetching
- Loading/error states
- Optimistic updates

**Configuration:**
```typescript
// Query Client defaults
staleTime: 5 * 60 * 1000  // 5 minutes
retry: 1                   // One retry on failure
```

**Query Key Organization:**
```typescript
// Feature-based key hierarchy
const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}
```

**Hook Pattern:**
```typescript
// src/features/user/hooks/useUsers.ts
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: userService.getAll,
  })
}
```

### 4.2 Client State (Zustand)

**Use Cases:**
- Authentication state
- UI preferences (theme, sidebar state)
- Form state (before submission)

**Store Pattern:**
```typescript
// src/store/authStore.ts
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
```

### 4.3 State Decision Tree

```
Is it server data?
  YES → TanStack Query
  NO → Is it global UI state?
    YES → Zustand
    NO → React useState/useReducer
```

---

## 5. API Layer Design

### 5.1 Axios Client Configuration

**Base Configuration:**
```typescript
// src/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://jsonplaceholder.typicode.com",
  timeout: 10000,
})
```

**Request Interceptor:**
```typescript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**Response Interceptor:**
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
```

### 5.2 Service Layer Pattern

**Service Function Structure:**
```typescript
// src/api/services/userService.ts
export const userService = {
  getAll: (): Promise<User[]> =>
    apiClient.get("/users").then((res) => res.data),

  getById: (id: number): Promise<User> =>
    apiClient.get(`/users/${id}`).then((res) => res.data),
}
```

**Benefits:**
- Single source of truth for endpoints
- Easy to mock in tests
- Type-safe return values

### 5.3 Orval Integration

**Configuration (orval.config.ts):**
```typescript
export default defineConfig({
  api: {
    input: "./openapi/api.yaml",
    output: {
      target: "./src/api/generated",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/api/client.ts",
          name: "apiClient",
        },
      },
    },
  },
})
```

**Generated Output:**
- Type-safe API clients from OpenAPI spec
- React Query hooks auto-generated
- Request/response types

**Usage:**
```typescript
import { useUsers } from "./api/generated"

function UserList() {
  const { data } = useUsers()
  // ...
}
```

---

## 6. Component Architecture

### 6.1 Component Types

**Shared Components (`src/components/common/`)**
- Generic, reusable UI elements
- No business logic
- Examples: Button, Input, Modal, Card

**Feature Components (`src/features/{feature}/components/`)**
- Feature-specific UI
- Can use feature-specific hooks
- Examples: UserCard, SearchBar, UserList

**Layout Components (`src/components/layout/`)**
- App shell components
- Navigation, sidebar, footer
- Examples: Layout, Header, Sidebar

### 6.2 Component Design Pattern

**Button Component Example:**
```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={/* Tailwind classes based on props */}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}
```

**Component Folder Structure:**
```
Button/
├── Button.tsx        # Component implementation
├── Button.test.tsx   # Tests
├── index.ts          # Export
└── types.ts          # Props interface (if complex)
```

### 6.3 Component Best Practices

**DO:**
- Use TypeScript for all props
- Compose with children prop
- Handle loading/error states
- Use Tailwind for styling
- Export named functions (for React Router lazy)

**DON'T:**
- Mix business logic with UI
- Use inline styles (use Tailwind)
- Export default (use named exports)
- Over-abstract (pre duplication over wrong abstraction)

---

## 7. Testing Strategy

### 7.1 Test Organization

```
src/
├── components/
│   └── common/
│       └── Button/
│           ├── Button.tsx
│           └── Button.test.tsx       # Component tests
├── features/
│   └── user/
│       ├── hooks/
│       │   ├── useUsers.ts
│       │   └── useUsers.test.tsx    # Hook tests
└── store/
    ├── authStore.ts
    └── authStore.test.tsx           # Store tests
```

### 7.2 Vitest Configuration

**Setup (vitest.config.ts):**
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
})
```

**Test Setup (src/test/setup.ts):**
```typescript
import "@testing-library/jest-dom"
```

### 7.3 Testing Patterns

**Component Testing (Button.test.tsx):**
```typescript
describe("Button", () => {
  it("renders text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText("Click"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("shows spinner when loading", () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
    // Check for spinner element
  })
})
```

**Hook Testing (useUsers.test.tsx):**
```typescript
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient } from "@tanstack/react-query"

describe("useUsers", () => {
  it("fetches users", async () => {
    vi.mocked(userService.getAll).mockResolvedValue(mockUsers)

    const { result } = renderHook(() => useUsers(), {
      wrapper: createQueryClientWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockUsers)
  })
})
```

**Store Testing (authStore.test.ts):**
```typescript
describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false })
  })

  it("initial state", () => {
    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it("login sets user", () => {
    const mockUser = { id: 1, name: "Test" }
    useAuthStore.getState().login(mockUser)

    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toEqual(mockUser)
    expect(isAuthenticated).toBe(true)
  })
})
```

### 7.4 Test Coverage Goals

| Type | Target |
|------|--------|
| Components | 80%+ |
| Hooks | 90%+ |
| Services | 80%+ |
| Stores | 90%+ |

---

## 8. Storybook Design System

### 8.1 Purpose and Benefits

**Why Storybook:**
- **Component Isolation**: Develop components in isolation from app logic and context
- **Visual Documentation**: Living documentation of all component variations
- **Interactive Development**: Fast iteration with hot reload
- **Design System**: Build and maintain a consistent design system
- **Testing**: Visual regression testing and component testing
- **Collaboration**: Bridge between designers, developers, and stakeholders

**Key Benefits:**
- Faster component development cycle
- Reusable component library
- Visual regression testing
- Accessibility testing integration
- Design tokens documentation
- Cross-team collaboration

### 8.2 Technology Stack

**Core Packages:**
- **storybook**: ^8.5.0 - Storybook core
- **@storybook/react-vite**: ^8.5.0 - React + Vite builder
- **@storybook/addon-essentials**: ^8.5.0 - Essential addons (actions, docs, controls)
- **@storybook/addon-interactions**: ^8.5.0 - Interaction testing
- **@storybook/addon-themes**: ^8.5.0 - Theme switching
- **@storybook/addon-a11y**: ^8.5.0 - Accessibility testing
- **@storybook/blocks**: ^8.5.0 - MDX documentation blocks
- **storybook-dark-mode**: ^4.0.0 - Dark mode toggle

### 8.3 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx       # Storybook stories
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── Input.test.tsx
│   │   │   ├── Input.stories.tsx
│   │   │   └── index.ts
│   │   └── ...
│   └── layout/
│       ├── Layout/
│       │   ├── Layout.tsx
│       │   ├── Layout.test.tsx
│       │   ├── Layout.stories.tsx
│       │   └── index.ts
│       └── ...

.storybook/
├── main.ts                        # Storybook configuration
├── preview.ts                     # Global decorators/parameters
└── manager.ts                     # Manager configuration

storybook-static/                  # Built Storybook output (gitignored)
```

### 8.4 Storybook Configuration

**main.ts - Core Configuration:**
```typescript
import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => {
        return prop.parent ? !/node_modules/.test(prop.parent.fileName) : true
      },
    },
  },
}

export default config
```

**preview.ts - Global Configuration:**
```typescript
import type { Preview } from "@storybook/react"
import { withThemeByDataAttribute } from "@storybook/addon-themes"
import "../src/styles/globals.css"

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0f172a" },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
}

export default preview
```

**manager.ts - UI Configuration:**
```typescript
import type { ManagerFeatures } from "@storybook/types"

const features: ManagerFeatures = {
  // Enable Storybook features
}

export default features
```

### 8.5 Story Writing Patterns

**Component Story Structure (Button.stories.tsx):**
```typescript
import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./Button"

// Meta configuration
const meta: Meta<typeof Button> = {
  title: "Common/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger"],
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    onClick: { action: "clicked" },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// Basic stories
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
}

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Danger Button",
  },
}

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
}

export const Medium: Story = {
  args: {
    size: "md",
    children: "Medium Button",
  },
}

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large Button",
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    children: "Loading...",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled Button",
  },
}

// Interactive story with controls
export const Interactive: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Interactive Button",
  },
  parameters: {
    controls: { expanded: true },
  },
}

// Composition example
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
}
```

### 8.6 Story Organization

**Story Hierarchy:**
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
└── ...

Layout/
├── Layout/
│   ├── Default
│   └── With Sidebar
└── ...

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
└── ...
```

**Story Naming Conventions:**
- Use PascalCase for story exports: `Primary`, `Secondary`, `Loading`
- Group related stories in folders
- Use descriptive names for complex stories
- Prefix with state: `Loading`, `Error`, `Success`, `Disabled`

### 8.7 Advanced Story Patterns

**Stories with Hooks and Context:**
```typescript
import type { Meta, StoryObj } from "@storybook/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { UserCard } from "./UserCard"

const meta: Meta<typeof UserCard> = {
  title: "Features/User/UserCard",
  component: UserCard,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      })

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof UserCard>

export const Default: Story = {
  args: {
    user: {
      id: 1,
      name: "Leanne Graham",
      email: "Sincere@april.biz",
      // ... other fields
    },
  },
}
```

**Stories with Mock Data:**
```typescript
import { mockUsers } from "./mockData"

export const WithMultipleUsers: Story = {
  render: () => (
    <div className="grid gap-4">
      {mockUsers.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  ),
}
```

**Interaction Testing:**
```typescript
import { within, expect } from "@storybook/test"
import { Page } from "./Page"

export const Loaded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole("button", { name: /submit/i })

    await expect(button).toBeInTheDocument()
    await userEvent.click(button)
    await expect(canvas.getByText("Success!")).toBeInTheDocument()
  },
}
```

### 8.8 Documentation Stories

**MDX Documentation:**
```markdown
import { Meta, Story, Canvas, Controls } from "@storybook/blocks"
import { Button } from "./Button"

<Meta title="Docs/Button Documentation" of={Button} />

# Button Component

The Button component is a reusable UI element that supports multiple variants and sizes.

## Variants

<Canvas>
  <Story of={Button} name="Primary" />
  <Story of={Button} name="Secondary" />
  <Story of={Button} name="Danger" />
</Canvas>

## Sizes

<Canvas>
  <Story of={Button} name="Small" />
  <Story of={Button} name="Medium" />
  <Story of={Button} name="Large" />
</Canvas>

## Props

<Controls of={Button} />

## Usage

```tsx
import { Button } from "@/components/common/Button"

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```
```

### 8.9 Addons Configuration

**Essential Addons:**

1. **Actions (@storybook/addon-actions)**
   - Logs event handlers
   - Auto-detects `on*` props
   - Shows in Actions panel

2. **Controls (@storybook/addon-controls)**
   - Interactive props editing
   - Dynamic prop updates
   - Support for complex types

3. **Docs (@storybook/addon-docs)**
   - Auto-generated documentation
   - MDX support
   - JSDoc comments

4. **Interactions (@storybook/addon-interactions)**
   - Visualize test flows
   - Step-by-step debugging
   - Integration with Testing Library

5. **Themes (@storybook/addon-themes)**
   - Dark/light mode
   - Custom themes
   - Theme switching UI

6. **Accessibility (@storybook/addon-a11y)**
   - Axe-core integration
   - WCAG compliance checks
   - Visual highlighting of issues

### 8.10 Testing Integration

**Visual Regression Testing:**
```typescript
// .storybook/test.ts
import { composeStories } from "@storybook/react"
import * as stories from "./Button.stories"

const { Primary, Secondary, Danger } = composeStories(stories)

test("renders primary button", async () => {
  const { container } = render(<Primary />)
  await expect(container).toMatchSnapshot()
})
```

**Component Testing with Storybook:**
```typescript
import { test } from "@storybook/test"
import { Page } from "./Page"

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await test("loads and displays content", async () => {
      const canvas = within(canvasElement)
      const heading = canvas.getByRole("heading", { level: 1 })
      await expect(heading).toBeInTheDocument()
      await expect(heading).toHaveTextContent("Welcome")
    })
  },
}
```

### 8.11 Theme Integration

**Tailwind CSS v4 with Storybook:**
```typescript
// .storybook/preview-head.html
<link rel="stylesheet" href="/src/styles/globals.css">
```

**Dark Mode Implementation:**
```css
/* src/styles/globals.css */
@import "tailwindcss";

[data-theme="dark"] {
  color-scheme: dark;
}
```

**Theme Toggle in Stories:**
```typescript
export const Themed: Story = {
  parameters: {
    themes: {
      themeOverride: "dark",
    },
  },
}
```

### 8.12 Best Practices

**DO:**
- Write stories for all component variations
- Use autodocs tag for auto-generated documentation
- Include interaction tests for critical paths
- Add accessibility tests for all components
- Use controls for interactive exploration
- Document complex components with MDX
- Keep stories focused and simple
- Group related stories logically

**DON'T:**
- Create stories with excessive mock data
- Mix business logic with presentation
- Duplicate stories (use compositions instead)
- Ignore accessibility warnings
- Overcomplicate story decorators
- Skip documentation for complex props

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

**GitHub Actions Example:**
```yaml
name: Storybook

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: yarn install
      - run: yarn build-storybook
      - uses: actions/upload-artifact@v3
        with:
          name: storybook
          path: storybook-static
```

**Chromatic Integration (Visual Testing):**
```bash
yarn add -D chromatic
```

```json
{
  "scripts": {
    "chromatic": "chromatic --project-token=<token>"
  }
}
```

### 8.15 Performance Optimization

**Story Loading Optimization:**
- Lazy load heavy dependencies
- Use `composeStories` for testing
- Optimize bundle size with code splitting
- Cache Storybook builds

**Development Best Practices:**
- Run Storybook in parallel with dev server
- Use hot module replacement
- Optimize images and assets
- Enable compression for static builds

---

## 9. Build Configuration

### 9.1 Vite Configuration

**React Compiler Setup:**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"], // Must be first!
      },
    }),
    tailwindcss(),
  ],
})
```

**Why React Compiler:**
- Automatic memoization (no manual useMemo/useCallback)
- Optimizes re-renders
- Zero configuration after setup

**Verification:**
- React DevTools shows "Memo ✨" badge on optimized components

### 9.2 TypeScript Configuration

**Key Settings (tsconfig.app.json):**
```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 9.3 Tailwind CSS v4

**Setup:**
```css
/* src/styles/globals.css */
@import "tailwindcss";
```

**Vite Plugin:**
```typescript
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [tailwindcss()],
})
```

---

## 9. Implementation Phases

### Phase 1: Project Scaffolding
1. Create Vite project with React + TypeScript template
2. Install all dependencies
3. Configure Vite, TypeScript, Tailwind
4. Set up folder structure

### Phase 2: Core Infrastructure
1. API client with interceptors
2. Query client configuration
3. Router setup with lazy loading
4. Provider wrapper

### Phase 3: Shared Components
1. Layout component
2. Button component
3. Common component library

### Phase 4: Features
1. Home page with tech stack display
2. User list page with TanStack Query
3. Auth store for state management

### Phase 5: Testing
1. Write unit tests for components
2. Write unit tests for hooks
3. Write unit tests for stores
4. Verify all tests pass

### Phase 6: Validation
1. Build succeeds (no TypeScript errors)
2. All tests pass
3. Dev server runs correctly
4. Lazy loading verified
5. React Compiler verified

---

## 10. Development Guidelines

### 10.1 File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button.tsx` |
| Hooks | camelCase with `use` prefix | `useUsers.ts` |
| Services | camelCase | `userService.ts` |
| Types | camelCase with `.type` suffix | `user.type.ts` |
| Utils | camelCase | `formatDate.ts` |
| Constants | UPPER_SNAKE_CASE | `API_ROUTES.ts` |

### 10.2 Import Order

```typescript
// 1. React
import { useState } from "react"

// 2. External libraries
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router"

// 3. Internal imports (absolute)
import { Button } from "@/components/common/Button"
import { useAuthStore } from "@/store/authStore"

// 4. Relative imports
import { UserCard } from "./components/UserCard"

// 5. Types (if separate file)
import type { User } from "./types/user.type"

// 6. CSS
import "./styles.css"
```

### 10.3 Code Style

**Use:**
- Function components (never class components)
- TypeScript strict mode
- ES6+ syntax (async/await, destructuring)
- Optional chaining (`?.`) and nullish coalescing (`??`)

**Avoid:**
- `any` type (use `unknown` or proper types)
- Prop drilling (use context or Zustand)
- Large components (split into smaller ones)
- Nested ternaries (use early returns)

---

## 11. Performance Considerations

### 11.1 Code Splitting
- Route-based: Already handled by React Router lazy loading
- Component-based: Use `React.lazy()` for heavy components

### 11.2 Image Optimization
- Use lazy loading for images
- Implement responsive images with `srcset`
- Consider using a CDN

### 11.3 Bundle Analysis
```bash
yarn add -D vite-bundle-visualizer
```

Run: `yarn build -- --mode analyze`

---

## 12. Security Best Practices

### 12.1 Environment Variables
- Never commit `.env` files
- Use `.env.example` as template
- All API URLs in environment variables

### 12.2 Authentication
- Store tokens in `localStorage` (or httpOnly cookies)
- Include token in all API requests via interceptor
- Handle 401 errors globally
- Redirect to login on auth failure

### 12.3 XSS Prevention
- React automatically escapes JSX content
- Avoid `dangerouslySetInnerHTML`
- Sanitize user input if using HTML rendering

---

## 14. Next Steps

After this design is approved:

1. **Generate project structure** using `/sc:implement`
2. **Create all configuration files** (vite.config.ts, tsconfig, etc.)
3. **Implement all source files** according to specifications
4. **Write comprehensive tests** for all components and hooks
5. **Run build and test suite** to verify everything works
6. **Deploy to staging** for final validation

---

## Appendix A: Package Dependencies

### Production Dependencies
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-router": "^7.0.0",
  "@tanstack/react-query": "^5.0.0",
  "@tanstack/react-query-devtools": "^5.0.0",
  "zustand": "^5.0.0",
  "axios": "^1.7.0",
  "tailwindcss": "^4.0.0",
  "@tailwindcss/vite": "^4.0.0"
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^4.3.0",
  "babel-plugin-react-compiler": "latest",
  "vitest": "^2.0.0",
  "@vitest/ui": "^2.0.0",
  "jsdom": "^25.0.0",
  "@testing-library/react": "^16.0.0",
  "@testing-library/jest-dom": "^6.5.0",
  "@testing-library/user-event": "^14.5.0",
  "orval": "^7.0.0",
  "typescript": "^5.6.0",
  "vite": "^6.0.0",
  "storybook": "^8.5.0",
  "@storybook/react-vite": "^8.5.0",
  "@storybook/addon-essentials": "^8.5.0",
  "@storybook/addon-interactions": "^8.5.0",
  "@storybook/addon-themes": "^8.5.0",
  "@storybook/addon-a11y": "^8.5.0",
  "@storybook/addon-links": "^8.5.0",
  "@storybook/blocks": "^8.5.0",
  "storybook-dark-mode": "^4.0.0"
}
```

---

## Appendix B: Environment Variables

```bash
# .env.example
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com

# Future variables:
# VITE_AUTH_TOKEN_KEY=token
# VITE_API_TIMEOUT=10000
# VITE_ENABLE_DEVTOOLS=true
```

---

**Document Version:** 1.1
**Last Updated:** 2025-03-13
**Author:** Senior Frontend Architect
**Status:** Ready for Implementation
**Changes:** Added Section 8 - Storybook Design System
