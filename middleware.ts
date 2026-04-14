import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES: Record<string, string[]> = {
  "/doctor": ["doctor"],
  "/clinic": ["clinic_ops"],
  "/admin": ["admin"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, and public pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/" ||
    pathname.startsWith("/onboard") ||
    pathname.startsWith("/demo") ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }

  // Check role-protected routes
  for (const [prefix, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      const role = request.cookies.get("ss-role")?.value;

      // For demo purposes, allow access if no cookie (default to appropriate role)
      if (!role) {
        // Auto-set cookie for demo
        const response = NextResponse.next();
        const defaultRole = allowedRoles[0];
        response.cookies.set("ss-role", defaultRole, { path: "/", maxAge: 86400 });
        return response;
      }

      if (!allowedRoles.includes(role)) {
        // Redirect to appropriate login
        const loginUrl = new URL(pathname.startsWith("/doctor") ? "/doctor/login" : "/onboarding", request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
