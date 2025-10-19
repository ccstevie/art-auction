import { Card, CardContent } from './ui/card'
import Link from 'next/link'
import { Auction } from '@/types/auctions'

interface AuctionCardProps {
  auction: Auction;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const isEnded = new Date(auction.endTime) < new Date();
  const isEndingSoon = () => {
    const hoursLeft = (new Date(auction.endTime).getTime() - Date.now()) / (1000 * 60 * 60);
    return hoursLeft < 24 && !isEnded;
  };
  
  return (
    <Link href={`/auctions/${auction.id}`}>
      <Card className="group relative overflow-hidden bg-white border border-gray-200 hover:border-gold transition-all duration-500 hover:shadow-2xl cursor-pointer transform hover:-translate-y-2">
        {/* Image Container with Professional Frame */}
        <div className="relative overflow-hidden bg-gray-100">
          <div className="aspect-square overflow-hidden">
            <img
              src={auction.imageUrl}
              alt={auction.title}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
          
          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isEnded ? (
              <div className="bg-burgundy text-white px-3 py-1 text-xs font-medium tracking-wide rounded-full shadow-lg">
                AUCTION ENDED
              </div>
            ) : isEndingSoon() ? (
              <div className="bg-gold text-deep-blue px-3 py-1 text-xs font-medium tracking-wide rounded-full shadow-lg">
                ENDING SOON
              </div>
            ) : (
              <div className="bg-sage text-white px-3 py-1 text-xs font-medium tracking-wide rounded-full shadow-lg">
                LIVE NOW
              </div>
            )}
          </div>

          {/* Bid Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white text-xs font-light opacity-90">CURRENT BID</p>
                <p className="text-gold text-lg font-semibold tracking-tight">
                  ${auction.currentBid.toLocaleString()}
                </p>
              </div>
              {!isEnded && (
                <div className="text-right">
                  <p className="text-white text-xs font-light opacity-90">STARTING PRICE</p>
                  <p className="text-white text-sm font-medium">
                    ${auction.startingPrice.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              <div className="bg-white/95 text-deep-blue px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                View Details →
              </div>
            </div>
          </div>
        </div>

        {/* Content with Professional Typography */}
        <CardContent className="p-5 group-hover:bg-cream/30 transition-colors duration-300">
          <h3 className="font-serif text-lg font-normal text-deep-blue mb-2 leading-tight line-clamp-2 group-hover:text-burgundy transition-colors">
            {auction.title}
          </h3>
          
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-600">
              <p className="font-light">
                {isEnded ? 'Ended' : 'Ends'} {new Date(auction.endTime).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              {!isEnded && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(auction.endTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
            
            {/* Bid Count */}
            {auction.bids && auction.bids.length > 0 && (
              <div className="text-right">
                <p className="text-xs text-gray-500 font-light">BIDS</p>
                <p className="text-gold font-medium">{auction.bids.length}</p>
              </div>
            )}
          </div>

          {/* Progress Bar for Time Remaining */}
          {!isEnded && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-gold h-1 rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.max(10, 100 - ((new Date(auction.endTime).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)) * 100)}%`
                  }}
                ></div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Subtle Corner Accents */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Card>
    </Link>
  )
}