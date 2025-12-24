import { BookmarkDetailClient } from '@/components/bookmarks/bookmark-detail-client'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default async function CollectionPage(props) {
  const params = await props.params
  const { slug } = params

  return <BookmarkDetailClient slug={slug} />
}

export async function generateMetadata(props) {
  const params = await props.params
  const { slug } = params
  
  // For now, return basic metadata. In production, you might want to fetch from API
  const siteUrl = `/bookmarks/${slug}`
  const seoTitle = `Bookmarks Collection`
  const seoDescription = `A curated selection of various handpicked bookmarks by Velen Fan Jiahui`

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: siteUrl,
      images: siteUrl + '/og.png'
    },
    alternates: {
      canonical: siteUrl
    }
  }
}
