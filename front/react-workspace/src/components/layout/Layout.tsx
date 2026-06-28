import { Outlet } from 'react-router'

export function Layout() {
  return (
    <div className='min-h-screen bg-background'>
      <nav className='bg-(--surface-container-lowest) shadow-sm border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex'>
              <div className='flex-shrink-0 flex items-center'>
                <h1 className='text-xl font-bold text-primary'>React Workspace</h1>
              </div>
              <div className='hidden sm:ml-6 sm:flex sm:space-x-8' />
            </div>
          </div>
        </div>
      </nav>
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <Outlet />
      </main>
    </div>
  )
}
