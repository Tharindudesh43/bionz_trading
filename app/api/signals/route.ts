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

  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
