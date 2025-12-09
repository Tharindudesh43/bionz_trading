import { Timestamp } from "firebase-admin/firestore";

export interface SignalModel {
  signal_id: string;
  type: "spot" | "futures";
  side: "buy" | "sell";
  pair: string;
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  createdAt: string | Timestamp;
  edited: boolean;
  editedAt?: string | Timestamp;
  win_count?: number | 0;
  loss_count?: number | 0;
  status?: "Active" | "Deactivate" ;
}
