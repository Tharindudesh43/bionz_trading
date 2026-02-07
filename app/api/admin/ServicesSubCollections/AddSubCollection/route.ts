import { NextResponse } from "next/server";
import { adminDB, adminStorage } from "@/firebase/FirebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase-admin/firestore";
import { subContentType } from "@/types/collection_models";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const collection_id = crypto.randomUUID();
    const collection_type = formData.get("collection_type") as string | null;
    const created_date = Timestamp.now();
    const currency = formData.get("currency") as string | null;
    const description = formData.get("description") as string | null;
    const intro_video_link = formData.get("video_link") as string | null;
    const main_pdf_link = formData.get("main_pdf_link") as string | null;
    const price = formData.get("price") as string | null;
    const title = formData.get("title") as string | null;
    const image = formData.get("thumbnail_image") as File | null;

    let thumbnail_image_path = "";
    let thumbnail_image = "";

    if (image instanceof File) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `courses/sub/${collection_id}/${uuidv4()}-${image.name}`;
      const bucketFile = adminStorage.file(fileName);

      await bucketFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      bucketFile.makePublic();

      const bucketName = adminStorage.name;
      const permanentURL = `https://storage.googleapis.com/${bucketName}/${fileName}`;

      thumbnail_image_path = fileName;
      thumbnail_image = permanentURL;
    }

    const docRef = await adminDB.collection("courses").add({
      collection_id,
      collection_type,
      created_date,
      currency,
      description,
      intro_video_link,
      main_pdf_link,
      price: parseFloat(price || "0"),
      sub_contents: [],
      thumbnail_image,
      thumbnail_image_path,
      title,
    });

    return NextResponse.json({
      success: true,
      message: "Sub Course Collection added successfully",
    });
  } catch (error) {
    console.error("Sub Course Collection API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}
