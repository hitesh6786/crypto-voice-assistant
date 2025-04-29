// Service for interacting with the CoinGecko API
const API_BASE_URL = "https://api.coingecko.com/api/v3"

// Cache to store API responses and reduce requests
const cache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_DURATION = 60 * 1000 // 1 minute cache

// Helper function to fetch with caching
async function fetchWithCache(url: string) {
  const cacheKey = url
  const now = Date.now()

  // Return cached data if available and not expired
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Cache the response
    cache[cacheKey] = { data, timestamp: now }

    return data
  } catch (error) {
    console.error("Error fetching from CoinGecko:", error)
    throw error
  }
}

// Get current price and market data for a specific coin
export async function getCoinData(coinId: string) {
  const url = `${API_BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  return fetchWithCache(url)
}

// Get price data for multiple coins at once
export async function getPrices(coinIds: string[]) {
  const ids = coinIds.join(",")
  const url = `${API_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
  return fetchWithCache(url)
}

// Get global crypto market data
export async function getGlobalData() {
  const url = `${API_BASE_URL}/global`
  return fetchWithCache(url)
}

// Search for coins by name or symbol
export async function searchCoins(query: string) {
  const url = `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`
  return fetchWithCache(url)
}

// Get trending coins
export async function getTrendingCoins() {
  const url = `${API_BASE_URL}/search/trending`
  return fetchWithCache(url)
}

// Get coin list (for mapping names to IDs)
export async function getCoinList() {
  const url = `${API_BASE_URL}/coins/list`
  return fetchWithCache(url)
}

// Map of common coin names/symbols to their CoinGecko IDs
export const coinIdMap: Record<string, string> = {
  bitcoin: "bitcoin",
  btc: "bitcoin",
  ethereum: "ethereum",
  eth: "ethereum",
  solana: "solana",
  sol: "solana",
  cardano: "cardano",
  ada: "cardano",
  dogecoin: "dogecoin",
  doge: "dogecoin",
  polkadot: "polkadot",
  dot: "polkadot",
  chainlink: "chainlink",
  link: "chainlink",
  avalanche: "avalanche-2",
  avax: "avalanche-2",
  polygon: "polygon",
  matic: "polygon",
  uniswap: "uniswap",
  uni: "uniswap",
  binance: "binancecoin",
  bnb: "binancecoin",
  xrp: "ripple",
  ripple: "ripple",
  litecoin: "litecoin",
  ltc: "litecoin",
  tether: "tether",
  usdt: "tether",
  usdc: "usd-coin",
  shiba: "shiba-inu",
  shib: "shiba-inu",
}

// Find coin ID from user input
export function findCoinId(input: string): string | null {
  const lowerInput = input.toLowerCase()

  // Direct match in our map
  if (coinIdMap[lowerInput]) {
    return coinIdMap[lowerInput]
  }

  // Check if any of the keys are contained in the input
  for (const [key, value] of Object.entries(coinIdMap)) {
    if (lowerInput.includes(key)) {
      return value
    }
  }

  return null
}
