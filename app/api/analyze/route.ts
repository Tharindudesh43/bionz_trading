import { NextResponse } from "next/server";
import admin,{adminDB} from "@/firebase/FirebaseAdmin";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { AnalyzeModel } from "@/types/analyze_model";

export async function GET(req: Request) {
  try {
    // Use Admin SDK Firestore methods (firebase-admin) instead of client SDK helpers
    const analyzesRef = await adminDB.collection("analyze");
    const snapshot = await analyzesRef.get();
    const data = snapshot.docs.map(doc => {
    const d = doc.data() as AnalyzeModel;

    return {
      id: doc.id,      
      analyze_id: d.analyze_id,
      created_date: d.created_date instanceof Timestamp ? d.created_date.toDate().toISOString() : d.created_date,
      analyze_image: d.analyze_image,
      analyze_description: d.analyze_description,
      pair: d.pair,
      type: d.type,
    };
  });

    console.log("Fetched analyzes:", data);

    return NextResponse.json({ success: true, data: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}