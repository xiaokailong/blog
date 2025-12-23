'use client'

import { useEffect, useState } from 'react'
import { ScreenLoadingSpinner } from '@/components/common/screen-loading-spinner'
import { WritingList } from '@/components/writing/writing-list'
import type { ContentfulPost } from '@/types'

export function HomeWritingListClient() {
  const [items, setItems] = useState<[string, ContentfulPost[]][]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        
        if (data.success) {
          const posts = data.data || []
          
          // Group posts by year
          const grouped: Record<string, ContentfulPost[]> = posts.reduce((acc: any, post: any) => {
            const date = post.date || post.created_at
            const year = new Date(date).getFullYear().toString()
            
            if (!acc[year]) {
              acc[year] = []
            }
            
            // Transform to ContentfulPost format
            const contentfulPost: ContentfulPost = {
              title: post.title,
              slug: post.slug,
              date: post.date,
              excerpt: post.excerpt || '',
              content: post.content,
              tags: Array.isArray(post.tags) ? post.tags : [],
              sys: {
                firstPublishedAt: post.first_published_at || post.created_at,
                publishedAt: post.published_at || post.updated_at
              }
            }
            
            acc[year].push(contentfulPost)
            return acc
          }, {})
          
          // Convert to array of tuples and sort by year descending
          const itemsArray: [string, ContentfulPost[]][] = Object.entries(grouped).sort(
            (a, b) => parseInt(b[0]) - parseInt(a[0])
          )
          
          setItems(itemsArray)
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

  if (items.length === 0) {
    return (
      <div className="py-4 text-gray-500">
        No posts yet
      </div>
    )
  }

  return <WritingList items={items} />
}
