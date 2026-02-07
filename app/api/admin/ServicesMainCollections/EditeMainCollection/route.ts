import { NextResponse } from "next/server";
import { adminDB, adminStorage } from "@/firebase/FirebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase-admin/firestore";

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();

    const image = formData.get("thumbnail_image") as File | string;
    const collection_id = formData.get("collection_id") as string;
    const collection_type = formData.get("collection_type") as string;
    const created_date = formData.get("created_date");
    const description = formData.get("description") as string;
    const title = formData.get("title") as string;
    const pdf_link = formData.get("pdf_link") as string;
    const video_link = formData.get("video_link") as string;

    if (collection_id === null) {
      return NextResponse.json(
        { success: false, message: "Collection ID is required" },
        { status: 400 }
      );
    }

    const querySnapshot = await adminDB
      .collection("courses")
      .where("collection_id", "==", collection_id)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Courses not found" },
        { status: 404 }
      );
    }

    const docSnap = querySnapshot.docs[0];
    const docReferrence = docSnap.ref;
    const oldData = docSnap.data();

    let newImageUrl = null;
    let neweditPath = null;

    if (image instanceof File) {
      const oldPath = oldData.thumbnail_image_path;

      if (image?.name !== undefined) {
        if (oldPath) {
          await adminStorage
            .file(oldPath)
            .delete()
            .catch(() => {});
        }

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let newPath = `courses/main/${uuidv4()}-${image.name}`;
        const file = adminStorage.file(newPath);

        await file.save(buffer, {
          metadata: {
            contentType: image.type,
          },
        });

        file.makePublic();

        const bucketName = adminStorage.name;
        const permanentURL = `https://storage.googleapis.com/${bucketName}/${newPath}`;

        const thumbnail_image_path = newPath;
        const thumbnail_image = permanentURL;
        newImageUrl = thumbnail_image;
        neweditPath = thumbnail_image_path;
      }
    }

    const docRef = querySnapshot.docs[0].ref;

    if (newImageUrl) {
      await docRef.update({
        thumbnail_image: newImageUrl,
        thumbnail_image_path: neweditPath,
        collection_type: collection_type,
        created_date: created_date,
        description: description,
        title: title,
        pdf_link: pdf_link,
        video_link: video_link,
      });
    } else {
      await docRef.update({
        collection_type: collection_type,
        created_date: created_date,
        description: description,
        title: title,
        pdf_link: pdf_link,
        video_link: video_link,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Main Collection updated successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    let errorMessage = "An unknown server error occurred.";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      errorMessage = (error as { message: string }).message;
    }
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
