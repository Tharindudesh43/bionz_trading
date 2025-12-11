import { NextResponse } from "next/server";
import admin,{adminDB} from "@/firebase/FirebaseAdmin";
import { collection, getDocs } from "firebase/firestore";
import { AnalyzeModel } from "@/types/analyze_model";

export async function GET(req: Request) {
  try {
    // Use Admin SDK Firestore methods (firebase-admin) instead of client SDK helpers
    const analyzesRef = await adminDB.collection("analyze");
    const snapshot = await analyzesRef.get();
    const data = snapshot.docs.map(doc => {
    const d = doc.data() as AnalyzeModel;

    return {
      id: doc.id,      
      analyze_id: d.analyze_id,
      created_date: d.created_date.toString(),
      analyze_image: d.analyze_image,
      analyze_description: d.analyze_description,
      pair: d.pair,
      type: d.type,
    };
  });

    console.log("Fetched analyzes:", data);

    return NextResponse.json({ success: true, data: data }, { status: 200 });
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