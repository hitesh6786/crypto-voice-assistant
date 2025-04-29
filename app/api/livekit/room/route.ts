import { type NextRequest, NextResponse } from "next/server"
import "server-only"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { roomName } = body

    if (!roomName) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 })
    }

    // Just check if the environment variables are set
    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      return NextResponse.json({ error: "LiveKit configuration is missing on the server" }, { status: 500 })
    }

    // We're not going to try to create the room directly anymore
    // Instead, we'll just return success and let LiveKit handle room creation
    // when the first participant joins
    return NextResponse.json({ success: true, roomName })
  } catch (error) {
    console.error("Error processing room request:", error)
    return NextResponse.json({ error: "Failed to process room request" }, { status: 500 })
  }
}
