import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";

export async function DELETE(req: Request) {
  try {
    const { signal_id } = await req.json();

    if (!signal_id) {
      return NextResponse.json(
        { success: false, message: "signal_id is required" },
        { status: 400 }
      );
    }

    console.log("Deleting signal:", signal_id);

    // 1️⃣ Find the matching document
    const querySnapshot = await adminDB
      .collection("signals")
      .where("signal_id", "==", signal_id)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Signal not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Delete the document
    const docRef = querySnapshot.docs[0].ref;
    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Signal deleted successfully",
      signal_id,
    });

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
}
