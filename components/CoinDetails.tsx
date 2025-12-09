import { CoinDetails } from "@/types/coinDetails";
import Image from "next/image";
import alt from "@/assets/alt coin.jpg" with { type: "image" };
import MarketChart from "@/components/MarketChart";
import { FiArrowLeft } from "react-icons/fi";

export async function CoinPage({ promise }: { promise: Promise<CoinDetails> }) {
  const details = await promise;

  return (
    <div className="mt-15 relative bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Back Button */}
      <nav className="fixed p-4 left-1 z-50 ">
        <button
          onClick={() => window.history.back()}
          className="flex items-center px-4 py-2 bg-[#f59e0b] cursor-pointer text-white rounded-full shadow-md hover:bg-[#d97706] transition"
        >
          <FiArrowLeft className="mr-2" size={20} />
          Back
        </button>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6 pt-20">
        {/* Coin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
          <Image
            src={details.image}
            alt={details.name}
            width={50}
            height={50}
            className="rounded-full shadow-sm"
          />
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <span>{details.name}</span>
              <span className="text-lg font-light text-gray-500 dark:text-gray-400">
                ({details.symbol.toUpperCase()})
              </span>{" "}
            </h1>
            <p className="mt-1 text-sm bg-orange-500 font-bold text-white inline-block px-2 py-1 rounded-lg">
              Rank {details.market_cap_rank.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-6">
          <p className="text-2xl font-bold">
            ${details.market_data.current_price.usd.toLocaleString()}
          </p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Stats */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <ul className="space-y-2">
              <li>
                <span className="font-semibold">Market Cap:</span> $
                {details.market_data.market_cap.usd.toLocaleString()}
              </li>
              <li>
                <span className="font-semibold">Circulating Supply:</span>{" "}
                {details.market_data.circulating_supply.toLocaleString()}
              </li>
              <li>
                <span className="font-semibold">Fully Diluted Valuation:</span>{" "}
                $
                {details.market_data.fully_diluted_valuation.usd.toLocaleString()}
              </li>
              <li>
                <span
                  className={
                    details.market_data.market_cap_change_percentage_24h
                      .toFixed(1)
                      .startsWith("-")
                      ? "font-semibold text-red-500"
                      : "font-semibold text-green-500"
                  }
                >
                  Market Cap Change (24h):
                </span>{" "}
                {details.market_data.market_cap_change_percentage_24h.toFixed(
                  1
                )}
                %
              </li>
            </ul>
          </div>

          {/* Right Stats */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <ul className="space-y-2">
              <li>
                <span className="font-semibold">Max Supply:</span>{" "}
                {details.market_data.max_supply?.toLocaleString() || "N/A"}
              </li>
              <li>
                <span
                  className="
                font-semibold"
                >
                  Price Change % (24h):
                </span>{" "}
                {details.market_data.price_change_percentage_24h.toFixed(1)}%
              </li>
              <li>
                <span className="font-semibold">Total Supply:</span>{" "}
                {details.market_data.total_supply.toLocaleString()}
              </li>
              <li>
                <span className="font-semibold">Total Volume:</span> $
                {details.market_data.total_volume.usd.toLocaleString()}
              </li>
            </ul>
          </div>
        </div>

        {/* Coin Information */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6">
          <h3 className="text-xl font-bold mb-2">Information</h3>
          <a
            href={details.links.homepage[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Visit {details.name}'s Website
          </a>
        </div>

        {/* Market Chart */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
          <h3 className="text-xl font-bold mb-2">Market Chart</h3>
          <MarketChart id={details.id} />
        </div>
      </div>
    </div>
  );
}
