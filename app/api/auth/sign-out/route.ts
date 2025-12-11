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
  } catch (error) {
    // console.error("API Error:", error.toString());

    // 1. Determine the error message safely
    let errorMessage = "An unknown server error occurred.";

    // 2. Check if the error object is a standard JavaScript Error
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Optional: Check if it's an object with a 'message' property (e.g., a custom error)
    else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      // We assert that error is an object with a message property for TypeScript
      errorMessage = (error as { message: string }).message;
    }

    // 3. Return the sanitized message in the response
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
  
  // catch (err: any) {
  //   return NextResponse.json(
  //     { success: false, message: err.message },
  //     { status: 500 }
  //   );
  // }
}
