import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  name: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface Goal {
  _id?: ObjectId
  userId: ObjectId
  name: string
  startDate: Date
  endDate: Date
  completedDates: string[] // Array of date strings in YYYY-MM-DD format
  createdAt: Date
  updatedAt: Date
}

export interface GoalCompletion {
  _id?: ObjectId
  goalId: ObjectId
  userId: ObjectId
  date: string // Date in YYYY-MM-DD format
  completed: boolean
  createdAt: Date
}
