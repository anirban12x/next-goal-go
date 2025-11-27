"use client"

import Link from "next/link"
import { Card } from "./ui/card"
import { Button } from "./ui/button"

interface Goal {
  _id: string
  title: string
  description: string
  category: string
  frequency: string
  color: string
  completions: any[]
}

interface GoalsListProps {
  goals: Goal[]
  onRefresh: () => void
}

export function GoalsList({ goals, onRefresh }: GoalsListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        onRefresh()
      }
    } catch (err) {
      console.error("Error deleting goal:", err)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => (
        <Link key={goal._id} href={`/dashboard/goal/${goal._id}`}>
          <Card className="h-full p-6 hover:shadow-lg transition cursor-pointer">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: goal.color }} />
                  <h3 className="text-lg font-bold text-foreground line-clamp-2">{goal.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>
              </div>

              <div className="flex gap-2">
                <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{goal.category}</span>
                <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{goal.frequency}</span>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">{goal.completions?.length || 0} completions</p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    handleDelete(goal._id)
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
