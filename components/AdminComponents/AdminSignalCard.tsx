"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import AnalyzePopUP from "../analyze_popup";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import type { SignalModel } from "@/types/signal_models";
import downimage from "@/src/down.png";
import upimage from "@/src/up.png";
import { Pencil, EyeClosed } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Timestamp } from "firebase/firestore";
import { AiFillDelete, AiFillEye } from "react-icons/ai";
dayjs.extend(relativeTime);

const SignalCard: React.FC<{
  signal: SignalModel;
  onEdit: () => void;
  onActivity: () => void;
  onDelete: () => void;
}> = ({ signal, onEdit, onActivity, onDelete }) => {
  const displaySignal = { ...signal };
  const [isOpenLossOrProfit, setisOpenLossOrProfit] = React.useState(false);
  const toggleOpenLossOrProfit = () =>
    setisOpenLossOrProfit(!isOpenLossOrProfit);

  function getTradePerformance(win: number, loss: number) {
    // No data
    if (win === 0 && loss === 0) {
      return "0.00%";
    }

    const diff = Math.abs(win - loss);
    const total = win + loss; // safe base (never zero unless both zero)

    const percentage = ((diff / total) * 100).toFixed(2);

    return win >= loss ? `+${percentage}%` : `-${percentage}%`;
  }

  const numericPercentage = getTradePerformance(
    signal.win_count ?? 0,
    signal.loss_count ?? 0
  );
  const profitDisplay = `${numericPercentage}`;

  const profitPercentage = getTradePerformance(
    signal.win_count ?? 0,
    signal.loss_count ?? 0
  );
  const isPositive = profitPercentage.startsWith("+");
  const isNegative = profitPercentage.startsWith("-");

  const wins = signal.win_count ?? 0;
  const losses = signal.loss_count ?? 0;
  const total = wins + losses;

  let profitPercent = 0;
  let lossPercent = 0;

  if (total > 0) {
    profitPercent = (wins / total) * 100;
    lossPercent = (losses / total) * 100;
  }
  const gaugeData = [
    { name: "Profit", value: profitPercent, fill: "#4ade80" }, // green
    { name: "Loss", value: lossPercent, fill: "#f87171" }, // red
  ];

  const backgroundStyle = {
    background:
      displaySignal.side.toString() === "buy"
        ? "linear-gradient(90deg, #e6ffe6, #ccffcc)"
        : "linear-gradient(90deg, #ffe6e6, #ffcccc)",
  };

  const [timeAgo, setTimeAgo] = React.useState<string>("");

  const createdDate = React.useMemo(() => {
    if (typeof displaySignal.createdAt === "string") {
      return new Date(displaySignal.createdAt);
    }
    // if it's a Timestamp-like object from Firebase
    if (
      displaySignal.createdAt &&
      typeof displaySignal.createdAt === "object" &&
      "seconds" in displaySignal.createdAt
    ) {
      const seconds = (displaySignal.createdAt as Timestamp).seconds || 0;
      const nanoseconds =
        (displaySignal.createdAt as Timestamp).nanoseconds || 0;
      return new Date(seconds * 1000 + nanoseconds / 1000000);
    }
    // Fallback: attempt to coerce to Date
    return new Date(String(displaySignal.createdAt));
  }, [displaySignal.createdAt]);

  function formatDateTime(date: Date | null) {
    if (!date) return "Not edited";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    setTimeAgo(dayjs(createdDate).fromNow());
  }, [createdDate]);

  return (
    <>
      <div
        className={`
    w-full max-w-xl mx-auto
    p-4 mt-3
    bg-white rounded-xl shadow-md
    flex flex-col md:flex-row md:items-center md:justify-between
    gap-4 md:gap-3
    relative
    transition-all duration-200 hover:shadow-lg
    ${displaySignal.status === "Active" ? "" : "border-l-8 border-gray-500"}
  `}
        style={backgroundStyle}
      >
        {/* Edit Buttons */}
        <div className="absolute bottom-2 left-2 flex gap-2 md:gap-3">
          <button
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 
      text-white p-1.5 rounded-md shadow-md flex items-center gap-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil size={16} />
          </button>

          <button
            className="cursor-pointer bg-pink-500 hover:bg-pink-600 
      text-white p-1.5 rounded-md shadow-md flex items-center gap-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onActivity();
            }}
          >
            <AiFillEye size={16} />
          </button>


            <button
            className="cursor-pointer bg-amber-800 hover:bg-yellow-600 
      text-white p-1.5 rounded-md shadow-md flex items-center gap-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <AiFillDelete size={16} />
          </button>
        </div>

        {/* Small Top Date */}
        <div className="absolute top-2 left-2 text-[10px] md:text-xs text-gray-600 font-medium">
          {formatDateTime(new Date(displaySignal.editedAt?.toString() || ""))}
        </div>

        {/* Left Block */}
        <div className="flex flex-col items-center w-full md:w-24 mt-5 md:mt-0">
          <div className="relative w-12 h-12 md:w-14 md:h-14 mb-1">
            {displaySignal.side.toString() === "buy" ? (
              <Image src={upimage} alt="" fill className="object-contain" />
            ) : (
              <Image src={downimage} alt="" fill className="object-contain" />
            )}
          </div>

          <div
            className={`text-base md:text-lg font-bold  
      ${displaySignal.side === "buy" ? "text-green-600" : "text-red-600"}`}
          >
            {displaySignal.side.toUpperCase()}
          </div>

          <p className="text-[10px] text-gray-500 mt-1">
            {dayjs(createdDate).fromNow()}
          </p>
        </div>

        {/* Middle Info */}
        <div className="flex-1 w-full px-3 py-2 border-y md:border-y-0 md:border-x border-gray-200">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
            <span className="text-orange-600 font-semibold text-xs">
              {displaySignal.type === "spot" ? "SPOT" : "FUTURES"}
            </span>

            <h2 className="text-lg font-bold text-gray-800">
              {displaySignal.pair}
            </h2>

            <span
              className={`font-semibold text-sm
        ${
          displaySignal.status === "Active" ? "text-green-600" : "text-red-600"
        }`}
            >
              {displaySignal.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs md:text-sm font-medium text-gray-700">
            <div>
              Leverage:{" "}
              <span className="font-bold">{displaySignal.leverage}X</span>
            </div>
            <div>
              Entry:{" "}
              <span className="font-bold">{displaySignal.entryPrice}</span>
            </div>
            <div>
              Exit: <span className="font-bold">{displaySignal.exitPrice}</span>
            </div>
            <div>
              Stop Loss:{" "}
              <span className="font-bold">{displaySignal.stopLoss}</span>
            </div>
          </div>
        </div>

        {/* Right Block */}
        <div className="flex flex-col items-center w-full md:w-24 mt-2 md:mt-0">
          <div
            className={`absolute top-2 right-2 text-[10px] md:text-xs px-2 py-1 rounded shadow 
      ${
        displaySignal.edited
          ? "bg-yellow-200 text-yellow-800"
          : "bg-green-300 text-green-800"
      }`}
          >
            {displaySignal.edited
              ? `Edited | ${formatDateTime(
                  new Date(displaySignal.editedAt?.toString() || "")
                )}`
              : "Not Edited"}
          </div>

          {/* Gauge */}
          <div className="w-24 h-14 md:w-28 md:h-16">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="100%"
                innerRadius="45%"
                outerRadius="85%"
                startAngle={180}
                endAngle={0}
                barSize={10}
                data={gaugeData}
              >
                <RadialBar dataKey="value" cornerRadius={5} background />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-gray-700 font-semibold text-xs mt-1 uppercase">
            Profit / Loss
          </div>

          <div
            className={`text-xl font-extrabold mt-1 
      ${isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {profitDisplay}
          </div>

          {/* Win / Loss badges */}
          <div className="flex space-x-3 mt-2 text-white font-bold text-xs">
            <div className="flex flex-col items-center">
              <span className="text-green-600 font-bold">
                {displaySignal.win_count}
              </span>
              <div className="px-2 py-0.5 bg-green-600 rounded">Win</div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-red-600 font-bold">
                {displaySignal.loss_count}
              </span>
              <div className="px-2 py-0.5 bg-red-600 rounded">Loss</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignalCard;
