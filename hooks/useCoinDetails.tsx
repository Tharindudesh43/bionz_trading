import useSWR from "swr"
import fetcher from '@/lib/fetcher'


export const useCoinDetails = (id: string) =>{
    console.log("Fetching details for coin ID:", id);

    const apiUrl = `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`

    const {  isLoading, error, data  } = useSWR(apiUrl, fetcher)

    return{
        isLoading,
        error,
        data,
    }
}