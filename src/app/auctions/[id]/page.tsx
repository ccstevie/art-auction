'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { socket } from '@/lib/socket'
import BidBox from '@/components/BidBox'
import { Auction, Bid } from '@/types/auctions'

export default function AuctionDetail({ params }: { params: { id: string } }) {
  const { data: auction, isLoading, error } = useQuery<Auction>({
    queryKey: ['auction', params.id],
    queryFn: async () => {
      const response = await api.get(`/auctions/${params.id}`)
      return response.data
    },
  })

  const [bids, setBids] = useState<Bid[]>([])

  useEffect(() => {
    if (!auction) return

    // Connect socket when component mounts
    socket.connect()

    // Join the auction room
    socket.emit('joinAuction', params.id)
    
    // Listen for new bids
    socket.on('bid:new', (bid: Bid) => {
      setBids((prev) => [bid, ...prev])
    })

    // Listen for bid updates to keep in sync
    socket.on('bid:update', (updatedAuction: Auction) => {
      // You could update the local state or refetch
      console.log('Auction updated:', updatedAuction)
    })

    return () => {
      socket.emit('leaveAuction', params.id)
      socket.off('bid:new')
      socket.off('bid:update')
      // Don't disconnect completely as other components might use it
    }
  }, [params.id, auction])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading auction...</p>
      </div>
    )
  }

  if (error || !auction) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">Failed to load auction</p>
      </div>
    )
  }

  const isEnded = new Date(auction.endTime) < new Date()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Auction Details */}
        <div>
          <img
            src={auction.imageUrl}
            alt={auction.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        
        <div>
          {isEnded && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              This auction has ended
            </div>
          )}
          
          <h1 className="text-3xl font-bold mb-4">{auction.title}</h1>
          <p className="text-gray-600 mb-6">{auction.description}</p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-2xl font-bold text-green-600">
              Current Bid: ${auction.currentBid}
            </p>
            <p className="text-sm text-gray-500">
              Starting Price: ${auction.startingPrice}
            </p>
            {!isEnded && (
              <p className="text-sm text-gray-500 mt-2">
                Ends: {new Date(auction.endTime).toLocaleString()}
              </p>
            )}
          </div>

          {!isEnded && (
            <BidBox auctionId={auction.id} currentBid={auction.currentBid} />
          )}
        </div>
      </div>

      {/* Live Bids Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Live Bids</h2>
        {bids.length === 0 ? (
          <p className="text-gray-500">No bids yet. Be the first to bid!</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {bids.map((bid, index) => (
              <div key={bid.id || index} className="flex justify-between items-center p-3 bg-white border rounded-lg">
                <div>
                  <span className="font-medium">{bid.user?.name || 'Anonymous'}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {new Date(bid.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <span className="font-bold text-green-600">${bid.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}