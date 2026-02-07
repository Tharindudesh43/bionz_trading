"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Search, Filter } from "lucide-react";
import PaymentCard from "@/components/AdminComponents/PaymentCard";
import { PaymentModel } from "@/types/payment_model";

type StatusFilter = "pending" | "approved" | "rejected";

export default function RequestsPage() {
  const [statusView, setStatusView] = useState<StatusFilter>("pending");
  const [payments, setPayments] = useState<PaymentModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admin/getAllPayments`);
      setPayments(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []); 

  const filteredPayments = payments.filter((p) => p.status === statusView);

  return (
    <div className="min-h-screen w-full bg-black text-gray-100 p-4 sm:p-8">
      
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2 flex items-center gap-3">
            <span className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20 text-white">
              <Clock size={24} />
            </span>
            Payment Requests
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Verify and manage user payment transactions.
          </p>
        </div>

        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setStatusView("pending")}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              statusView === "pending" ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Pending
          </button>
          
          <button 
            onClick={() => setStatusView("approved")}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              statusView === "approved" ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Approved
          </button>

          <button 
            onClick={() => setStatusView("rejected")}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              statusView === "rejected" ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Syncing Database...</p>
        </div>
      ) : filteredPayments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredPayments.map((payment) => (
            <PaymentCard key={payment.payment_id} payment={payment} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
           <div className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-700">
              <Filter size={32} />
           </div>
           <p className="uppercase tracking-widest text-xs font-bold text-gray-500">
             No {statusView} payments found
           </p>
        </div>
      )}
    </div>
  );
}