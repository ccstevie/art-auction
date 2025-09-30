import { NextResponse } from 'next/server'

// Mock data - using Unsplash images for realistic artwork
const mockAuctions = [
  {
    id: '1',
    title: 'Starry Night Interpretation',
    description: 'A modern take on Van Gogh\'s classic masterpiece using mixed media and contemporary techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop',
    currentBid: 1250,
    startingPrice: 500,
    endTime: '2024-12-31T23:59:59Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    bids: [
      { id: '1', amount: 1200, userId: 'user1', createdAt: '2024-01-16T14:30:00Z' },
      { id: '2', amount: 1250, userId: 'user2', createdAt: '2024-01-16T15:45:00Z' },
    ],
    status: 'active' as const,
  },
  {
    id: '2',
    title: 'Abstract Ocean Waves',
    description: 'Vibrant abstract representation of ocean waves with acrylic on canvas.',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=500&fit=crop',
    currentBid: 800,
    startingPrice: 300,
    endTime: '2024-12-25T23:59:59Z',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    bids: [
      { id: '3', amount: 800, userId: 'user3', createdAt: '2024-01-16T13:15:00Z' },
    ],
    status: 'active' as const,
  },
  {
    id: '3',
    title: 'Urban Landscape Photography',
    description: 'Black and white urban landscape capturing the essence of city life.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
    currentBid: 450,
    startingPrice: 200,
    endTime: '2024-11-30T23:59:59Z',
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-05T14:00:00Z',
    bids: [],
    status: 'active' as const,
  },
  {
    id: '4',
    title: 'Colorful Geometric Patterns',
    description: 'Modern geometric art with vibrant colors and precise lines.',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
    currentBid: 320,
    startingPrice: 150,
    endTime: '2024-10-15T23:59:59Z',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z',
    bids: [
      { id: '4', amount: 320, userId: 'user4', createdAt: '2024-01-21T10:20:00Z' },
    ],
    status: 'active' as const,
  },
  {
    id: '5',
    title: 'Mountain Landscape Oil Painting',
    description: 'Traditional oil painting of serene mountain landscape at sunset.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    currentBid: 950,
    startingPrice: 400,
    endTime: '2024-12-20T23:59:59Z',
    createdAt: '2024-01-08T08:00:00Z',
    updatedAt: '2024-01-08T08:00:00Z',
    bids: [
      { id: '5', amount: 900, userId: 'user5', createdAt: '2024-01-18T16:30:00Z' },
      { id: '6', amount: 950, userId: 'user1', createdAt: '2024-01-19T09:15:00Z' },
    ],
    status: 'active' as const,
  },
  {
    id: '6',
    title: 'Contemporary Portrait Series',
    description: 'Series of three contemporary portraits exploring human emotion.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop',
    currentBid: 680,
    startingPrice: 250,
    endTime: '2024-11-10T23:59:59Z',
    createdAt: '2024-01-12T13:00:00Z',
    updatedAt: '2024-01-12T13:00:00Z',
    bids: [
      { id: '7', amount: 680, userId: 'user2', createdAt: '2024-01-17T14:45:00Z' },
    ],
    status: 'active' as const,
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit')
  
  let auctions = mockAuctions
  
  if (limit) {
    auctions = mockAuctions.slice(0, parseInt(limit))
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return NextResponse.json(auctions)
}

// Add this POST function to your existing route.ts file
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { title, description, imageUrl, startingPrice, endTime } = body

    // Validation
    if (!title || !description || !imageUrl || !startingPrice || !endTime) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create new auction
    const newAuction = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      imageUrl,
      currentBid: Number(startingPrice),
      startingPrice: Number(startingPrice),
      endTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bids: [],
      status: 'active' as const,
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      auction: newAuction,
      message: 'Auction created successfully!'
    })

  } catch (error) {
    console.error('Create auction error:', error)
    return NextResponse.json(
      { error: 'Failed to create auction' },
      { status: 500 }
    )
  }
}