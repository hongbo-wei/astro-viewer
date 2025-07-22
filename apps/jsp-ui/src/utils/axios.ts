import { message } from 'antd'
import * as Axios from 'axios'
import qs from 'qs'

// 工具函数----------------------------------------------------------
export function toLogin() {}

export const baseURL = '/api'

// 主体----------------------------------------------------------
const instance = Axios.default.create({
  baseURL,
  method: 'get',
  headers: {
    post: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    'Access-Control-Allow-Origin': '*',
  },
  paramsSerializer: (params) => qs.stringify(params, { indices: false }),
})

// instance.interceptors.request.use(
//   (config: Axios.AxiosRequestConfig) => config,
//   (error) => {
//     // Do something with request error
//     message.error('请求超时:', error.toString())
//     return Promise.reject(error)
//   },
// )

instance.interceptors.response.use(
  ({ data }: Axios.AxiosResponse) => {
    // 通用封装
    const { code, message: msg, result, tips } = data
    switch (code) {
      case 3001: // 用户不存在
        return Promise.reject(data)
      default: {
        if (code !== 200 && code !== 204) {
          message.error(`${msg || tips}`)
          return Promise.reject(data)
        }
        return result
      }
    }
  },
  (error) => {
    let { message: errorDescription } =
      error.response?.data || error.data || error
    if (errorDescription === 'Network Error') {
      errorDescription = '数据同步失败，请检查网络'
    }
    console.error('api error:', errorDescription, error.response)
    return Promise.reject(error)
  },
)

export default instance
