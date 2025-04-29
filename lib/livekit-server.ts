// This file should only be imported by server components or API routes
import { AccessToken, RoomServiceClient } from "livekit-server-sdk"

// Generate a token for a user to join a room
export async function generateToken(username: string, roomName: string) {
  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error("LiveKit API key or secret is missing")
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: username,
  })

  at.addGrant({ roomJoin: true, room: roomName })
  return at.toJwt()
}

// Create a room (server-side only)
export async function createRoom(roomName: string) {
  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET
  const livekitUrl = process.env.LIVEKIT_URL

  if (!apiKey || !apiSecret || !livekitUrl) {
    throw new Error("LiveKit configuration is missing")
  }

  const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret)

  await roomService.createRoom({
    name: roomName,
    emptyTimeout: 60 * 30, // 30 minutes
    maxParticipants: 10,
  })

  return { roomName }
}
