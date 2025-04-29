import { type NextRequest, NextResponse } from "next/server"
import { getCoinData, getGlobalData, getTrendingCoins, findCoinId, getPrices } from "@/lib/coingecko-service"

// Detailed information about specific cryptocurrencies
const cryptoInfo = {
  bitcoin: [
    "Bitcoin (BTC) is the first cryptocurrency, created in 2009 by an anonymous person or group known as Satoshi Nakamoto. It introduced blockchain technology and operates as a decentralized digital currency without a central authority.",
    "Bitcoin (BTC) is often referred to as digital gold due to its limited supply of 21 million coins. It uses a proof-of-work consensus mechanism and has become a store of value and inflation hedge for many investors.",
    "Bitcoin (BTC) was the first cryptocurrency and remains the largest by market capitalization. It introduced the concept of a decentralized ledger (blockchain) and has inspired thousands of other cryptocurrencies.",
  ],
  ethereum: [
    "Ethereum (ETH) is a decentralized platform that enables smart contracts and decentralized applications (dApps). Created by Vitalik Buterin in 2015, it's the second-largest cryptocurrency by market cap.",
    "Ethereum (ETH) revolutionized blockchain technology by introducing smart contracts - self-executing contracts with the terms directly written into code. This innovation enabled the development of DeFi, NFTs, and thousands of dApps.",
    "Ethereum (ETH) is transitioning from proof-of-work to proof-of-stake through a series of upgrades, significantly reducing its energy consumption and improving scalability. It serves as the foundation for much of the crypto ecosystem.",
  ],
  solana: [
    "Solana (SOL) is a high-performance blockchain supporting smart contracts and decentralized applications. Known for its high speed and low transaction costs, it uses a unique proof-of-history consensus mechanism.",
    "Solana (SOL) is designed for scalability, capable of processing thousands of transactions per second with low fees. It's popular for DeFi applications, NFT marketplaces, and Web3 projects requiring high throughput.",
    "Solana (SOL) combines proof-of-stake with proof-of-history to achieve high throughput and low latency. It has gained popularity for NFT projects and DeFi applications due to its speed and low transaction costs.",
  ],
  cardano: [
    "Cardano (ADA) is a blockchain platform built on peer-reviewed research and developed through evidence-based methods. Founded by Charles Hoskinson, co-founder of Ethereum, it focuses on sustainability, scalability, and transparency.",
    "Cardano (ADA) takes a research-first approach to blockchain development, with a strong focus on security, scalability, and interoperability. It uses a proof-of-stake consensus mechanism called Ouroboros.",
    "Cardano (ADA) is developed in phases, each focusing on different functionalities. It aims to provide financial services to unbanked populations and create a more secure and sustainable blockchain ecosystem.",
  ],
  dogecoin: [
    "Dogecoin (DOGE) started as a meme cryptocurrency featuring the Shiba Inu dog from the 'Doge' meme. Created in 2013 by Billy Markus and Jackson Palmer, it has gained popularity and has been endorsed by figures like Elon Musk.",
    "Dogecoin (DOGE) began as a joke but has evolved into a popular cryptocurrency with a strong community. Unlike Bitcoin, it has no supply cap and uses a proof-of-work consensus mechanism similar to Litecoin.",
    "Dogecoin (DOGE) has gained mainstream attention through celebrity endorsements, particularly from Elon Musk. Despite starting as a meme, it's now used for tipping content creators and charitable donations.",
  ],
  avalanche: [
    "Avalanche (AVAX) is a layer-1 blockchain platform focused on speed, low costs, and eco-friendliness. It uses a novel consensus protocol that allows for high throughput and quick finality of transactions.",
    "Avalanche (AVAX) features a unique architecture with three built-in blockchains designed for different purposes. It's EVM-compatible, allowing Ethereum developers to easily port their applications to the platform.",
    "Avalanche (AVAX) aims to be the fastest smart contract platform in terms of time-to-finality. It uses a proof-of-stake consensus mechanism and has become popular for DeFi applications and subnets (custom blockchains).",
  ],
  polkadot: [
    "Polkadot (DOT) is a multi-chain network that enables different blockchains to transfer messages and value in a trust-free fashion. Created by Ethereum co-founder Gavin Wood, it aims to solve blockchain interoperability.",
    "Polkadot (DOT) allows specialized blockchains to communicate with each other, creating an interconnected internet of blockchains. Its relay chain provides shared security for all connected parachains.",
    "Polkadot (DOT) uses a nominated proof-of-stake consensus mechanism and allows developers to create custom blockchains (parachains) that can interact with other networks while maintaining their own governance.",
  ],
  aptos: [
    "Aptos (APT) is a layer-1 blockchain focused on security, scalability, and upgradeability. Developed by former Meta (Facebook) employees who worked on the Diem project, it uses the Move programming language.",
    "Aptos (APT) features a novel Block-STM parallel execution engine that processes transactions concurrently, achieving high throughput. It emphasizes safety and reliability through its Move programming language.",
    "Aptos (APT) launched in 2022 and quickly gained attention due to its technical innovations and team's background from Meta's Diem project. It uses a proof-of-stake consensus mechanism and focuses on developer experience.",
  ],
  chainlink: [
    "Chainlink (LINK) is a decentralized oracle network that enables smart contracts to securely interact with real-world data, events, and payments. It bridges the gap between blockchain and external systems.",
    "Chainlink (LINK) solves the 'oracle problem' by providing reliable data feeds to smart contracts. It's widely used in DeFi for price feeds, weather data, sports results, and connecting blockchains to traditional systems.",
    "Chainlink (LINK) uses a network of node operators who stake LINK tokens to provide data to smart contracts. It's blockchain-agnostic and works with multiple networks including Ethereum, Solana, and Avalanche.",
  ],
  polygon: [
    "Polygon (MATIC) is a layer-2 scaling solution for Ethereum that aims to provide faster and cheaper transactions. It offers a framework for building and connecting Ethereum-compatible blockchain networks.",
    "Polygon (MATIC) has evolved from a simple scaling solution to a full-fledged multi-chain system. It supports various scaling solutions including Polygon PoS, Polygon zkEVM, and Polygon Supernets.",
    "Polygon (MATIC) helps address Ethereum's limitations by offering lower transaction fees and higher throughput. It's popular for gaming, NFTs, and DeFi applications that require faster and cheaper transactions.",
  ],
  ripple: [
    "XRP is the native cryptocurrency of the XRP Ledger, created by Ripple. It's designed for fast, low-cost international payments and serves as a bridge currency in Ripple's payment network.",
    "XRP can settle transactions in 3-5 seconds with minimal fees, making it suitable for cross-border payments. Unlike many cryptocurrencies, XRP is pre-mined with a total supply of 100 billion tokens.",
    "XRP and Ripple have focused on partnering with financial institutions to improve the efficiency of international money transfers. The company has faced regulatory challenges, particularly from the SEC in the United States.",
  ],
  binancecoin: [
    "Binance Coin (BNB) is the native cryptocurrency of the Binance ecosystem, including the Binance exchange and Binance Smart Chain. It was initially created as an ERC-20 token before migrating to its own blockchain.",
    "BNB is used for trading fee discounts, participation in token sales, payments, and as gas for transactions on the BNB Chain (formerly Binance Smart Chain). Binance conducts regular token burns to reduce supply.",
    "BNB has evolved from a simple exchange token to the backbone of a comprehensive ecosystem including a smart contract platform, decentralized exchange, and various financial services.",
  ],
  litecoin: [
    "Litecoin (LTC) is one of the earliest Bitcoin alternatives, created in 2011 by Charlie Lee. Often called 'silver to Bitcoin's gold,' it features faster block generation and a different hashing algorithm.",
    "Litecoin (LTC) processes blocks every 2.5 minutes (compared to Bitcoin's 10 minutes) and uses the memory-intensive Scrypt algorithm instead of SHA-256. It has a maximum supply of 84 million coins.",
    "Litecoin (LTC) has served as a testbed for Bitcoin upgrades, implementing technologies like SegWit and the Lightning Network before Bitcoin. It aims to be a lighter, faster alternative to Bitcoin for everyday transactions.",
  ],
  uniswap: [
    "Uniswap (UNI) is the governance token of the Uniswap protocol, one of the largest decentralized exchanges (DEX) on Ethereum. The protocol uses automated market makers instead of traditional order books.",
    "The Uniswap protocol revolutionized decentralized trading with its automated market maker model, allowing users to swap tokens without intermediaries. UNI token holders can vote on protocol changes and upgrades.",
    "Uniswap pioneered the concept of liquidity pools in DeFi, where users provide token pairs to earn trading fees. The protocol has gone through multiple versions, each adding new features and efficiencies.",
  ],
}

