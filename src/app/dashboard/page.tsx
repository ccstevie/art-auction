'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session.user?.name}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>My Auctions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-gray-600">Active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-gray-600">Bids placed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Won Auctions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-gray-600">Artworks won</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>My Active Auctions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-semibold">Sunset Painting</p>
                  <p className="text-sm text-gray-600">Current bid: $450</p>
                </div>
                <Button size="sm">View</Button>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-semibold">Abstract Art</p>
                  <p className="text-sm text-gray-600">Current bid: $320</p>
                </div>
                <Button size="sm">View</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-semibold">Mountain Landscape</p>
                  <p className="text-sm text-gray-600">Your bid: $250</p>
                </div>
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Outbid
                </span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-semibold">Portrait Series</p>
                  <p className="text-sm text-gray-600">Your bid: $180</p>
                </div>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  Leading
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}