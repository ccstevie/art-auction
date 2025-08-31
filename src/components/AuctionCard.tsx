import { Card, CardContent } from './ui/card'
import Link from 'next/link'

export default function AuctionCard({ auction }: { auction: any }) {
  return (
    <Link href={`/auctions/${auction.id}`}>
      <Card className="hover:shadow-lg transition">
        <img
          src={auction.imageUrl}
          alt={auction.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg">{auction.title}</h3>
          <p className="text-gray-600">Current Bid: ${auction.currentBid}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
