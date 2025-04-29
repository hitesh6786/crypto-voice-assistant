import { type NextRequest, NextResponse } from "next/server"
import { AccessToken } from "livekit-server-sdk"
import "server-only"

// Keep token generation logic directly in the API route to avoid any imports
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, roomName } = body

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    if (!roomName) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 })
    }

    // Server-side environment check
    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: "LiveKit configuration is missing on the server" }, { status: 500 })
    }

    try {
      // Generate token directly in the API route
      const at = new AccessToken(apiKey, apiSecret, {
        identity: username,
      })

      at.addGrant({ roomJoin: true, room: roomName })
      const token = at.toJwt()

      return NextResponse.json({ token })
    } catch (error) {
      console.error("Error generating token:", error)
      return NextResponse.json(
        { error: "Failed to generate token. LiveKit configuration may be missing." },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
