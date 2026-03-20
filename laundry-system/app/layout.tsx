import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = { title: "Laundry Management System", description: "Complete Laundry Management System" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${cairo.className} bg-gray-50 antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
