"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Users, Settings, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
  const { data: session } = useSession()

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {session.user?.name}</p>
          </div>
          <Button variant="outline" onClick={() => signOut({ redirect: true })}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-gray-500 mt-1">All systems operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">0</div>
              <p className="text-xs text-gray-500 mt-1">Online now</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" /> User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Manage system users and permissions</p>
              <div className="space-y-2">
                <div className="text-sm">View all users</div>
                <div className="text-sm">Manage permissions</div>
                <div className="text-sm">Review audit logs</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" /> System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Configure system parameters</p>
              <div className="space-y-2">
                <div className="text-sm">General settings</div>
                <div className="text-sm">Email templates</div>
                <div className="text-sm">Backup & restore</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
