'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { Button } from './ui/button'
import { Input } from './ui/input'

export default function BidBox({ auctionId }: { auctionId: string }) {
  const [amount, setAmount] = useState('')

  async function placeBid() {
    await api.post(`/auctions/${auctionId}/bid`, { amount: Number(amount) })
    setAmount('')
  }

  return (
    <div className="flex gap-2 mt-4">
      <Input
        type="number"
        placeholder="Your bid"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button onClick={placeBid}>Place Bid</Button>
    </div>
  )
}
