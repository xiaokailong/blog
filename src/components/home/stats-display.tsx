'use client'

import { useEffect, useState } from 'react'
import { ClockIcon, EyeIcon, HeartIcon } from 'lucide-react'

interface StatsData {
  visitCount: number
  daysRunning: number
  likeCount: number
  siteStartDate: string
  introduction: string
}

export function StatsDisplay() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [localLikes, setLocalLikes] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showPlusOne, setShowPlusOne] = useState(false)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
          setLocalLikes(data.data.likeCount || 0)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()

    // 记录访问 - 每次访问都会递增
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {})

    // 心跳动画，每8秒缓慢闪动一次
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1500) // 延长动画时间使其更缓慢
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const handleLike = async () => {
    // 立即更新本地显示
    setLocalLikes((prev) => prev + 1)
    setShowPlusOne(true)
    setTimeout(() => setShowPlusOne(false), 1000)

    // 发送到服务器
    try {
      await fetch('/api/stats/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Failed to increment likes:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <ClockIcon size={16} />
          <span>Loading...</span>
        </div>
        <div className="flex items-center gap-2">
          <EyeIcon size={16} />
          <span>Loading...</span>
        </div>
        <div className="flex items-center gap-2">
          <HeartIcon size={16} />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="flex flex-wrap gap-6 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <ClockIcon size={16} className="text-gray-500" />
        <span>
          <span className="font-mono font-semibold text-black">{stats.daysRunning}</span> days running
        </span>
      </div>
      <div className="flex items-center gap-2">
        <EyeIcon size={16} className="text-gray-500" />
        <span>
          <span className="font-mono font-semibold text-black">{stats.visitCount.toLocaleString()}</span> visitors
        </span>
      </div>
      <div className="relative flex items-center gap-2">
        <button
          onClick={handleLike}
          className="group relative flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          aria-label="Like this site"
        >
          <div className="relative">
            <HeartIcon
              size={16}
              className={`text-red-500 transition-all duration-1000 ${
                isAnimating ? 'animate-pulse scale-110' : ''
              } group-hover:fill-red-500`}
            />
            {showPlusOne && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 animate-float-up text-xs font-bold text-red-500">
                +1
              </span>
            )}
          </div>
          <span>
            <span className="font-mono font-semibold text-black">{localLikes.toLocaleString()}</span> likes
          </span>
        </button>
      </div>
    </div>
  )
}
