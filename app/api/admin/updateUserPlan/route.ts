import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const db = admin.firestore();

export async function POST(req: Request) {
  try {
    const { uid, plan, feeType, courseName } = await req.json();

    if (!uid) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const updateData: any = {
      updatedAt: Timestamp.now(),
    };

 
    if (feeType === "signal" && plan === "pro") {
      updateData.signalplan = "pro";
    }

    if (feeType === "course" && courseName) {
      updateData.courseplan = "pro";
      
      const existingCourses = userData?.courses || [];
      
      const hasCourse = existingCourses.some((c: any) => c.courseId === courseName);

      if (!hasCourse) {
        updateData.courses = admin.firestore.FieldValue.arrayUnion({
          courseId: courseName,
          activatedAt: Timestamp.now(),
          status: "active"
        });
      }
    }

    await userRef.update(updateData);

    await db.collection("admin_logs").add({
      adminId: "system_admin",
      targetUser: uid,
      action: `Approved ${feeType} for ${uid}`,
      timestamp: Timestamp.now(),
    });

    return NextResponse.json({ 
      success: true, 
      message: "User permissions updated successfully." 
    });

  } catch (error: any) {
    console.error("Firebase Update Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}