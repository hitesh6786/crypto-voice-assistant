"use client"

import Link from "next/link"
import { Bitcoin, Home, LayoutDashboard } from "lucide-react"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Bitcoin className="h-6 w-6 text-blue-500" />
          <span className="text-lg font-bold">CryptoVoice</span>
        </div>
        <nav className="flex items-center gap-2">
          <Link href="/">
            <Button variant={pathname === "/" ? "default" : "ghost"} size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant={pathname === "/dashboard" ? "default" : "ghost"} size="sm" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
