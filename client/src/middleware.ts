import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    if (pathname === "/dashboard/workflow") {
      return NextResponse.redirect(
        new URL("/dashboard/workflow/new", request.url)
      );
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};