'use client'

import { useEffect, useState } from 'react'
import { ScreenLoadingSpinner } from '@/components/common/screen-loading-spinner'
import { WritingListLayout } from '@/components/writing/writing-list-layout'
import type { ContentfulPost } from '@/types'
import { API_BASE_URL } from '@/lib/constants'

export function WritingLayoutClient() {
  const [posts, setPosts] = useState<ContentfulPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/posts`)
        const data = await response.json()
        
        if (data.success) {
          setPosts(data.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return <ScreenLoadingSpinner />
  }

  return <WritingListLayout list={posts} />
}
