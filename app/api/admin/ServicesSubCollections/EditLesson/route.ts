import { NextResponse } from "next/server";
import { adminDB, adminStorage } from "@/firebase/FirebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase-admin/firestore";

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();
    const parent_collection_id = formData.get("parent_collection_id") as
      | string
      | null;
    const content_id = formData.get("content_id") as string | null;

    const description = formData.get("formData[description]") as string;
    const pdf_link = formData.get("formData[pdf_link]") as string;
    const video_link = formData.get("formData[video_link]") as string;
    const thumbnail_image = formData.get("formData[thumbnail_image]") as
      | File
      | string;
    const title = formData.get("formData[title]") as string;

    if (parent_collection_id === null && content_id === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Content ID and Parent Collection ID are required",
        },
        { status: 400 }
      );
    }

    const querySnapshot = await adminDB
      .collection("courses")
      .where("collection_id", "==", parent_collection_id)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Parent collection not found" },
        { status: 404 }
      );
    }

    const docSnap = querySnapshot.docs[0];
    const docReferrence = docSnap.ref;
    const oldData = docSnap.data();

    let sub_contents_want_to_edit;

    for (let i = 0; i < oldData.sub_contents.length; i++) {
      if (oldData.sub_contents[i].content_id === content_id) {
        sub_contents_want_to_edit = oldData.sub_contents[i];
        break;
      }
    }

    let newImageUrl = null;
    let neweditPath = null;

    if (thumbnail_image instanceof File) {
      const oldPath = sub_contents_want_to_edit.thumbnail_image_path;

      if (thumbnail_image?.name !== undefined) {
        if (oldPath) {
          await adminStorage
            .file(oldPath)
            .delete()
            .catch(() => {});
        }

        const bytes = await thumbnail_image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let newPath = `courses/sub/${parent_collection_id}/${content_id}/${uuidv4()}-${
          thumbnail_image.name
        }`;
        const file = adminStorage.file(newPath);

        await file.save(buffer, {
          metadata: {
            contentType: thumbnail_image.type,
          },
        });

        file.makePublic();

        const bucketName = adminStorage.name;
        const permanentURL = `https://storage.googleapis.com/${bucketName}/${newPath}`;

        const thumbnail_image_path = newPath;
        const thumbnail_image_url = permanentURL;

        newImageUrl = thumbnail_image_url;
        neweditPath = thumbnail_image_path;
      }
    }

    const docRef = querySnapshot.docs[0].ref;

    if (newImageUrl) {
      await docRef.update({
        sub_contents: oldData.sub_contents.map((sub_content: any) => {
          if (sub_content.content_id === content_id) {
            return {
              ...sub_content,
              title: title,
              description: description,
              video_link: video_link,
              pdf_link: pdf_link,
              thumbnail_image: newImageUrl,
              thumbnail_image_path: neweditPath,
            };
          } else {
            return sub_content;
          }
        }),
      });
    } else {
      await docRef.update({
        sub_contents: oldData.sub_contents.map((sub_content: any) => {
          if (sub_content.content_id === content_id) {
            return {
              ...sub_content,
              title: title,
              description: description,
              video_link: video_link,
              pdf_link: pdf_link,
            };
          } else {
            return sub_content;
          }
        }),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Lesson updated successfully",
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
