import { NextResponse } from "next/server";
import { adminDB, adminStorage } from "@/firebase/FirebaseAdmin";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const image = formData.get("analyze_image") as File | null;
    const analyze_description = formData.get("analyze_description") as
      | string
      | null;
    const pair = formData.get("pair") as string | null;
    const type = formData.get("type") as string | null;
    const analyze_id = formData.get("analyze_id") as string | null;

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image is required" },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `analyze/${uuidv4()}-${image.name}`;
    const bucketFile = adminStorage.file(fileName);

    await bucketFile.save(buffer, {
      metadata: {
        contentType: image.type,
      },
    });

    bucketFile.makePublic();

    const bucketName = adminStorage.name;
    const permanentURL = `https://storage.googleapis.com/${bucketName}/${fileName}`;
 
    const analyze_image_path = fileName;
    const analyze_image = permanentURL;

    const docRef = await adminDB.collection("analyze").add({
      analyze_id,
      analyze_description,
      pair,
      type,
      status: "Active",
      created_date: new Date(),
      edited: false,
      analyze_image: analyze_image,
      analyze_image_path: analyze_image_path,
      edited_date: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Analyze added successfully",
      id: docRef.id,
      analyze_image: analyze_image,
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
