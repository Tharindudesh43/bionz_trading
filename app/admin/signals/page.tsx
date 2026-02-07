"use client";

import SignalCard from "@/components/AdminComponents/AdminSignalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { SignalModel } from "@/types/signal_models";
import axios from "axios";
import { Timestamp } from "firebase-admin/firestore";
import React, { useState, useCallback, useEffect } from "react";
import { FiFilter, FiPlus, FiRefreshCcw } from "react-icons/fi";

interface SignalFormModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  editingEnabled: boolean;
  editingLoading: boolean;
  addingLoading: boolean;
  // State values
  type: "spot" | "futures";
  mode: "buy" | "sell";
  leverage: number;
  pair: string;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  // Setters (or functions that use setters)
  setType: (val: "spot" | "futures") => void;
  setMode: (val: "buy" | "sell") => void;
  setLeverage: (val: number) => void;
  setPair: (val: string) => void;
  setEntryPrice: (val: number) => void;
  setExitPrice: (val: number) => void;
  setStopLoss: (val: number) => void;
  ClearFormData: () => void;
  handleAddSignal: () => Promise<void>;
  handleEdit: () => Promise<void>;
}

interface StatusEditModelProps {
  setOpen: (open: boolean) => void;
  ChangeStatus: () => void;
  setActivateEnable: (val: boolean) => void;
  status: string;
  activateEnable: boolean;
  setStatus: (val: string) => void;
  loading: boolean;
}

interface StatusDeleteModelProps {
  signal_id: string;
  setShowSignalFormModal: (val: boolean) => void;
  showSignalFormModal: boolean;
  handleSignalDelete: (signal_id: string) => void;
  loading: boolean;
}

