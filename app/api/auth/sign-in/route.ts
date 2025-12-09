import { NextResponse } from "next/server";
import admin,{ adminDB } from "@/firebase/FirebaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const loginRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await loginRes.json();

    if (data.error) {
      const code = data.error.message;

      const errorMap: any = {
        INVALID_PASSWORD: "Incorrect password",
        EMAIL_NOT_FOUND: "Email not registered",
      };

      return NextResponse.json(
        { success: false, message: errorMap[code] || code },
        { status: 400 }
      );
    }

    const idToken = data.idToken;
    const uid = data.localId;

    // Verify user token to get custom claims
    const decodedToken = await admin.auth().verifyIdToken(idToken);
  
    let role: string | null = null;

    if (decodedToken.role=="admin") {
      role = "admin";
      console.log("Admin login detected, skipping Firestore check.");
    } else {
      const userRef = adminDB.collection("users").doc(uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        return NextResponse.json(
          { success: false, message: "No user record found in Firestore" },
          { status: 403 }
        );
      }

      role = userSnap.data()?.role;

      if (!role) {
        return NextResponse.json(
          { success: false, message: "User has no assigned role" },
          { status: 403 }
        );
      }
    }

    // Create session cookie (works for admin & normal user)
    const expiresIn = 1000 * 60 * 60 * 24 * 7; // 7 days
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      uid,
      role,
    });

    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresIn / 1000,
      path: "/",
    });

    console.log(response);

    return response;

  } catch (err: any) {
    console.error("Error during sign-in:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
