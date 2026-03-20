"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Users, Settings, BarChart3 } from "lucide-react"
import { useTranslation } from "@/lib/useLanguage"
import { useRealtime } from "@/lib/useRealtime"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function AdminDashboard() {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const { isConnected } = useRealtime({})

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-sm font-medium">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-gray-700">{isConnected ? t('online') : t('offline')}</span>
      </div>
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin_dashboard')}</h1>
            <p className="text-gray-600 mt-1">{t('welcome')}, {session.user?.name}</p>
          </div>
          <Button variant="outline" onClick={() => signOut({ redirect: true })}>
            <LogOut className="mr-2 h-4 w-4" /> {t('sign_out')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{t('system_status')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{t('healthy')}</div>
              <p className="text-xs text-gray-500 mt-1">{t('all_systems_operational')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{t('active_users')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">0</div>
              <p className="text-xs text-gray-500 mt-1">{t('online_now')}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" /> {t('user_management')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{t('manage_users_permissions')}</p>
              <div className="space-y-2">
                <div className="text-sm">{t('view_all_users')}</div>
                <div className="text-sm">{t('manage_permissions')}</div>
                <div className="text-sm">{t('review_audit_logs')}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" /> {t('system_settings')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{t('configure_system')}</p>
              <div className="space-y-2">
                <div className="text-sm">{t('general_settings')}</div>
                <div className="text-sm">{t('email_templates')}</div>
                <div className="text-sm">{t('backup_restore')}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
