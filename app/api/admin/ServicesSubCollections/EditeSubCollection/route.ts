import { NextResponse } from "next/server";
import { adminDB, adminStorage } from "@/firebase/FirebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase-admin/firestore";

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();

    const collection_id = formData.get("collection_id") as string;
    const collection_type = formData.get("collection_type") as string;
    const currency = formData.get("currency") as string;
    const description = formData.get("description") as string;
    const intro_video_link = formData.get("intro_video_link") as string;
    const main_pdf_link = formData.get("main_pdf_link") as string;
    const price = formData.get("price") as string;
    const image = formData.get("thumbnail_image") as File | string;
    const title = formData.get("title") as string;

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

        let newPath = `courses/sub/${collection_id}/${uuidv4()}-${image.name}`;
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
        currency: currency,
        description: description,
        intro_video_link: intro_video_link,
        main_pdf_link: main_pdf_link,
        price: parseFloat(price),
        title: title,
      });
    } else {
      await docRef.update({
        collection_type: collection_type,
        currency: currency,
        description: description,
        intro_video_link: intro_video_link,
        main_pdf_link: main_pdf_link,
        price: parseFloat(price),
        title: title,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Sub Collection updated successfully",
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
