import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";

export async function PATCH(req: Request) {
  try {
    const { signal_id, status } = await req.json();

    console.log("Received data:", { signal_id, status });   

    if (!signal_id) {
      return NextResponse.json(
        { success: false, message: "signal_id is required" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { success: false, message: "status field is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Find document by signal_id
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

    const docRef = querySnapshot.docs[0].ref;

    // 2️⃣ Only update the "status" field
    await docRef.update({
      status: status,
      updated_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: `Status updated to ${status}`,
      signal_id,
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
