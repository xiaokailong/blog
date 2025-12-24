import Link from 'next/link'

import { FloatingHeader } from '@/components/layout/floating-header'
import { PageTitle } from '@/components/content/page-title'
import { ScrollArea } from '@/components/layout/scroll-area'
import { Button } from '@/components/ui/button'
import { HomeWritingListClient } from '@/components/writing/home-writing-list-client'

export default function Home() {
  return (
    <ScrollArea useScrollAreaId>
      <FloatingHeader scrollTitle="Velen Fan Jiahui" />
      <div className="content-wrapper">
        <div className="content">
          <PageTitle title="Home" className="lg:hidden" />
          <p>
            Hi 👋 I'm Velen Fan Jiahui, a software engineer based in Dalian, China.
          </p>
          <p>
            I develop things as a Senior Frontend Software Engineer. Previously, I worked as a Senior Frontend Software
            Engineer at heycar, Frontend Software Engineer at Yemeksepeti, Fullstack Software Engineer at Sistas, Mobile
            Developer at Tanbula, and Specialist at Apple.
          </p>
          <Button asChild variant="link" className="inline px-0">
            <Link href="/writing">
              <h2 className="mt-8 mb-4">Writing</h2>
            </Link>
          </Button>
          <HomeWritingListClient />
        </div>
      </div>
    </ScrollArea>
  )
}
