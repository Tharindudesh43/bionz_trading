import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";
export async function GET() {
  try {
    const snapshot = await adminDB.collection("users").get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      users: users,
    });
  } catch (error) {
    console.error("API Error:", error);

    let errorMessage = "An unknown server error occurred.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      errorMessage = (error as { message: string }).message;
    }
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
