"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PriceData {
  timestamp: number
  price: number
}

interface CryptoPriceChartProps {
  initialCrypto?: string
}

export default function CryptoPriceChart({ initialCrypto = "bitcoin" }: CryptoPriceChartProps) {
  const [selectedCrypto, setSelectedCrypto] = useState(initialCrypto)
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Fetch price data from CoinGecko
  useEffect(() => {
    async function fetchPriceData() {
      try {
        setIsLoading(true)
        // Get 30 days of price data
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart?vs_currency=usd&days=30&interval=daily`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch price data")
        }

        const data = await response.json()

        // Transform the data
        const formattedData: PriceData[] = data.prices.map((item: [number, number]) => ({
          timestamp: item[0],
          price: item[1],
        }))

        setPriceData(formattedData)
        setError(null)
      } catch (err) {
        console.error("Error fetching price data:", err)
        setError("Failed to load price data. Using mock data.")

        // Generate mock data as fallback
        const now = Date.now()
        const mockData: PriceData[] = []

        // Generate price data for the last 30 days
        for (let i = 30; i >= 0; i--) {
          const timestamp = now - i * 24 * 60 * 60 * 1000
          let basePrice = 0

          switch (selectedCrypto) {
            case "bitcoin":
              basePrice = 65000
              break
            case "ethereum":
              basePrice = 3500
              break
            case "solana":
              basePrice = 120
              break
            case "cardano":
              basePrice = 0.45
              break
            case "dogecoin":
              basePrice = 0.12
              break
            default:
              basePrice = 1000
          }

          // Add some randomness to the price
          const randomFactor = 0.05 // 5% variation
          const randomVariation = basePrice * randomFactor * (Math.random() * 2 - 1)
          const price = basePrice + randomVariation

          mockData.push({ timestamp, price })
        }

        setPriceData(mockData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPriceData()
  }, [selectedCrypto])

  // Draw the chart
  useEffect(() => {
    if (canvasRef.current && priceData.length > 0) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Set up the chart
        const padding = 40
        const chartWidth = canvas.width - padding * 2
        const chartHeight = canvas.height - padding * 2

        // Find min and max prices
        const prices = priceData.map((d) => d.price)
        const minPrice = Math.min(...prices) * 0.95
        const maxPrice = Math.max(...prices) * 1.05
        const priceRange = maxPrice - minPrice

        // Draw axes
        ctx.beginPath()
        ctx.strokeStyle = "#666"
        ctx.lineWidth = 1

        // X-axis
        ctx.moveTo(padding, canvas.height - padding)
        ctx.lineTo(canvas.width - padding, canvas.height - padding)

        // Y-axis
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, canvas.height - padding)
        ctx.stroke()

        // Draw price line
        ctx.beginPath()
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2

        priceData.forEach((data, index) => {
          const x = padding + (index / (priceData.length - 1)) * chartWidth
          const y = canvas.height - padding - ((data.price - minPrice) / priceRange) * chartHeight

          if (index === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })

        ctx.stroke()

        // Draw price labels
        ctx.fillStyle = "#666"
        ctx.font = "12px Arial"
        ctx.textAlign = "right"
        ctx.textBaseline = "middle"

        // Min price
        ctx.fillText(
          minPrice.toLocaleString("en-US", { style: "currency", currency: "USD" }),
          padding - 10,
          canvas.height - padding,
        )

        // Max price
        ctx.fillText(maxPrice.toLocaleString("en-US", { style: "currency", currency: "USD" }), padding - 10, padding)

        // Current price
        const currentPrice = priceData[priceData.length - 1].price
        ctx.fillStyle = "#3b82f6"
        ctx.font = "14px Arial"
        ctx.textAlign = "left"
        ctx.fillText(
          currentPrice.toLocaleString("en-US", { style: "currency", currency: "USD" }),
          canvas.width - padding,
          padding,
        )
      }
    }
  }, [priceData])

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Price Chart</CardTitle>
          <div className="h-9 w-[180px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Price Chart</CardTitle>
        <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select cryptocurrency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bitcoin">Bitcoin</SelectItem>
            <SelectItem value="ethereum">Ethereum</SelectItem>
            <SelectItem value="solana">Solana</SelectItem>
            <SelectItem value="cardano">Cardano</SelectItem>
            <SelectItem value="dogecoin">Dogecoin</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {error && <p className="text-yellow-600 dark:text-yellow-400 mb-2">{error}</p>}
        <canvas ref={canvasRef} width={600} height={300} className="w-full h-auto" />
      </CardContent>
    </Card>
  )
}
