"use client"

import { useState, useEffect } from 'react';
import Image from "next/image";
import { AuroraBackground } from '@/components/ui/shadcn-io/aurora-background';
import { Navbar02 } from '@/components/ui/shadcn-io/navbar-02';
import landing_main_image from "@/public/landing_main_image.png";
import Footer from "@/components/footer";
import { Input } from '@/components/ui/input';
import { NewsCard } from '@/components/newscard';

export default function News() {
  const newsItems = [
  {
    imageUrl: 'https://picsum.photos/id/1/200/300',
    title: 'Genius Group: How a BTC Treasury Can Help Solve Humanity\'s Final Exam',
    source: 'Sponsored by Genius',
    date: 'Oct 30, 2025',
    href: '/news/genius-group-btc-treasury',
  },
  {
    imageUrl: 'https://picsum.photos/id/2/200/300',
    title: 'Paxos Acquires Crypto Wallet Startup Fordefi to Expand Custody Services',
    href: '/news/paxos-acquires-fordefi',
  },
  {
    imageUrl: 'https://picsum.photos/id/3/200/300',
    title: 'Swedish Buy Now, Pay Later Giant Klarna Rolling Out Stablecoin with Stripe\'s Bridge',
    href: '/news/klarna-stablecoin',
  },
  {
    imageUrl: 'https://picsum.photos/id/4/200/300',
    title: 'Still Jittery: Crypto Daybook Americas',
    href: '/news/crypto-daybook-americas',
  },
  {
    imageUrl: 'https://picsum.photos/id/5/200/300',
    title: 'Private Equity Firm Bridgepoint to Buy Majority of Crypto Audit Specialist ht.digital',
    href: '/news/bridgepoint-ht-digital',
  },
  {
    imageUrl: 'https://picsum.photos/id/6/200/300',
    title: 'The $1.7B Bitcoin Bet on Rally Above $100K, But Not Reaching New Record Highs',
    href: '/news/bitcoin-bet-100k',
  },
];
const [loading, setLoading] = useState(true);


  
  
  return (
<>
 <div className="flex flex-col items-center py-12 px-4  dark:bg-gray-900 min-h-fit">
      <div className="w-full max-w-5xl mt-10">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
           <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Latest News</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsItems.map((item, index) => (
          <NewsCard
            key={index}
            imageUrl={item.imageUrl}
            title={item.title}
            source={item.source}
            date={item.date}
            href={item.href}
          />
        ))}
      </div>
    </div>
          </div>
        </div>
      </div>
      </div>
</>
  );
}
