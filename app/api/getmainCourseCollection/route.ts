import { NextResponse } from "next/server";
import admin,{adminDB} from "@/firebase/FirebaseAdmin";
import { collection, getDocs } from "firebase/firestore";
import { AnalyzeModel } from "@/types/analyze_model";
import { MainCollection } from "@/types/collection_models";

export async function GET(req: Request) {
  try {
    const coursesRef = adminDB.collection("courses");
    const snapshot = await coursesRef.where("collection_type", "==", "Main").get();

    const data = snapshot.docs.map(doc => {
      const d = doc.data() as MainCollection;

      return {
        id: doc.id,      
        collection_id: d.collection_id,
        collection_type: d.collection_type,
        created_date: d.created_date ? d.created_date.toString() : new Date().toISOString(),
        description: d.description,
        pdf_link: d.pdf_link,
        thumbnail_image: d.thumbnail_image,
        title: d.title,
        video_link: d.video_link,
      };
    });
    return NextResponse.json({ success: true, data: data }, { status: 200 });
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}