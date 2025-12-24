import { WritingDetailClient } from '@/components/writing/writing-detail-client'

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
  
  // Simple metadata without fetching from DB
  const siteUrl = `/writing/${slug}`
  const seoTitle = `Writing`
  const seoDescription = `Blog post by Velen Fan Jiahui`

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      url: siteUrl,
      images: siteUrl + '/og.png'
    },
    alternates: {
      canonical: siteUrl
    }
  }
}
