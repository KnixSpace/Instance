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

  const match = pathname.match(/\/dashboard\/workflow\/([^/]+)/);
  const workflowId = match ? match[1] : null;
  if (workflowId === "new") {
    return NextResponse.next();
  }
  if (workflowId && cookieSession) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/workflow/existWorkflow/${workflowId}`,
        {
          headers: {
            Cookie: `connect.sid=${cookieSession.value}`,
          },
        }
      );
      if (response.status === 200) {
        return NextResponse.next();
      }
    } catch (error: any) {
      if (
        error.response?.status === 404 ||
        error.response?.status === 401 ||
        error.response?.status === 500
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard/workflow/:path*",
    "/",
    "/about",
    "/register",
  ],
};
