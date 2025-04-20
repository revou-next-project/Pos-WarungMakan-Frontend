import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRETT;
if (!secretKey) throw new Error("Missing NEXT_PUBLIC_JWT_SECRET");

const encodedSecret = new TextEncoder().encode(secretKey);

export async function middleware(req: NextRequest) {
  console.log("🛡 Middleware running for:", req.nextUrl.pathname);
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      console.log("Verifying token:", token);
      await jwtVerify(token, encodedSecret, {
        algorithms: ["HS256"],
      });
      isAuthenticated = true;
    } catch (error) {
      console.error("❌ Invalid or expired JWT:", error);

      // ❗️Delete the cookie when verification fails
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  if (pathname === "/login" || pathname === "/register") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const protectedRoutes = [
    "/dashboard",
    "/inventory",
    "/sales",
    "/cash-balance",
    "/reports",
    "/settings",
    "/products",
    "/recipes",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("token");
    return response;
  }

  return NextResponse.next();
}
