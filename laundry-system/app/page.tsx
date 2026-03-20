"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Shirt } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await signIn("credentials", { email, password, redirect: false })
    if (result?.error) { setError("Invalid email or password"); setLoading(false) }
    else { router.refresh() }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center"><Shirt className="w-8 h-8 text-white" /></div>
          <div><CardTitle className="text-2xl font-bold">Laundry Management System</CardTitle><CardDescription className="mt-2">Login to access your dashboard</CardDescription></div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium text-gray-700">Email</label><Input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-gray-700">Password</label><Input type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required /></div>
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>{loading ? <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> Logging in...</> : "Login"}</Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 mb-3">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>Owner: owner@demo.com</p>
              <p>Admin: admin@demo.com</p>
              <p>Cashier: cashier@demo.com</p>
              <p>Delivery: delivery@demo.com</p>
              <p>Technician: tech@demo.com</p>
              <p className="mt-2 text-gray-400">Password for all: 123456</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
