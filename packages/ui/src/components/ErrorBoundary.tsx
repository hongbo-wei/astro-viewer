//ErrorBoundary.tsx
import * as React from 'react'

interface PropsType {
  children: React.ReactNode
}

interface StateType {
  hasError: boolean
  Error?: null | Error
  ErrorInfo?: null | React.ErrorInfo
}

export class ErrorBoundary extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = {
      hasError: false,
      Error: null,
      ErrorInfo: null,
    }
  } //控制渲染降级UI

  // 接收 error，返回一个新的 state，会触发重新渲染来显示错误对应的 UI
  static getDerivedStateFromError(error: Error): StateType {
    return { hasError: true, Error: error }
  } //捕获抛出异常

  // 接收 error 和堆栈 info，可以用来打印错误日志
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    //传递异常信息
    this.setState((preState) => ({
      hasError: preState.hasError,
      Error: error,
      ErrorInfo: errorInfo,
    }))
    //可以将异常信息抛出给日志系统等等
    //do something....
  }

  render() {
    //如果捕获到异常，渲染降级UI
    if (this.state.hasError) {
      return (
        <div>
          <h1>{`Error Boundary:${this.state.Error?.message}`}</h1>

          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.ErrorInfo?.componentStack}
          </details>
        </div>
      )
    }
    return this.props.children
  }
}
