'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import BidBox from '@/components/BidBox'
import { Button } from '@/components/ui/button'
import { Auction, Bid } from '@/types/auctions'
import Link from 'next/link'
import { AxiosError } from 'axios';

export default function AuctionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session } = useSession()
  
  const { data: auction, isLoading, error } = useQuery<Auction>({
    queryKey: ['auction', id],
    queryFn: async () => {
      const response = await api.get(`/auctions/${id}`)
      return response.data
    },
    refetchInterval: 30000,
  })

  const [bids, setBids] = useState<Bid[]>([])
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleDeleteAuction = async () => {
    if (!confirm('Are you sure you want to delete this auction? This action cannot be undone.')) return;

    try {
      const response = await api.delete(`/auctions/${id}`);
      if (response.data.success) {
        alert('Auction deleted successfully');
        router.push('/auctions');
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        alert(error.response?.data?.error || 'Failed to delete auction');
      } else {
        alert('Failed to delete auction');
      }
    }
  };

  const isEnded = auction ? new Date(auction.endTime) < new Date() : false
  const isOwner = session?.user?.id === auction?.userId

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!auction || isEnded) return null
    
    const now = new Date().getTime()
    const end = new Date(auction.endTime).getTime()
    const diff = end - now
    
    if (diff <= 0) return null
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-deep-blue font-light">Loading auction details...</p>
        </div>
      </div>
    )
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🎨</div>
          <h1 className="text-2xl font-serif text-deep-blue mb-2">Auction Not Found</h1>
          <p className="text-gray-600 mb-6">The auction you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button onClick={() => router.push('/auctions')} className="bg-gold text-deep-blue hover:bg-yellow-500">
            Browse All Auctions
          </Button>
        </div>
      </div>
    )
  }

  const timeRemaining = getTimeRemaining()

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-deep-blue text-white py-4">
        <div className="container mx-auto px-4">
          <Link 
            href="/auctions"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 inline-block backdrop-blur-sm"
          >
            ← Back to Auctions
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Image Gallery Section */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="relative aspect-square">
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                      <div className="text-gray-400">Loading artwork...</div>
                    </div>
                  )}
                  <img
                    src={auction.imageUrl}
                    alt={auction.title}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
                
                {/* Image Footer */}
                <div className="p-6 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Lot #{auction.id.slice(-6).toUpperCase()}</span>
                    <span>Posted by {auction.user?.name || 'Unknown Artist'}</span>
                  </div>
                </div>
              </div>

              {/* Artwork Details */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="font-serif text-xl text-deep-blue mb-4">Artwork Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Artist</span>
                    <span className="text-deep-blue font-medium">{auction.user?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Starting Price</span>
                    <span className="text-gold font-semibold">${auction.startingPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Auction Started</span>
                    <span className="text-deep-blue">
                      {new Date(auction.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auction Details Section */}
            <div className="space-y-6">
              {/* Auction Header */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {isEnded ? (
                      <span className="bg-burgundy text-white px-4 py-2 rounded-full text-sm font-medium">
                        AUCTION ENDED
                      </span>
                    ) : (
                      <span className="bg-sage text-white px-4 py-2 rounded-full text-sm font-medium">
                        LIVE AUCTION
                      </span>
                    )}
                  </div>
                  {timeRemaining && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Time Remaining</p>
                      <p className="text-xl font-bold text-gold">{timeRemaining}</p>
                    </div>
                  )}
                </div>

                <h1 className="font-serif text-3xl text-deep-blue mb-4 leading-tight">
                  {auction.title}
                </h1>
                
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  {auction.description}
                </p>

                {/* Current Bid Display */}
                <div className="bg-gradient-to-r from-deep-blue to-burgundy rounded-xl p-6 text-white mb-6">
                  <p className="text-sm opacity-90 mb-1">CURRENT BID</p>
                  <p className="text-4xl font-light mb-2">
                    ${auction.currentBid.toLocaleString()}
                  </p>
                  <p className="text-sm opacity-80">
                    {bids.length > 0 ? `${bids.length} bids placed` : 'No bids yet'}
                  </p>
                </div>

                {/* Bid Action */}
                {!isEnded && (
                  <div className="border-t border-gray-200 pt-6">
                    <BidBox auctionId={id} currentBid={auction.currentBid} auctionOwnerId={auction.userId} />
                  </div>
                )}
              </div>

              {/* Bidding History */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="font-serif text-xl text-deep-blue mb-6">Bidding History</h3>
                
                {bids.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {bids.map((bid, index) => (
                      <div 
                        key={bid.id || index} 
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gold transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-deep-blue font-semibold text-sm">
                            {bid.user?.name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="font-medium text-deep-blue">
                              {bid.user?.name || 'Anonymous Bidder'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(bid.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gold">
                            ${bid.amount.toLocaleString()}
                          </p>
                          {index === 0 && bids.length > 1 && (
                            <p className="text-xs text-sage font-medium">Winning Bid</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💎</div>
                    <p className="text-gray-600 mb-2">No bids yet</p>
                    <p className="text-sm text-gray-500">Be the first to place a bid on this artwork</p>
                  </div>
                )}
              </div>

              {/* Owner Management Section */}
              {isOwner && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200">
                  <h3 className="font-serif text-xl text-deep-blue mb-4">Auction Management</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    This section is only visible to you as the auction owner.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAuction}
                    className="bg-burgundy hover:bg-red-800 transition-all w-full"
                  >
                    Delete Auction
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}