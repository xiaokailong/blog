'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClientOnly } from '@/components/common/client-only'
import { RichText } from '@/components/contentful/rich-text'
import { FloatingHeader } from '@/components/layout/floating-header'
import { PageTitle } from '@/components/content/page-title'
import { ScrollArea } from '@/components/layout/scroll-area'
import { WritingViews } from '@/components/writing/writing-views'
import { ScreenLoadingSpinner } from '@/components/common/screen-loading-spinner'
import { getDateTimeFormat } from '@/lib/utils'

interface PostData {
  title: string
  slug: string
  content: any
  excerpt?: string
  date: string
  tags?: string[]
  first_published_at: string
  published_at: string
  created_at: string
  updated_at: string
}

export function WritingDetailClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${slug}`)
        const data = await response.json()
        
        if (data.success) {
          setPost(data.data)
        } else {
          setError(data.error || 'Failed to fetch post')
          if (response.status === 404) {
            router.push('/404')
          }
        }
      } catch (err) {
        setError('Failed to fetch post')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug, router])

  if (loading) {
    return <ScreenLoadingSpinner />
  }

  if (error || !post) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">{error || 'Post not found'}</p>
      </div>
    )
  }

  const postDate = post.date || post.first_published_at || post.created_at
  const dateString = getDateTimeFormat(postDate)
  const datePublished = new Date(postDate).toISOString()
  const dateModified = new Date(post.updated_at || post.published_at).toISOString()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: 'Velen Fan Jiahui'
    },
    url: `https://blog.velen.fun/writing/${slug}`
  }

  return (
    <>
      <ScrollArea className="bg-white" useScrollAreaId>
        <FloatingHeader scrollTitle={post.title} goBackLink="/writing">
          <WritingViews slug={slug} />
        </FloatingHeader>
        <div className="content-wrapper @container/writing">
          <article className="content">
            <PageTitle
              title={post.title}
              subtitle={
                <time dateTime={postDate} className="text-gray-400">
                  {dateString}
                </time>
              }
              className="mb-6 flex flex-col gap-3"
            />
            <RichText content={post.content} />
          </article>
        </div>
      </ScrollArea>
      <ClientOnly>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }} />
      </ClientOnly>
    </>
  )
}
