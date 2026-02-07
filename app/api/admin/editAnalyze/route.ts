import { NextResponse } from "next/server";
import { adminDB, adminStorage } from "@/firebase/FirebaseAdmin";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(req: Request) {
  try {
    console.log("PATCH /api/admin/editAnalyze called");
    const formData = await req.formData();

    const image = formData.get("edit_analyze_image") as File | null;
    const analyze_description = formData.get(
      "edit_analyze_description"
    ) as string;
    const pair = formData.get("edit_analyze_pair") as string | null;
    const type = formData.get("edit_analyze_type") as string | null;
    const analyze_id = formData.get("edit_analyze_id") as string | null;
    const status = formData.get("edit_analyze_status") as string | null;

    if (analyze_id === null) {
      return NextResponse.json(
        { success: false, message: "analyze_id is required" },
        { status: 400 }
      );
    }

    const querySnapshot = await adminDB
      .collection("analyze")
      .where("analyze_id", "==", analyze_id)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Analyze not found" },
        { status: 404 }
      );
    }

    const docSnap = querySnapshot.docs[0];
    const docReferrence = docSnap.ref;
    const oldData = docSnap.data();

    const oldPath = oldData.analyze_image_path;

    let newImageUrl = null;
    let neweditPath = null;

    if (image?.name !== undefined) {
      if (oldPath) {
        await adminStorage
          .file(oldPath)
          .delete()
          .catch(() => {});
      }

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      let newPath = `analyze/${uuidv4()}-${image.name}`;
      const file = adminStorage.file(newPath);

      await file.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      file.makePublic();

      const bucketName = adminStorage.name;
      const permanentURL = `https://storage.googleapis.com/${bucketName}/${newPath}`;

      const analyze_image_path = newPath;
      const analyze_image = permanentURL;

      newImageUrl = analyze_image;
      neweditPath = analyze_image_path;
    }

    const docRef = querySnapshot.docs[0].ref;

    if (newImageUrl) {
      await docRef.update({
        analyze_description: analyze_description,
        pair: pair,
        type: type,
        edited: true,
        edited_date: new Date(),
        analyze_image: newImageUrl,
        analyze_image_path: neweditPath,
        status: status,
      });
    } else {
      await docRef.update({
        analyze_description: analyze_description,
        pair: pair,
        type: type,
        edited: true,
        edited_date: new Date(),
        status: status,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Analyze updated successfully",
      analyze_id: analyze_id,
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
