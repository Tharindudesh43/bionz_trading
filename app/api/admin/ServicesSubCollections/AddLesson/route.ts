import { NextResponse } from "next/server";
import { adminDB, adminStorage } from "@/firebase/FirebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { subContentType } from "@/types/collection_models";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const parent_collection_id = formData.get("parent_collection_id") as
      | string
      | null;

    if (!parent_collection_id) {
      return NextResponse.json(
        { success: false, message: "Parent Collection ID is required" },
        { status: 400 }
      );
    }

    const content_id = crypto.randomUUID();
    const created_date = Timestamp.now();
    const description = formData.get("description") as string | null;
    const image = formData.get("thumbnail_image") as File | null;
    const title = formData.get("title") as string | null;
    const video_link = formData.get("video_link") as string | null;
    const pdf_link = formData.get("pdf_link") as string | null;

    let thumbnail_image_path = "";
    let thumbnail_image = "";

    if (image instanceof File) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `courses/sub/${parent_collection_id}/${content_id}/${uuidv4()}-${
        image.name
      }`;
      const bucketFile = adminStorage.file(fileName);

      await bucketFile.save(buffer, {
        metadata: { contentType: image.type },
      });

      bucketFile.makePublic();

      const bucketName = adminStorage.name;
      const permanentURL = `https://storage.googleapis.com/${bucketName}/${fileName}`;

      thumbnail_image_path = fileName;
      thumbnail_image = permanentURL;
    }

    const sub_content: subContentType = {
      content_id,
      created_date,
      description: description || "",
      thumbnail_image,
      thumbnail_image_path,
      title: title || "",
      video_link: video_link || "",
      pdf_link: pdf_link || "",
    };

    const querySnapshot = await adminDB
      .collection("courses")
      .where("collection_id", "==", parent_collection_id)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Course collection not found" },
        { status: 404 }
      );
    }

    const docRef = querySnapshot.docs[0].ref;

    await docRef.update({
      sub_contents: FieldValue.arrayUnion(sub_content),
    });

    return NextResponse.json({
      success: true,
      message: "New Lesson added to sub-contents successfully",
    });
  } catch (error) {
    console.error("New Lesson API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}
