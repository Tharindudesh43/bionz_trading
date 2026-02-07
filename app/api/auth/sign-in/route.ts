import { NextResponse } from "next/server";
import admin, { adminDB } from "@/firebase/FirebaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const loginRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
      method: "POST",
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await loginRes.json();
    if (data.error) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const expiresIn = 60 * 60 * 24 * 7 * 1000; 
    const sessionCookie = await admin.auth().createSessionCookie(data.idToken, { expiresIn });

    const response = NextResponse.json({ success: true });

    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn / 1000,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}