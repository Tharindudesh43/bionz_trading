import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

function convertTimestampsToStrings<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Timestamp) {
    return obj.toDate().toISOString() as any;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertTimestampsToStrings(item)) as any;
  }

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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limitSize = parseInt(searchParams.get("limit") || "10");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const offsetValue = (page - 1) * limitSize;

    let query: any = adminDB.collection("analyze");

    if (startDate && endDate) {
      const startJS = new Date(`${startDate}T00:00:00.000Z`);
      const endJS = new Date(`${endDate}T23:59:59.999Z`);

      const startTimestamp = Timestamp.fromDate(startJS);
      const endTimestamp = Timestamp.fromDate(endJS);

      query = query
        .where("created_date", ">=", startTimestamp)
        .where("created_date", "<=", endTimestamp);
    }

    const countSnapshot = await query.count().get();
    const totalItems = countSnapshot.data().count;
    const totalPages = Math.ceil(totalItems / limitSize);

    const snapshot = await query
      .orderBy("created_date", "desc")
      .limit(limitSize)
      .offset(offsetValue)
      .get();

    const data = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...convertTimestampsToStrings(doc.data()),
    }));

    return NextResponse.json({
      data,
      totalItems,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("Error fetching analyze data:", err);
    return NextResponse.json(
      { data: [], error: "Server error" },
      { status: 500 }
    );
  }
}
