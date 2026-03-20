"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, DollarSign, Receipt, TrendingUp } from "lucide-react"

export default function CashierDashboard() {
  const { data: session } = useSession()

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cashier Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {session.user?.name}</p>
          </div>
          <Button variant="outline" onClick={() => signOut({ redirect: true })}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Today&apos;s Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">$0</div>
              <p className="text-xs text-gray-500 mt-1">0 transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">0</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Cash on Hand</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">$0</div>
              <p className="text-xs text-gray-500 mt-1">Register balance</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="mr-2 h-5 w-5" /> Create Invoice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Issue new invoices to customers</p>
              <Button className="w-full">New Invoice</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" /> Payment Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Record payments and cash deposits</p>
              <Button className="w-full">Record Payment</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
