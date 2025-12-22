import { NextResponse } from 'next/server'
import { getBookmarkCollections } from '@/lib/db'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const collections = await getBookmarkCollections()
    
    return NextResponse.json({
      success: true,
      data: collections
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
