import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";

export async function GET() {
  try {

    // 🔥 Sort by createdAt (newest first)
    const snapshot = await adminDB
      .collection("signals")
      .orderBy("createdAt", "desc")
      .get();

    const data = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        ...d,
        createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : d.createdAt,
        editedAt: d.editedAt?.toDate ? d.editedAt.toDate() : d.editedAt,
      };
    });

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );

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
  
  
  // catch (err: any) {
  //   console.error("API error:", err);
  //   return NextResponse.json(
  //     { error: err.message || "Unknown error" },
  //     { status: 500 }
  //   );
  // }
}
