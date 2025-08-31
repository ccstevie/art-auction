import Link from 'next/link'
import { Button } from './ui/button'

export default function Navbar() {
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
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
      </div>
    </nav>
  )
}
