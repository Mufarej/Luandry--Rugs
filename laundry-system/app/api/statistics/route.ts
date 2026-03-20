import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

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
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as "completedOrders",
        SUM(CASE WHEN status LIKE '%PENDING%' OR status = 'PICKED_UP' THEN 1 ELSE 0 END) as "pendingOrders"
      FROM "Order"
    `) as Array<{
      totalOrders: bigint
      totalCustomers: bigint
      totalRevenue: number
      completedOrders: bigint
      pendingOrders: bigint
    }>

    const costs = await prisma.cost.aggregate({
      _sum: { amount: true },
      where: { type: "FIXED" },
    })

    const staffCount = await prisma.user.count({
      where: { role: { in: ["ADMIN", "CASHIER", "DELIVERY", "TECHNICIAN"] } }
    })

    const data = stats[0];

    return NextResponse.json({
      totalRevenue: Number(data.totalRevenue) || 0,
      totalOrders: Number(data.totalOrders) || 0,
      activeStaff: staffCount || 0,
      pendingOrders: Number(data.pendingOrders) || 0,
      completedOrders: Number(data.completedOrders) || 0,
      monthlyFixedCosts: costs._sum.amount || 0,
    })
  } catch (error) {
    console.error("Statistics fetch error:", error)
    return NextResponse.json({ 
      totalRevenue: 0,
      totalOrders: 0,
      activeStaff: 0,
      pendingOrders: 0,
      completedOrders: 0,
      monthlyFixedCosts: 0,
      error: "Failed to fetch statistics" 
    }, { status: 500 })
  }
}
