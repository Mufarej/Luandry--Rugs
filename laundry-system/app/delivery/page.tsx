"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Truck, MapPin, CheckCircle } from "lucide-react"

export default function DeliveryDashboard() {
  const { data: session } = useSession()

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {session.user?.name}</p>
          </div>
          <Button variant="outline" onClick={() => signOut({ redirect: true })}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Today&apos;s Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">0</div>
              <p className="text-xs text-gray-500 mt-1">Pending delivery</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">0</div>
              <p className="text-xs text-gray-500 mt-1">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Distance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">0 km</div>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" /> Active Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">View and manage current deliveries</p>
              <Button className="w-full">View Deliveries</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" /> Route Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Optimize delivery routes</p>
              <Button className="w-full">Generate Route</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
