import { Card, CardContent } from './ui/card'
import Link from 'next/link'
import { Auction } from '@/types/auctions'

interface AuctionCardProps {
  auction: Auction;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const isEnded = new Date(auction.endTime) < new Date();
  
  return (
    <Link href={`/auctions/${auction.id}`}>
      <Card className={`hover:shadow-lg transition ${isEnded ? 'opacity-60' : ''}`}>
        <div className="relative">
          <img
            src={auction.imageUrl}
            alt={auction.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {isEnded && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              Ended
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">{auction.title}</h3>
          <p className="text-gray-600 font-medium">
            Current Bid: ${auction.currentBid}
          </p>
          {!isEnded && (
            <p className="text-sm text-gray-500 mt-1">
              Ends: {new Date(auction.endTime).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}