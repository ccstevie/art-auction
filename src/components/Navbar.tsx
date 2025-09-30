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
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <Link href="/" className="text-xl font-bold">Art Auction</Link>
      <div className="flex gap-2">
        <Link href="/auctions">
          <Button variant="outline">Browse Auctions</Button>
        </Link>
        <Link href="/sell">
          <Button>Sell Art</Button>
        </Link>
        
        {isLoading ? (
          <Button variant="ghost" disabled>Loading...</Button>
        ) : isAuthenticated ? (
          <>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}