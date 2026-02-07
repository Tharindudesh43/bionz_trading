"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Mail,
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { PaymentModel } from "@/types/payment_model";
import dayjs from "dayjs";

interface PaymentData {
  id: string;
  userEmail: string;
  status: "approved" | "pending" | "rejected";
  type: string;
  details: string;
  uploadAt: string;
  paymentSlipUrl: string;
}

export default function PaymentCard({ payment }: { payment: PaymentModel }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isPending = payment.status === "pending";
  const isApproved = payment.status === "approved";
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "approved" | "rejected" | null
  >(null);

  const handleUpdateStatus = async (
    e: React.MouseEvent,
    targetStatus: "approved" | "rejected"
  ) => {
    e.preventDefault();
    setIsUpdating(true);
    setShowConfirm(false);
    try {
      const res = await axios.post("/api/admin/updatePayment", {
        payment_id: payment.payment_id,
        status: targetStatus,
      });

      if (res.status === 200) {
        alert(`Payment ${targetStatus} successfully!`);
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Frontend Error:", error);
      alert(error.response?.data?.message || "Error connecting to server");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-2xl">
      <div className="relative w-full h-48 bg-black/40 border-b border-white/5 flex items-center justify-center group">
        <img
          src={payment.paymentSlipUrl}
          alt="Payment Receipt"
          className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isApproved
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
            }`}
          >
            {isApproved ? <CheckCircle size={12} /> : <Clock size={12} />}
            {payment.status}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-white font-bold text-lg leading-tight truncate">
            {payment.userId}
          </h3>
          <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
            <Mail size={12} /> {payment.userEmail}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold">
            <span className="text-gray-500">Service</span>
            <span className="text-blue-400">{payment.type}</span>
          </div>

          <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold">
            <span className="text-gray-500">Uploaded</span>
            <span className="text-blue-400/80">
              {dayjs(payment.uploadAt?.toString()).format("DD MMM YYYY HH:mm")}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[9px] uppercase tracking-[0.15em] text-gray-500 font-bold block mb-1">
              User Note
            </span>
            <p className="text-gray-400 text-xs italic leading-relaxed">
              "{payment.details}"
            </p>
          </div>
        </div>

        <div className="mt-auto space-y-2">
          {isPending && (
            <div className="flex flex-col gap-2 transition-all duration-300">
              {confirmAction === null ? (
                <>
                  <button
                    onClick={() => setConfirmAction("approved")}
                    disabled={isUpdating}
                    className="flex items-center justify-center gap-2 w-full bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-600/20 text-xs font-black py-3 rounded-xl transition-all uppercase tracking-widest"
                  >
                    <CheckCircle size={14} />
                    Approve
                  </button>

                  <button
                    onClick={() => setConfirmAction("rejected")}
                    disabled={isUpdating}
                    className="flex items-center justify-center gap-2 w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 text-xs font-black py-3 rounded-xl transition-all uppercase tracking-widest"
                  >
                    <XCircle size={14} />
                    Reject
                  </button>
                </>
              ) : (
                <div
                  className={`p-3 rounded-xl border animate-in zoom-in-95 duration-200 ${
                    confirmAction === "approved"
                      ? "bg-emerald-900/20 border-emerald-500/30"
                      : "bg-red-900/20 border-red-500/30"
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-tighter text-center mb-3 text-white">
                    Confirm {confirmAction}?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmAction(null)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold py-2 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => handleUpdateStatus(e, confirmAction)}
                      disabled={isUpdating}
                      className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-black py-2 rounded-lg transition-all uppercase text-white shadow-lg ${
                        confirmAction === "approved"
                          ? "bg-emerald-600 shadow-emerald-900/40"
                          : "bg-red-600 shadow-red-900/40"
                      }`}
                    >
                      {isUpdating ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        "Confirm"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <a
            href={payment.paymentSlipUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-3 rounded-xl border border-white/10 transition-all uppercase tracking-widest"
          >
            View Full Receipt <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
