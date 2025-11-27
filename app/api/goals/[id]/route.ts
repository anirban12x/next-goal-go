import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import type { Goal } from "@/lib/schemas"
import { verifyToken } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid goal ID format" }, { status: 400 })
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

    // Ensure completedDates exists
    const goalWithDates = {
      ...goal,
      completedDates: goal.completedDates || []
    }

    return NextResponse.json(goalWithDates)
  } catch (error) {
    console.error("Get goal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { name, startDate, endDate } = await req.json()

    // Validate required fields
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

    const result = await goals.findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      {
        $set: {
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Update goal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const client = await clientPromise
    const db = client.db("goal-tracker")
    const goals = db.collection<Goal>("goals")

    const result = await goals.deleteOne({
      _id: new ObjectId(id),
      userId,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete goal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
