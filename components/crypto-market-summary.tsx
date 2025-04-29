"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

interface CryptoData {
  name: string
  symbol: string
  price: number
  change: number
}

export default function CryptoMarketSummary() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        // Fetch data from CoinGecko API
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano,dogecoin&vs_currencies=usd&include_24hr_change=true",
        )

        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        const data = await response.json()

        // Transform the data
        const formattedData: CryptoData[] = [
          {
            name: "Bitcoin",
            symbol: "BTC",
            price: data.bitcoin.usd,
            change: data.bitcoin.usd_24h_change,
          },
          {
            name: "Ethereum",
            symbol: "ETH",
            price: data.ethereum.usd,
            change: data.ethereum.usd_24h_change,
          },
          {
            name: "Solana",
            symbol: "SOL",
            price: data.solana.usd,
            change: data.solana.usd_24h_change,
          },
          {
            name: "Cardano",
            symbol: "ADA",
            price: data.cardano.usd,
            change: data.cardano.usd_24h_change,
          },
          {
            name: "Dogecoin",
            symbol: "DOGE",
            price: data.dogecoin.usd,
            change: data.dogecoin.usd_24h_change,
          },
        ]

        setCryptoData(formattedData)
      } catch (err) {
        console.error("Error fetching crypto data:", err)
        setError("Failed to load market data. Using fallback data.")

        // Use fallback data if API fails
        setCryptoData([
          { name: "Bitcoin", symbol: "BTC", price: 65432.1, change: 2.5 },
          { name: "Ethereum", symbol: "ETH", price: 3456.78, change: -1.2 },
          { name: "Solana", symbol: "SOL", price: 123.45, change: 5.7 },
          { name: "Cardano", symbol: "ADA", price: 0.45, change: 0.8 },
          { name: "Dogecoin", symbol: "DOGE", price: 0.12, change: -3.2 },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Summary</CardTitle>
          <CardDescription>Loading latest cryptocurrency prices...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse"></div>
                </div>
                <div className="text-right">
                  <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Summary</CardTitle>
        <CardDescription>{error ? error : "Latest cryptocurrency prices and changes"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cryptoData.map((crypto) => (
            <div key={crypto.symbol} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{crypto.name}</p>
                <p className="text-sm text-gray-500">{crypto.symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  $
                  {crypto.price.toLocaleString(undefined, {
                    minimumFractionDigits: crypto.price < 1 ? 4 : 2,
                    maximumFractionDigits: crypto.price < 1 ? 4 : 2,
                  })}
                </p>
                <p className={`text-sm flex items-center ${crypto.change > 0 ? "text-green-500" : "text-red-500"}`}>
                  {crypto.change > 0 ? (
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(crypto.change).toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
