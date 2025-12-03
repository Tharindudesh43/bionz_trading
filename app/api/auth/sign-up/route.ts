import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
     let body;

     try {
       body = await req.json();
     } catch {
       return NextResponse.json(
         { error: "Invalid JSON body" },
         { status: 400 }
       );
     }

     const { email, password, username } = body;

     console.log("Received sign-up request for email:", email);

     if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    console.log("User created with UID:", userCredential);
    const user = userCredential.user;


    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role : "user", // default role
      username: user.displayName || username,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(), 
      plan: "free",
      courses: [],
      signals: false,
    });

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: {
        uid: user.uid,
        email: user.email,
        role: "user",
        plan: "free",
        courses: [],
        signals: false,
      },
    });

  } catch (error: any) {
    console.log("Error during sign-up:", error);
    if(error.code === 'auth/email-already-in-use'){
      console.log("Email already in use:");
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
