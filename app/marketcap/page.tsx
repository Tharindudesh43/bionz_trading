"use client"
import Coins from "@/components/CoinMarkets"
import SearchBar from "@/components/SearchBar"
import {useData} from '@/hooks/useData'


export default function Home() {
  const { data, error, isLoading } = useData()

  if(error){ 
    return ( 
    <div className="text-center h-screen text-2xl p-10 mt-20 text-[#f59e0b]">Oops! <br></br> Error loading data</div>
    ) 
  }

  if(isLoading){ 
  return (  
  <div className="p-10 flex flex-col overflow-x-auto mt-10">
  <div className="sm:-mx-6 lg:-mx-8">
    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm font-light animate-pulse">
          {/* Skeleton loading rows */}
          <thead className="border-b font-medium dark:border-neutral-200 animate-pulse">
            <tr>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {/* Render skeleton loading rows */}
            {[1, 2, 3, 4, 5,6,7,8,9,10,11].map((_, index) => (
              <tr
                className="border-b dark:border-neutral-200 animate-pulse "
                key={index}
              >
                <td className="whitespace-nowrap text-neutral-300 px-6 py-4">Loading</td>
                <td className="whitespace-nowrap text-neutral-300 px-6 py-4">Loading</td>
                <td className="whitespace-nowrap text-neutral-300 px-1 py-4">Loading</td>
                <td className="whitespace-nowrap text-neutral-300 px-6 py-4">Loading</td>
                <td className="whitespace-nowrap text-neutral-300 px-6 py-4">Loading</td>
                <td className="whitespace-nowrap text-neutral-300 px-6 py-4">Loading</td>
                <td className="whitespace-nowrap text-neutral-300 px-6 py-4">Loading</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>) }


 return (
  <div className="relative w-full">

    {/* FIXED SEARCH BAR UNDER MAIN NAVBAR */}
    <div className="
      fixed 
      w-full 
      bg-[#FBFBFB] 
      z-30 
      shadow-sm
      right-0
      top-14
      sm:top-19  /* tablet + desktop */
      md:top-19   /* tablet + desktop */
      lg:top-17   /* bigger screens */
    ">
      <div className="flex items-center justify-start px-3 py-3">
        <SearchBar />
      </div>
    </div>

    {/* MAIN CONTENT */}
    <div className=" p-2">
      <Coins coin={data} />
    </div>
  </div>
);


}