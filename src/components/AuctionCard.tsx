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
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 cursor-pointer transform hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img
            src={auction.imageUrl}
            alt={auction.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {isEnded && (
            <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 text-xs tracking-wide rounded">
              AUCTION ENDED
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white text-sm font-light">
              Current Bid: <span className="font-medium">${auction.currentBid}</span>
            </p>
          </div>
        </div>
        <CardContent className="p-4 group-hover:bg-gray-50 transition-colors duration-200">
          <h3 className="font-light text-lg mb-2 tracking-wide group-hover:text-gray-800 transition-colors">
            {auction.title}
          </h3>
          <p className="text-gray-600 text-sm font-light group-hover:text-gray-700 transition-colors">
            Ends {new Date(auction.endTime).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}