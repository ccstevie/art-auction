// src/types/auction.ts
export interface Bid {
  id: string;
  amount: number;
  userId: string;
  user?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  currentBid: number;
  startingPrice: number;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  bids: Bid[];
  status: 'active' | 'ended' | 'upcoming';
}

export interface BidRequest {
  amount: number;
  auctionId: string;
}