import { NextResponse } from 'next/server'
import { getJourneyItems } from '@/lib/db'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const items = await getJourneyItems()
    
    // Group by year
    const groupedByYear = items.reduce((acc: any[], item: any) => {
      const year = new Date(item.date).getFullYear()
      const existingYear = acc.find(group => group.year === year)
      
      if (!existingYear) {
        acc.push({ year, logs: [item] })
      } else {
        existingYear.logs.push(item)
      }
      
      return acc
    }, [])
    
    // Sort by year descending
    groupedByYear.sort((a, b) => b.year - a.year)
    
    return NextResponse.json({
      success: true,
      data: groupedByYear
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
