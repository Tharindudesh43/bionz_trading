import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";

export async function GET() {
  try {
    const snapshot = await adminDB
      .collection("courses")
      .where("collection_type", "==", "Sub")
      .get();

    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id, // Firestore doc id
        collection_id: d.collection_id, // your course id field (fallback)
        title: d.title ?? "Untitled Course",  // course name
        price: d.price || 0,
        currency: d.currency || "",
      };
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
