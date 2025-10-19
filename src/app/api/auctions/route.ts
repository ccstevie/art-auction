import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    
    const auctions = await prisma.auction.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: {
          select: { name: true, image: true }
        },
        bids: {
          orderBy: { amount: 'desc' },
          take: 1,
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined
    })

    return NextResponse.json(auctions)
  } catch (error) {
    console.error('Failed to fetch auctions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch auctions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Get the authenticated user from session
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to create an auction' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, imageUrl, startingPrice, endTime } = body

    const auction = await prisma.auction.create({
      data: {
        title,
        description,
        imageUrl,
        startingPrice: parseFloat(startingPrice),
        currentBid: parseFloat(startingPrice),
        endTime: new Date(endTime),
        userId: session.user.id // Use the real user ID
      },
      include: {
        user: {
          select: { name: true, image: true }
        }
      }
    })

    return NextResponse.json({ success: true, auction })
  } catch (error) {
    console.error('Failed to create auction:', error)
    return NextResponse.json(
      { error: 'Failed to create auction' },
      { status: 500 }
    )
  }
}