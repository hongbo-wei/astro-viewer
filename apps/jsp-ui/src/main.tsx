import { ErrorBoundary } from '@zj-astro/ui'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from '@/routes'
import '@zj-astro/ui/index.scss'
import '@zj-astro/ui/mixin.scss'
import '@zj-astro/ui/theme.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>,
)
