import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const roleRoutes = {
  OWNER: "/owner",
  ADMIN: "/admin",
  CASHIER: "/cashier",
  DELIVERY: "/delivery",
  TECHNICIAN: "/technician",
  CUSTOMER: "/customer",
}

export async function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token && pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (token && pathname === "/") {
    const role = token.role as string | undefined
    const redirectPath = roleRoutes[role as keyof typeof roleRoutes] || "/customer"
    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  if (token && pathname.startsWith("/")) {
    const role = token.role as string | undefined
    const allowedPath = roleRoutes[role as keyof typeof roleRoutes]
    if (allowedPath && !pathname.startsWith(allowedPath)) {
      return NextResponse.redirect(new URL(allowedPath, req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
