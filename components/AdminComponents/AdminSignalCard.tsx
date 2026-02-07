"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { SignalModel } from "@/types/signal_models";
import downimage from "@/src/down.png";
import upimage from "@/src/up.png";
import { Pencil, Trash2, Clock, CheckCircle2, XCircle, Power } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Timestamp } from "firebase/firestore";

dayjs.extend(relativeTime);

const SignalCard: React.FC<{
  signal: SignalModel;
  onEdit: () => void;
  onActivity: () => void;
  onDelete: () => void;
}> = ({ signal, onEdit, onActivity, onDelete }) => {
  const [timeAgo, setTimeAgo] = useState<string>("");

  const parseDate = (dateField: any) => {
    if (!dateField) return null;
    if (typeof dateField === "string") return new Date(dateField);
    if (dateField instanceof Timestamp) return dateField.toDate();
    if (dateField.seconds) return new Date(dateField.seconds * 1000);
    return new Date(dateField);
  };

  const createdDate = useMemo(() => parseDate(signal.createdAt), [signal.createdAt]);
  const editedDate = useMemo(() => parseDate(signal.editedAt), [signal.editedAt]);

  useEffect(() => {
    if (createdDate) setTimeAgo(dayjs(createdDate).fromNow());
  }, [createdDate]);

  const wins = signal.win_count ?? 0;
  const losses = signal.loss_count ?? 0;
  const total = wins + losses;
  const winPercent = total > 0 ? (wins / total) * 100 : 50;

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-2 px-2 sm:px-0">
      {/* Side Status Indicator - Made slightly thinner */}
      <div className={`absolute left-2 sm:left-0 top-0 bottom-0 w-[3px] rounded-l-lg z-10 ${
        signal.status === "Active" ? "bg-emerald-500" : "bg-gray-600"
      }`} />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-[#0B1222] border border-white/5 rounded-lg overflow-hidden shadow-md transition-all hover:border-white/20">
        
        {/* SECTION 1: MODE & ICON - Compact padding */}
        <div className={`flex flex-row sm:flex-col items-center justify-center p-2 gap-2 sm:gap-0 sm:min-w-[65px] ${
          signal.mode === "buy" ? "bg-emerald-500/5" : "bg-rose-500/5"
        }`}>
          <div className="relative w-6 h-6">
            <Image src={signal.mode === "buy" ? upimage : downimage} alt="mode" fill className="object-contain" />
          </div>
          <span className={`text-[9px] font-black uppercase tracking-tight ${signal.mode === "buy" ? "text-emerald-500" : "text-rose-500"}`}>
            {signal.mode}
          </span>
        </div>

        {/* SECTION 2: PAIR, LEVERAGE & STATUS - Tightened spacing */}
        <div className="flex-1 px-3 py-1.5 flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h2 className="text-sm font-bold text-white tracking-tight truncate">{signal.pair}</h2>
            <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-1 py-0.5 rounded">
              {signal.leverage}x
            </span>
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold border ${
              signal.status === "Active" 
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
              : "bg-gray-500/10 text-gray-500 border-gray-500/20"
            }`}>
              {signal.status === "Active" ? <CheckCircle2 size={8} /> : <XCircle size={8} />}
              {signal.status?.toUpperCase()}
            </div>
          </div>

          {/* SECTION 3: DATE LOGIC - Smaller text */}
          <div className="flex flex-col mt-0.5">
            <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-medium">
              <Clock size={8} />
              <span>{timeAgo}</span>
              <span className="text-gray-700 font-bold">• {dayjs(createdDate).format("MMM DD")}</span>
            </div>
            
            {signal.edited && editedDate && (
              <div className="text-[8px] text-amber-500/80 font-bold flex items-center gap-1">
                <span>(Edited {dayjs(editedDate).format("MMM DD, HH:mm")})</span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: WIN/LOSS BAR - Lower height bar */}
        <div className="px-3 py-1.5 sm:border-x border-white/5 min-w-[120px] bg-white/[0.01]">
          <div className="flex justify-between items-end mb-0.5 text-[8px]">
            <span className="font-bold text-emerald-500 uppercase">Win {wins}</span>
            <span className="font-bold text-rose-500 uppercase">Loss {losses}</span>
          </div>
          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden flex">
            <div style={{ width: `${winPercent}%` }} className="h-full bg-emerald-500" />
            <div style={{ width: `${100 - winPercent}%` }} className="h-full bg-rose-500" />
          </div>
          <div className="mt-0.5 flex justify-between items-center text-[8px]">
            <span className="font-bold text-blue-400/80">{signal.type.toUpperCase()}</span>
            <span className="font-black text-gray-500">{winPercent.toFixed(0)}%</span>
          </div>
        </div>

        {/* SECTION 5: PRICES - Compact columns */}
        <div className="grid grid-cols-3 gap-2 px-4 py-1.5 sm:min-w-[170px]">
          <div className="flex flex-col">
            <span className="text-[7px] text-gray-600 uppercase font-black">Entry</span>
            <span className="text-[10px] font-bold text-gray-200">{signal.entryPrice}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] text-gray-600 uppercase font-black">Stop</span>
            <span className="text-[10px] font-bold text-rose-500">{signal.stopLoss}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] text-gray-600 uppercase font-black">Exit</span>
            <span className="text-[10px] font-bold text-emerald-400">{signal.exitPrice}</span>
          </div>
        </div>

        {/* SECTION 6: ACTIONS - Shrunk icon buttons */}
        <div className="flex flex-row sm:flex-col items-center justify-center p-1 gap-0.5 bg-black/20">
          <button 
            onClick={onActivity} 
            className={`p-1.5 rounded-md cursor-pointer transition-all ${
              signal.status === "Active" 
              ? "text-emerald-500 hover:bg-emerald-500/10" 
              : "text-gray-500 hover:bg-gray-500/10"
            }`}
          >
            <Power size={12} />
          </button>
          <button onClick={onEdit} className="p-1.5 cursor-pointer rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-500/35">
            <Pencil size={12} />
          </button>
          <button onClick={onDelete} className="p-1.5 cursor-pointer hover:bg-rose-500/10 rounded-md text-gray-500 hover:text-rose-500">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignalCard;