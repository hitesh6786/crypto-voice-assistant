import CryptoAssistant from "@/components/crypto-assistant"
import CryptoPriceChart from "@/components/crypto-price-chart"
import CryptoMarketSummary from "@/components/crypto-market-summary"
import EnvSetupGuide from "@/components/env-setup-guide"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, LineChart, PieChart } from "lucide-react"

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Crypto Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor cryptocurrency prices, market trends, and get AI-powered assistance
        </p>
      </div>

      <EnvSetupGuide />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Price Chart
              </TabsTrigger>
              <TabsTrigger value="market" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Market Data
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Portfolio
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="mt-4">
              <CryptoPriceChart />
            </TabsContent>
            <TabsContent value="market" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Market Overview</CardTitle>
                  <CardDescription>Comprehensive market data and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12 text-muted-foreground">Market data visualization coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="portfolio" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Portfolio</CardTitle>
                  <CardDescription>Track your crypto investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12 text-muted-foreground">Portfolio tracking feature coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <CryptoMarketSummary />
          </div>
        </div>

        <div>
          <CryptoAssistant />
        </div>
      </div>
    </main>
  )
}
