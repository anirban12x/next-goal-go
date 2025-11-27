"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Target, LogOut, User, Calendar, Clock } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
}

interface Goal {
  _id: string
  name: string
  startDate: string | Date
  endDate: string | Date
  completedDates: string[]
  createdAt: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token) {
      router.push("/")
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetchGoals()
  }, [router])

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          router.push("/")
          return
        }
        throw new Error("Failed to fetch goals")
      }

      const data = await res.json()
      setGoals(data)
    } catch (err) {
      console.error("Error fetching goals:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const formatDate = (date: string | Date) => {
    if (!date) return 'Invalid Date'

    const dateObj = typeof date === 'string' ? new Date(date) : date

    // Check if the date is valid
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }

    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const calculateProgress = (goal: Goal) => {
    const start = new Date(goal.startDate)
    const end = new Date(goal.endDate)
    const today = new Date()

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const completedDays = (goal.completedDates || []).length
    const progressPercentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0

    return {
      totalDays,
      completedDays,
      progressPercentage: Math.round(progressPercentage),
      isActive: today >= start && today <= end
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your goals...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Daily Goals</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-gray-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        {goals.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Journey</h2>
              <p className="text-gray-600">Create your first goal and begin tracking your daily progress.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Goals</h2>
                <p className="text-gray-600 text-sm">Tap any goal to view details and track progress</p>
              </div>
            </div>

            {goals.map((goal) => {
              const progress = calculateProgress(goal)
              return (
                <Link key={goal._id} href={`/dashboard/goal/${goal._id}`}>
                  <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-3">
                        {goal.name}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${progress.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {progress.isActive ? 'Active' : 'Ended'}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(goal.startDate)} - {formatDate(goal.endDate)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">
                          {progress.completedDays}/{progress.totalDays} days
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.progressPercentage}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{progress.progressPercentage}% complete</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{Math.max(0, Math.ceil((new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days left</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Floating Create Button */}
      <Link href="/dashboard/create-goal">
        <Button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-110 z-50">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </main>
  )
}
