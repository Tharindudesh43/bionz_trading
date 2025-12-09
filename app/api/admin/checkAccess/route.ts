import admin from "@/firebase/FirebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { session } = await req.json();

    if (!session) {
      return NextResponse.json({ admin: false }, { status: 401 });
    }

    // Verify Firebase session cookie
    const decoded = await admin.auth().verifySessionCookie(session, true);

    // Check user role
    const role = decoded.role || null;

    if (role === "admin") {
      return NextResponse.json({ admin: true });
    } else {
      return NextResponse.json({ admin: false });
    }
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json({ admin: false }, { status: 401 });
  }
}
