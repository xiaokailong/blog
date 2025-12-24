'use client'

import { useEffect, useState } from 'react'

interface StatsData {
  totalVisitors: number
  daysRunning: number
  startDate: string
}

export function StatsDisplay() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()

    // 记录访问
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: '/' })
    }).catch(() => {})
  }, [])

  if (isLoading) {
    return (
      <div className="flex gap-8 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-xl">👁️</span>
          <span>Loading...</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">⏰</span>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="flex gap-8 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <span className="text-xl">👁️</span>
        <span>
          <span className="font-mono font-semibold text-black">{stats.totalVisitors.toLocaleString()}</span>
          {' '}visitors
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl">⏰</span>
        <span>
          <span className="font-mono font-semibold text-black">{stats.daysRunning}</span>
          {' '}days running
        </span>
      </div>
    </div>
  )
}
