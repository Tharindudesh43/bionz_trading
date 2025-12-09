import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (!url.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const session = req.cookies.get("session")?.value;

  if (!session) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Call API route for session validation
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/checkAccess`, {
    method: "POST",
    body: JSON.stringify({ session }),
    headers: { "Content-Type": "application/json" },
  });

  // This must return JSON
  let json: any;
  try {
    json = await res.json();
  } catch (err) {
    // If fetch returns HTML (like 404 or Next error page), redirect
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (!json.admin) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
