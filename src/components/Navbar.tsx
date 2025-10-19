'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { useAuth } from '@/hooks/use-auth'
import { signOut } from 'next-auth/react'

export default function Navbar() {
  const { isAuthenticated, isLoading } = useAuth()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-sm border-b">
      <Link href="/" className="text-xl font-serif font-normal tracking-wider hover:opacity-70 transition-opacity">
        ART AUCTION
      </Link>
      
      <div className="flex gap-6 items-center">
        <Link href="/auctions" className="text-sm font-light hover:text-gray-600 transition-all duration-200 py-2 px-3 rounded-lg hover:bg-gray-50">
          Auctions
        </Link>
        
        {isLoading ? (
          <div className="text-sm text-gray-400">Loading...</div>
        ) : isAuthenticated ? (
          <>
            <Link href="/sell" className="text-sm font-light hover:text-gray-600 transition-all duration-200 py-2 px-3 rounded-lg hover:bg-gray-50">
              Sell
            </Link>
            <Link href="/dashboard" className="text-sm font-light hover:text-gray-600 transition-all duration-200 py-2 px-3 rounded-lg hover:bg-gray-50">
              Account
            </Link>
            <Button 
              variant="ghost" 
              onClick={handleSignOut} 
              className="hover:bg-red-50 hover:text-red-600 transition-all text-sm"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <div className="flex gap-3">
            <Link href="/login" className="text-sm font-light hover:text-gray-600 transition-all duration-200 py-2 px-3 rounded-lg hover:bg-gray-50">
              Sign In
            </Link>
            <Link href="/register" className="text-sm bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all duration-200">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}