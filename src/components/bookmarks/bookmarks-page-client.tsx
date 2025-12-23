'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ScreenLoadingSpinner } from '@/components/common/screen-loading-spinner'

interface BookmarkCollection {
  id: number
  _id: number
  title: string
  slug: string
  description: string
  count: number
}

export function BookmarksPageClient() {
  const [bookmarks, setBookmarks] = useState<BookmarkCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const response = await fetch('/api/bookmarks')
        const data = await response.json()
        
        if (data.success) {
          setBookmarks(data.data || [])
        } else {
          setError(data.error || 'Failed to fetch bookmarks')
        }
      } catch (err) {
        setError('Failed to fetch bookmarks')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
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

  if (bookmarks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">No bookmarks yet</p>
      </div>
    )
  }

  return (
    <>
      {bookmarks.map((bookmark) => {
        return (
          <Link
            key={bookmark.id}
            href={`/bookmarks/${bookmark.slug}`}
            className="flex flex-col gap-1 border-b px-4 py-3 text-sm hover:bg-gray-100"
          >
            <span className="font-medium">{bookmark.title}</span>
            <span className="text-slate-500">{bookmark.count} bookmarks</span>
          </Link>
        )
      })}
    </>
  )
}
