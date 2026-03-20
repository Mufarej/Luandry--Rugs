"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, TrendingUp, Users, Package } from "lucide-react"

export default function OwnerDashboard() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {session.user?.name}</p>
          </div>
          <Button variant="outline" onClick={() => signOut({ redirect: true })}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">$0</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">0</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">0</div>
              <p className="text-xs text-gray-500 mt-1">Employees</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" /> Business Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Coming soon</p>
              <div className="space-y-2">
                <div className="text-sm">Daily revenue tracking</div>
                <div className="text-sm">Monthly forecasts</div>
                <div className="text-sm">Performance metrics</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" /> Staff Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Coming soon</p>
              <div className="space-y-2">
                <div className="text-sm">Add/remove staff</div>
                <div className="text-sm">Assign roles</div>
                <div className="text-sm">View performance</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
