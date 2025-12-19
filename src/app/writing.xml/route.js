import { Feed } from 'feed'

import { getAllPosts } from '@/lib/contentful'
import { getSortedPosts } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  const allPosts = await getAllPosts()
  if (!allPosts) {
    return new Response('Posts not available', { status: 503 })
  }
  const sortedPosts = getSortedPosts(allPosts)
  const date = new Date()
  const siteURL = 'https://blog.velen.fun'
  const author = {
    name: 'Velen Fan Jiahui',
    link: 'https://blog.velen.fun'
  }

  const feed = new Feed({
    title: `Writings RSS feed by ${author.name}`,
    description: 'Stay up to date with my latest writings',
    id: siteURL,
    link: `${siteURL}/writing`,
    language: 'en',
    copyright: `All rights reserved ${date.getFullYear()}, ${author.name}`,
    author,
    feedLinks: {
      rss2: `${siteURL}/writing/rss.xml`
    }
  })

  sortedPosts.forEach((post) => {
    feed.addItem({
      id: post.slug,
      guid: post.slug,
      title: post.title,
      link: `${siteURL}/writing/${post.slug}`,
      date: new Date(post.date || post.sys.firstPublishedAt),
      updated: new Date(post.sys.publishedAt),
      author: [author],
      contributor: [author]
    })
  })

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // Cache response for 2 days, revalidate once a day
      'Cache-Control': 'max-age=172800, stale-while-revalidate=86400'
    }
  })
}
