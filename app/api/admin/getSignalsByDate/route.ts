import { NextResponse } from "next/server";
import { db } from "@/firebase/config"; // your Firestore config
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date"); // yyyy-mm-dd

    if (!dateParam) return NextResponse.json({ data: [], message: "No date provided" });

    // Create start and end timestamps for the day
    const start = new Date(dateParam);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateParam);
    end.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, "signals"),
      where("createdAt", ">=", Timestamp.fromDate(start)),
      where("createdAt", "<=", Timestamp.fromDate(end))
    );

    const snapshot = await getDocs(q);
    const signals = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ data: signals });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ data: [], error: "Failed to fetch signals" }, { status: 500 });
  }
}
