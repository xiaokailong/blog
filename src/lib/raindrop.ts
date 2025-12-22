import 'server-only'

import { getBookmarkCollections, getBookmarksByCollection } from '@/lib/db'

export const getBookmarkItems = async (id, pageIndex = 0) => {
  if (!id) throw new Error('Bookmark ID is required')
  if (typeof pageIndex !== 'number' || pageIndex < 0) {
    throw new Error('Invalid page index')
  }

  try {
    const items = await getBookmarksByCollection(id, pageIndex, 50)
    return {
      result: true,
      items: items,
      count: items.length
    }
  } catch (error) {
    console.error(`Failed to fetch bookmark items: ${error.message}`)
    return null
  }
}

export const getBookmarks = async () => {
  try {
    const collections = await getBookmarkCollections()
    return {
      result: true,
      items: collections
    }
  } catch (error) {
    console.error(`Failed to fetch bookmarks: ${error.message}`)
    return null
  }
}

export const getBookmark = async (id) => {
  try {
    const collections = await getBookmarkCollections()
    const collection = collections.find((c: { id: number }) => c.id === parseInt(id))
    
    if (!collection) return null
    
    return {
      result: true,
      item: collection
    }
  } catch (error) {
    console.error(`Failed to fetch bookmark: ${error.message}`)
    return null
  }
}
