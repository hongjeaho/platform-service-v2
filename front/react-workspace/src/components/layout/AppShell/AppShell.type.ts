import type { ComponentType, ReactNode } from 'react'

export interface NavIconProps {
  className?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}

export interface NavItem {
  label: string
  to: string
  icon?: ComponentType<NavIconProps>
}

export interface NavSection {
  label?: string
  items: NavItem[]
}

export interface SidebarBrand {
  label: string
  mark?: string
}

export interface SidebarProfile {
  name: string
  role?: string
}

export interface SidebarProps {
  brand: SidebarBrand
  sections: NavSection[]
  profile?: SidebarProfile
}

export interface TopbarProps {
  breadcrumb: ReactNode
  onSearch?: (query: string) => void
  onNotificationsClick?: () => void
  user?: SidebarProfile
}

export interface AppShellProps {
  brand: SidebarBrand
  sections: NavSection[]
  profile?: SidebarProfile
  breadcrumb: ReactNode
  onSearch?: (query: string) => void
  onNotificationsClick?: () => void
  children?: ReactNode
}
