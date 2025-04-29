"use client"

import { type ReactNode, useEffect, useState } from "react"
import { LiveKitRoom } from "@livekit/components-react"
import { livekitConfig } from "@/lib/livekit-config"

interface LiveKitProviderProps {
  children: ReactNode
  username: string
}

export default function LiveKitProvider({ children, username }: LiveKitProviderProps) {
  const [token, setToken] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get token from server
    const getToken = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/livekit/get-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            roomName: livekitConfig.roomName,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Server responded with ${response.status}`)
        }

        const data = await response.json()
        setToken(data.token)
      } catch (error) {
        console.error("Error getting token:", error)
        setError(error instanceof Error ? error.message : "Failed to connect to LiveKit service")
      } finally {
        setIsLoading(false)
      }
    }

    if (username) {
      getToken()
    }
  }, [username])

  // Check if LiveKit URL is available
  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL

  if (isLoading) {
    return <div className="flex items-center justify-center h-40">Loading LiveKit session...</div>
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400">
        <p>Error: {error}</p>
        {children}
      </div>
    )
  }

  if (!token) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-yellow-700 dark:text-yellow-400">
        <p>Failed to get LiveKit token. Voice features will not be available.</p>
        {children}
      </div>
    )
  }

  if (!livekitUrl) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-yellow-700 dark:text-yellow-400">
        <p>LiveKit URL is not configured. Voice features will not be available.</p>
        {children}
      </div>
    )
  }

  return (
    <LiveKitRoom serverUrl={livekitUrl} token={token} connect={true} audio={true} video={false}>
      {children}
    </LiveKitRoom>
  )
}
