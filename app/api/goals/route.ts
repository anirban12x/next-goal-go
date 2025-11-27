import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Goal } from "@/lib/schemas"
import { verifyToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = verifyToken(token)
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("goal-tracker")
    const goals = db.collection<Goal>("goals")

    const userGoals = await goals.find({ userId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(userGoals)
  } catch (error) {
    console.error("Get goals error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = verifyToken(token)
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { name, startDate, endDate } = await req.json()

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json({ error: "Start date cannot be after end date" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("goal-tracker")
    const goals = db.collection<Goal>("goals")

    const result = await goals.insertOne({
      userId,
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      completedDates: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const newGoal = await goals.findOne({ _id: result.insertedId })
    return NextResponse.json(newGoal, { status: 201 })
  } catch (error) {
    console.error("Create goal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
