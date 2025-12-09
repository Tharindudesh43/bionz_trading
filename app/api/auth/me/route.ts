import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.ADMIN_FIREBASE_PROJECT_ID,
      clientEmail: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const adminDB = admin.firestore();

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const session = cookieHeader.split("session=")[1];

    if (!session) {
      return NextResponse.json({ loggedIn: false });
    }

    const decoded = await admin.auth().verifySessionCookie(session);

    // Check admin via role claim
    const isAdmin = decoded.role === "admin";

    // const expDate = new Date(decoded.exp * 1000);
    // console.log("Cookie expires at:", expDate.toString());
    // console.log("Is Admin?", isAdmin);

    let userData = null;

    if (!isAdmin) {
      // Only query Firestore for normal users
      const userRef = adminDB.collection("users").doc(decoded.uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        return NextResponse.json({
          loggedIn: false,
          message: "User record not found in Firestore",
        });
      }

      userData = userSnap.data();
    }

    return NextResponse.json({
      loggedIn: true,
      user: {
        uid: decoded.uid,
        email: decoded.email,
        role: isAdmin ? "admin" : userData?.role ?? "user",
        plan: isAdmin ? "admin" : userData?.plan ?? "free",
        courses: isAdmin ? null : userData?.courses ?? [],
        signals: isAdmin ? false : userData?.signals ?? false,
      },
    });
  } catch (e) {
    console.error("Error decoding session:", e);
    return NextResponse.json({ loggedIn: false });
  }
}
