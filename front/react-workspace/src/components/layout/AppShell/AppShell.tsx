import { Outlet } from 'react-router'

import type { AppShellProps } from './AppShell.type'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell({
  brand,
  sections,
  profile,
  breadcrumb,
  onSearch,
  onNotificationsClick,
  children,
}: AppShellProps) {
  return (
    <div className='flex min-h-screen bg-background'>
      <Sidebar brand={brand} sections={sections} profile={profile} />
      <div className='flex min-w-0 flex-1 flex-col'>
        <Topbar
          breadcrumb={breadcrumb}
          onSearch={onSearch}
          onNotificationsClick={onNotificationsClick}
          user={profile}
        />
        <main className='flex-1 p-7'>{children ?? <Outlet />}</main>
      </div>
    </div>
  )
}
