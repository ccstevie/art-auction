import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auto-config'
import { prisma } from '@/lib/db'

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