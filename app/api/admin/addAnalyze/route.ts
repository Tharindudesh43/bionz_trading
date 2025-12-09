import { NextResponse } from "next/server";
// import { adminDB, adminStorage } from "@/firebase/FirebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import  { AnalyzeModel } from '@/types/analyze_model'

export async function POST(req: Request) {
  try {
  //  const { data }: { data: AnalyzeModel } = await req.json();
     

  //   if (!data.analyze_image || !(data.analyze_image instanceof File)) {
  //     return NextResponse.json(
  //       { success: false, message: "Image is required" },
  //       { status: 400 }
  //     );
  //   }

  //   // Convert image to buffer
  //   const bytes = await data.analyze_image.arrayBuffer();
  //   const buffer = Buffer.from(bytes);

  //   // Generate unique file name
  //   const fileName = `analyze/${uuidv4()}-
  //   ${data.analyze_image.name}`;
  //   // Upload to Firebase Storage
  //   const file = adminStorage.file(fileName);

  //   await file.save(buffer, {
  //     metadata: {
  //       contentType: data.analyze_image.type,
  //       firebaseStorageDownloadTokens: uuidv4(),
  //     },
  //   });

  //   // Construct download URL
  //   const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(
  //     fileName
  //   )}?alt=media`;

  //   // Save document in Firestore
  //   const docRef = await adminDB.collection("analyze").add({
     
  //   });

  //   return NextResponse.json({
  //     success: true,
  //     message: "Analyze data added successfully",
  //     id: docRef.id,
  //     imageUrl,
  //   });
  } catch (error: any) {
    console.error("Analyze Add Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
