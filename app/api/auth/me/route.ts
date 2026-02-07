import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { adminDB } from "@/firebase/FirebaseAdmin";


// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.ADMIN_FIREBASE_PROJECT_ID,
//       clientEmail: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     }),
//   });
// }

// const adminDB = admin.firestore();

// export async function GET(req: Request) {
//   try {
//     const cookieHeader = req.headers.get("cookie") || "";
//     const session = cookieHeader.split("session=")[1];

//     if (!session) {
//       return NextResponse.json({ loggedIn: false });
//     }

//     const decoded = await admin.auth().verifySessionCookie(session);

//     const isAdmin = decoded.role === "admin";

//     let userData = null;

//     if (!isAdmin) {
//       // Only query Firestore for normal users
//       const userRef = adminDB.collection("users").doc(decoded.uid);
//       const userSnap = await userRef.get();

//       if (!userSnap.exists) {
//         return NextResponse.json({
//           loggedIn: false,
//           message: "User record not found in Firestore",
//         });
//       }

//       userData = userSnap.data();
//     }

//     return NextResponse.json({
//       loggedIn: true,
//       user: {
//         uid: decoded.uid,
//         email: decoded.email,
//         role: isAdmin ? "admin" : userData?.role ?? "user",
//         signalplan: isAdmin ? "admin" : userData?.signalplan ?? "free",
//         courses: isAdmin ? null : userData?.courses ?? [],
//         courseplan: isAdmin ? false : userData?.courseplan ?? false,
//       },
//     });
//   } catch (e) {
//     console.error("Error decoding session:", e);
//     return NextResponse.json({ loggedIn: false });
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ loggedIn: false });

    const decoded = await admin.auth().verifySessionCookie(session);
    
    const userSnap = await adminDB.collection("users").doc(decoded.uid).get();
    const userData = userSnap.data();

    return NextResponse.json({
      loggedIn: true,
      user: {
        uid: decoded.uid,
        email: decoded.email,
        role: userData?.role || "user",
        courseplan: userData?.courseplan || "free",
        signalplan: userData?.signalplan || "free",
        courses: userData?.courses || [], 
      }
    });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}