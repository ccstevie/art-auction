'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { AxiosError } from 'axios';

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
  const [isUploading, setIsUploading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file) // Changed from 'image' to 'file'

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      if (result.success) {
        setForm(prev => ({ ...prev, imageUrl: result.imageUrl })) // Use result.imageUrl
      } else {
        alert(result.error || 'Failed to upload image')
      }
    } catch (error) {
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

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
      router.push('/auctions')
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      alert(error.response?.data?.message || 'Failed to create auction')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.imageUrl) {
      alert('Please upload an image first')
      return
    }
    
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
                Artwork Image
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                required
              />
              {isUploading && (
                <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
              )}
              {form.imageUrl && !isUploading && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">✓ Image uploaded successfully</p>
                  <img 
                    src={form.imageUrl} 
                    alt="Preview" 
                    className="mt-2 h-32 w-32 object-cover rounded border"
                  />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Upload a high-quality image of your artwork (max 5MB)
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
              disabled={createAuctionMutation.isPending || !form.imageUrl}
            >
              {createAuctionMutation.isPending ? 'Creating Auction...' : 'Create Auction'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}