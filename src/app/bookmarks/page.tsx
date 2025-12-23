import { FloatingHeader } from '@/components/layout/floating-header'
import { ScrollArea } from '@/components/layout/scroll-area'
import { BookmarksPageClient } from '@/components/bookmarks/bookmarks-page-client'
import { getPageSeo } from '@/lib/contentful'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default function Bookmarks() {
  return (
    <ScrollArea className="lg:hidden">
      <FloatingHeader title="Bookmarks" />
      <BookmarksPageClient />
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
