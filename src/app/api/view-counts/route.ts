import { NextResponse } from 'next/server'
import { getAllViewCounts } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const viewCounts = await getAllViewCounts()
    return NextResponse.json(viewCounts)
  } catch (error) {
    console.error('Error fetching view counts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch view counts' },
      { status: 500 }
    )
  }
}
