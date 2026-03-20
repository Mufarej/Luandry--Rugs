import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('123456', 10)

  await prisma.user.upsert({ where: { email: 'owner@demo.com' }, update: {}, create: { name: 'Owner', email: 'owner@demo.com', password, phone: '01000000001', role: 'OWNER' } })
  await prisma.user.upsert({ where: { email: 'admin@demo.com' }, update: {}, create: { name: 'Admin', email: 'admin@demo.com', password, phone: '01000000002', role: 'ADMIN' } })
  await prisma.user.upsert({ where: { email: 'cashier@demo.com' }, update: {}, create: { name: 'Cashier', email: 'cashier@demo.com', password, phone: '01000000003', role: 'CASHIER' } })
  await prisma.user.upsert({ where: { email: 'delivery@demo.com' }, update: {}, create: { name: 'Delivery', email: 'delivery@demo.com', password, phone: '01000000004', role: 'DELIVERY' } })
  await prisma.user.upsert({ where: { email: 'tech@demo.com' }, update: {}, create: { name: 'Technician', email: 'tech@demo.com', password, phone: '01000000005', role: 'TECHNICIAN' } })
  await prisma.user.upsert({ where: { email: 'customer@demo.com' }, update: {}, create: { name: 'Customer', email: 'customer@demo.com', password, phone: '01000000006', role: 'CUSTOMER', address: 'Test Address' } })

  await prisma.service.create({ data: { name: 'Wash', nameAr: 'غسيل', items: { create: [ { name: 'Shirt', nameAr: 'قميص', price: 15 }, { name: 'Pants', nameAr: 'بنطلون', price: 20 }, { name: 'Thobe', nameAr: 'ثوب', price: 35 } ] } } })
  await prisma.service.create({ data: { name: 'Iron', nameAr: 'كي', items: { create: [ { name: 'Shirt Iron', nameAr: 'قميص', price: 10 }, { name: 'Pants Iron', nameAr: 'بنطلون', price: 15 } ] } } })
  await prisma.service.create({ data: { name: 'Wash & Iron', nameAr: 'غسيل وكي', items: { create: [ { name: 'Shirt Both', nameAr: 'قميص', price: 20 }, { name: 'Pants Both', nameAr: 'بنطلون', price: 30 } ] } } })

  const costs = [
    { name: 'Rent', type: 'FIXED', category: 'Rent', amount: 8000, frequency: 'MONTHLY' },
    { name: 'Electricity', type: 'FIXED', category: 'Utilities', amount: 500, frequency: 'MONTHLY' },
    { name: 'Water', type: 'FIXED', category: 'Utilities', amount: 200, frequency: 'MONTHLY' },
    { name: 'Cashier Salary', type: 'FIXED', category: 'Salaries', amount: 3500, frequency: 'MONTHLY' },
    { name: 'Technician Salary', type: 'FIXED', category: 'Salaries', amount: 4000, frequency: 'MONTHLY' },
    { name: 'Detergent', type: 'VARIABLE', category: 'Supplies', amount: 5, frequency: 'PER_ORDER' },
    { name: 'Softener', type: 'VARIABLE', category: 'Supplies', amount: 3, frequency: 'PER_ORDER' },
    { name: 'Packaging Bags', type: 'VARIABLE', category: 'Supplies', amount: 4, frequency: 'PER_ORDER' },
  ]

  for (const cost of costs) await prisma.cost.create({ data: cost })

  await prisma.settings.create({ data: { shopName: 'My Laundry', primaryColor: '#2563eb', phone: '01000000000', deliveryFee: 20 } })

  console.log('✅ All demo data created successfully!')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => await prisma.$disconnect())
