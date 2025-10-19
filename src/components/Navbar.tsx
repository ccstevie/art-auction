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
    <nav className="flex justify-between items-center px-6 py-4 bg-deep-blue text-white shadow-lg">
      <Link href="/" className="text-xl font-serif font-normal tracking-wider hover:text-gold transition-colors">
        ART AUCTION
      </Link>
      
      <div className="flex gap-6 items-center">
        <Link href="/auctions" className="text-sm font-light hover:text-gold transition-all duration-200 py-2 px-3 rounded-lg hover:bg-white/10">
          Auctions
        </Link>
        
        {isLoading ? (
          <div className="text-sm text-gray-300">Loading...</div>
        ) : isAuthenticated ? (
          <>
            <Link href="/sell" className="text-sm font-light hover:text-gold transition-all duration-200 py-2 px-3 rounded-lg hover:bg-white/10">
              Sell
            </Link>
            <Link href="/dashboard" className="text-sm font-light hover:text-gold transition-all duration-200 py-2 px-3 rounded-lg hover:bg-white/10">
              Account
            </Link>
            <Button 
              variant="ghost" 
              onClick={handleSignOut} 
              className="hover:bg-burgundy hover:text-white transition-all text-sm text-white border-white"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <div className="flex gap-3">
            <Link href="/login" className="text-sm font-light hover:text-gold transition-all duration-200 py-2 px-3 rounded-lg hover:bg-white/10">
              Sign In
            </Link>
            <Link href="/register" className="text-sm bg-gold text-deep-blue py-2 px-4 rounded-lg hover:bg-yellow-500 transition-all duration-200 font-medium">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}