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

    const stats = (await prisma.$queryRaw`
      SELECT
        COUNT(DISTINCT id) as "totalOrders",
        COUNT(DISTINCT "customerId") as "totalCustomers",
        COALESCE(SUM("totalAmount"), 0) as "totalRevenue",
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as "completedOrders"
      FROM "Order"
    `) as Array<{
      totalOrders: bigint
      totalCustomers: bigint
      totalRevenue: number
      completedOrders: bigint
    }>

    const costs = await prisma.cost.aggregate({
      _sum: { amount: true },
      where: { type: "FIXED" },
    })

    return NextResponse.json({
      stats: stats[0],
      monthlyFixedCosts: costs._sum.amount || 0,
    })
  } catch (error) {
    console.error("Statistics fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
