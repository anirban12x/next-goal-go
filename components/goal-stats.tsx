"use client"

import { Card } from "./ui/card"

interface Goal {
  _id: string
  completions: string[]
  createdAt: string
  frequency: string
}

interface GoalStatsProps {
  goal: Goal
}

export function GoalStats({ goal }: GoalStatsProps) {
  const calculateStats = () => {
    const completions = goal.completions || []
    const createdDate = new Date(goal.createdAt)
    const today = new Date()
    const daysActive = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    let currentStreak = 0
    const today2 = new Date()
    const sortedDates = [...completions].map((d) => new Date(d)).sort((a, b) => b.getTime() - a.getTime())

    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i])
      const expectedDate = new Date(today2)
      expectedDate.setDate(expectedDate.getDate() - i)

      if (date.toDateString() === expectedDate.toDateString()) {
        currentStreak++
      } else {
        break
      }
    }

    const completionRate = daysActive > 0 ? Math.round((completions.length / daysActive) * 100) : 0

    return { completions: completions.length, daysActive, currentStreak, completionRate }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-1">Total Completions</p>
          <p className="text-4xl font-bold text-foreground">{stats.completions}</p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-1">Current Streak</p>
          <p className="text-4xl font-bold text-foreground">{stats.currentStreak}</p>
          <p className="text-xs text-muted-foreground mt-2">days</p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-1">Completion Rate</p>
          <p className="text-4xl font-bold text-foreground">{stats.completionRate}%</p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-1">Days Active</p>
          <p className="text-4xl font-bold text-foreground">{stats.daysActive}</p>
        </div>
      </Card>
    </div>
  )
}
