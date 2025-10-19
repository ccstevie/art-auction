import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // params is now a Promise
) {
  try {
    // Await the params
    const { id } = await params
    
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, image: true }
        },
        bids: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!auction) {
      return NextResponse.json(
        { error: 'Auction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(auction)
  } catch (error) {
    console.error('Failed to fetch auction:', error)
    return NextResponse.json(
      { error: 'Failed to fetch auction' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // params is now a Promise
) {
  try {
    // Await the params
    const { id } = await params
    
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to delete an auction' },
        { status: 401 }
      )
    }

    const auction = await prisma.auction.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!auction) {
      return NextResponse.json(
        { error: 'Auction not found' },
        { status: 404 }
      )
    }

    if (auction.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own auctions' },
        { status: 403 }
      )
    }

    await prisma.auction.delete({
      where: { id }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Auction deleted successfully' 
    })
  } catch (error) {
    console.error('Failed to delete auction:', error)
    return NextResponse.json(
      { error: 'Failed to delete auction' },
      { status: 500 }
    )
  }
}