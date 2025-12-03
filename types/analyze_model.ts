import { Timestamp } from "firebase-admin/firestore";

export interface AnalyzeModel {
  analyze_id: string;
  analyze_image: string;
  created_date: Timestamp;
  analyze_description: string;
  pair: string;
  type?: "spot" | "futures";
}

