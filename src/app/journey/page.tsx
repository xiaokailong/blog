import { FloatingHeader } from '@/components/layout/floating-header'
import { GradientBg3 } from '@/components/common/gradient-bg'
import { PageTitle } from '@/components/content/page-title'
import { ScrollArea } from '@/components/layout/scroll-area'
import { JourneyClient } from '@/components/journey/journey-client'
import { getPageSeo } from '@/lib/contentful'

export default function Journey() {
  return (
    <ScrollArea useScrollAreaId>
      <GradientBg3 />
      <FloatingHeader scrollTitle="Journey" />
      <div className="content-wrapper">
        <div className="content">
          <PageTitle title="Journey" />
          <JourneyClient />
        </div>
      </div>
    </ScrollArea>
  )
}

export async function generateMetadata() {
  const seoData = await getPageSeo('journey')
  if (!seoData) return null

  const {
    seo: { title, description }
  } = seoData
  const siteUrl = '/journey'

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
