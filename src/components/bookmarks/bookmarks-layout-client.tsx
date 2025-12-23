'use client'

import { ListItem } from '@/components/content/list-item'

interface BookmarkCollection {
  id: number
  _id: number
  title: string
  slug: string
  description: string
  count: number
}

interface BookmarksLayoutClientProps {
  bookmarks: BookmarkCollection[]
}

export function BookmarksLayoutClient({ bookmarks }: BookmarksLayoutClientProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        No bookmarks yet
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 text-sm">
      {bookmarks.map((bookmark) => {
        return (
          <ListItem
            key={bookmark._id}
            path={`/bookmarks/${bookmark.slug}`}
            title={bookmark.title}
            description={`${bookmark.count} bookmarks`}
          />
        )
      })}
    </div>
  )
}
