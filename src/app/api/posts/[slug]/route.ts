import { NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/db'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const preview = searchParams.get('preview') === 'true'
    
    const post = await getPostBySlug(slug, preview)
    
    if (!post) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Post not found' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch post' 
      },
      { status: 500 }
    )
  }
}
