// app/page.js
import SignalCard from '@/components/signalCard'; // Assuming your component path is correct

// Sample Data (using the same data for both cards for demonstration)
const signalData = [
    {
  type: 'BUY',
  status: 'Deactive',
  symbol: 'BTC/USDT',
  timeAgo: '2 hours Ago',
  leverage: '10X',
  entryPrice: '$2.5-7.5',
  exitPrice: '$3.0-5.0',
  stopLoss: '$2.22-3.25',
  profitPercentage: '50',
  winCount: 2,
  lossCount: 5,
  date: '2025.10.11',
},
{
  type: 'SELL',
  status: 'Active',
  symbol: 'BTC/USDT',
  timeAgo: '2 hours Ago',
  leverage: '10X',
  entryPrice: '$2.5-7.5',
  exitPrice: '$3.0-5.0',
  stopLoss: '$2.22-3.25',
  profitPercentage: '100',
  winCount: 2,
  lossCount: 5,
  date: '2025.10.11',
},
{
  type: 'BUY',
  status: 'Deactive',
  symbol: 'BTC/USDT',
  timeAgo: '2 hours Ago',
  leverage: '10X',
  entryPrice: '$2.5-7.5',
  exitPrice: '$3.0-5.0',
  stopLoss: '$2.22-3.25',
  profitPercentage: '100',
  winCount: 2,
  lossCount: 5,
  date: '2025.10.11',
},{
  type: 'SELL',
  status: 'Deactive',
  symbol: 'BTC/USDT',
  timeAgo: '2 hours Ago',
  leverage: '10X',
  entryPrice: '$2.5-7.5',
  exitPrice: '$3.0-5.0',
  stopLoss: '$2.22-3.25',
  profitPercentage: '100',
  winCount: 2,
  lossCount: 10,
  date: '2025.10.11',
}
];

export default function Home() {
  return (
    // Updated container class:
    // 1. Removed min-h-screen so the container only takes up the necessary height.
    // 2. Added 'flex-col' to stack the cards vertically.
    // 3. Added 'gap-y-6' for vertical spacing between the cards.
    // 4. Added 'py-8' to ensure spacing at the top and bottom of the content.
    <div className="flex flex-col items-center bg-gray-50 p-4 py-8 gap-y-6 min-h-screen">
      {
        signalData.map((signal, index) => (
            <SignalCard signal={signal} key={index} />
        ))
      }
    </div>
  );
}