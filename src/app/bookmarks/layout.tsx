'use client'

import { useEffect, useState } from 'react'
import { SideMenu } from '@/components/layout/side-menu'
import { Toaster } from '@/components/ui/sonner'
import { BookmarksLayoutClient } from '@/components/bookmarks/bookmarks-layout-client'
import { API_BASE_URL } from '@/lib/constants'

interface BookmarkCollection {
  id: number
  _id: number
  title: string
  slug: string
  description: string
  count: number
}

export default function BookmarksLayout({ children }) {
  const [bookmarks, setBookmarks] = useState<BookmarkCollection[]>([])

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/bookmarks`)
        const data = await response.json()
        
        if (data.success) {
          setBookmarks(data.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch bookmarks:', err)
      }
    }

    fetchBookmarks()
  }, [])

  return (
    <>
      <div className="flex w-full">
        <SideMenu title="Bookmarks" bookmarks={bookmarks} isInner>
          <BookmarksLayoutClient bookmarks={bookmarks} />
        </SideMenu>
        <div className="lg:bg-grid flex-1">{children}</div>
      </div>
      <Toaster
        closeButton
        toastOptions={{
          duration: 5000
        }}
      />
    </>
  )
}
