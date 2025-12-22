import { SCROLL_AREA_ID } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { ScrollAreaProps } from '@/types'

export const ScrollArea = ({ useScrollAreaId = false, className, ...rest }: ScrollAreaProps) => (
  <div
    {...(useScrollAreaId && { id: SCROLL_AREA_ID })}
    className={cn('scrollable-area relative flex w-full flex-col', className)}
    {...rest}
  />
)
