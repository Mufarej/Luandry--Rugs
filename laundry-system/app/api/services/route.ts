import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as any
    if (!["OWNER", "ADMIN", "CASHIER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const services = await prisma.service.findMany({
      include: { items: true },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Services fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}
