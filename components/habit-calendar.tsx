"use client"

import { useState } from "react"
import { Button } from "./ui/button"

interface Goal {
  _id: string
  completions: string[]
  color: string
}

interface HabitCalendarProps {
  goal: Goal
  onToggleCompletion: (date: Date) => void
}

export function HabitCalendar({ goal, onToggleCompletion }: HabitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const isDateCompleted = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return goal.completions?.some((c) => c.split("T")[0] === dateStr)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const days = []
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
  }

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">{monthName}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            ← Prev
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            Next →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {days.map((date, i) => (
          <div key={i} className="aspect-square">
            {date ? (
              <button
                onClick={() => onToggleCompletion(date)}
                className={`w-full h-full rounded-lg font-medium text-sm transition ${
                  isDateCompleted(date) ? "text-white" : "bg-muted text-muted-foreground hover:bg-muted-foreground/50"
                }`}
                style={{
                  backgroundColor: isDateCompleted(date) ? goal.color : undefined,
                }}
              >
                {date.getDate()}
              </button>
            ) : (
              <div />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
