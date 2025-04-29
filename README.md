# Crypto Voice Assistant

An AI-powered voice assistant for cryptocurrency information, built with Next.js, LiveKit, and modern web technologies.

## Features

- Voice and text interaction with AI assistant
- Real-time cryptocurrency price information via CoinGecko API
- Educational content about blockchain and crypto
- Interactive price charts with historical data
- Market summaries and trends
- Dark/light theme support

## Prerequisites

- Node.js 18+ installed on your machine
- A LiveKit account (optional, for voice features)
- Internet connection for CoinGecko API access

## Getting Started

Follow these steps to run the application locally:

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/yourusername/crypto-voice-assistant.git
cd crypto-voice-assistant
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
NEXT_PUBLIC_LIVEKIT_URL=wss://finance-agent-r6hpnynu.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
\`\`\`

Note: The application will work without LiveKit, but voice features will be disabled.

### 4. Run the development server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Integration

This application uses the free CoinGecko API to fetch real-time cryptocurrency data. The API has rate limits (around 10-50 calls per minute) but doesn't require an API key for basic usage.

If you encounter rate limiting issues, you can:
1. Implement more aggressive caching
2. Sign up for CoinGecko Pro for higher rate limits
3. Switch to an alternative API

## Using the Assistant

1. Type your question in the input field or click the microphone button to use voice input
2. Ask about cryptocurrency prices, market trends, or general information
3. Try questions like:
   - "What's the price of Bitcoin?"
   - "Tell me about Ethereum"
   - "What is blockchain?"
   - "How is the crypto market doing?"
   - "What are NFTs?"
   - "Show me the top performing coins"
