import { FloatingHeader } from '@/components/layout/floating-header'
import { GradientBg4 } from '@/components/common/gradient-bg'
import { PageTitle } from '@/components/content/page-title'
import { ScrollArea } from '@/components/layout/scroll-area'
import { StackPageClient } from '@/components/common/stack-page-client'

export const metadata = {
  title: 'Tech Stack',
  description: 'Explore the frontend technologies and tools I use and recommend',
  openGraph: {
    title: 'Tech Stack',
    description: 'Explore the frontend technologies and tools I use and recommend',
    url: '/stack'
  },
  alternates: {
    canonical: '/stack'
  }
}

export default function StackPage() {
  return (
    <ScrollArea>
      <GradientBg4 />
      <FloatingHeader title="Tech Stack" />
      <div className="content-wrapper">
        <PageTitle title="Tech Stack" />
        <p className="mb-8 text-gray-600">
          A curated collection of frontend technologies, frameworks, tools, and resources that I use and recommend for
          modern web development.
        </p>
        <StackPageClient />
      </div>
    </ScrollArea>
  )
}