// General responses for different categories
const generalResponses = {
  greetings: [
    "Hello! How can I help you with crypto information today?",
    "Hi there! What would you like to know about cryptocurrencies?",
    "Hey! I'm here to help with your crypto questions. What's on your mind?",
    "Greetings! How can I assist you with cryptocurrency information today?",
  ],
  howAreYou: [
    "I'm doing well, thank you for asking! I'm ready to help you with cryptocurrency information. What would you like to know?",
    "I'm great! Always ready to discuss crypto. What can I help you with today?",
    "I'm functioning perfectly! What crypto information are you looking for?",
    "All systems operational and ready to assist with your crypto queries!",
  ],
  thanks: [
    "You're welcome! Is there anything else you'd like to know about cryptocurrencies?",
    "Happy to help! Let me know if you have any other crypto questions.",
    "Anytime! I'm here whenever you need crypto information.",
    "My pleasure! Feel free to ask if you need more information about the crypto world.",
  ],
  whatIsCrypto: [
    "Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates on decentralized networks based on blockchain technology. Bitcoin, created in 2009, was the first cryptocurrency, and thousands of alternatives have been created since.",
    "Cryptocurrencies are digital assets designed to work as a medium of exchange using cryptography to secure transactions and control the creation of additional units. They operate on decentralized systems called blockchains.",
    "Crypto refers to digital currencies that use encryption techniques to regulate the generation of units and verify the transfer of funds. They operate independently of central banks and use distributed ledger technology.",
  ],
  blockchain: [
    "Blockchain is a distributed ledger technology that records transactions across many computers so that the record cannot be altered retroactively. It's the underlying technology behind cryptocurrencies, providing security, transparency, and decentralization.",
    "A blockchain is a continuously growing list of records, called blocks, which are linked and secured using cryptography. Each block contains a timestamp and transaction data, making it resistant to modification and creating a transparent, verifiable record.",
    "Blockchain technology is a decentralized, distributed ledger that records transactions across multiple computers. This ensures that records cannot be altered retroactively without altering all subsequent blocks, which provides security and transparency.",
  ],
  investmentStrategy: [
    "Some common crypto investment strategies include dollar-cost averaging (regular small investments), diversification (investing in multiple cryptocurrencies), and long-term holding. Remember that all investments carry risk, and it's important to only invest what you can afford to lose.",
    "When investing in crypto, consider strategies like dollar-cost averaging to mitigate volatility, diversifying your portfolio across different assets, and conducting thorough research before investing. Always be aware of the risks involved.",
    "Successful crypto investors often employ strategies such as setting clear investment goals, staying informed about market trends, diversifying their portfolios, and being prepared for volatility. Remember that past performance doesn't guarantee future results.",
  ],
  nft: [
    "NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of specific items like art, collectibles, or music. Unlike cryptocurrencies, each NFT has distinct value and cannot be exchanged on a one-to-one basis.",
    "Non-Fungible Tokens (NFTs) are digital certificates of authenticity built on blockchain technology. They verify ownership of a unique digital or physical asset, such as artwork, music, videos, or virtual real estate.",
    "NFTs are blockchain-based tokens that represent ownership of unique items. They've gained popularity in digital art, gaming, and collectibles markets, allowing creators to tokenize their work and buyers to verify authenticity and ownership.",
  ],
  defi: [
    "DeFi (Decentralized Finance) refers to financial services built on blockchain technology that operate without traditional intermediaries like banks. It includes lending, borrowing, trading, and earning interest on crypto assets.",
    "Decentralized Finance (DeFi) is an ecosystem of financial applications built on blockchain networks. It aims to create an open, permissionless financial system that operates without central authorities, offering services like lending, borrowing, and trading.",
    "DeFi represents a shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on blockchains. It includes applications for lending, borrowing, trading derivatives, and more.",
  ],
  staking: [
    "Staking is the process of actively participating in transaction validation on a proof-of-stake blockchain. It involves locking up crypto assets to support network operations in exchange for rewards, similar to earning interest.",
    "Crypto staking involves holding funds in a cryptocurrency wallet to support the security and operations of a blockchain network. In return for locking up coins and validating transactions, participants receive staking rewards.",
    "Staking is a way to earn passive income with your cryptocurrency by participating in the network's consensus mechanism. By locking up your coins, you help secure the network and receive rewards in return.",
  ],
  tradingAdvice: [
    "I cannot provide specific financial advice. It's important to do your own research and consider consulting with a financial advisor before making investment decisions.",
    "While I can provide information about cryptocurrencies, I'm not qualified to give personalized trading advice. Consider researching thoroughly and possibly consulting with a financial professional.",
    "Trading cryptocurrencies involves significant risk. Rather than following specific advice, consider learning about risk management, technical analysis, and fundamental analysis to make informed decisions.",
  ],
  fallback: [
    "Error: I don't have any information about this topic. You might want to try asking about specific cryptocurrencies like Bitcoin or Ethereum, or general topics like 'What is blockchain?' or 'How does staking work?'",
    "Error: I don't have data on this subject. Try asking about cryptocurrency prices, market trends, or questions like 'What is DeFi?' or 'Tell me about NFTs.'",
    "Error: I don't have enough information to answer that question. You could ask about the current crypto market, specific coins like Bitcoin or Solana, or concepts like smart contracts and decentralized finance.",
  ],
  suggestedQuestions: [
    "Here are some questions you might want to ask: 'What's the price of Bitcoin?', 'Tell me about Ethereum', 'How is the crypto market doing?', or 'What is blockchain technology?'",
    "You could try asking: 'What are NFTs?', 'Explain DeFi', 'How does staking work?', or 'What's the current price of Solana?'",
    "Some questions I can help with: 'What are the top performing cryptocurrencies?', 'Tell me about Cardano', 'What is a smart contract?', or 'How does Bitcoin mining work?'",
  ],
}

