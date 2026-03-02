import ApplicationFormPage from '@views/implementer/application/FormPage.tsx'
import ApplicationList from '@views/implementer/application/List.tsx'
import type { RouteObject } from 'react-router-dom'

const routes: RouteObject[] = [
  {
    path: 'application',
    children: [
      {
        path: '',
        element: <ApplicationList />,
      },
      {
        path: ':judgSeqNo/view',
        element: <ApplicationFormPage />,
      },
      {
        path: ':judgSeqNo/write',
        element: <ApplicationFormPage />,
      },
      {
        path: ':judgSeqNo/edit',
        element: <ApplicationFormPage />,
      },
    ],
  },
]

export default routes
