import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { success: false, message: "User UID is required" },
        { status: 400 }
      );
    }

    const userDoc = await adminDB.collection("users").doc(uid).get();

    console.log("Fetched user document:", userDoc.exists ? userDoc.data() : "No such document");

    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

 
    const formattedUser = {
      ...userData,
      uid: userDoc.id,
      createdAt: userData?.createdAt?.toDate ? userData.createdAt.toDate().toISOString() : userData?.createdAt,
      lastLogin: userData?.lastLogin?.toDate ? userData.lastLogin.toDate().toISOString() : userData?.lastLogin,
    };

    return NextResponse.json({
      success: true,
      user: formattedUser,
    });

  } catch (error: any) {
    console.error("Error fetching user by ID:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}