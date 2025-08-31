'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { socket } from '@/lib/socket'
import BidBox from '@/components/BidBox'

export default function AuctionDetail({ params }: { params: { id: string } }) {
  const { data: auction } = useQuery({
    queryKey: ['auction', params.id],
    queryFn: async () => (await api.get(`/auctions/${params.id}`)).data,
  })

  const [bids, setBids] = useState<any[]>([])

  useEffect(() => {
    socket.emit('joinAuction', params.id)
    socket.on('bid:new', (bid: any) => setBids((prev) => [bid, ...prev]))

    return () => {
      socket.emit('leaveAuction', params.id)
      socket.off('bid:new')
    }
  }, [params.id])

  if (!auction) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold">{auction.title}</h1>
      <p className="text-gray-600">{auction.description}</p>
      <p className="mt-2 font-semibold">Current Bid: ${auction.currentBid}</p>

      <BidBox auctionId={auction.id} />

      <h2 className="mt-6 text-xl font-semibold">Live Bids</h2>
      <ul className="list-disc pl-6">
        {bids.map((b, i) => (
          <li key={i}>{b.user}: ${b.amount}</li>
        ))}
      </ul>
    </div>
  )
}
