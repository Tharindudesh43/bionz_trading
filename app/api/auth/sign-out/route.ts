import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import admin from "firebase-admin";

export async function POST() {
  try {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("session")?.value;

    if (sessionCookie) {
      // Decode the cookie to get the user ID
      const decoded = await admin.auth().verifySessionCookie(sessionCookie);

      // Revoke refresh tokens for this user
      await admin.auth().revokeRefreshTokens(decoded.uid);
    }

    // Create response and clear cookie
    const response = NextResponse.json({
      success: true,
      message: "Signed out successfully",
    });

    response.cookies.set("session", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 0, // expire immediately
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
