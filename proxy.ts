import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/complaints", "/admin", "/profile"];

function getRole(token: string) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).role as string;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("refreshToken")?.value;

  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // UX guard only; আসল authorization backend-এ
  if (token && pathname.startsWith("/admin") && getRole(token) !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/complaints/:path*", "/admin/:path*", "/profile/:path*"],
};