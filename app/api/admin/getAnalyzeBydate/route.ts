// import { NextResponse } from "next/server";
// import { adminDB } from "@/firebase/FirebaseAdmin";
// import { collection, query, orderBy, getDocs } from "firebase/firestore";

// export async function GET() {
//   try {
//     const snapshot = await adminDB
//       .collection("analyze")
//       .orderBy("created_date", "desc")
//       .get();

//     const data = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     console.log("Fetched analyze data:", data);
//     return NextResponse.json({ data });
//   } catch (err) {
//     console.error("Error fetching analyze data:", err);
//     return NextResponse.json({ data: [], error: "Server error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/FirebaseAdmin";
// Import the necessary Timestamp type from the Admin SDK
import { Timestamp } from "firebase-admin/firestore";

function convertTimestampsToStrings<T>(obj: T): T {
    // 1. Base Case: If null or not an object, return the value as is.
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Timestamp) {
        return obj.toDate().toISOString() as T; 
    }

    if (Array.isArray(obj)) {
        return obj.map(item => convertTimestampsToStrings(item)) as T;
    }
    const newObj = {} as T; 
    
    // Type-safely iterate over keys
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
            .collection("analyze")
            .orderBy("created_date", "desc")
            .get();

        const data = snapshot.docs.map(doc => {
            const rawData = doc.data();
            
            // 🛑 CRITICAL STEP: Convert Timestamps before mapping
            const convertedData = convertTimestampsToStrings(rawData);

            return {
                id: doc.id,
                ...convertedData,
            };
        });

        console.log("Fetched analyze data:", data);
        return NextResponse.json({ data });
    } catch (err) {
        console.error("Error fetching analyze data:", err);
        return NextResponse.json({ data: [], error: "Server error" }, { status: 500 });
    }
}