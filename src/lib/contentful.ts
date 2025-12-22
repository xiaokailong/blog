import 'server-only'

import { cache } from 'react'

import { getAllPosts as dbGetAllPosts, getPostBySlug as dbGetPostBySlug, getPostSlugs as dbGetPostSlugs, getJourneyItems as dbGetJourneyItems } from '@/lib/db'
import { isDevelopment } from '@/lib/utils'
import type { Post } from '@/types'

// https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#preloading-data
export const preloadGetAllPosts = (preview = isDevelopment) => {
  void getAllPosts(preview)
}

export const getAllPosts = cache(async (preview = isDevelopment) => {
  try {
    const posts = await dbGetAllPosts(preview)
    return posts.map((post: Post) => ({
      title: post.title,
      slug: post.slug,
      date: post.date,
      excerpt: post.excerpt,
      tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags,
      content: typeof post.content === 'string' ? JSON.parse(post.content) : post.content,
      sys: {
        firstPublishedAt: post.created_at,
        publishedAt: post.updated_at
      }
    }))
  } catch (error) {
    console.info(error)
    return []
  }
})

export const getPost = cache(async (slug, preview = isDevelopment) => {
  try {
    const post = await dbGetPostBySlug(slug, preview)
    if (!post) return null

    return {
      title: post.title,
      slug: post.slug,
      date: post.date,
      seo: {
        title: post.title,
        description: post.excerpt || ''
      },
      content: {
        json: post.content,
        links: {
          assets: { block: [] },
          entries: { inline: [] }
        }
      },
      sys: {
        firstPublishedAt: post.first_published_at,
        publishedAt: post.published_at
      }
    }
  } catch (error) {
    console.info(error)
    return null
  }
})

export const getWritingSeo = cache(async (slug, preview = isDevelopment) => {
  try {
    const post = await dbGetPostBySlug(slug, preview)
    if (!post) return null

    return {
      date: post.date,
      seo: {
        title: post.title,
        description: post.excerpt || '',
        ogImageTitle: post.title,
        ogImageSubtitle: post.excerpt || '',
        keywords: post.tags || []
      },
      sys: {
        firstPublishedAt: post.first_published_at,
        publishedAt: post.published_at
      }
    }
  } catch (error) {
    console.info(error)
    return null
  }
})

export const getPageSeo = cache(async (slug, preview = isDevelopment) => {
  try {
    // 页面SEO暂时返回默认值，可以后续扩展
    return {
      seo: {
        title: slug,
        description: '',
        ogImageTitle: slug,
        ogImageSubtitle: '',
        keywords: []
      }
    }
  } catch (error) {
    console.info(error)
    return null
  }
})

export const getAllPageSlugs = cache(async (preview = isDevelopment) => {
  try {
    // 页面slug暂时返回空数组，可以后续扩展pages表
    return []
  } catch (error) {
    console.info(error)
    return []
  }
})

export const getAllPostSlugs = cache(async (preview = isDevelopment) => {
  try {
    const slugs = await dbGetPostSlugs()
    return slugs.map(slug => ({ slug }))
  } catch (error) {
    console.info(error)
    return []
  }
})

export const getPage = cache(async (slug, preview = isDevelopment) => {
  try {
    // 页面内容暂时返回null，可以后续扩展pages表
    return null
  } catch (error) {
    console.info(error)
    return null
  }
})

export const getAllLogbook = cache(async (preview = isDevelopment) => {
  try {
    const items = await dbGetJourneyItems()
    return items.map((item: any) => ({
      title: item.title,
      date: item.date,
      description: item.description,
      image: null // 可以后续添加图片支持
    }))
  } catch (error) {
    console.info(error)
    return []
  }
})
