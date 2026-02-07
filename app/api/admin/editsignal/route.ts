import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function PATCH(req: Request) {
  try {
    const { data } = await req.json();

    const type = data?.type;
    const mode = data?.mode;
    const pair = data?.pair;
    const leverage = data?.leverage;
    const entryPrice = data?.entryPrice;
    const exitPrice = data?.exitPrice;
    const stopLoss = data?.stopLoss;
    const signal_id = data?.signal_id;
    const edited = data?.edited;
    const createdAt = Timestamp.fromDate(new Date(data?.createdAt));
    const editedAt = new Date();
    const win_count = data?.win_count;
    const loss_count = data?.loss_count;
    const status = data?.status;

    if (!data || !data.signal_id) {
      return NextResponse.json(
        { success: false, message: "signal_id is required" },
        { status: 400 }
      );
    }

    const signalId = data.signal_id;

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

    const docRef = querySnapshot.docs[0].ref;

    await docRef.update({
      type,
      mode,
      pair,
      leverage,
      entryPrice,
      exitPrice,
      stopLoss,
      edited,
      editedAt,
      createdAt,
      win_count,
      loss_count,
      status,
    });

    return NextResponse.json({
      success: true,
      message: "Signal updated successfully",
      signal_id: signalId,
    });
  } catch (error) {
    console.error("API Error:", error);

    let errorMessage = "An unknown server error occurred.";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (
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
