import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/db'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

function getSortedPosts(posts: any[]) {
  return posts.sort((a, b) => {
    const dateA = a.date || a.created_at
    const dateB = b.date || b.created_at
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const preview = searchParams.get('preview') === 'true'
    
    const posts = await getAllPosts(preview)
    const sortedPosts = getSortedPosts(posts)
    
    return NextResponse.json({
      success: true,
      data: sortedPosts
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
