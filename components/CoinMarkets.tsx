import Image from "next/image";
import Link from "next/link";
import alt from "@/assets/alt coin.jpg";
import { CoinMarkets } from "@/types/coinMarkets";

interface Coins {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap_rank: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

interface Props {
  coin: CoinMarkets[];
}

export default function Coins({ coin }: Props) {
  return (
    <div className="p-2 sm:p-4 lg:p-8 mt-27">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
      <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">
        <tr>
          <th className="px-3 py-2 text-left">#</th>
          <th className="px-3 py-2"></th>
          <th className="px-3 py-2 text-left">Coin</th>
          <th className="px-3 py-2 text-right hidden sm:table-cell">Price</th>
          <th className="px-3 py-2 text-right hidden md:table-cell">Market Cap</th>
          <th className="px-3 py-2 text-right hidden md:table-cell">Total Volume</th>
          <th className="px-3 py-2 text-right">24h</th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {coin.map((coin) => (
          <tr
            key={coin.id}
            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <td className="px-3 py-2 font-medium">{coin.market_cap_rank}</td>
            <td className="px-3 py-2">
              <Image
                src={coin.image || "/placeholder.png"}
                alt={coin.name}
                width={30}
                height={30}
                className="rounded-full"
              />
            </td>
            <td className="px-3 py-2">
              <Link
                href={`/coins/${coin.id}`}
                className="flex flex-col sm:flex-row sm:items-center hover:underline"
              >
                <span className="font-medium">{coin.name}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-0 sm:ml-2 uppercase">
                  {coin.symbol}
                </span>
              </Link>
            </td>
            <td className="px-3 py-2 text-right hidden sm:table-cell">
              ${coin.current_price.toLocaleString()}
            </td>
            <td className="px-3 py-2 text-right hidden md:table-cell">
              ${coin.market_cap.toLocaleString()}
            </td>
            <td className="px-3 py-2 text-right hidden md:table-cell">
              ${coin.total_volume.toLocaleString()}
            </td>
            <td
              className={`px-3 py-2 text-right font-semibold ${
                coin.price_change_percentage_24h >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {coin.price_change_percentage_24h.toFixed(1)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
}