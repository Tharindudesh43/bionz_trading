import { NextResponse } from "next/server";
import { adminDB, adminStorage } from "@/firebase/FirebaseAdmin";

export async function DELETE(req: Request) {
  try {
    const { sub_collection_id } = await req.json();

    if (!sub_collection_id) {
      return NextResponse.json(
        { success: false, message: "Sub Collection ID is required" },
        { status: 400 }
      );
    }

    const snapshot = await adminDB
      .collection("courses")
      .where("collection_id", "==", sub_collection_id)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Sub Collection not found" },
        { status: 404 }
      );
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    const imagePath = data?.thumbnail_image_path;

    if (imagePath) {
      await adminStorage
        .file(imagePath)
        .delete()
        .catch(() => console.warn("Image already deleted or not found"));
    }

    await docSnap.ref.delete();

    return NextResponse.json({
      success: true,
      message: "Sub Collection deleted successfully",
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
