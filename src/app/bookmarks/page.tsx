import Link from 'next/link'
import { Suspense } from 'react'

import { FloatingHeader } from '@/components/layout/floating-header'
import { ScreenLoadingSpinner } from '@/components/common/screen-loading-spinner'
import { ScrollArea } from '@/components/layout/scroll-area'
import { getPageSeo } from '@/lib/contentful'
import { getBookmarks } from '@/lib/raindrop'
import { sortByProperty } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function fetchData() {
  const bookmarksResult = await getBookmarks()
  const bookmarks = bookmarksResult?.items || []
  const sortedBookmarks = sortByProperty(bookmarks, 'title')
  return { bookmarks: sortedBookmarks }
}

export default async function Writing() {
  const { bookmarks } = await fetchData()

  return (
    <ScrollArea className="lg:hidden">
      <FloatingHeader title="Bookmarks" bookmarks={bookmarks} />
      <Suspense fallback={<ScreenLoadingSpinner />}>
        {bookmarks?.map((bookmark) => {
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
      </Suspense>
    </ScrollArea>
  )
}

export async function generateMetadata() {
  const seoData = await getPageSeo('bookmarks')
  if (!seoData) return null

  const {
    seo: { title, description }
  } = seoData
  const siteUrl = '/bookmarks'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: siteUrl
    },
    alternates: {
      canonical: siteUrl
    }
  }
}
