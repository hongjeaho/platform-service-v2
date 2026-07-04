import { NavLink } from 'react-router'

import type { SidebarProps } from './AppShell.type'

export function Sidebar({ brand, sections, profile }: SidebarProps) {
  return (
    <nav
      aria-label={brand.label}
      className='flex h-full w-56 flex-col gap-6 border-r border-border bg-card p-4'
    >
      <div className='flex items-center gap-2 px-1'>
        <span className='flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground'>
          {brand.mark ?? brand.label.slice(0, 1)}
        </span>
        <span className='text-sm font-bold'>{brand.label}</span>
      </div>

      {sections.map((section, sectionIdx) => (
        <div key={section.label ?? sectionIdx} className='flex flex-col gap-1'>
          {section.label && (
            <span className='px-2 text-xs font-bold uppercase text-muted-foreground'>
              {section.label}
            </span>
          )}
          {section.items.map(item => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-[0.6875rem] px-2.5 py-2 text-sm font-semibold ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`
                }
              >
                {Icon && <Icon className='h-4 w-4' aria-hidden='true' />}
                {item.label}
              </NavLink>
            )
          })}
        </div>
      ))}

      {profile && (
        <div className='mt-auto flex items-center gap-2 rounded-xl bg-muted p-2.5'>
          <span className='flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
            {profile.name.slice(0, 1)}
          </span>
          <div>
            <div className='text-xs font-bold'>{profile.name}</div>
            {profile.role && <div className='text-xs text-muted-foreground'>{profile.role}</div>}
          </div>
        </div>
      )}
    </nav>
  )
}
