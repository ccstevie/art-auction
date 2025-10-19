'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AuctionCard from '@/components/AuctionCard'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Auction } from '@/types/auctions'

export default function HomePage() {
  const { data: auctions, isLoading } = useQuery<Auction[]>({
    queryKey: ['latestAuctions'],
    queryFn: async () => {
      const res = await api.get('/auctions?limit=6')
      return res.data
    },
  })

  // Remove the minimal Auction type and placeholder auctions 
  // since our mock API now returns full data

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 gap-6">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-black mt-9">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Featured Artwork"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-light mb-6 tracking-tight">
            Extraordinary Art
          </h1>
          <p className="text-lg md:text-xl mb-8 font-light max-w-2xl mx-auto">
            Discover and bid on exceptional works from emerging and established artists
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auctions">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                View Current Auctions
              </Button>
            </Link>
            <Link href="/sell">
              <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-100">
                Sell Your Art
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-6xl">
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold">Fast & Fair Bidding</h3>
            <p className="text-gray-600 mt-2">
              All bids processed in real-time with strict transaction handling.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold">Secure Payments</h3>
            <p className="text-gray-600 mt-2">
              Powered by Stripe Connect for safe and compliant payouts.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold">Global Artists</h3>
            <p className="text-gray-600 mt-2">
              Showcase your art to collectors from all around the world.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Auctions Section */}
      <section className="mt-12 w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">Latest Auctions</h2>
        {isLoading ? (
          <div className="flex justify-center">
            <p className="text-lg">Loading auctions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {auctions?.map((auction: Auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}