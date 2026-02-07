import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";
import type { SignalModel } from "@/types/signal_models";

export async function POST(req: Request) {
  try {
    const { data }: { data: SignalModel } = await req.json();

    const type = data.type;
    const mode = data.mode;
    const pair = data.pair;
    const leverage = data.leverage;
    const entryPrice = data.entryPrice;
    const exitPrice = data.exitPrice;
    const stopLoss = data.stopLoss;
    const signal_id = data.signal_id;
    const edited = data.edited;
    const createdAt = new Date();
    const editedAt = new Date();
    const win_count = data.win_count;
    const loss_count = data.loss_count;
    const status = data.status;



    if (!data) {
      return NextResponse.json(
        { success: false, message: "No signal data provided" },
        { status: 400 }
      );
    }
    const docRef = await adminDB.collection("signals").add({
      type,
      mode,
      pair,
      leverage,
      entryPrice,
      exitPrice,
      stopLoss,
      signal_id,
      edited,
      createdAt,
      editedAt,
      win_count,
      loss_count,
      status,
    });

    return NextResponse.json({
      success: true,
      message: "Signal created successfully",
      id: docRef.id,
    });
  } catch (error) {
    // console.error("API Error:", error.toString());

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
