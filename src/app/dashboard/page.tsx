'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { signOut } from 'next-auth/react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface DashboardData {
  stats: {
    activeAuctions: number
    totalBids: number
    wonAuctions: number
  }
  userAuctions: Array<{
    id: string
    title: string
    currentBid: number
    status: string
    bids: Array<{
      amount: number
      userId: string
    }>
  }>
  recentBids: Array<{
    id: string
    amount: number
    createdAt: string
    auction: {
      id: string
      title: string
      currentBid: number
      status: string
    }
  }>
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const { data: dashboardData, isLoading: isDataLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/dashboard')
      return response.data
    },
    enabled: status === 'authenticated'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading' || isDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif text-gray-900">Dashboard</h1>
              <p className="text-gray-600 font-light">Welcome back, {session.user?.name}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="border-gray-300 text-gray-700 hover:bg-gray-50/80 backdrop-blur-sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Active Auctions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-light text-gray-900 mb-1">
                {dashboardData?.stats.activeAuctions || 0}
              </p>
              <p className="text-sm text-gray-500">Currently listed artworks</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Total Bids
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-light text-gray-900 mb-1">
                {dashboardData?.stats.totalBids || 0}
              </p>
              <p className="text-sm text-gray-500">Bids placed across all auctions</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Won Auctions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-light text-gray-900 mb-1">
                {dashboardData?.stats.wonAuctions || 0}
              </p>
              <p className="text-sm text-gray-500">Successful acquisitions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Active Auctions */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30">
            <CardHeader className="border-b border-gray-100/60 pb-4">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center justify-between">
                <span>My Active Auctions</span>
                <span className="text-sm font-normal text-gray-500 bg-gray-100/80 px-2 py-1 rounded backdrop-blur-sm">
                  {dashboardData?.userAuctions?.filter(a => a.status === 'ACTIVE').length || 0}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {dashboardData?.userAuctions && dashboardData.userAuctions.filter(auction => auction.status === 'ACTIVE').length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.userAuctions
                    .filter(auction => auction.status === 'ACTIVE')
                    .slice(0, 4)
                    .map((auction) => (
                      <div key={auction.id} className="flex justify-between items-center p-3 border border-gray-100/60 rounded-lg hover:bg-white/60 transition-all duration-200 backdrop-blur-sm bg-white/30">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{auction.title}</p>
                          <p className="text-sm text-gray-600">Current bid: <span className="font-semibold text-green-600">${auction.currentBid.toLocaleString()}</span></p>
                        </div>
                        <Link href={`/auctions/${auction.id}`}>
                          <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 bg-white/80 backdrop-blur-sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white/30 rounded-lg backdrop-blur-sm">
                  <div className="text-4xl text-gray-300/80 mb-3">🎨</div>
                  <p className="text-gray-500 mb-2">No active auctions</p>
                  <p className="text-sm text-gray-400 mb-4">Start selling your artwork today</p>
                </div>
              )}
              <div className="mt-6 pt-4 border-t border-gray-100/60">
                <Link href="/sell">
                  <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 backdrop-blur-sm">
                    Create New Auction
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bids */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30">
            <CardHeader className="border-b border-gray-100/60 pb-4">
              <CardTitle className="text-lg font-medium text-gray-900">
                Recent Bidding Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {dashboardData?.recentBids && dashboardData.recentBids.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentBids.map((bid) => (
                    <div key={bid.id} className="flex justify-between items-center p-3 border border-gray-100/60 rounded-lg hover:bg-white/60 transition-all duration-200 backdrop-blur-sm bg-white/30">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{bid.auction.title}</p>
                        <p className="text-sm text-gray-600">
                          Your bid: <span className="font-semibold">${bid.amount.toLocaleString()}</span>
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm ${
                        bid.auction.status === 'ENDED' 
                          ? 'bg-gray-100/80 text-gray-700'
                          : bid.amount >= bid.auction.currentBid
                          ? 'bg-green-100/80 text-green-800'
                          : 'bg-orange-100/80 text-orange-800'
                      }`}>
                        {bid.auction.status === 'ENDED' 
                          ? 'Ended' 
                          : bid.amount >= bid.auction.currentBid
                          ? 'Winning'
                          : 'Outbid'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white/30 rounded-lg backdrop-blur-sm">
                  <div className="text-4xl text-gray-300/80 mb-3">💎</div>
                  <p className="text-gray-500 mb-2">No recent bids</p>
                  <p className="text-sm text-gray-400">Start exploring available auctions</p>
                </div>
              )}
              <div className="mt-6 pt-4 border-t border-gray-100/60">
                <Link href="/auctions">
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50/80 backdrop-blur-sm">
                    Browse All Auctions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}