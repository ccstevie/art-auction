'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    await signIn('github', { callbackUrl: '/dashboard' })
    
    setIsLoading(false)
  }

  const handleOAuthLogin = (provider: string) => {
    setIsLoading(true)
    signIn(provider, { callbackUrl: '/dashboard' })
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
          
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={true}
            >
              Email Login (Coming Soon)
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => handleOAuthLogin('github')}
              className="w-full bg-gray-800 hover:bg-gray-900"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign in with GitHub'}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Demo:</strong> Use GitHub OAuth for now
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}