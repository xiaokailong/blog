import { NextResponse } from 'next/server'
import { getBookmarksByCollection } from '@/lib/db'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const { id } = params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '0', 10)
    const perPage = parseInt(searchParams.get('perPage') || '50', 10)
    
    const bookmarks = await getBookmarksByCollection(parseInt(id), page, perPage)
    
    return NextResponse.json({
      success: true,
      data: bookmarks,
      count: bookmarks.length
    })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch bookmarks' 
      },
      { status: 500 }
    )
  }
}
