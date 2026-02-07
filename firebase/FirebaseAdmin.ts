import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
      credential: admin.credential.cert({
      projectId: process.env.ADMIN_FIREBASE_PROJECT_ID,
      clientEmail: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.ADMIN_FIREBASE_STORAGE_BUCKET,
  });
}

export const adminDB = admin.firestore();
export const adminStorage = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET)
export default admin;
