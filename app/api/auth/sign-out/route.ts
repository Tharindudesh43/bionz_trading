import { NextResponse } from "next/server";
import { cookies } from "next/headers"
import admin from "firebase-admin";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: "Signed out successfully" });

    // 1. Read session cookie
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("session")?.value;

  
    if (sessionCookie) {
      // Decode the cookie to get the user ID
      const decoded = await admin.auth().verifySessionCookie(sessionCookie);

      // 2. Revoke refresh tokens for this user (important!)
      await admin.auth().revokeRefreshTokens(decoded.uid);
    }

    // 3. Clear cookie (main sign-out action)
    const res = NextResponse.json({
      success: true,
      message: "Signed out successfully",
    });

    // Clear the session cookie
    response.cookies.set("session", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 0, // immediately expire
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
