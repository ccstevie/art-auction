'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { BidRequest } from '@/types/auctions'

interface BidBoxProps {
  auctionId: string;
  currentBid: number;
  auctionOwnerId?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export default function BidBox({ auctionId, currentBid, auctionOwnerId }: BidBoxProps) {
  const [amount, setAmount] = useState('')
  const queryClient = useQueryClient()
  const { data: session, status } = useSession()
  const router = useRouter()

  // Check if current user is the auction owner
  const isOwner = session?.user?.id === auctionOwnerId
  const isAuthenticated = status === 'authenticated'
  const isLoadingAuth = status === 'loading'

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
    onError: (error: ApiError) => {
      alert(error.response?.data?.message || 'Failed to place bid')
    }
  })

  const handlePlaceBid = () => {
    const bidAmount = Number(amount)
    
    if (bidAmount <= currentBid) {
      alert(`Bid must be higher than current bid of $${currentBid}`)
      return
    }

    bidMutation.mutate({ amount: bidAmount, auctionId })
  }

  const handleSignInRedirect = () => {
    router.push('/login?callbackUrl=' + encodeURIComponent(window.location.href))
  }

  // Show loading while checking authentication
  if (isLoadingAuth) {
    return (
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600 text-sm">Checking authentication...</p>
      </div>
    )
  }

  // If user is not authenticated, show sign in prompt
  if (!isAuthenticated) {
    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm font-medium mb-2">
          Sign in to place a bid
        </p>
        <p className="text-blue-600 text-xs mb-3">
          You must be signed in to participate in auctions.
        </p>
        <Button 
          onClick={handleSignInRedirect}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Sign In to Bid
        </Button>
      </div>
    )
  }

  // If user is the auction owner, show message instead of bid form
  if (isOwner) {
    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm font-medium">
          This is your auction. You cannot place bids on your own artwork.
        </p>
        <p className="text-blue-600 text-xs mt-1">
          Monitor the bidding activity and manage your auction from this page.
        </p>
      </div>
    )
  }

  // Authenticated user who is not the owner - show bid form
  return (
    <div className="mt-4">
      <div className="flex gap-2">
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
      <p className="text-xs text-gray-500 mt-2">
        You are signed in as {session.user?.name || session.user?.email}
      </p>
    </div>
  )
}