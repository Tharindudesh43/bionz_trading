import { NextResponse } from "next/server";
import { adminDB, adminStorage } from "@/firebase/FirebaseAdmin";
import { v4 as uuidv4 } from "uuid";
import { stat } from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const selectedOption = formData.get("selectedOption") as string | null;

    let uid: string | null = null;
    let email: string | null = null;
    let image: File | null = null;
    let selectedCourseId: string | null = null;
    let note: string | null = null;
    let bookShippingAddress: string | null = null;
    let bookname: string | null = null;

    if (selectedOption === "course") {
      uid = formData.get("uid") as string | null;
      email = formData.get("email") as string | null;
      image = formData.get("slipFile") as File | null;
      selectedCourseId = formData.get("selectedCourseId") as string | null;
      note = formData.get("note") as string | null;
    } else if (selectedOption === "pro") {
      uid = formData.get("uid") as string | null;
      email = formData.get("email") as string | null;
      image = formData.get("slipFile") as File | null;
      note = formData.get("note") as string | null;
    } else if (selectedOption === "book") {
      uid = formData.get("uid") as string | null;
      email = formData.get("email") as string | null;
      image = formData.get("slipFile") as File | null;
      note = formData.get("note") as string | null;
      bookShippingAddress = formData.get("bookShippingAddress") as string | null;
      bookname = formData.get("bookname") as string | null;
    }

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image is required" },
        { status: 400 },
      );
    }

    if (selectedOption === "pro") {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `payments/signal/${uuidv4()}-${image.name}`;
      const bucketFile = adminStorage.file(fileName);

      await bucketFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      bucketFile.makePublic();

      const bucketName = adminStorage.name;
      const permanentURL = `https://storage.googleapis.com/${bucketName}/${fileName}`;

      const payment_slip_path = fileName;
      const paymentSlipUrl = permanentURL;

      const docRef = await adminDB.collection("payments").add({
        approveAt: null,
        details: note,
        paymentSlipUrl: paymentSlipUrl,
        payment_slip_path: payment_slip_path,
        payment_id: uuidv4(),
        status: "pending",
        type: "signal",
        uploadAt: new Date(),
        userEmail: email,
        userId: uid,
      });

      return NextResponse.json({
        success: true,
        message: "Payment added successfully",
        status: 200,
      });
    } else if (selectedOption === "course") {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `payments/course/${uuidv4()}-${image.name}`;
      const bucketFile = adminStorage.file(fileName);

      await bucketFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      bucketFile.makePublic();

      const bucketName = adminStorage.name;
      const permanentURL = `https://storage.googleapis.com/${bucketName}/${fileName}`;

      const payment_slip_path = fileName;
      const paymentSlipUrl = permanentURL;

      const docRef = await adminDB.collection("payments").add({
        approveAt: null,
        details: note,
        paymentSlipUrl: paymentSlipUrl,
        payment_slip_path: payment_slip_path,
        payment_id: uuidv4(),
        status: "pending",
        type: "course",
        uploadAt: new Date(),
        userEmail: email,
        userId: uid,
        courseIds: selectedCourseId
      });

      return NextResponse.json({
        success: true,
        message: "Payment added successfully",
        status: 200,
      });
    } else if (selectedOption === "book") {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `payments/book/${uuidv4()}-${image.name}`;
      const bucketFile = adminStorage.file(fileName);

      await bucketFile.save(buffer, {
        metadata: {
          contentType: image.type,
        },
      });

      bucketFile.makePublic();

      const bucketName = adminStorage.name;
      const permanentURL = `https://storage.googleapis.com/${bucketName}/${fileName}`;

      const payment_slip_path = fileName;
      const paymentSlipUrl = permanentURL;

      const docRef = await adminDB.collection("payments").add({
        approveAt: null,
        details: note,
        paymentSlipUrl: paymentSlipUrl,
        payment_slip_path: payment_slip_path,
        payment_id: uuidv4(),
        status: "pending",
        type: "book",
        uploadAt: new Date(),
        userEmail: email,
        userId: uid,
        bookShippingAddress: bookShippingAddress,
        bookname: bookname,
      });

      return NextResponse.json({
        success: true,
        message: "Payment added successfully",
        status: 200,
      });
    }
  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 },
    );
  }
}
