import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";

export async function PATCH(req: Request) {
  try {
    const { data } = await req.json();

    if (!data || !data.signal_id) {
      return NextResponse.json(
        { success: false, message: "signal_id is required" },
        { status: 400 }
      );
    }

    const signalId = data.signal_id;

    console.log("Received data for update:", data);

    const querySnapshot = await adminDB
      .collection("signals")
      .where("signal_id", "==", signalId)
      .get();
      
    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Signal not found" },
        { status: 404 }
      );
    }

    // Get the doc reference
    const docRef = querySnapshot.docs[0].ref;

    // 2️⃣ Update the document
    await docRef.update({
      ...data,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Signal updated successfully",
      signal_id: signalId,
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
