import { FloatingHeader } from '@/components/layout/floating-header'
import { PageTitle } from '@/components/content/page-title'
import { ScrollArea } from '@/components/layout/scroll-area'

export function NotFound() {
  return (
    <ScrollArea useScrollAreaId>
      <FloatingHeader scrollTitle="Not found" />
      <div className="content-wrapper">
        <div className="content">
          <PageTitle title="Not found" />
          <p>This link might be broken, deleted, or moved. Nevertheless, there’s nothing to see here...</p>
        </div>
      </div>
    </ScrollArea>
  )
}
