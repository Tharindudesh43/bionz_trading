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

/**
 * Helper function to recursively convert Firebase Timestamp objects to ISO date strings.
 * @param obj The data object retrieved from Firestore.
 * @returns The object with Timestamps converted to strings.
 */
function convertTimestampsToStrings(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Timestamp) {
        // Convert the Timestamp object to a JavaScript Date, then to an ISO string
        return obj.toDate().toISOString();
    }

    if (Array.isArray(obj)) {
        return obj.map(item => convertTimestampsToStrings(item));
    }

    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = convertTimestampsToStrings(obj[key]);
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