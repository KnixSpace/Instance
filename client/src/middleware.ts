import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieSession = request.cookies.get("connect.sid");
  const publicRoutes = ["/", "/about", "/register"];

  if (cookieSession) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/check`,
        {
          headers: {
            Cookie: `connect.sid=${cookieSession.value}`,
          },
        }
      );
      if (response.status === 200) {
        if (publicRoutes.includes(pathname)) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        if (pathname === "/dashboard") {
          return NextResponse.next();
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        if (pathname.startsWith("/dashboard")) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    }
  } else {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname === "/dashboard/workflow") {
    return NextResponse.redirect(
      new URL("/dashboard/workflow/new", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/", "/about", "/register"],
};
