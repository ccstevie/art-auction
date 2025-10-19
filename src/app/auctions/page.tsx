'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import AuctionCard from '@/components/AuctionCard'
import { Auction } from '@/types/auctions'

export default function AuctionsPage() {
  const { data: auctions, isLoading, error } = useQuery<Auction[]>({
    queryKey: ['auctions'],
    queryFn: async () => {
      const response = await api.get('/auctions')
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading auctions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">Failed to load auctions</p>
      </div>
    )
  }

  if (!auctions?.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">No auctions available</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Current Auctions</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {auctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  )
}