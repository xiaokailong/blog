import { NextResponse } from 'next/server'
import { getJourneyItems } from '@/lib/db'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const items = await getJourneyItems()
    
    return NextResponse.json({
      success: true,
      data: items
    })
  } catch (error) {
    console.error('Error fetching journey items:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch journey items' 
      },
      { status: 500 }
    )
  }
}
