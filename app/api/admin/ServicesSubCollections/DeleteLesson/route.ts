import { NextResponse } from "next/server";
import { adminDB, adminStorage } from "@/firebase/FirebaseAdmin";

export async function DELETE(req: Request) {
  try {
    const { parent_collection_id,content_id } = await req.json();

    if (!parent_collection_id || !content_id) {
      return NextResponse.json(
        { success: false, message: "Sub Collection ID is required" },
        { status: 400 }
      );
    }

    const snapshot = await adminDB
      .collection("courses")
      .where("collection_id", "==", parent_collection_id)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Sub Collection not found" },
        { status: 404 }
      );
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    
    let sub_contents_want_to_edit;

    for (let i = 0; i < data.sub_contents.length; i++) {
      if (data.sub_contents[i].content_id === content_id) {
        sub_contents_want_to_edit = data.sub_contents[i];
        break;
      }
    }
    const imagePath = sub_contents_want_to_edit?.thumbnail_image_path;

    if (imagePath) {
      await adminStorage
        .file(imagePath)
        .delete()
        .catch(() => console.warn("Image already deleted or not found"));
    }

    const updatedArray = data.sub_contents.filter((item: any) => item.content_id !== content_id);

    await docSnap.ref.update({
      sub_contents: updatedArray,
    });

    return NextResponse.json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error("Delete API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    );
  }
}
