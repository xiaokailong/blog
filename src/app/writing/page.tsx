import { FloatingHeader } from '@/components/layout/floating-header'
import { ScrollArea } from '@/components/layout/scroll-area'
import { WritingPageClient } from '@/components/writing/writing-page-client'
import { getPageSeo } from '@/lib/contentful'

export default function Writing() {
  return (
    <ScrollArea className="lg:hidden">
      <FloatingHeader title="Writing" />
      <WritingPageClient />
    </ScrollArea>
  )
}

export async function generateMetadata() {
  const seoData = await getPageSeo('writing')
  if (!seoData) return null

  const {
    seo: { title, description }
  } = seoData
  const siteUrl = '/writing'

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
