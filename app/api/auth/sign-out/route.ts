import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import admin from "@/firebase/FirebaseAdmin"; 
export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (sessionCookie) {
      try {
        const decoded = await admin.auth().verifySessionCookie(sessionCookie);
        await admin.auth().revokeRefreshTokens(decoded.uid);
      } catch (authError) {
        console.warn("Session already invalid or expired");
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Signed out successfully",
    });

    response.cookies.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      path: "/",
      maxAge: 0, 
    });

    return response;
  } catch (error: any) {
    console.error("Sign-out Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}