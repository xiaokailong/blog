import { SideMenu } from '@/components/layout/side-menu'
import { WritingLayoutClient } from '@/components/writing/writing-layout-client'

export default function WritingLayout({ children }) {
  return (
    <>
      <SideMenu title="Writing" isInner>
        <WritingLayoutClient />
      </SideMenu>
      <div className="lg:bg-dots flex-1">{children}</div>
    </>
  )
}
