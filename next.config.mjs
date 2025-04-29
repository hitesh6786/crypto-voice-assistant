/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Explicitly set the NEXT_PUBLIC_LIVEKIT_URL from the LIVEKIT_URL
    NEXT_PUBLIC_LIVEKIT_URL: process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || "",
  },
  // Prevent server-only code from being included in the client bundle
  experimental: {
    serverComponentsExternalPackages: ["livekit-server-sdk"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
