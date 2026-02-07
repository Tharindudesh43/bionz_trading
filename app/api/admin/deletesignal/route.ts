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
    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Signal deleted successfully",
      signal_id,
    });

  } catch (error) {

    let errorMessage = "An unknown server error occurred.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      errorMessage = (error as { message: string }).message;
    }
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
