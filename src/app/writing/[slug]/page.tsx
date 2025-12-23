import { WritingDetailClient } from '@/components/writing/writing-detail-client'
import { getWritingSeo } from '@/lib/contentful'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default async function WritingSlug(props) {
  const params = await props.params
  const { slug } = params

  return <WritingDetailClient slug={slug} />
}

export async function generateMetadata(props) {
  const params = await props.params
  const { slug } = params
  const seoData = await getWritingSeo(slug)
  if (!seoData) return null

  const {
    date,
    seo: { title, description, keywords },
    sys: { firstPublishedAt, publishedAt: updatedAt }
  } = seoData

  const siteUrl = `/writing/${slug}`
  const postDate = date || firstPublishedAt
  const publishedTime = new Date(postDate).toISOString()
  const modifiedTime = new Date(updatedAt).toISOString()

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      ...(updatedAt && {
        modifiedTime
      }),
      url: siteUrl,
      images: siteUrl + '/og.png'
    },
    alternates: {
      canonical: siteUrl
    }
  }
}
