'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import AuctionCard from '@/components/AuctionCard'

export default function AuctionsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['auctions'],
    queryFn: async () => (await api.get('/auctions')).data,
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data?.map((auction: any) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
    </div>
  )
}
