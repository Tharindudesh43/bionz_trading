import { Timestamp } from "firebase-admin/firestore";

export interface AnalyzeModel {
  analyze_id: string;
  analyze_image: string;
  created_date: string | Timestamp;
  analyze_description: string;
  pair: string;
  type?: "spot" | "futures";
  status: "active" | "inactive";
  edited_date?: string | Timestamp;
  edited?: boolean;
}

