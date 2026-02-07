// import { NextResponse } from "next/server";
// import { db } from "@/firebase/config"; // your Firestore config
// import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const dateParam = searchParams.get("date"); // yyyy-mm-dd

//     if (!dateParam) return NextResponse.json({ data: [], message: "No date provided" });

//     // Create start and end timestamps for the day
//     const start = new Date(dateParam);
//     start.setHours(0, 0, 0, 0);
//     const end = new Date(dateParam);
//     end.setHours(23, 59, 59, 999);

//     const q = query(
//       collection(db, "signals"),
//       where("createdAt", ">=", Timestamp.fromDate(start)),
//       where("createdAt", "<=", Timestamp.fromDate(end))
//     );

//     const snapshot = await getDocs(q);
//     const signals = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

//     return NextResponse.json({ data: signals });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ data: [], error: "Failed to fetch signals" }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { adminDB } from "@/firebase/FirebaseAdmin";
// import { Timestamp } from "firebase-admin/firestore";

// function convertTimestampsToStrings<T>(obj: T): T {
//   if (obj === null || typeof obj !== "object") {
//     return obj;
//   }

//   if (obj instanceof Timestamp) {
//     return obj.toDate().toISOString() as any;
//   }

//   if (Array.isArray(obj)) {
//     return obj.map((item) => convertTimestampsToStrings(item)) as any;
//   }

//   const newObj = {} as any;
//   for (const key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       newObj[key] = convertTimestampsToStrings((obj as any)[key]);
//     }
//   }

//   return newObj;
// }

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get("page") || "1");
//     const limitSize = parseInt(searchParams.get("limit") || "10");
//     const startDate = searchParams.get("startDate");
//     const endDate = searchParams.get("endDate");

//     const offsetValue = (page - 1) * limitSize;

//     let query: any = adminDB.collection("analyze");

//     if (startDate && endDate) {
//       const startJS = new Date(`${startDate}T00:00:00.000Z`);
//       const endJS = new Date(`${endDate}T23:59:59.999Z`);

//       const startTimestamp = Timestamp.fromDate(startJS);
//       const endTimestamp = Timestamp.fromDate(endJS);

//       query = query
//         .where("created_date", ">=", startTimestamp)
//         .where("created_date", "<=", endTimestamp);
//     }

//     const countSnapshot = await query.count().get();
//     const totalItems = countSnapshot.data().count;
//     const totalPages = Math.ceil(totalItems / limitSize);

//     const snapshot = await query
//       .orderBy("created_date", "desc")
//       .limit(limitSize)
//       .offset(offsetValue)
//       .get();

//     const data = snapshot.docs.map((doc: any) => ({
//       id: doc.id,
//       ...convertTimestampsToStrings(doc.data()),
//     }));

//     return NextResponse.json({
//       data,
//       totalItems,
//       totalPages,
//       currentPage: page,
//     });
//   } catch (err) {
//     console.error("Error fetching analyze data:", err);
//     return NextResponse.json(
//       { data: [], error: "Server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

function convertTimestampsToStrings<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Timestamp) return obj.toDate().toISOString() as any;
  if (Array.isArray(obj))
    return obj.map((item) => convertTimestampsToStrings(item)) as any;

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
    const offsetValue = (page - 1) * limitSize;

    // Optional Filters
    const type = searchParams.get("type");
    const mode = searchParams.get("mode");
    const sort = searchParams.get("sort");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    console.log("Fetching signals with params:", {
      page,
      limitSize,
      type,
      mode,
      sort,
      startDate,
      endDate,
    });

    let query: any = adminDB.collection("signals");

    if (startDate!=null && endDate!=null) {
      const startTS = Timestamp.fromDate(
        new Date(`${startDate}T00:00:00.000Z`)
      );
      const endTS = Timestamp.fromDate(new Date(`${endDate}T23:59:59.999Z`));
      query = query
        .where("createdAt", ">=", startTS)
        .where("createdAt", "<=", endTS);
    } else {
      if (sort) {
        query = query.orderBy("createdAt", sort).offset(offsetValue);
      } else {
        if (type) {
          query = query.where("type", "==", type);
        }
        if (mode) {
          query = query.where("mode", "==", mode);
        }
      }
    }

    const snapshot = await query.limit(limitSize).get();

    const data = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...convertTimestampsToStrings(doc.data()),
    }));

    return NextResponse.json({
      success: true,
      data,
      currentPage: page,
    });
  } catch (err: any) {
    console.error("Error fetching signals:", err);
    return NextResponse.json(
      { data: [], error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
