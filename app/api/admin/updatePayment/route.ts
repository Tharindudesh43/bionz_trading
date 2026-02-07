import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Data received at backend:", body); 

    const { payment_id, status } = body;

    if (!payment_id || !status) {
      return NextResponse.json(
        { error: "Missing ID or Status" },
        { status: 400 }
      );
    }

    const updateData: any = {
      status: status,
    };

    if (status === "approved") {
      updateData.approveAt = Timestamp.now();
    }

 
    const querySnapshot = await adminDB
      .collection("payments")
      .where("payment_id", "==", payment_id)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }
    const docRef = querySnapshot.docs[0].ref;
    await docRef.update(updateData); 

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}