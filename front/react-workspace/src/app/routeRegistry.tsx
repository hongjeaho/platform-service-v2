import { createBrowserRouter, redirect } from 'react-router'

import { isAuthenticated } from '../store/auth/authStore'
import type { RouteNode } from './routes'
import { getNavSections as getNavSectionsFromRoutes, routeTree } from './routes/index'

// Re-export types and functions from routes
export type { RouteMeta, RouteNode } from './routes'
export { getNavSectionsFromRoutes as getNavSections }
export { NotFoundPage, RootLayout, RouterErrorPage } from './routes/layout'

// Auth loader for protected routes
export const protectedLoader = () => {
  if (!isAuthenticated()) {
    return redirect('/login')
  }
  return null
}

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
