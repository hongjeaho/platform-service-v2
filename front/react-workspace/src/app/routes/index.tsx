import type { NavSection } from '@components/layout/AppShell'

import { NotFoundPage, RootLayout, RouterErrorPage } from './layout'

// Route meta type for use in route meta
export interface RouteMeta {
  title: string
  inNav?: boolean
  navLabel?: string
  icon?: React.ComponentType<{ className?: string }>
  authRequired?: boolean
}

// Extended route type with meta support
export interface RouteNode {
  path?: string
  index?: boolean
  Component?: React.ComponentType
  element?: React.ReactNode
  errorElement?: React.ReactNode
  children?: RouteNode[]
  meta?: RouteMeta
}

// Route tree definition
export const routeTree: RouteNode[] = [
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
