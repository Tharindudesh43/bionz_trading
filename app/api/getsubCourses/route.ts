import { NextResponse } from "next/server";
import admin, { adminDB } from "@/firebase/FirebaseAdmin";

export async function GET(req: Request) {
  try {
    const coursesRef = adminDB.collection("courses");
    const snapshot = await coursesRef.where("collection_type", "==", "Sub").get();

    const data = snapshot.docs.map(doc => {
      const d = doc.data();

      return {
        id: doc.id, 
        collection_id: d.collection_id,
        collection_type: d.collection_type,
        created_date: d.created_date, 
        description: d.description,
        title: d.title,
        price: d.price || 0,
        currency: d.currency || "RS",
        thumbnail_image: d.thumbnail_image,
        thumbnail_image_path: d.thumbnail_image_path || null,
        intro_video_link: d.intro_video_link || "",
        main_pdf_link: d.main_pdf_link || d.pdf_link || "",
        
        sub_contents: (d.sub_contents || []).map((content: any) => ({
          content_id: content.content_id,
          created_date: content.created_date,
          description: content.description,
          thumbnail_image: content.thumbnail_image,
          thumbnail_image_path: content.thumbnail_image_path || null,
          title: content.title,
          video_link: content.video_link,
          pdf_link: content.pdf_link || ""
        })),
      };
    });

    console.log(`Fetched ${data.length} Sub-Collections`);

    return NextResponse.json({ success: true, data: data }, { status: 200 });
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}