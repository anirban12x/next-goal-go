import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import type { Goal } from "@/lib/schemas"
import { verifyToken } from "@/lib/auth"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = verifyToken(token)
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await params
    const { date } = await req.json()

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("goal-tracker")
    const goals = db.collection<Goal>("goals")

    const goal = await goals.findOne({
      _id: new ObjectId(id),
      userId,
    })

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    // Check if date is already completed
    const isCompleted = goal.completedDates?.includes(date)

    if (isCompleted) {
      // Remove the date from completed dates
      await goals.updateOne(
        { _id: new ObjectId(id) },
        {
          $pull: { completedDates: date },
          $set: { updatedAt: new Date() },
        }
      )
    } else {
      // Add the date to completed dates
      await goals.updateOne(
        { _id: new ObjectId(id) },
        {
          $addToSet: { completedDates: date },
          $set: { updatedAt: new Date() },
        }
      )
    }

    // Return success response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Toggle completion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