// Helper function to get a random response from a category
function getRandomResponse(category: keyof typeof generalResponses): string {
  const responses = generalResponses[category]
  return responses[Math.floor(Math.random() * responses.length)]
}

// Helper function to get a random crypto info response
function getRandomCryptoInfo(coin: keyof typeof cryptoInfo): string {
  const responses = cryptoInfo[coin]
  return responses[Math.floor(Math.random() * responses.length)]
}

// Format a number with commas for thousands
function formatNumber(num: number): string {
  return num.toLocaleString("en-US")
}

// Format a percentage
function formatPercentage(num: number): string {
  return num.toFixed(2) + "%"
}

export async function POST(req: NextRequest) {
  try {
    const { command } = await req.json()

    if (!command) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 })
    }

    // Process the command
    const lowerCommand = command.toLowerCase()
    let response = ""

    // Check for greetings
    if (
      lowerCommand.includes("hello") ||
      lowerCommand.includes("hi") ||
      lowerCommand === "hello" ||
      lowerCommand === "hi" ||
      lowerCommand === "hey" ||
      lowerCommand.includes("greetings")
    ) {
      response = getRandomResponse("greetings")
    }

    // Check for how are you
    else if (
      lowerCommand.includes("how are you") ||
      lowerCommand.includes("how's it going") ||
      lowerCommand.includes("how are things") ||
      lowerCommand.includes("what's up")
    ) {
      response = getRandomResponse("howAreYou")
    }

    // Check for thank you
    else if (
      lowerCommand.includes("thank you") ||
      lowerCommand.includes("thanks") ||
      lowerCommand.includes("appreciate it") ||
      lowerCommand === "thanks" ||
      lowerCommand === "thank you"
    ) {
      response = getRandomResponse("thanks")
    }

    // Check for price requests
    else if (
      lowerCommand.includes("price of") ||
      lowerCommand.includes("how much is") ||
      lowerCommand.includes("what is the price") ||
      lowerCommand.includes("value of") ||
      lowerCommand.includes("worth") ||
      lowerCommand.includes("how much does") ||
      lowerCommand.includes("cost")
    ) {
      try {
        const coinId = findCoinId(lowerCommand)

        if (coinId) {
          const coinData = await getCoinData(coinId)
          const price = coinData.market_data.current_price.usd
          const priceChange24h = coinData.market_data.price_change_percentage_24h
          const marketCap = coinData.market_data.market_cap.usd
          const volume24h = coinData.market_data.total_volume.usd

          response = `The current price of ${coinData.name} (${coinData.symbol.toUpperCase()}) is $${formatNumber(price)}. It has ${priceChange24h >= 0 ? "increased" : "decreased"} by ${formatPercentage(Math.abs(priceChange24h))} in the last 24 hours. The market cap is $${formatNumber(marketCap)} with a 24-hour trading volume of $${formatNumber(volume24h)}.`
        } else {
          response =
            "Error: I couldn't identify which cryptocurrency you're asking about. You can ask about Bitcoin, Ethereum, Solana, and many other major cryptocurrencies. Try questions like 'What's the price of Bitcoin?' or 'How much is Ethereum worth?'"
        }
      } catch (error) {
        console.error("Error fetching coin data:", error)
        response =
          "Error: I'm having trouble getting the latest price information right now. Please try again later. You can try asking about market trends or general information about cryptocurrencies instead."
      }
    }

    // Check for general market info
    else if (
      lowerCommand.includes("market") ||
      lowerCommand.includes("overview") ||
      lowerCommand.includes("market update") ||
      lowerCommand.includes("crypto market")
    ) {
      try {
        const globalData = await getGlobalData()
        const marketCap = globalData.data.total_market_cap.usd
        const volume24h = globalData.data.total_volume.usd
        const btcDominance = globalData.data.market_cap_percentage.btc
        const ethDominance = globalData.data.market_cap_percentage.eth
        const marketCapChange = globalData.data.market_cap_change_percentage_24h_usd

        // Get trending coins
        const trendingData = await getTrendingCoins()
        const trendingCoins = trendingData.coins
          .slice(0, 3)
          .map((coin: any) => coin.item.name)
          .join(", ")

        response = `The global crypto market cap is currently $${formatNumber(marketCap)}, a ${marketCapChange >= 0 ? "gain" : "loss"} of ${formatPercentage(Math.abs(marketCapChange))} in the last 24 hours. The 24-hour trading volume is $${formatNumber(volume24h)}. Bitcoin dominance is at ${formatPercentage(btcDominance)} and Ethereum at ${formatPercentage(ethDominance)}. Trending coins right now include ${trendingCoins}.`
      } catch (error) {
        console.error("Error fetching market data:", error)
        response =
          "Error: I'm having trouble getting the latest market information right now. Please try again later. You can try asking about specific cryptocurrencies like Bitcoin or Ethereum instead."
      }
    }

    // Check for top coins
    else if (
      lowerCommand.includes("top coins") ||
      lowerCommand.includes("best performing") ||
      lowerCommand.includes("top crypto") ||
      lowerCommand.includes("top performing")
    ) {
      try {
        // Get data for top coins
        const topCoinIds = ["bitcoin", "ethereum", "binancecoin", "solana", "ripple"]
        const priceData = await getPrices(topCoinIds)

        const coinInfos = []
        for (const [id, data] of Object.entries(priceData)) {
          const change = (data as any).usd_24h_change
          const price = (data as any).usd
          let name = id.charAt(0).toUpperCase() + id.slice(1)
          if (id === "binancecoin") name = "Binance Coin"
          if (id === "ripple") name = "XRP"

          coinInfos.push({
            name,
            price,
            change,
          })
        }

        // Sort by 24h change for best performers
        coinInfos.sort((a, b) => b.change - a.change)

        const topPerformers = coinInfos
          .slice(0, 3)
          .map((coin) => `${coin.name} at $${formatNumber(coin.price)} (${formatPercentage(coin.change)})`)
          .join(", ")

        response = `The top performing major cryptocurrencies in the last 24 hours are: ${topPerformers}.`
      } catch (error) {
        console.error("Error fetching top coins:", error)
        response =
          "Error: I'm having trouble getting information about top coins right now. Please try again later. You can ask about specific cryptocurrencies like 'Tell me about Bitcoin' or 'What is Ethereum?'"
      }
    }

    // Check for trading advice
    else if (
      lowerCommand.includes("should i buy") ||
      lowerCommand.includes("should i sell") ||
      lowerCommand.includes("trading advice") ||
      lowerCommand.includes("good investment") ||
      lowerCommand.includes("invest in")
    ) {
      response = getRandomResponse("tradingAdvice")
    }

    // Check for what is crypto
    else if (
      lowerCommand.includes("what is crypto") ||
      lowerCommand.includes("what are cryptocurrencies") ||
      lowerCommand.includes("explain crypto") ||
      lowerCommand === "what is cryptocurrency"
    ) {
      response = getRandomResponse("whatIsCrypto")
    }

    // Check for blockchain explanation
    else if (
      lowerCommand.includes("blockchain") ||
      lowerCommand.includes("what is blockchain") ||
      lowerCommand === "blockchain"
    ) {
      response = getRandomResponse("blockchain")
    }

    // Check for investment strategies
    else if (
      lowerCommand.includes("investment strategy") ||
      lowerCommand.includes("how to invest") ||
      lowerCommand.includes("investment tips") ||
      lowerCommand.includes("investing in crypto")
    ) {
      response = getRandomResponse("investmentStrategy")
    }

    // Check for NFTs
    else if (
      lowerCommand.includes("nft") ||
      lowerCommand.includes("non-fungible") ||
      lowerCommand.includes("digital art") ||
      lowerCommand === "what are nfts"
    ) {
      response = getRandomResponse("nft")
    }

    // Check for DeFi
    else if (
      lowerCommand.includes("defi") ||
      lowerCommand.includes("decentralized finance") ||
      lowerCommand === "what is defi"
    ) {
      response = getRandomResponse("defi")
    }

    // Check for staking
    else if (
      lowerCommand.includes("staking") ||
      lowerCommand.includes("stake crypto") ||
      lowerCommand === "what is staking"
    ) {
      response = getRandomResponse("staking")
    }

    // Check for specific coin information
    else if (lowerCommand.includes("tell me about") || lowerCommand.includes("what is")) {
      // Check for specific cryptocurrencies in our predefined list
      let foundCrypto = false

      for (const coin of Object.keys(cryptoInfo)) {
        if (lowerCommand.includes(coin)) {
          response = getRandomCryptoInfo(coin as keyof typeof cryptoInfo)
          foundCrypto = true
          break
        }
      }

      // If not found in our predefined list, try to find it via CoinGecko
      if (!foundCrypto) {
        const coinId = findCoinId(lowerCommand)

        if (coinId) {
          try {
            const coinData = await getCoinData(coinId)

            response = `${coinData.name} (${coinData.symbol.toUpperCase()}) is currently ranked #${coinData.market_cap_rank} by market cap. ${
              coinData.genesis_date ? `It was created on ${coinData.genesis_date}.` : ""
            } ${
              coinData.description && coinData.description.en ? coinData.description.en.split(". ")[0] + "." : ""
            } The current price is $${formatNumber(coinData.market_data.current_price.usd)} with a market cap of $${formatNumber(
              coinData.market_data.market_cap.usd,
            )}.`
          } catch (error) {
            console.error("Error fetching coin data:", error)
            response = `Error: I don't have detailed information about that cryptocurrency right now. ${getRandomResponse("suggestedQuestions")}`
          }
        } else {
          // Default response for unknown entities
          response = `${getRandomResponse("fallback")} ${getRandomResponse("suggestedQuestions")}`
        }
      }
    }

    // Default response
    if (!response) {
      response = `${getRandomResponse("fallback")} ${getRandomResponse("suggestedQuestions")}`
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error processing command:", error)
    return NextResponse.json({
      response: `Error: I encountered a problem processing your request. You can try asking about cryptocurrency prices like "What's the price of Bitcoin?", market information like "How is the crypto market doing?", or general questions like "What is blockchain?"`,
    })
  }
}
