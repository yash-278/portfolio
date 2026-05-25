import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // Guard: only redirect on production to avoid matching Vercel preview URLs (D-11)
  if (process.env.VERCEL_ENV !== "production") {
    return NextResponse.next();
  }

  // Use request.headers.get('host') — NOT request.nextUrl.hostname (Pitfall 4)
  // request.nextUrl.hostname returns the deployment URL, not the browser's Host header
  const host = request.headers.get("host") ?? "";
  if (host === "blog.yashkadam.com") {
    // 308 = permanent redirect, method-preserving (not 301/302) (D-10)
    return NextResponse.redirect("https://www.yashkadam.com/blog", {
      status: 308,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude static files and Next.js internals to avoid unnecessary proxy processing (Pitfall 6)
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
