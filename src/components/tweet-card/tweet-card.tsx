import { Tweet, TweetSkeleton } from 'react-tweet'

import styles from '@/components/tweet-card/tweet-card.module.css'
import { cn } from '@/lib/utils'
import type { TweetCardProps } from '@/types'

export const TweetCard = ({ id, className }: TweetCardProps) => {
  if (!id) return null

  return (
    <div
      className={cn(
        'thumbnail-shadow relative w-full min-w-full overflow-hidden rounded-xl',
        styles.tweetCard,
        className
      )}
    >
      <Tweet
        id={id}
        fallback={
          <div>
            <TweetSkeleton />
          </div>
        }
      />
    </div>
  )
}
