import { useEffect, useState } from 'react'

import { getAllViewCounts } from '@/lib/db'

export const useViewData = (slug?: any) => {
  const [viewData, setViewData] = useState(null)

  useEffect(() => {
    async function getViewData() {
      try {
        const data = await getAllViewCounts()
        if (slug) {
          const filtered = data.filter((item: any) => item.slug === slug)
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
