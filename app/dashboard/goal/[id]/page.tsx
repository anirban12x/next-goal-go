"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ChevronLeft, ChevronRight, Edit, Calendar, Target, TrendingUp, Clock, X, Check } from "lucide-react"

interface Goal {
  _id: string
  name: string
  startDate: string | Date
  endDate: string | Date
  completedDates: string[]
  createdAt: string
}

export default function GoalDetail() {
  const [goal, setGoal] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
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
          // Handle other errors (404, 500, etc.) gracefully
          console.error("Failed to fetch goal:", res.status, res.statusText)
          router.push("/dashboard")
          return
        }

        const data = await res.json()
        setGoal(data)
      } catch (err) {
        console.error("Error fetching goal:", err)
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchGoal()
  }, [id, router])

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0] // YYYY-MM-DD format
  }

  const toggleCompletion = async (date: Date) => {
    if (!goal) return

    const dateStr = formatDate(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)

    // Don't allow toggling future dates
    if (date > today) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/goals/${id}/completion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: dateStr }),
      })

      if (!res.ok) throw new Error("Failed to update completion")

      // Update local state
      const isCompleted = goal.completedDates.includes(dateStr)
      const updatedDates = isCompleted
        ? goal.completedDates.filter(d => d !== dateStr)
        : [...goal.completedDates, dateStr]

      setGoal(prev => prev ? { ...prev, completedDates: updatedDates } : null)
    } catch (err) {
      console.error("Error updating completion:", err)
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const renderCalendar = () => {
    if (!goal) return null

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfWeek = getFirstDayOfMonth(currentDate)

    const startDate = new Date(goal.startDate)
    const endDate = new Date(goal.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const days = []
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = formatDate(date)
      const isCompleted = (goal.completedDates || []).includes(dateStr)
      const isToday = date.getTime() === today.getTime()
      const isInGoalRange = date >= startDate && date <= endDate
      const isPastOrToday = date <= today
      const canToggle = isInGoalRange && isPastOrToday

      days.push(
        <button
          key={day}
          onClick={() => canToggle && toggleCompletion(date)}
          className={`
            h-12 w-full rounded-lg border text-sm font-medium transition-all duration-200 relative
            ${isToday ? 'ring-2 ring-blue-500' : ''}
            ${!isInGoalRange
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : canToggle
                ? isCompleted
                  ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                  : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
          disabled={!canToggle}
        >
          <span className="text-xs">{day}</span>
          <div className="absolute inset-0 flex items-center justify-center">
            {isInGoalRange && canToggle && (
              isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-3 w-3" />
              )
            )}
          </div>
        </button>
      )
    }

    return (
      <div>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    )
  }

  const calculateStats = () => {
    if (!goal) return { completedDays: 0, totalDays: 0, missedDays: 0, streak: 0, daysLeft: 0 }

    const startDate = new Date(goal.startDate)
    const endDate = new Date(goal.endDate)
    const today = new Date()

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const completedDays = (goal.completedDates || []).length

    // Calculate days that should have been completed (days from start to today or end, whichever is earlier)
    const lastDay = today > endDate ? endDate : today
    const daysShouldHaveCompleted = Math.max(0, Math.ceil((lastDay.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)
    const missedDays = Math.max(0, daysShouldHaveCompleted - completedDays)

    const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

    // Calculate current streak
    let streak = 0
    const sortedDates = [...(goal.completedDates || [])].sort().reverse()
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const dateStr of sortedDates) {
      const completedDate = new Date(dateStr)
      if (formatDate(completedDate) === formatDate(currentDate)) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (formatDate(completedDate) === formatDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))) {
        // If we missed today but completed yesterday, check if we have a streak ending yesterday
        currentDate.setDate(currentDate.getDate() - 1)
        if (formatDate(completedDate) === formatDate(currentDate)) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          break
        }
      } else {
        break
      }
    }

    return { completedDays, totalDays, missedDays, streak, daysLeft }
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading goal...</p>
        </div>
      </div>
    )
  }

  if (!goal) return null

  const stats = calculateStats()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-6">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
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
                <div>
                  <h1 className="text-lg font-bold text-gray-900 truncate">{goal.name}</h1>
                  <p className="text-xs text-gray-600">
                    {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <Link href={`/dashboard/goal/${id}/edit`}>
              <Button variant="outline" size="sm" className="border-gray-200">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Calendar */}
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>

            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {renderCalendar()}

          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
              <span className="text-gray-600">Missed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span className="text-gray-600">Not in range</span>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedDays}</p>
                <p className="text-sm text-gray-600">Days Done</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.missedDays}</p>
                <p className="text-sm text-gray-600">Days Missed</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.streak}</p>
                <p className="text-sm text-gray-600">Current Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.daysLeft}</p>
                <p className="text-sm text-gray-600">Days Left</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg col-span-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDays}</p>
                <p className="text-sm text-gray-600">Total Goal Days</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
