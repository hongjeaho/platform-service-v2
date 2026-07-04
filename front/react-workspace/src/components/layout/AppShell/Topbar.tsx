import { Button } from '@/components/common/Button'
import { icons } from '@/styles'

import type { TopbarProps } from './AppShell.type'

export function Topbar({ breadcrumb, onSearch, onNotificationsClick, user }: TopbarProps) {
  return (
    <div className='flex items-center justify-between border-b border-border bg-card px-7 py-4'>
      <div className='text-sm font-semibold text-muted-foreground'>{breadcrumb}</div>

      <div className='flex items-center gap-3'>
        <Button
          variant='ghost'
          size='sm'
          icon={<icons.search />}
          aria-label='검색'
          onClick={() => onSearch?.('')}
        >
          {null}
        </Button>
        <Button
          variant='ghost'
          size='sm'
          icon={<icons.notification />}
          aria-label='알림'
          onClick={onNotificationsClick}
        >
          {null}
        </Button>
        {user && (
          <span className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
            {user.name.slice(0, 1)}
          </span>
        )}
      </div>
    </div>
  )
}
