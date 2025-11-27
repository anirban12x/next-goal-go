"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calendar, Target, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function CreateGoal() {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Basic validation
    if (!formData.name || !formData.startDate || !formData.endDate) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("Start date cannot be after end date")
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create goal")
      }

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-gray-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Create New Goal</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">What's Your Goal?</h2>
                <p className="text-sm text-gray-600 mt-1">Set a goal and track your daily progress</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Goal Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Daily Exercise, Read Books, Meditate..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                    Start Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                      className="h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pl-10"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                    End Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      required
                      className="h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pl-10"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
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
                {loading ? "Creating Goal..." : "Create Goal"}
              </Button>
            </form>
          </Card>

          {/* Tips */}
          <div className="mt-6 p-4 bg-white/60 rounded-xl backdrop-blur-sm">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">💡 Tips for Success</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Choose a specific and achievable goal</li>
              <li>• Start with shorter time periods to build momentum</li>
              <li>• Track your progress daily for best results</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
