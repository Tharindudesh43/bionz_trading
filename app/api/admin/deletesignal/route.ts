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

  } catch (error: any) {
    console.error("DELETE API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
