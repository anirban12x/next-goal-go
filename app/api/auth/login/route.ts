import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import type { User } from "@/lib/schemas"
import { generateToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("goal-tracker")
    const users = db.collection<User>("users")

    const user = await users.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken(user._id!)

    return NextResponse.json(
      {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
