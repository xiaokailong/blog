import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/db'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const preview = searchParams.get('preview') === 'true'
    
    const posts = await getAllPosts(preview)
    
    return NextResponse.json({
      success: true,
      data: posts
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch posts' 
      },
      { status: 500 }
    )
  }
}
