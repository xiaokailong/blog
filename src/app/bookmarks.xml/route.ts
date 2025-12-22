import { Feed } from 'feed'

import { getBookmarkItems, getBookmarks } from '@/lib/raindrop'

export const dynamic = 'force-dynamic'

export async function GET() {
  const bookmarksResult = await getBookmarks()
  if (!bookmarksResult || !bookmarksResult.items) {
    return new Response('Bookmarks not available', { status: 503 })
  }
  
  const bookmarks = bookmarksResult.items
  const date = new Date()
  const siteURL = 'https://blog.velen.fun'
  const author = {
    name: 'Velen Fan Jiahui',
    link: 'https://blog.velen.fun'
  }

  const feed = new Feed({
    title: `Bookmarks RSS feed by ${author.name}`,
    description: 'Stay up to date with my latest selection of various handpicked bookmarks',
    id: siteURL,
    link: `${siteURL}/bookmarks`,
    language: 'en',
    copyright: `All rights reserved ${date.getFullYear()}, ${author.name}`,
    author,
    feedLinks: {
      rss2: `${siteURL}/bookmarks/rss.xml`
    }
  })

  const bookmarkList = []
  for (const bookmark of bookmarks) {
    const bookmarkItems = await getBookmarkItems(bookmark.id)
    const { items = [] } = bookmarkItems ?? {}

    items?.slice(0, 10).forEach((bookmark) => {
      bookmarkList.push({
        id: bookmark.id,
        guid: bookmark.id,
        title: bookmark.title,
        link: bookmark.url,
        description: bookmark.description,
        content: bookmark.description,
        image: bookmark.image,
        date: new Date(bookmark.created_at),
        updated: new Date(bookmark.updated_at),
        author: [author],
        contributor: [author]
      })
    })
  }

  const sortedBookmarks = bookmarkList.sort(
    (a, b) => new Date(b.updated || b.created).getTime() - new Date(a.updated || a.created).getTime()
  )
  sortedBookmarks.forEach((bookmark) => {
    feed.addItem({ ...bookmark })
  })

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  })
}
