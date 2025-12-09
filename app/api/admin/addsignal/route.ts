import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";
import type { SignalModel } from "@/types/signal_models";

export async function POST(req: Request) {
  try {
    const { data }: { data: SignalModel } = await req.json();

    if (!data) {
      return NextResponse.json(
        { success: false, message: "No signal data provided" },
        { status: 400 }
      );
    }
    const docRef = await adminDB.collection("signals").add({
      ...data
    });

    return NextResponse.json({
      success: true,
      message: "Signal created successfully",
      id: docRef.id,
      signal: data,
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
