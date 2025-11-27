"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "./ui/button"

interface User {
  name?: string
  email?: string
}

interface NavigationProps {
  user?: User | null
}

export function Navigation({ user }: NavigationProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={user ? "/dashboard" : "/"} className="text-2xl font-bold text-foreground">
          Goal Tracker
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="text-sm">
                <p className="font-medium text-foreground">{user.name || user.email}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
