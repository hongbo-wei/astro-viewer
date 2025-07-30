// src/services/jspImageService.ts
// 负责与后端JSP图像融合接口的数据交互

import { RetrievePayload } from '@/types/astro'

export async function postRetrieve(payload: RetrievePayload): Promise<any> {
  // 这里的url和端口需根据后端实际部署情况调整
  const response = await fetch('http://localhost:3001/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}
