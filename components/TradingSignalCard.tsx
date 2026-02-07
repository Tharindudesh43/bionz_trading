"use client";

import React from "react";
import dynamic from "next/dynamic";
import { SignalModel } from "@/types/signal_models";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { useSelector } from "react-redux";
import axios from "axios";
import { useSnackbar } from "notistack";

type WinLoss = "win" | "loss";

const GaugeComponent = dynamic(
  () => import("react-gauge-component").then((m) => m.GaugeComponent),
  { ssr: false },
);

const formatSuccessRate = (win_count?: number, loss_count?: number): string => {
  const wins = Number(win_count ?? 0);
  const losses = Number(loss_count ?? 0);
  const total = wins + losses;
  if (!total) return "--";

  const rate = Math.round((wins / total) * 100);

  // show + when win > loss, else show negative style (like your current logic)
  if (wins > losses) return `+${rate}%`;
  return `-${100 - rate}%`;
};

const timeAgoFrom = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
};

const getSuccessRateNumber = (win_count?: number, loss_count?: number) => {
  const wins = Number(win_count ?? 0);
  const losses = Number(loss_count ?? 0);
  const total = wins + losses;
  if (!total) return 0;
  return Math.round((wins / total) * 100);
};

export default function TradingSignalCard({
  data,
  onSelectOutcome,
  className,
  isLocked = false,
}: {
  data: SignalModel;
  onSelectOutcome?: (outcome: WinLoss) => void;
  className?: string;
  isLocked?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);

  const { currentUser, loading } = useSelector((state: any) => state.user);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleSelection = async (outcome: WinLoss) => {
    try {
      if (!currentUser?.uid) {
        enqueueSnackbar("Please sign in to submit outcome.", {
          variant: "error",
          autoHideDuration: 3000,
        });
        return;
      }

      setButtonLoading(true);

      const res = await axios.post("/api/updatesignaloutcome", {
        signalId: data.signal_id,
        outcome,
        userId: currentUser.uid,
      });

      enqueueSnackbar(res.data?.message || "Outcome updated successfully!", {
        variant: "success",
        autoHideDuration: 3000,
      });

      onSelectOutcome?.(outcome);
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 409) {
        enqueueSnackbar(
          msg || "You already submitted outcome for this signal.",
          {
            variant: "warning",
            autoHideDuration: 3000,
          },
        );
        setIsModalOpen(false);
        return;
      }

      if (status === 404) {
        enqueueSnackbar(msg || "Signal not found.", {
          variant: "error",
          autoHideDuration: 3000,
        });
        return;
      }

      if (status === 400) {
        enqueueSnackbar(msg || "Invalid input.", {
          variant: "error",
          autoHideDuration: 3000,
        });
        return;
      }

      enqueueSnackbar("Server error. Please try again.", {
        variant: "error",
        autoHideDuration: 3000,
      });

      console.error("Error handling selection:", err);
    } finally {
      setButtonLoading(false);
    }
  };
  

  // ✅ LOCK: prevent modal open
  const handleCardClick = () => {
    if (isLocked) return;
    openModal();
  };

  // Use editedAt if edited, else createdAt
  const displayTimeAgo = data.edited
    ? timeAgoFrom(String(data.editedAt ?? ""))
    : timeAgoFrom(String(data.createdAt ?? ""));

  const isInactive = (data.status ?? "").toLowerCase() === "inactive";

  return (
    <>
      <button
        type="button"
        onClick={handleCardClick}
        className={[
          "relative w-full overflow-hidden rounded-2xl border p-4 shadow-sm transition hover:shadow-md sm:p-5",
          isInactive
            ? "border-gray-200 bg-gradient-to-r from-white via-gray-50 to-gray-100"
            : data.mode === "buy"
              ? "border-emerald-100 bg-gradient-to-r from-white via-emerald-50 to-emerald-100"
              : "border-rose-100 bg-gradient-to-r from-white via-rose-50 to-rose-100",
          className ?? "",
        ].join(" ")}
      >
        <div
          className={
            isLocked
              ? "pointer-events-none select-none blur-[5px] opacity-70"
              : ""
          }
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex items-center justify-center">
                {data.mode === "buy" ? (
                  <FaArrowTrendUp className="h-14 w-14 text-lime-500" />
                ) : (
                  <FaArrowTrendDown className="h-14 w-14 text-red-500" />
                )}
              </div>

              <p
                className={`text-sm font-extrabold tracking-wide ${
                  data.mode === "buy" ? "text-lime-500" : "text-red-500"
                }`}
              >
                {data.mode === "buy" ? "BUY" : "SELL"}
              </p>

              <p className="text-[11px] font-semibold text-gray-900">
                {displayTimeAgo || "—"}
                {data.edited ? " (edited)" : ""}
              </p>

              <p className="text-[10px] font-medium text-gray-500">
                Created: {new Date(String(data.createdAt)).toLocaleDateString()}
              </p>
            </div>

            <div className="flex-1 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-500">
                  {data.type}
                </span>

                <span className="text-lg font-semibold text-gray-900">
                  {data.pair}
                </span>

                <span
                  className={`text-xs font-medium ${
                    isInactive ? "text-red-500" : "text-green-400"
                  }`}
                >
                  {data.status}
                </span>
              </div>

              <div className="mt-2 grid gap-1 text-sm text-gray-600 sm:grid-cols-2">
                <p>
                  <span className="font-semibold text-gray-700">Leverage:</span>{" "}
                  {data.leverage}x
                </p>
                <p>
                  <span className="font-semibold text-gray-700">
                    Entry Price:
                  </span>{" "}
                  {data.entryPrice}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">
                    Exit Price:
                  </span>{" "}
                  {data.exitPrice}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">
                    Stop Loss:
                  </span>{" "}
                  {data.stopLoss}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[150px] rounded-2xl bg-white px-4 py-3 shadow-sm">
                <div className="mx-auto h-[70px] w-full">
                  <GaugeComponent
                    value={getSuccessRateNumber(
                      data.win_count,
                      data.loss_count,
                    )}
                    minValue={0}
                    maxValue={100}
                    type="semicircle"
                    arc={{
                      width: 0.22,
                      padding: 0.01,
                      subArcs: [
                        { limit: 25, color: "#ef4444" },
                        { limit: 50, color: "#f97316" },
                        { limit: 75, color: "#facc15" },
                        { limit: 100, color: "#22c55e" },
                      ],
                    }}
                    pointer={{ type: "arrow", elastic: true, color: "#111827" }}
                    labels={{
                      valueLabel: { hide: true },
                    }}
                  />
                </div>

                <p className="mt-1 text-center text-[11px] font-semibold text-gray-400">
                  LOSS / PROFIT
                </p>

                <p
                  className={`mt-0.5 text-center text-xl font-extrabold ${
                    (data.win_count ?? 0) >= (data.loss_count ?? 0)
                      ? "text-emerald-600"
                      : "text-orange-500"
                  }`}
                >
                  {formatSuccessRate(data.win_count, data.loss_count)}
                </p>

                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="rounded-full bg-lime-500 px-3 py-1 text-[11px] font-semibold text-white">
                    {data.win_count} <span className="font-bold">Win</span>
                  </span>
                  <span className="rounded-full bg-red-500 px-3 py-1 text-[11px] font-semibold text-white">
                    {data.loss_count} <span className="font-bold">Loss</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/35 backdrop-blur-[1px]">
            <div 
             onClick={() => {
            window.location.href = "/payments?uid=" + (currentUser?.uid || "") + "&email=" + (currentUser?.email || ""); 
            }
             }
            className="cursor-pointer rounded-2xl bg-white/90 px-4 py-3 text-center shadow-md ring-1 ring-gray-200">
              <div className="cursor-pointer mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 10V8a5 5 0 0 1 10 0v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-900">Locked</p>
              <p className="text-xs text-gray-500">Click to Pay</p>
            </div>
          </div>
        )}
      </button>

      {isModalOpen && currentUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Select outcome
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose whether this signal resulted in a win or a loss.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                disabled={buttonLoading}
                type="button"
                onClick={() => handleSelection("win")}
                className="flex-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                {buttonLoading ? "Loading..." : "Win"}
              </button>
              <button
                disabled={buttonLoading}
                type="button"
                onClick={() => handleSelection("loss")}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                {buttonLoading ? "Loading..." : "Loss"}
              </button>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
