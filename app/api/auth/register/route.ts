import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import { generateToken } from "@/lib/auth"
import type { User } from "@/lib/schemas"

export async function POST(req: NextRequest) {
  try {
    const { email, name, password } = await req.json()

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("goal-tracker")
    const users = db.collection<User>("users")

    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await users.insertOne({
      email,
      name,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const token = generateToken(result.insertedId)
    const user = { id: result.insertedId.toString(), email, name }

    return NextResponse.json({ token, user }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
