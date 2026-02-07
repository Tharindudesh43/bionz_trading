import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

function convertTimestampsToStrings<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;

  if (obj instanceof Timestamp) {
    return obj.toDate().toISOString() as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertTimestampsToStrings(item)) as T;
  }

  const newObj = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key as keyof T] = convertTimestampsToStrings(obj[key]);
    }
  }

  return newObj;
}

export async function GET() {
  try {
    const snapshot = await adminDB
      .collection("courses")
      .where("collection_type", "==", "Main")       
      .get();

    const data = snapshot.docs.map((doc) => {
      const rawData = doc.data();
      const convertedData = convertTimestampsToStrings(rawData);

      return {
        id: doc.id,
        ...convertedData,
      };
    });
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error fetching courses:", err);
    return NextResponse.json(
      { data: [], error: "Server error" },
      { status: 500 }
    );
  }
}
