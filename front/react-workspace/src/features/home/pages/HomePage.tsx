import { Link } from 'react-router'

import { Button } from '../../../components/common/Button'
import { useAuthStore } from '../../../store/authStore'

const techStack = [
  { name: 'React 19', color: 'bg-cyan-500', description: 'UI Library with Compiler' },
  { name: 'TypeScript', color: 'bg-blue-600', description: 'Type Safety' },
  { name: 'Vite', color: 'bg-purple-500', description: 'Build Tool' },
  { name: 'TanStack Query', color: 'bg-red-500', description: 'Server State' },
  { name: 'Zustand', color: 'bg-yellow-500', description: 'Client State' },
  { name: 'React Router v7', color: 'bg-indigo-500', description: 'Routing' },
  { name: 'Tailwind CSS', color: 'bg-teal-500', description: 'Styling' },
  { name: 'Vitest', color: 'bg-orange-500', description: 'Testing' },
  { name: 'React Compiler', color: 'bg-pink-500', description: 'Auto Optimization' },
]

export function Component() {
  const { user, isAuthenticated, login, logout } = useAuthStore()

  const handleLoginTest = () => {
    if (isAuthenticated) {
      logout()
    } else {
      login({ id: 1, name: 'Test User', email: 'test@example.com' })
    }
  }

  return (
    <div className='space-y-8'>
      {/* Hero Section */}
      <div className='text-center py-12'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>Welcome to React Workspace</h1>
        <p className='text-lg text-gray-600 mb-8'>
          Enterprise-grade React application with modern architecture
        </p>
        <Link to='/users'>
          <Button size='lg'>View Users</Button>
        </Link>
      </div>

      {/* Tech Stack Section */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>Technology Stack</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {techStack.map(tech => (
            <div
              key={tech.name}
              className='border rounded-lg p-4 hover:shadow-md transition-shadow'
            >
              <div className='flex items-center gap-3 mb-2'>
                <div className={`w-3 h-3 rounded-full ${tech.color}`} />
                <h3 className='font-semibold text-gray-900'>{tech.name}</h3>
              </div>
              <p className='text-sm text-gray-600'>{tech.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Auth State Test Section */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Authentication State Test</h2>
        <div className='space-y-4'>
          <div className='flex items-center gap-4'>
            <div className='flex-1'>
              <p className='text-sm text-gray-600'>Status:</p>
              <p
                className={`text-lg font-semibold ${isAuthenticated ? 'text-green-600' : 'text-gray-400'}`}
              >
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </p>
            </div>
            {user && (
              <div className='flex-1'>
                <p className='text-sm text-gray-600'>User:</p>
                <p className='text-lg font-semibold text-gray-900'>{user.name}</p>
                <p className='text-sm text-gray-600'>{user.email}</p>
              </div>
            )}
          </div>
          <Button onClick={handleLoginTest} variant={isAuthenticated ? 'secondary' : 'primary'}>
            {isAuthenticated ? 'Logout' : 'Login Test'}
          </Button>
        </div>
      </div>

      {/* Architecture Flow Diagram */}
      <div className='bg-gray-900 rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-bold text-white mb-6'>Architecture Flow</h2>
        <div className='bg-gray-800 rounded-lg p-6 font-mono text-sm overflow-x-auto'>
          <div className='space-y-2 text-green-400'>
            <p>Component → Custom Hook → Service → API Client → Backend API</p>
            <p className='text-gray-500'>↓ ↓ ↓ ↓</p>
            <p>UI useQuery userService axios</p>
            <p>Render useMutation (interceptors)</p>
          </div>
        </div>
        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div className='bg-gray-800 rounded-lg p-4'>
            <h3 className='text-white font-semibold mb-2'>Separation of Concerns</h3>
            <ul className='text-gray-300 space-y-1'>
              <li>• Components: UI rendering only</li>
              <li>• Hooks: Data fetching logic</li>
              <li>• Services: API endpoint definitions</li>
              <li>• API Client: HTTP configuration</li>
            </ul>
          </div>
          <div className='bg-gray-800 rounded-lg p-4'>
            <h3 className='text-white font-semibold mb-2'>State Management</h3>
            <ul className='text-gray-300 space-y-1'>
              <li>• Server State: TanStack Query</li>
              <li>• Client State: Zustand</li>
              <li>• Local State: useState/useReducer</li>
              <li>• Form State: Uncontrolled inputs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
