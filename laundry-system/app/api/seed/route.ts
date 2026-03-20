import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    // Security check - only allow from localhost or with a secret key
    const authHeader = req.headers.get("authorization")
    const secret = process.env.SEED_SECRET || "dev-seed-secret"
    
    if (authHeader !== `Bearer ${secret}` && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const password = await bcrypt.hash("123456", 10)

    // Create demo users
    const users = [
      { name: "Owner", email: "owner@demo.com", phone: "01000000001", role: "OWNER" as const },
      { name: "Admin", email: "admin@demo.com", phone: "01000000002", role: "ADMIN" as const },
      { name: "Cashier", email: "cashier@demo.com", phone: "01000000003", role: "CASHIER" as const },
      { name: "Delivery", email: "delivery@demo.com", phone: "01000000004", role: "DELIVERY" as const },
      { name: "Technician", email: "tech@demo.com", phone: "01000000005", role: "TECHNICIAN" as const },
      { name: "Customer", email: "customer@demo.com", phone: "01000000006", role: "CUSTOMER" as const, address: "Test Address" },
    ]

    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: { 
          name: user.name, 
          email: user.email, 
          phone: user.phone, 
          role: user.role, 
          address: "address" in user ? user.address : undefined,
          password 
        },
      })
    }

    // Create services
    const services = [
      {
        name: "Wash",
        nameAr: "غسيل",
        items: {
          create: [
            { name: "Shirt", nameAr: "قميص", price: 15 },
            { name: "Pants", nameAr: "بنطلون", price: 20 },
            { name: "Thobe", nameAr: "ثوب", price: 35 },
          ],
        },
      },
      {
        name: "Iron",
        nameAr: "كي",
        items: {
          create: [
            { name: "Shirt Iron", nameAr: "قميص", price: 10 },
            { name: "Pants Iron", nameAr: "بنطلون", price: 15 },
          ],
        },
      },
      {
        name: "Wash & Iron",
        nameAr: "غسيل وكي",
        items: {
          create: [
            { name: "Shirt Both", nameAr: "قميص", price: 20 },
            { name: "Pants Both", nameAr: "بنطلون", price: 30 },
          ],
        },
      },
    ]

    for (const service of services) {
      const existing = await prisma.service.findFirst({
        where: { name: service.name },
      })
      if (!existing) {
        await prisma.service.create({ data: service })
      }
    }

    // Create costs
    const costs = [
      { name: "Rent", type: "FIXED", category: "Rent", amount: 8000, frequency: "MONTHLY" },
      { name: "Electricity", type: "FIXED", category: "Utilities", amount: 500, frequency: "MONTHLY" },
      { name: "Water", type: "FIXED", category: "Utilities", amount: 200, frequency: "MONTHLY" },
      { name: "Cashier Salary", type: "FIXED", category: "Salaries", amount: 3500, frequency: "MONTHLY" },
      { name: "Technician Salary", type: "FIXED", category: "Salaries", amount: 4000, frequency: "MONTHLY" },
      { name: "Detergent", type: "VARIABLE", category: "Supplies", amount: 5, frequency: "PER_ORDER" },
      { name: "Softener", type: "VARIABLE", category: "Supplies", amount: 3, frequency: "PER_ORDER" },
      { name: "Packaging Bags", type: "VARIABLE", category: "Supplies", amount: 4, frequency: "PER_ORDER" },
    ]

    for (const cost of costs) {
      const existing = await prisma.cost.findFirst({
        where: { name: cost.name },
      })
      if (!existing) {
        await prisma.cost.create({ data: cost })
      }
    }

    // Create settings
    const existingSettings = await prisma.settings.findFirst()
    if (!existingSettings) {
      await prisma.settings.create({
        data: {
          shopName: "My Laundry",
          primaryColor: "#2563eb",
          phone: "01000000000",
          deliveryFee: 20,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      users: users.length,
      services: services.length,
      costs: costs.length,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    )
  }
}
