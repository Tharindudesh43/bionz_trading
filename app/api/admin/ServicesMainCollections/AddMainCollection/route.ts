import { NextResponse } from "next/server";
import { adminDB, adminStorage } from "@/firebase/FirebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const collection_id = formData.get("collection_id") as string | null;
    const collection_type = formData.get("collection_type") as string | null;
    const description = formData.get("description") as string | null;
    const pdf_link = formData.get("pdf_link") as string | null;
    const title = formData.get("title") as string | null;
    const video_link = formData.get("video_link") as string | null;

    const image = formData.get("thumbnail_image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Thumbnail image is required" },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `courses/main/${uuidv4()}-${image.name}`;
    const bucketFile = adminStorage.file(fileName);

    await bucketFile.save(buffer, {
      metadata: {
        contentType: image.type,
      },
    });

    bucketFile.makePublic();

    const bucketName = adminStorage.name;
    const permanentURL = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    const thumbnail_image_path = fileName;
    const thumbnail_image = permanentURL;

    const docRef = await adminDB.collection("courses").add({
      collection_id: crypto.randomUUID(),
      collection_type,
      description,
      pdf_link,
      thumbnail_image,
      title,
      video_link,
      thumbnail_image_path,
      created_date: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Course added successfully",
    });
  } catch (error) {
    console.error("Analyze API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}
