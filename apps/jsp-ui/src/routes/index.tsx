import { ELangBtn } from '@zj-astro/ui'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import App from '@/App'
import AstroImageViewer from '@/views/AstroImageViewer'
import ErrorPage from '@/views/ErrorPage'
import Example from '@/views/Example'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Navigate
        to={`${navigator.language.includes('zh') ? ELangBtn.ZH : ELangBtn.EN}/astro-viewer`}
      />
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/:lang',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'example',
        element: <Example />,
        param: { type: 'star' },
      },
      {
        path: 'astro-viewer',
        element: <AstroImageViewer />,
      },
    ],
  },
  {
    path: '/404',
    element: <ErrorPage />,
  },
])

export default router
