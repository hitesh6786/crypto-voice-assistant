import CryptoAssistant from "@/components/crypto-assistant"
import EnvSetupGuide from "@/components/env-setup-guide"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Bitcoin, ChevronRight, Coins, Shield, Zap } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full max-w-5xl">
        <EnvSetupGuide />

        <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your AI Crypto Assistant
            </h1>
            <p className="text-xl mb-6 text-gray-600 dark:text-gray-400">
              Get real-time information, market insights, and learn about cryptocurrencies through natural conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            <Bitcoin className="w-32 h-32 text-blue-500 mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
            <Zap className="h-10 w-10 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Real-time Data</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get up-to-date cryptocurrency prices and market information through simple voice or text commands.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
            <Coins className="h-10 w-10 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Market Insights</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Understand market trends, get explanations about blockchain technology, and learn about crypto investing.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
            <Shield className="h-10 w-10 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Educational Content</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Learn about blockchain, NFTs, DeFi, and other crypto concepts through conversational AI assistance.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Try the Crypto Assistant</h2>
          <CryptoAssistant />
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-white text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Ready to explore more?</h2>
          <p className="mb-6">
            Visit the dashboard for comprehensive market data, price charts, and more detailed information.
          </p>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="gap-2">
              Go to Dashboard
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
