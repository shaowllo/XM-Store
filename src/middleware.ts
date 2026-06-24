import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/profile", "/profile/addresses", "/orders", "/wishlist", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (!isProtected) {
    return NextResponse.next();
  }

  const session = request.cookies.get("xmstore-session")?.value;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/orders/:path*", "/checkout", "/wishlist", "/admin/:path*"],
};
