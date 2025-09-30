import { NextResponse } from 'next/server'

const mockAuctions = [
  {
    id: '1',
    title: 'Starry Night Interpretation',
    description: 'A modern take on Van Gogh\'s classic masterpiece using mixed media and contemporary techniques. This piece combines traditional painting methods with digital elements to create a unique visual experience that bridges classical and modern art.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop',
    currentBid: 1250,
    startingPrice: 500,
    endTime: '2024-12-31T23:59:59Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    bids: [
      { 
        id: '1', 
        amount: 1200, 
        userId: 'user1', 
        user: { name: 'Alex Johnson', email: 'alex@example.com' },
        createdAt: '2024-01-16T14:30:00Z' 
      },
      { 
        id: '2', 
        amount: 1250, 
        userId: 'user2', 
        user: { name: 'Sarah Miller', email: 'sarah@example.com' },
        createdAt: '2024-01-16T15:45:00Z' 
      },
    ],
    status: 'active' as const,
  },
  {
    id: '2',
    title: 'Abstract Ocean Waves',
    description: 'Vibrant abstract representation of ocean waves with acrylic on canvas. The artist captures the movement and energy of the sea through bold brushstrokes and a dynamic color palette.',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop',
    currentBid: 800,
    startingPrice: 300,
    endTime: '2024-12-25T23:59:59Z',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    bids: [
      { 
        id: '3', 
        amount: 800, 
        userId: 'user3', 
        user: { name: 'Mike Chen', email: 'mike@example.com' },
        createdAt: '2024-01-16T13:15:00Z' 
      },
    ],
    status: 'active' as const,
  },
  {
    id: '3',
    title: 'Urban Landscape Photography',
    description: 'Black and white urban landscape capturing the essence of city life. This photograph was taken during golden hour, creating dramatic shadows and highlights that emphasize the architectural beauty.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
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
    description: 'Modern geometric art with vibrant colors and precise lines. This piece explores the relationship between mathematical precision and artistic expression.',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop',
    currentBid: 320,
    startingPrice: 150,
    endTime: '2024-10-15T23:59:59Z',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z',
    bids: [
      { 
        id: '4', 
        amount: 320, 
        userId: 'user4', 
        user: { name: 'Emma Davis', email: 'emma@example.com' },
        createdAt: '2024-01-21T10:20:00Z' 
      },
    ],
    status: 'active' as const,
  },
  {
    id: '5',
    title: 'Mountain Landscape Oil Painting',
    description: 'Traditional oil painting of serene mountain landscape at sunset. Created using classical techniques passed down through generations of landscape artists.',
    imageUrl: 'https://images.unsplash.com/photo-1578321272177-56bdbd7675de?w=600&h=600&fit=crop',
    currentBid: 950,
    startingPrice: 400,
    endTime: '2024-12-20T23:59:59Z',
    createdAt: '2024-01-08T08:00:00Z',
    updatedAt: '2024-01-08T08:00:00Z',
    bids: [
      { 
        id: '5', 
        amount: 900, 
        userId: 'user5', 
        user: { name: 'James Wilson', email: 'james@example.com' },
        createdAt: '2024-01-18T16:30:00Z' 
      },
      { 
        id: '6', 
        amount: 950, 
        userId: 'user1', 
        user: { name: 'Alex Johnson', email: 'alex@example.com' },
        createdAt: '2024-01-19T09:15:00Z' 
      },
    ],
    status: 'active' as const,
  },
  {
    id: '6',
    title: 'Contemporary Portrait Series',
    description: 'Series of three contemporary portraits exploring human emotion and identity in the digital age. Each portrait tells a unique story while maintaining visual cohesion.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop',
    currentBid: 680,
    startingPrice: 250,
    endTime: '2024-11-10T23:59:59Z',
    createdAt: '2024-01-12T13:00:00Z',
    updatedAt: '2024-01-12T13:00:00Z',
    bids: [
      { 
        id: '7', 
        amount: 680, 
        userId: 'user2', 
        user: { name: 'Sarah Miller', email: 'sarah@example.com' },
        createdAt: '2024-01-17T14:45:00Z' 
      },
    ],
    status: 'active' as const,
  },
]

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params to resolve the Promise
  const { id } = await params
  
  const auction = mockAuctions.find(a => a.id === id)
  
  if (!auction) {
    return NextResponse.json({ error: 'Auction not found' }, { status: 404 })
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return NextResponse.json(auction)
}