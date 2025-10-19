import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params first
    const { id } = await params
    
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to place a bid' },
        { status: 401 }
      )
    }

    // Check if user is the auction owner
    const auction = await prisma.auction.findUnique({
      where: { id },
      select: { userId: true, currentBid: true }
    })

    if (!auction) {
      return NextResponse.json(
        { error: 'Auction not found' },
        { status: 404 }
      )
    }

    if (auction.userId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot bid on your own auction' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { amount } = body
    
    // Convert amount to number and validate
    const bidAmount = parseFloat(amount)
    
    if (isNaN(bidAmount)) {
      return NextResponse.json(
        { error: 'Valid bid amount is required' },
        { status: 400 }
      )
    }
    
    if (bidAmount <= auction.currentBid) {
      return NextResponse.json(
        { error: `Bid must be higher than current bid of $${auction.currentBid}` },
        { status: 400 }
      )
    }

    // Create the bid
    const bid = await prisma.bid.create({
      data: {
        amount: bidAmount,
        userId: session.user.id,
        auctionId: id
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    // Update auction current bid
    await prisma.auction.update({
      where: { id },
      data: { currentBid: bidAmount }
    })

    return NextResponse.json({
      success: true,
      message: 'Bid placed successfully!',
      bid
    })
    
  } catch (error) {
    console.error('Bid placement error:', error)
    return NextResponse.json(
      { error: 'Failed to place bid' },
      { status: 500 }
    )
  }
}