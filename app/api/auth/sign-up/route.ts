import { NextResponse } from "next/server";
import admin, { adminDB } from "@/firebase/FirebaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    const uid = userRecord.uid;

    const userData = {
      uid: uid,
      email: email,
      role: "user",
      username: username || "New User",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      courseplan: "free",
      signalplan: "free",
      courses: [],
    };

    await adminDB.collection("users").doc(uid).set(userData);

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: {
        uid,
        email,
        role: "user",
      },
    });

  } catch (error: any) {
    console.error("Sign-up Error:", error);

    if (error.code === "auth/email-already-exists") {
      return NextResponse.json(
        { success: false, message: "This email is already registered." },
        { status: 400 }
      );
    }

    if (error.code === "auth/invalid-password") {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Server error during sign-up" },
      { status: 500 }
    );
  }
}