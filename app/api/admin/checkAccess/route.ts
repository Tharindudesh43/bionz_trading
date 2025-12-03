import admin from "@/firebase/FirebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { session } = await req.json();
    const decoded = await admin.auth().verifySessionCookie(session);
    const role =  decoded.role;

    if (role === 'admin') {
      return NextResponse.json({ admin: true });
    }else {
      return NextResponse.json({ admin: false });
    }
  } catch (e) {
    return NextResponse.json({ admin: false });
  }
}
