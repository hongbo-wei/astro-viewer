import { ReactNode, createContext, useContext } from 'react'

type valueType = {
  regenerate: () => void
}

// 创建Context
const Context = createContext<any>({} as valueType)

// 创建Provider
const Provider = ({
  value,
  children,
}: {
  value?: any
  children: ReactNode
}) => {
  // const regenerate = () => {}

  return <Context.Provider value={{ ...value }}>{children}</Context.Provider>
}

// 创建消费
const useChat = () => {
  return useContext(Context)
}

export { Context, Provider, useChat }
