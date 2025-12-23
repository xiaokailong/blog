'use client'

import { useEffect, useState } from 'react'
import { ScreenLoadingSpinner } from '@/components/common/screen-loading-spinner'
import { WritingListLayout } from '@/components/writing/writing-list-layout'
import type { ContentfulPost } from '@/types'

export function WritingPageClient() {
  const [posts, setPosts] = useState<ContentfulPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        
        if (data.success) {
          setPosts(data.data || [])
        } else {
          setError(data.error || 'Failed to fetch posts')
        }
      } catch (err) {
        setError('Failed to fetch posts')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
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

  if (posts.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">No posts yet</p>
      </div>
    )
  }

  return <WritingListLayout list={posts} isMobile />
}
