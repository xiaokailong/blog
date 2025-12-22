import { draftMode } from 'next/headers'
import { ImageResponse } from 'next/og'

import { sharedMetadata } from '@/app/shared-metadata'
import { OpenGraphImage } from '@/components/content/og-image'
import { getAllPostSlugs, getWritingSeo } from '@/lib/contentful'
import { getBoldFont, getRegularFont } from '@/lib/fonts'
import { isDevelopment } from '@/lib/utils'

export const dynamic = 'force-static'



export async function generateStaticParams() {
  const allPosts = await getAllPostSlugs()
  return allPosts.map((post) => ({ slug: post.slug }))
}

export async function GET(_, props) {
  const params = await props.params
  const { isEnabled } = await draftMode()
  const { slug } = params
  const [seoData, regularFontData, boldFontData] = await Promise.all([
    getWritingSeo(slug, isDevelopment ? true : isEnabled),
    getRegularFont(),
    getBoldFont()
  ])
  if (!seoData) {
    return new Response('Not Found', { status: 404 })
  }
  const {
    seo: { title, ogImageTitle, ogImageSubtitle }
  } = seoData

  return new ImageResponse(
    (
      <OpenGraphImage
        title={ogImageTitle || title}
        description={ogImageSubtitle || 'by Velen Fan Jiahui'}
        url="writing"
      />
    ),
    {
      width: sharedMetadata.ogImage.width, height: sharedMetadata.ogImage.height,
      fonts: [
        {
          name: 'Geist Sans',
          data: regularFontData,
          style: 'normal',
          weight: 400
        },
        {
          name: 'Geist Sans',
          data: boldFontData,
          style: 'normal',
          weight: 500
        }
      ]
    }
  )
}
