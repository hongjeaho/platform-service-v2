import type { NavSection } from '@components/layout/AppShell'
import { AppShell } from '@components/layout/AppShell'
import { createBrowserRouter, redirect, useRouteError } from 'react-router'

import { isAuthenticated } from '../store/auth/authStore'

// Route meta type for use in handle.meta
export interface RouteMeta {
  title: string
  inNav?: boolean
  navLabel?: string
  icon?: React.ComponentType<{ className?: string }>
  authRequired?: boolean
}

// Extended route type with meta support
interface RouteNode {
  path?: string
  index?: boolean
  Component?: React.ComponentType
  element?: React.ReactNode
  errorElement?: React.ReactNode
  children?: RouteNode[]
  meta?: RouteMeta
}

// Auth loader for protected routes
export const protectedLoader = () => {
  if (!isAuthenticated()) {
    return redirect('/login')
  }
  return null
}

// Layout Components
function RootLayout() {
  return (
    <AppShell brand={{ label: 'React Workspace' }} sections={getNavSections()} breadcrumb='홈' />
  )
}

function RouterErrorPage() {
  const error = useRouteError()
  const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4 p-6'>
      <h1 className='text-2xl font-bold text-error-foreground'>오류가 발생했습니다</h1>
      <p className='text-muted-foreground'>{message}</p>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
      <h1 className='text-6xl font-bold text-muted-foreground'>404</h1>
      <p className='text-xl text-muted-foreground'>페이지를 찾을 수 없습니다.</p>
    </div>
  )
}

// Route tree definition (internal type)
const routeTree: RouteNode[] = [
  {
    path: '/',
    Component: RootLayout,
    meta: { title: '홈', inNav: false },
    errorElement: <RouterErrorPage />,
    children: [
      {
        index: true,
        Component: NotFoundPage,
        meta: { title: '홈', inNav: false },
      },
    ],
  },
]

/**
 * Convert RouteNode to RouteObject for react-router
 */
function toRouteObject(node: RouteNode): Record<string, unknown> {
  const obj: Record<string, unknown> = {}
  if (node.path) obj.path = node.path
  if (node.index) obj.index = node.index
  if (node.Component) obj.Component = node.Component
  if (node.element) obj.element = node.element
  if (node.errorElement) obj.errorElement = node.errorElement
  if (node.children) obj.children = node.children.map(toRouteObject)
  if (node.meta) obj.handle = { meta: node.meta }
  return obj
}

// Create and export router
export const router = createBrowserRouter(routeTree.map(toRouteObject))

/**
 * Extract navigation sections from route tree
 * Traverses the route tree and collects routes with inNav: true
 */
export function getNavSections(): NavSection[] {
  const sections: NavSection[] = []
  const navItems: NavSection['items'] = []

  function traverse(routes: RouteNode[]) {
    for (const route of routes) {
      if (route.meta?.inNav && route.path) {
        navItems.push({
          label: route.meta.navLabel || route.meta.title,
          to: route.path === 'index' ? '/' : `/${route.path}`,
          icon: route.meta.icon,
        })
      }
      if (route.children) {
        traverse(route.children)
      }
    }
  }

  traverse(routeTree)

  if (navItems.length > 0) {
    sections.push({ items: navItems })
  }

  return sections
}

/**
 * Get breadcrumbs for a given pathname
 * Matches the path against routes and returns breadcrumb trail
 */
export interface Breadcrumb {
  title: string
  path: string
}

export function getBreadcrumbs(pathname: string): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = []

  function traverse(routes: RouteNode[], parentPath = '') {
    for (const route of routes) {
      const currentPath = route.path
        ? `${parentPath}/${route.path}`.replace(/\/+/g, '/')
        : parentPath

      if (route.meta) {
        breadcrumbs.push({
          title: route.meta.title,
          path: currentPath || '/',
        })
      }

      if (route.children) {
        traverse(route.children, currentPath || '/')
      }
    }
  }

  traverse(routeTree)

  // Filter to match current path
  const segments = pathname.split('/').filter(Boolean)
  return breadcrumbs.filter(bc => {
    const bcSegments = bc.path.split('/').filter(Boolean)
    return segments.some((seg, i) => bcSegments[i] === seg)
  })
}
