"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Shirt } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/useLanguage"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LoginPage() {
  const router = useRouter()
  const { t, isRTL } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await signIn("credentials", { email, password, redirect: false })
    if (result?.error) { 
      setError(t('invalid_credentials'))
      setLoading(false) 
    } else {
      // Redirect based on session data
      const res = await fetch("/api/auth/session")
      const session = await res.json()
      if (session?.user?.role) {
        const roleMap: Record<string, string> = {
          OWNER: "/owner",
          ADMIN: "/admin",
          CASHIER: "/cashier",
          DELIVERY: "/delivery",
          TECHNICIAN: "/technician",
          CUSTOMER: "/customer"
        }
        router.push(roleMap[session.user.role] || "/")
      }
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center"><Shirt className="w-8 h-8 text-white" /></div>
          <div><CardTitle className="text-2xl font-bold">{t('app_name')}</CardTitle><CardDescription className="mt-2">{t('login_to_access')}</CardDescription></div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium text-gray-700">{t('email')}</label><Input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-gray-700">{t('password')}</label><Input type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required /></div>
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>{loading ? <><Loader2 className={`h-5 w-5 animate-spin ${isRTL ? 'mr-2' : 'ml-2'}`} /> {t('logging_in')}...</> : t('login')}</Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              {t('dont_have_account')}{" "}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                {t('register_here')}
              </Link>
            </p>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 mb-3">{t('demo_accounts')}:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>Owner: owner@demo.com</p>
              <p>Admin: admin@demo.com</p>
              <p>Cashier: cashier@demo.com</p>
              <p>Delivery: delivery@demo.com</p>
              <p>Technician: tech@demo.com</p>
              <p className="mt-2 text-gray-400">Password: 123456</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
