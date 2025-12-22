import dynamic from 'next/dynamic'
import { memo } from 'react'

const MarkdownRenderer = dynamic(() => import('@/components/content/markdown-renderer').then((mod) => mod.MarkdownRenderer))
import type { JourneyCardProps } from '@/types'

export const JourneyCard = memo(({ title, description, image, index }: JourneyCardProps) => {
  const imageData = typeof image === 'string' ? { url: image } : image
  
  return (
    <div className="word-break-word flex flex-col">
      <span className="mb-px font-semibold tracking-tight">{title}</span>
      {description && (
        <MarkdownRenderer
          className="text-sm"
          options={{
            forceInline: true
          }}
        >
          {description}
        </MarkdownRenderer>
      )}
      {imageData?.url && (
        <div className="mt-2.5 overflow-hidden rounded-xl bg-white">
          <img
            src={imageData.url}
            alt={imageData.title || imageData.description || title}
            width={imageData.width}
            height={imageData.height}
            loading={index < 1 ? 'eager' : 'lazy'}
            className="animate-reveal"
            {...({ nopin: "nopin" } as any)}
          />
        </div>
      )}
    </div>
  )
})
JourneyCard.displayName = 'JourneyCard'
