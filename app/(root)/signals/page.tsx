"use client";

import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import type { SignalModel } from "@/types/signal_models";
import TradingSignalCard from "@/components/TradingSignalCard";
import axios from "axios";

export default function Signal() {
  const [signals, setSignals] = useState<SignalModel[]>([]);
  const [signalloading, setsignalloading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "spot" | "futures">(
    "all",
  );

  // Get Auth state from Redux
  const { currentUser, loading } = useSelector((state: any) => state.user);
  const isProPlan = currentUser?.signalplan === "pro";

  const getLocalYYYYMMDD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const firstSignalOfToday = useMemo(() => {
    if (!signals?.length) return null;

    const todayStr = getLocalYYYYMMDD(new Date());

    const todaySignals = signals.filter((s) => {
      if (!s.createdAt) return false;
      const createdStr = getLocalYYYYMMDD(new Date(s.createdAt.toString()));
      return createdStr === todayStr;
    });

    if (!todaySignals.length) return null;

    const sorted = [...todaySignals].sort(
      (a, b) =>
        new Date(a.createdAt!.toString()).getTime() -
        new Date(b.createdAt!.toString()).getTime(),
    );

    return sorted[0];
  }, [signals]);

  const filteredSignals = useMemo(() => {
    return signals.filter((s) => {
      const status = (s.status ?? "").toLowerCase();
      const type = (s.type ?? "").toLowerCase();

      const statusOk = statusFilter === "all" ? true : status === statusFilter;
      const typeOk = typeFilter === "all" ? true : type === typeFilter;

      return statusOk && typeOk;
    });
  }, [signals, statusFilter, typeFilter]);

  useEffect(() => {
    let isMounted = true;

    const loadSignals = async () => {
      try {
        setsignalloading(true);
        const res = await axios.get(`/api/getallSignals`);
        const data = res.data.data as SignalModel[];
        if (isMounted) {
          setSignals(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setsignalloading(false);
        if (isMounted) {
          setsignalloading(false);
        }
      }
    };

    loadSignals();

    // const interval = setInterval(loadSignals, 5000);

    return () => {
      isMounted = false;
      // clearInterval(interval);
    };
  }, []);

  const pillClass = (active: boolean) =>
    [
      "rounded-full px-3 py-1 text-xs font-medium shadow-sm ring-1 transition",
      active
        ? "bg-gray-900 text-white ring-gray-900"
        : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50",
    ].join(" ");

  const isProUser = !!currentUser && !!isProPlan;

  // pick today's first signal object (from your computed id)
  const todayFirstSignal = firstSignalOfToday
    ? filteredSignals.find((s) => s.signal_id === firstSignalOfToday.signal_id)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl mt-20">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Trading Signals
            </h1>
            <p className="text-sm text-gray-500">
              Track your entries, exits, and performance in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status */}
            <button
              onClick={() => setStatusFilter("all")}
              className={pillClass(statusFilter === "all")}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={pillClass(statusFilter === "active")}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={pillClass(statusFilter === "inactive")}
            >
              Inactive
            </button>

            <span className="mx-1 hidden h-5 w-px bg-gray-200 sm:inline-block" />

            {/* Type */}
            <button
              onClick={() => setTypeFilter("all")}
              className={pillClass(typeFilter === "all")}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter("spot")}
              className={pillClass(typeFilter === "spot")}
            >
              Spot
            </button>
            <button
              onClick={() => setTypeFilter("futures")}
              className={pillClass(typeFilter === "futures")}
            >
              Futures
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1">
          {signalloading ? (
            <p className="col-span-full text-center text-gray-500">
              Loading signals...
            </p>
          ) : filteredSignals.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No signals found.
            </p>
          ) : (
            filteredSignals.map((s) => {
              const isTeaser =
                firstSignalOfToday &&
                s.signal_id === firstSignalOfToday.signal_id;
              const isLocked = !isProUser && !isTeaser;

              return (
                <div key={s.signal_id} className="relative">
                  <TradingSignalCard data={s} isLocked={isLocked} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
