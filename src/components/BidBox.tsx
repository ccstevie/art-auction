'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { BidRequest } from '@/types/auctions'

interface BidBoxProps {
  auctionId: string;
  currentBid: number;
}

// Add proper error type
interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export default function BidBox({ auctionId, currentBid }: BidBoxProps) {
  const [amount, setAmount] = useState('')
  const queryClient = useQueryClient()

  const bidMutation = useMutation({
    mutationFn: async (bidData: BidRequest) => {
      const response = await api.post(`/auctions/${auctionId}/bid`, bidData)
      return response.data
    },
    onSuccess: () => {
      setAmount('')
      // Invalidate and refetch auction data
      queryClient.invalidateQueries({ queryKey: ['auction', auctionId] })
    },
    onError: (error: ApiError) => { // Fixed: replaced 'any' with proper type
      alert(error.response?.data?.message || 'Failed to place bid')
    }
  })

  function handlePlaceBid() {
    const bidAmount = Number(amount)
    
    if (bidAmount <= currentBid) {
      alert(`Bid must be higher than current bid of $${currentBid}`)
      return
    }

    bidMutation.mutate({ amount: bidAmount, auctionId })
  }

  return (
    <div className="flex gap-2 mt-4">
      <Input
        type="number"
        placeholder={`Min: $${currentBid + 1}`}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min={currentBid + 1}
        step="1"
      />
      <Button 
        onClick={handlePlaceBid}
        disabled={bidMutation.isPending || !amount}
        className="transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
      >
        {bidMutation.isPending ? 'Placing...' : 'Place Bid'}
      </Button>
    </div>
  )
}