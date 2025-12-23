import { NextResponse } from 'next/server'
import { getBookmarkCollections } from '@/lib/db'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

function sortByTitle(arr: any[]) {
  return arr.sort((a, b) => {
    const titleA = (a.title || '').toUpperCase()
    const titleB = (b.title || '').toUpperCase()
    if (titleA < titleB) return -1
    if (titleA > titleB) return 1
    return 0
  })
}

export async function GET() {
  try {
    const collections = await getBookmarkCollections()
    const sortedCollections = sortByTitle(collections)
    
    return NextResponse.json({
      success: true,
      data: sortedCollections
    })
  } catch (error) {
    console.error('Error fetching bookmark collections:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch bookmark collections' 
      },
      { status: 500 }
    )
  }
}
