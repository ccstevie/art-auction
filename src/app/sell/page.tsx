'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

interface AuctionForm {
  title: string
  description: string
  imageUrl: string
  startingPrice: number
  endTime: string
}

export default function SellPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState<AuctionForm>({
    title: '',
    description: '',
    imageUrl: '',
    startingPrice: 0,
    endTime: '',
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])


  const createAuctionMutation = useMutation({
    mutationFn: async (auctionData: AuctionForm) => {
      const response = await api.post('/auctions', auctionData)
      return response.data
    },
    onSuccess: () => {
      alert('Auction created successfully!')
      setForm({
        title: '',
        description: '',
        imageUrl: '',
        startingPrice: 0,
        endTime: '',
      })
      router.push('/auctions') // Redirect to auctions page
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create auction')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createAuctionMutation.mutate(form)
  }

  const handleChange = (field: keyof AuctionForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

   // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    )
  }

  // Show nothing if not authenticated (will redirect)
  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-2">Sell Your Art</h1>
          <p className="text-gray-600 mb-6">Welcome, {session.user?.name}</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Artwork Title
              </label>
              <Input
                type="text"
                placeholder="Enter a compelling title for your artwork"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                placeholder="Describe your artwork, inspiration, technique, and materials used..."
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com/your-artwork.jpg"
                value={form.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Use a high-quality image that showcases your artwork
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Starting Price ($)
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={form.startingPrice}
                  onChange={(e) => handleChange('startingPrice', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Auction End Date
                </label>
                <Input
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={createAuctionMutation.isPending}
            >
              {createAuctionMutation.isPending ? 'Creating Auction...' : 'Create Auction'}
            </Button>
          </form>

          {/* Tips Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Tips for Success:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use high-quality, well-lit photos of your artwork</li>
              <li>• Write a detailed description including dimensions and materials</li>
              <li>• Set a realistic starting price to attract bidders</li>
              <li>• Choose an end time when most collectors are active</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}