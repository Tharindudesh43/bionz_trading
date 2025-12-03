import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (!url.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const session = req.cookies.get("session")?.value;

  // Not logged in → redirect home
  if (!session) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Validate session through API (Node.js runtime)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/checkAccess`, {
    method: "POST",
    body: JSON.stringify({ session }),
    headers: { "Content-Type": "application/json" },
  });

  const { admin } = await res.json();

  if (!admin) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
