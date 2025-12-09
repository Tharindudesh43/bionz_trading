import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";
import { UserModel } from "@/types/user_models";

export async function GET() {
  try {
    const snapshot = await adminDB.collection("users").get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched users:", users);

    return NextResponse.json({
      success: true,
      users: users,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
