"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calendar, Target, AlertCircle, Trash2 } from "lucide-react"
import Link from "next/link"

interface Goal {
  _id: string
  name: string
  startDate: string | Date
  endDate: string | Date
  completedDates: string[]
}

export default function EditGoal() {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  })
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState("")
  const [fetchLoading, setFetchLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/")
          return
        }

        const res = await fetch(`/api/goals/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            router.push("/")
            return
          }
          throw new Error("Goal not found")
        }

        const goal: Goal = await res.json()

        // Safely convert dates to YYYY-MM-DD format
        const formatDateForInput = (date: string | Date) => {
          if (!date) return ""
          const dateObj = typeof date === 'string' ? new Date(date) : date
          return dateObj.toISOString().split('T')[0]
        }

        setFormData({
          name: goal.name,
          startDate: formatDateForInput(goal.startDate),
          endDate: formatDateForInput(goal.endDate),
        })
      } catch (err) {
        console.error("Error fetching goal:", err)
        router.push("/dashboard")
      } finally {
        setFetchLoading(false)
      }
    }

    fetchGoal()
  }, [id, router])

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
      const res = await fetch(`/api/goals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update goal")
      }

      router.push(`/dashboard/goal/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this goal? This action cannot be undone.")) {
      return
    }

    setDeleteLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete goal")
      }

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setDeleteLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading goal...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link href={`/dashboard/goal/${id}`}>
              <Button variant="outline" size="sm" className="border-gray-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Edit Goal</h1>
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
                <h2 className="text-xl font-semibold text-gray-900">Update Your Goal</h2>
                <p className="text-sm text-gray-600 mt-1">Modify your goal details</p>
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

              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? "Updating Goal..." : "Update Goal"}
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleteLoading ? "Deleting..." : "Delete Goal"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Warning */}
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2 text-sm">⚠️ Important</h3>
            <p className="text-xs text-amber-800">
              Changing the start or end date will affect your progress tracking. Completed days outside the new date range will be preserved but won't count toward your statistics.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
