import { NextResponse } from "next/server";
import admin, { adminDB } from "@/firebase/FirebaseAdmin";

export async function POST(req: Request) {
  try {
    const { signalId, outcome, userId } = await req.json();

    if (!signalId || !userId || (outcome !== "win" && outcome !== "loss")) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const snap = await adminDB
      .collection("signals")
      .where("signal_id", "==", signalId)
      .limit(1)
      .get();

    if (snap.empty) {
      return NextResponse.json(
        { message: "Signal not found" },
        { status: 404 },
      );
    }

    const signalRef = snap.docs[0].ref;

    await adminDB.runTransaction(async (tx) => {
      const snap = await tx.get(signalRef);
      if (!snap.exists) throw new Error("Signal not found");

      const data = snap.data() || {};
      const outcomesByUser = (data.outcomesByUser ?? {}) as Record<
        string,
        "win" | "loss"
      >;

      if (outcomesByUser[userId]) {
        const err: any = new Error("ALREADY_SUBMITTED");
        err.code = "ALREADY_SUBMITTED";
        throw err;
      }

      const updates: Record<string, any> = {
        [`outcomesByUser.${userId}`]: outcome,
        ...(outcome === "win"
          ? { win_count: admin.firestore.FieldValue.increment(1) }
          : { loss_count: admin.firestore.FieldValue.increment(1) }),
      };

      tx.update(signalRef, updates);
    });

    return NextResponse.json(
      { message: "Outcome updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);

    if (
      error?.code === "ALREADY_SUBMITTED" ||
      error?.message === "ALREADY_SUBMITTED"
    ) {
      return NextResponse.json(
        { message: "You already submitted outcome for this signal." },
        { status: 409 },
      );
    }

    if (error?.message === "Signal not found") {
      return NextResponse.json(
        { message: "Signal not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
