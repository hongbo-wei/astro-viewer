import { ErrPage } from '@zj-astro/ui'
import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()

  return <ErrPage content={error.statusText || error.message} />
}
