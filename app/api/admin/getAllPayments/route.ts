import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

function convertTimestampsToStrings<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Timestamp) return obj.toDate().toISOString() as any;
  if (Array.isArray(obj)) return obj.map((item) => convertTimestampsToStrings(item)) as any;

  const newObj = {} as any;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = convertTimestampsToStrings((obj as any)[key]);
    }
  }
  return newObj;
}

export async function GET(request: NextRequest) {
  try {
    // const { searchParams } = new URL(request.url);
    // const startDate = searchParams.get("startDate");
    // const endDate = searchParams.get("endDate");

    let query: any = adminDB.collection("payments");

    // if (startDate && endDate) {
    //   const startTimestamp = Timestamp.fromDate(new Date(`${startDate}T00:00:00.000Z`));
    //   const endTimestamp = Timestamp.fromDate(new Date(`${endDate}T23:59:59.999Z`));

    //   query = query
    //     .where("created_date", ">=", startTimestamp)
    //     .where("created_date", "<=", endTimestamp);
    // }

    // Sort by date and fetch ALL documents
    const snapshot = await query.orderBy("uploadAt", "desc").get();

    const data = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...convertTimestampsToStrings(doc.data()),
    }));

    return NextResponse.json({
      success: true,
      totalItems: data.length,
      data: data,
    });
    
  } catch (err) {
    console.error("Error fetching all payment data:", err);
    return NextResponse.json(
      { data: [], error: "Server error" },
      { status: 500 }
    );
  }
}
