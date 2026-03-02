import type { RouteObject } from 'react-router-dom'

import implementerApplicationRoutes from './application/index.tsx'
import implementerOpinionRoutes from './opinion/index.tsx'

const routes: RouteObject[] = [
  {
    path: 'implementer',
    children: [...implementerApplicationRoutes, ...implementerOpinionRoutes],
  },
]

export default routes
