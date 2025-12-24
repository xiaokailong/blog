'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookmarkList } from '@/components/bookmarks/bookmark-list'
import { FloatingHeader } from '@/components/layout/floating-header'
import { PageTitle } from '@/components/content/page-title'
import { ScreenLoadingSpinner } from '@/components/common/screen-loading-spinner'
import { ScrollArea } from '@/components/layout/scroll-area'

interface BookmarkCollection {
  id: number
  _id: number
  title: string
  slug: string
  description: string
  count: number
}

interface BookmarkItem {
  _id: number
  title: string
  link: string
  excerpt?: string
  created: string
  domain: string
  type?: string
}

interface BookmarkDetailClientProps {
  slug: string
}

export function BookmarkDetailClient({ slug }: BookmarkDetailClientProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkCollection[]>([])
  const [currentBookmark, setCurrentBookmark] = useState<BookmarkCollection | null>(null)
  const [bookmarkItems, setBookmarkItems] = useState<BookmarkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all collections
        const collectionsResponse = await fetch('/api/bookmarks')
        const collectionsData = await collectionsResponse.json()
        
        if (!collectionsData.success) {
          setError('Failed to fetch bookmarks')
          return
        }

        const collections = collectionsData.data || []
        setBookmarks(collections)

        // Find current collection
        const current = collections.find((b: BookmarkCollection) => b.slug === slug)
        if (!current) {
          router.push('/404')
          return
        }

        setCurrentBookmark(current)

        // Fetch items for this collection
        const itemsResponse = await fetch(`/api/bookmarks/${current.id}`)
        const itemsData = await itemsResponse.json()
        
        if (itemsData.success) {
          setBookmarkItems(itemsData.data || [])
        }
      } catch (err) {
        console.error('Error fetching bookmark data:', err)
        setError('Failed to fetch bookmark data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, router])

  if (loading) {
    return <ScreenLoadingSpinner />
  }

  if (error || !currentBookmark) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">{error || 'Bookmark not found'}</p>
      </div>
    )
  }

  return (
    <ScrollArea className="bg-grid" useScrollAreaId>
      <FloatingHeader
        scrollTitle={currentBookmark.title}
        goBackLink="/bookmarks"
        bookmarks={bookmarks}
        currentBookmark={currentBookmark}
      />
      <div className="content-wrapper">
        <div className="content @container">
          <PageTitle title={currentBookmark.title} />
          <BookmarkList id={currentBookmark._id} initialData={{ items: bookmarkItems }} />
        </div>
      </div>
    </ScrollArea>
  )
}
