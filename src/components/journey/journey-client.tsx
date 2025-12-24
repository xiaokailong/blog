'use client'

import { useEffect, useState } from 'react'
import { ScreenLoadingSpinner } from '@/components/common/screen-loading-spinner'
import { JourneyCard } from '@/components/journey/journey-card'
import { API_BASE_URL } from '@/lib/constants'

interface JourneyLog {
  title: string
  date: string
  description: string
  type?: string
  icon?: string
  link?: string
  image?: any
}

interface JourneyYear {
  year: number
  logs: JourneyLog[]
}

export function JourneyClient() {
  const [journeyData, setJourneyData] = useState<JourneyYear[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchJourney() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/journey`)
        const data = await response.json()
        
        if (data.success) {
          setJourneyData(data.data || [])
        } else {
          setError(data.error || 'Failed to fetch journey data')
        }
      } catch (err) {
        setError('Failed to fetch journey data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchJourney()
  }, [])

  if (loading) {
    return <ScreenLoadingSpinner />
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (journeyData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">No journey items yet</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-stretch gap-12">
      {journeyData.map((item, itemIndex) => (
        <div key={`data_${itemIndex}`} className="flex flex-col items-baseline gap-6 md:flex-row md:gap-12">
          <h2>{item.year}</h2>
          <section>
            {item.logs.map((log, logIndex) => (
              <div key={`data_${itemIndex}_log_${logIndex}`} className="relative flex pb-8 last:pb-0">
                {logIndex !== item.logs.length - 1 && (
                  <div className="absolute inset-0 flex w-5 items-center justify-center">
                    <div className="pointer-events-none h-full w-px border-l border-dashed border-gray-200"></div>
                  </div>
                )}
                <div className="z-0 grid size-5 shrink-0 place-items-center rounded-full border bg-white text-white shadow-xs">
                  <div className="size-2 rounded-full bg-blue-600" />
                </div>
                <div className="grow pl-4 lg:pl-8">
                  <JourneyCard {...log} index={logIndex} />
                </div>
              </div>
            ))}
          </section>
        </div>
      ))}
    </div>
  )
}
