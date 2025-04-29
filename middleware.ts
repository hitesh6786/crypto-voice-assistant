import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // We'll continue even if the environment variable is not set
  // The components will handle this case gracefully
  return NextResponse.next()
}
