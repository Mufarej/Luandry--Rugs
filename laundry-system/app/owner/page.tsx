"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, TrendingUp, Users, Package, Wifi, WifiOff, RefreshCw } from "lucide-react"
import { useTranslation } from "@/lib/useLanguage"
import { useRealtime } from "@/lib/useRealtime"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function OwnerDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const { t, isRTL } = useTranslation()
  const { isConnected, orders, subscribeToAllOrders } = useRealtime()
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, activeStaff: 0, pendingOrders: 0 })
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    subscribeToAllOrders()
    fetchStats()
  }, [subscribeToAllOrders])

  const fetchStats = async () => {
    try {
      setRefreshing(true)
      const res = await fetch("/api/statistics")
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch statistics:", error)
    } finally {
      setRefreshing(false)
    }
  }

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">{t('loading')}</div>
  }

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 right-4 flex gap-2">
        <LanguageSwitcher />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('owner_dashboard')}</h1>
            <p className="text-gray-600 mt-1">{t('login_to_access').replace('access', 'viewing')}, {session.user?.name}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchStats}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors ${refreshing ? 'opacity-50' : ''}`}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> {t('refresh')}
            </button>
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isConnected ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
              title={isConnected ? t('online') : t('offline')}
            >
              {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              {isConnected ? t('online') : t('offline')}
            </button>
            <Button variant="outline" onClick={() => signOut({ redirect: true })}>
              <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('sign_out')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{t('revenue')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{t('total_orders')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalOrders}</div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{t('pending_orders')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</div>
              <p className="text-xs text-gray-500 mt-1">{t('in_process')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{t('live_orders')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{orders.length}</div>
              <p className="text-xs text-gray-500 mt-1">{t('real_time_updates')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('statistics')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">✅ {t('real_time_updates')} {t('loading')}</p>
              <div className="space-y-2">
                <div className="text-sm">📊 Daily revenue tracking</div>
                <div className="text-sm">📈 Monthly forecasts</div>
                <div className="text-sm">📉 Performance metrics</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Users className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('users')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Active staff: {stats.activeStaff}</p>
              <div className="space-y-2">
                <div className="text-sm">👤 Add/remove staff</div>
                <div className="text-sm">🎯 Assign roles</div>
                <div className="text-sm">⭐ View performance</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
