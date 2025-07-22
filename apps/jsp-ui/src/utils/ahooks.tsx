import { useRequest as useARequest } from 'ahooks'

function useRequest<TData, TParams extends any[]>(service, options) {
  return useARequest<TData, TParams>(service, {
    loadingDelay: 300,
    ...options,
  })
}

export { useRequest }
