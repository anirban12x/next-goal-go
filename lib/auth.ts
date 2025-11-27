import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error("Please add JWT_SECRET to your environment variables")
}

export function generateToken(userId: ObjectId) {
  return jwt.sign({ userId: userId.toString() }, JWT_SECRET, {
    expiresIn: "30d", // 30 days as requested
  })
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { userId: string }
    return new ObjectId(decoded.userId)
  } catch (error) {
    return null
  }
}
