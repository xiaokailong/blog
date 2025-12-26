'use client'

import { useEffect, useState } from 'react'
import { getApiUrl } from '@/lib/config'
import type { ViewCount } from '@/types'

export const useViewData = (slug?: string) => {
  const [viewData, setViewData] = useState(null)

  useEffect(() => {
    async function getViewData() {
      try {
        // 使用API路由获取浏览量数据
        const response = await fetch(getApiUrl('/view-counts'))
        if (!response.ok) throw new Error('Failed to fetch view data')
        
        const data = await response.json()
        if (slug) {
          const filtered = data.filter((item: ViewCount) => item.slug === slug)
          setViewData(filtered)
        } else {
          setViewData(data)
        }
      } catch (error) {
        console.info('Error fetching view data:', error)
      }
    }

    getViewData()
  }, [slug])

  // D1数据库不支持实时更新，移除realtime订阅
  // 可以考虑使用轮询或WebSocket实现

  return viewData
}
