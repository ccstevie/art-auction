import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/lib/db'

// Define types for the data
interface UserAuction {
  id: string
  title: string
  status: string
  bids: Array<{
    amount: number
    userId: string
  }>
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get user's auctions
    const userAuctions = await prisma.auction.findMany({
      where: { userId },
      include: {
        bids: {
          orderBy: { amount: 'desc' },
          take: 1
        }
      }
    }) as UserAuction[]

    // Get user's bids
    const userBids = await prisma.bid.findMany({
      where: { userId },
      include: {
        auction: {
          select: {
            id: true,
            title: true,
            currentBid: true,
            endTime: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate stats with proper typing
    const activeAuctions = userAuctions.filter((a: UserAuction) => a.status === 'ACTIVE').length
    const totalBids = userBids.length
    const wonAuctions = userAuctions.filter((a: UserAuction) => 
      a.status === 'ENDED' && 
      a.bids.length > 0 && 
      a.bids[0].userId === userId
    ).length

    return NextResponse.json({
      stats: {
        activeAuctions,
        totalBids,
        wonAuctions
      },
      userAuctions,
      recentBids: userBids.slice(0, 5) // Last 5 bids
    })
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}