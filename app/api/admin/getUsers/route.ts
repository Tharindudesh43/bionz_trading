import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";
// import { UserModel } from "@/types/user_models";

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
  } catch (error) {
    console.error("API Error:", error);

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
}
