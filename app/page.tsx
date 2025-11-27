"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Target, Calendar, TrendingUp } from "lucide-react"

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showRegister, setShowRegister] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Registration failed")
        return
      }

      // Auto login after registration
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-400 to-blue-400 rounded-full opacity-5 blur-2xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Goals</h1>
          <p className="text-gray-600">Track your progress, achieve your dreams</p>
        </div>

        {/* Login/Register Form */}
        <Card className="p-8 backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <form onSubmit={showRegister ? handleRegister : handleLogin} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {showRegister ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {showRegister ? "Start your goal tracking journey" : "Sign in to your account"}
              </p>
            </div>

            {showRegister && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? "Please wait..." : showRegister ? "Create Account" : "Sign In"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowRegister(!showRegister)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                {showRegister ? "Already have an account? Sign in" : "Don't have an account? Create one"}
              </button>
            </div>
          </form>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 bg-white/60 rounded-xl backdrop-blur-sm">
            <Calendar className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">Daily Tracking</p>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-xl backdrop-blur-sm">
            <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">Progress Stats</p>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-xl backdrop-blur-sm">
            <Target className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">Goal Success</p>
          </div>
        </div>
      </div>
    </main>
  )
}
