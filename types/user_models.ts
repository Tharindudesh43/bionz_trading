import { Timestamp } from "firebase-admin/firestore";

export interface UserModel {
    uid: string;
    email: string;
    username: string;
    role: "admin" | "user";
    createdAt: string | Timestamp;
    lastLogin: string | Timestamp;
    courses: string[] | null;
    signalplan: string| null;
    courseplan: string| null;
}