const StatusEditModel: React.FC<StatusEditModelProps> = ({
  ChangeStatus,
  setActivateEnable,
  activateEnable,
  status,
  setStatus,
  loading,
}) => {
  if (!activateEnable) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div className="bg-white rounded-lg p-6 w-72 shadow-lg flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-800">
            Do you want to change the status?
          </h2>

          <div className="flex items-center justify-between">
            {/* Toggle Switch */}
            <div className="flex flex-col gap-3">
              {/* Active */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={status === "Active" ? true : false}
                  onChange={() => setStatus("Active")}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-black">Active</span>
              </label>

              {/* Inactive */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={status === "Inactive" ? true : false}
                  onChange={() => setStatus("Inactive")}
                  className="w-4 h-4 cursor-pointer text-black"
                />
                <span className="text-sm text-black">Inactive</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setStatus("");
                setActivateEnable(false);
              }}
              disabled={loading}
              className="cursor-pointer text-black"
            >
              Cancel
            </Button>
            <Button
              onClick={ChangeStatus}
              disabled={loading}
              className={`cursor-pointer text-amber-300 bg-blue-800`}
            >
              {" "}
              {loading ? "Changing..." : "Change"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const SignalDeleteModel: React.FC<StatusDeleteModelProps> = ({
  showSignalFormModal,
  setShowSignalFormModal,
  signal_id,
  handleSignalDelete,
  loading,
}) => {
  if (!showSignalFormModal) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div className="bg-white rounded-lg p-6 w-72 shadow-lg flex flex-col gap-4">
          {/* Title */}
          <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <span>⚠️</span> Delete Item?
          </h2>

          {/* Message */}
          <p className="text-sm text-gray-700">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-3">
            <Button
              disabled={loading}
              variant="outline"
              onClick={() => setShowSignalFormModal(false)}
              className="cursor-pointer text-black border-gray-300"
            >
              Cancel
            </Button>

            <Button
              disabled={loading}
              onClick={() => {
                handleSignalDelete(signal_id);
              }}
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const SignalAddAndEditFormModal: React.FC<SignalFormModalProps> = ({
  isOpen,
  setOpen,
  editingEnabled,
  editingLoading,
  addingLoading,
  type,
  setType,
  mode,
  setMode,
  leverage,
  setLeverage,
  pair,
  setPair,
  entryPrice,
  setEntryPrice,
  exitPrice,
  setExitPrice,
  stopLoss,
  setStopLoss,
  ClearFormData,
  handleAddSignal,
  handleEdit,
}) => {
  if (!isOpen) return null;

  const handleCancel = () => {
    ClearFormData();
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-5 text-black">
          {editingEnabled ? "Edit Signal" : "Add Signal"}
        </h2>

        {/* Type */}
        <div className="mb-4">
          <label className="font-medium text-gray-700 block mb-1">Type</label>
          <RadioGroup
            value={type}
            onValueChange={(val: string) => setType(val as "spot" | "futures")}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="spot"
                id="spot"
                className="cursor-pointer"
              />
              <label htmlFor="spot" className="text-black">
                Spot
              </label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value="futures"
                id="futures"
                className="cursor-pointer"
              />
              <label htmlFor="futures" className="text-black">
                Futures
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Pair */}
        <div className="mb-4">
          <label className="font-medium text-gray-700 block mb-1">
            Pair (e.g., XRP/USD)
          </label>
          <Input
            className="text-black"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            placeholder="Enter pair"
          />
        </div>

        {/* Mode */}
        <div className="mb-4">
          <label className="font-medium text-gray-700 block mb-1">Mode</label>
          <div className="flex gap-4">
            <Button
              variant={mode === "buy" ? "default" : "outline"}
              className={`text-black cursor-pointer hover:bg-green-600 ${
                mode === "buy" ? "bg-green-500 text-white" : ""
              }`}
              onClick={() => setMode("buy")}
            >
              Buy
            </Button>
            <Button
              variant={mode === "sell" ? "default" : "outline"}
              className={` cursor-pointer text-black hover:bg-red-600 ${
                mode === "sell" ? "bg-red-500 text-white" : ""
              }`}
              onClick={() => setMode("sell")}
            >
              Sell
            </Button>
          </div>
        </div>

        {/* Leverage */}
        <div className="mb-4">
          <label className="font-medium text-gray-700 block mb-2">
            Leverage: {leverage}x
          </label>
          <Slider
            className="cursor-pointer"
            value={[leverage]}
            max={300}
            min={0}
            step={1}
            onValueChange={(val: number[]) => setLeverage(val[0])}
          />
        </div>

        {/* Prices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          <div>
            <label className="font-medium text-gray-700 block mb-1">
              Entry Price
            </label>
            <Input
              className="text-black"
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="font-medium text-gray-700 block mb-1">
              Exit Price
            </label>
            <Input
              className="text-black"
              type="number"
              value={exitPrice}
              onChange={(e) => setExitPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="font-medium text-gray-700 block mb-1">
              Stop Loss
            </label>
            <Input
              className="text-black"
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleCancel}
            disabled={editingEnabled ? editingLoading : addingLoading}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          {editingEnabled ? (
            <Button
              onClick={handleEdit}
              disabled={editingEnabled ? editingLoading : addingLoading}
              className="cursor-pointer"
            >
              {editingEnabled
                ? editingLoading
                  ? "Editing..."
                  : "Edit Signal"
                : addingLoading
                ? "Adding..."
                : "Create Signal"}
            </Button>
          ) : (
            <Button
              onClick={handleAddSignal}
              disabled={editingEnabled ? editingLoading : addingLoading}
              className="cursor-pointer"
            >
              {editingEnabled
                ? editingLoading
                  ? "Editing..."
                  : "Edit Signal"
                : addingLoading
                ? "Adding..."
                : "Create Signal"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminSignalPage() {
  const [open, setOpen] = useState(false);

  //Signal Add Form States
  const [SignalAddLoading, setSignalAddLoading] = useState(false);
  const [pair, setPair] = useState("");
  const [leverage, setLeverage] = useState<number>(0);
  const [type, setType] = useState<"spot" | "futures">("spot");
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [exitPrice, setExitPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);

  //Signal Delete States
  const [deleteLoading, setDeleteLoading] = useState(false);

  //Signal Status Change States
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);

  //Signal Edit Form States
  const [editingLoading, setEditingLoading] = useState(false);

  // --- State Management ---
  const [signalid, setSignalId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false); // Unused in modal but kept for context
  const [editedAt, setEditedAt] = useState<string>(""); // Unused in modal but kept for context
  const [createdAt, setCreatedAt] = useState<string | Timestamp>(""); // Unused in modal but kept for context
  const [win_count, setWinCount] = useState<number>(0); // Unused in modal but kept for context
  const [loss_count, setLossCount] = useState<number>(0); // Unused in modal but kept for context
  const [status, setStatus] = useState<string>(""); // Unused in modal but kept for context
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [pageloading, setPageLoading] = useState(false);
  const [activateEnable, setActivateEnable] = useState<boolean>(false);

  const [showDeleteSignalFormModal, setShowDeleteSignalFormModal] =
    useState(false); // Unused in modal but kept for context

  // --- Pagination States ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 15;

  const [loadingMore, setLoadingMore] = useState(false);

  // --- Filter States ---
  const [filterType, setFilterType] = useState("all"); // all, spot, futures
  const [filterMode, setFilterMode] = useState("all"); // all, buy, sell
  const [sortOrder, setSortOrder] = useState(""); // desc (newest), asc (oldest)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [signals, setSignals] = useState<SignalModel[]>([]);

  const resetFilters = () => {
    setFilterType("all");
    setFilterMode("all");
    setSortOrder("");
    setStartDate("");
    setEndDate("");
  };

  function openEditModal(signal: SignalModel) {
    setOpen(true);
    setSignalId(signal.signal_id);
    setEditingEnabled(true);
    setEntryPrice(signal.entryPrice);
    setExitPrice(signal.exitPrice);
    setStopLoss(signal.stopLoss);
    setType(signal.type);
    setMode(signal.mode);
    setPair(signal.pair);
    setLeverage(signal.leverage);
    setCreatedAt(signal.createdAt);
    setWinCount(signal.win_count || 0);
    setLossCount(signal.loss_count || 0);
    setEdited(true);
    setEditedAt(new Date().toISOString());
  }

  const StatusModel = useCallback((signal: SignalModel) => {
    setStatus(signal.status?.toString() || "");
    setSignalId(signal.signal_id);
    setActivateEnable(true);

    console.log("Current Status:", signal.signal_id, signal.status);
  }, []);

  const DeleteSignalCardModel = useCallback(async (signal_id: string) => {
    setSignalId(signal_id);
    setShowDeleteSignalFormModal(true);
  }, []);

  const ClearFormData = useCallback(() => {
    setType("spot");
    setMode("buy");
    setPair("");
    setLeverage(1);
    setEntryPrice(0);
    setExitPrice(0);
    setStopLoss(0);
    setSignalId("");
    setEditingEnabled(false);
  }, []);

  const fetchSignals = async (isInitial = true) => {
    if (isInitial) {
      setLoading(true);
      setPage(1);
    } else {
      setLoadingMore(true);
    }

    const pageToFetch = isInitial ? 1 : page + 1;

    try {
      // 1. Mandatory base parameters
      const params: any = {
        page: pageToFetch,
        limit: LIMIT,
      };

      // 2. Logic: If Date Range is selected, it takes priority
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
        params.sort = sortOrder;

        console.log("Filtering by Date Range - Secondary filters bypassed");
      }
      // 3. Otherwise, use standard filters
      else {
        if (filterType !== "all") params.type = filterType;
        if (filterMode !== "all") params.mode = filterMode;
        params.sort = sortOrder;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/getSignalsByDate`,
        {
          params,
          // Removed multipart/form-data as GET requests should not have it
          headers: { "Content-Type": "application/json" },
        }
      );

      const newData = res.data.data || [];
      const hasMoreItems = newData.length === LIMIT;

      if (isInitial) {
        setSignals(newData);
        setPage(1);
      } else {
        setSignals((prev) => [...prev, ...newData]);
        setPage(pageToFetch);
      }

      setHasMore(hasMoreItems);
    } catch (err) {
      console.error("Fetch Error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchNextPage = () => {
    if (!loadingMore && hasMore) {
      fetchSignals(false);
    }
  };

  useEffect(() => {
    fetchSignals(true);
  }, [filterType, filterMode, sortOrder, startDate, endDate, pageloading]);

  // 1. Handle Add Signal
  const handleAddSignal = useCallback(async () => {
    if (
      pair === "" ||
      entryPrice === 0 ||
      exitPrice === 0 ||
      stopLoss === 0 ||
      leverage === 0 ||
      (mode !== "buy" && mode !== "sell") ||
      (type !== "spot" && type !== "futures")
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      setSignalAddLoading(true);
      const Data: SignalModel = {
        type,
        mode,
        pair,
        leverage,
        entryPrice,
        exitPrice,
        stopLoss,
        signal_id: crypto.randomUUID(),
        edited: false,
        editedAt: "",
        createdAt: "",
        win_count: 0,
        loss_count: 0,
        status: "Active",
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/addsignal`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: Data }),
        }
      );

      if (response.ok) {
        console.log("Signal added successfully");
      }

      if (response.status === 200) {
        setSignalAddLoading(false);
        ClearFormData();
        setOpen(false);
        setPageLoading((prev) => !prev);
      }
    } catch (error) {
      setSignalAddLoading(false);
      console.error("Error adding signal:", error);
    }
  }, [
    type,
    mode,
    pair,
    leverage,
    entryPrice,
    exitPrice,
    stopLoss,
    ClearFormData,
    setPageLoading,
  ]);

  const ChangeStatus = useCallback(async () => {
    setStatusChangeLoading(true);
    const Data = {
      signal_id: signalid,
      status: status,
    };

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/changesignalstatus`,
        Data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setStatusChangeLoading(false);
        setPageLoading((prev) => !prev);
        setActivateEnable(false);
        setStatus("");
        console.log("Status updated:", response.data.message);
      }
    } catch (error) {
      console.error("Error changing status:", error);
      setStatusChangeLoading(false);
    }
  }, [signalid, status]);

  // 2. Handle Edit Signal
  const handleEdit = useCallback(async () => {
    setEditingLoading(true);
    const Data: SignalModel = {
      type,
      mode,
      pair,
      leverage,
      entryPrice,
      exitPrice,
      stopLoss,
      signal_id: signalid,
      edited: true,
      editedAt: "",
      createdAt: createdAt,
      win_count: win_count,
      loss_count: loss_count,
      status: (status as "Active" | "Inactive" | undefined) || "Active",
    };

    try {
      const response = await axios("/api/admin/editsignal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        data: { data: Data },
      });

      if (response.status === 200) {
        setEditingLoading(false);
        console.log("Signal Edited successfully");
      }

      ClearFormData();
      setOpen(false);
      setPageLoading((prev) => !prev);
    } catch (error) {
      setEditingLoading(false);
      console.error("Error editing signal:", error);
    }
  }, [
    type,
    mode,
    pair,
    leverage,
    entryPrice,
    exitPrice,
    stopLoss,
    signalid,
    createdAt,
    win_count,
    loss_count,
    status,
    ClearFormData,
    setPageLoading,
  ]);

  const handlesignalDelete = useCallback(async (signal_id: string) => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(`/api/admin/deletesignal`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: { signal_id: signal_id },
      });

      if (response.data.success) {
        setDeleteLoading(false);
        setPageLoading((prev) => !prev);
        setShowDeleteSignalFormModal(false);
        console.log("Signal deleted:", response.data.message);
      }
    } catch (error) {
      setDeleteLoading(false);
      setShowDeleteSignalFormModal(false);
      console.error("Error deleting signal:", error);
    }
  }, []);

  return (
    <>
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl mx-auto mt-6 px-4 gap-4">
        <h1 className="text-xl font-black text-white tracking-tighter uppercase flex items-center">
          Signal Terminal
        </h1>
        <button
          onClick={() => {
            ClearFormData();
            setEditingEnabled(false);
            setOpen(true);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2 text-xs font-black uppercase text-white bg-emerald-600 rounded-lg shadow-lg hover:bg-emerald-500 transition-all"
        >
          <FiPlus size={16} /> Add Signal
        </button>
      </div>

      {/* 2. ADVANCED FILTER PANEL */}
      <div className="flex flex-col w-full max-w-5xl mx-auto mt-4 px-4 gap-3">
        <div className="bg-[#0B1222] border border-white/5 rounded-2xl p-4 shadow-2xl flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Group 1: Type & Mode */}
            <div className="flex flex-wrap gap-2">
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                {["ALL", "SPOT", "FUTURES"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t.toLowerCase())}
                    className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all ${
                      filterType === t.toLowerCase()
                        ? "bg-emerald-500 text-white"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                {["ALL", "BUY", "SELL"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMode(m.toLowerCase())}
                    className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all ${
                      filterMode === m.toLowerCase()
                        ? "bg-blue-500 text-white"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Group 2: Sorting */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                Sort Signals
              </label>

              <div className="flex bg-black/40 border border-white/10 p-1 rounded-xl w-fit group">
                {/* Newest Button */}
                <button
                  onClick={() => setSortOrder("desc")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all duration-300 ${
                    sortOrder === "desc"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      sortOrder === "desc" ? "rotate-0" : "opacity-50"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path d="M3 4h13M3 8h9M3 12h5m0 5l3 3 3-3m-3 3V10" />
                  </svg>
                  Newest
                </button>

                {/* Oldest Button */}
                <button
                  onClick={() => setSortOrder("asc")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all duration-300 ${
                    sortOrder === "asc"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      sortOrder === "asc" ? "rotate-180" : "opacity-50"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path d="M3 4h13M3 8h9M3 12h5m0 5l3 3 3-3m-3 3V10" />
                  </svg>
                  Oldest
                </button>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* Group 3: Date Range */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Inputs Container */}
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              {/* Start Date */}
              <div className="flex flex-col flex-1 relative group">
                <label className="text-[8px] text-gray-500 font-black uppercase mb-1.5 ml-1 tracking-widest">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-gray-300 text-[11px] font-bold px-3 py-2.5 rounded-xl outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all cursor-pointer [color-scheme:dark]"
                  />
                  {/* Optional: Overlaying a custom icon if you want to make it look more professional */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-emerald-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* End Date */}
              <div className="flex flex-col flex-1 relative group">
                <label className="text-[8px] text-gray-500 font-black uppercase mb-1.5 ml-1 tracking-widest">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-gray-300 text-[11px] font-bold px-3 py-2.5 rounded-xl outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all cursor-pointer [color-scheme:dark]"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-emerald-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Button */}
            <button
              onClick={resetFilters}
              className="mt-auto flex items-center gap-2 px-5 py-2.5 text-[10px] font-black text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all uppercase tracking-tighter active:scale-95"
            >
              <FiRefreshCcw size={12} className="shrink-0" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. SIGNALS LIST */}
      <div className="flex flex-col items-center w-full mt-2 gap-2 py-4 px-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
              Optimizing Data Stream...
            </p>
          </div>
        ) : signals.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-white/5 rounded-3xl w-full max-w-5xl">
            <FiFilter className="text-gray-800 mb-2" size={30} />
            <p className="text-[10px] font-bold text-gray-600 uppercase">
              No signals match your current criteria
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-full gap-2">
              {signals.map((signal, index) => (
                <SignalCard
                  key={signal.signal_id || index}
                  signal={signal}
                  onEdit={() => openEditModal(signal)}
                  onActivity={() => StatusModel(signal)}
                  onDelete={() => DeleteSignalCardModel(signal.signal_id)}
                />
              ))}
            </div>

            {/* 4. LOAD MORE */}
            {hasMore && (
              <div className="mt-8 mb-12">
                <button
                  onClick={fetchNextPage}
                  disabled={loadingMore}
                  className="px-12 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 border border-emerald-500/30 rounded-full hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {loadingMore ? "Loading..." : "Load More Signals"}
                </button>
              </div>
            )}

            {!hasMore && signals.length > 0 && (
              <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest mt-6 mb-12">
                All available records synchronized
              </p>
            )}
          </>
        )}
      </div>

      {/* MODALS (Kept exactly as previous) */}
      <SignalAddAndEditFormModal
        isOpen={open}
        setOpen={setOpen}
        editingEnabled={editingEnabled}
        addingLoading={SignalAddLoading}
        editingLoading={editingLoading}
        type={type}
        setType={setType}
        mode={mode}
        setMode={setMode}
        leverage={leverage}
        setLeverage={setLeverage}
        pair={pair}
        setPair={setPair}
        entryPrice={entryPrice}
        setEntryPrice={setEntryPrice}
        exitPrice={exitPrice}
        setExitPrice={setExitPrice}
        stopLoss={stopLoss}
        setStopLoss={setStopLoss}
        ClearFormData={ClearFormData}
        handleAddSignal={handleAddSignal}
        handleEdit={handleEdit}
      />

      <StatusEditModel
        setActivateEnable={setActivateEnable}
        ChangeStatus={ChangeStatus}
        status={status}
        activateEnable={activateEnable}
        setStatus={setStatus}
        loading={statusChangeLoading}
        setOpen={setOpen}
      />

      <SignalDeleteModel
        loading={deleteLoading}
        handleSignalDelete={() => handlesignalDelete(signalid)}
        showSignalFormModal={showDeleteSignalFormModal}
        setShowSignalFormModal={setShowDeleteSignalFormModal}
        signal_id={signalid}
      />
    </>
  );
}
