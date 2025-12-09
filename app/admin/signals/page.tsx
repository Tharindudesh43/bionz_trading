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
import { FiPlus } from "react-icons/fi";

// --- Interface for Modal Props (for type safety) ---
interface SignalFormModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  editingEnabled: boolean;
  loading: boolean;
  // State values
  type: "spot" | "futures";
  side: "buy" | "sell";
  leverage: number;
  pair: string;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  // Setters (or functions that use setters)
  setType: (val: "spot" | "futures") => void;
  setSide: (val: "buy" | "sell") => void;
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
  setLoading: (val: boolean) => void;
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
              Change
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
  setLoading,
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
              variant="outline"
              onClick={() => setShowSignalFormModal(false)}
              className="cursor-pointer text-black border-gray-300"
            >
              Cancel
            </Button>

            <Button
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

const SignalFormModal: React.FC<SignalFormModalProps> = ({
  isOpen,
  setOpen,
  editingEnabled,
  loading,
  type,
  setType,
  side,
  setSide,
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
              variant={side === "buy" ? "default" : "outline"}
              className={`text-black cursor-pointer hover:bg-green-600 ${
                side === "buy" ? "bg-green-500 text-white" : ""
              }`}
              onClick={() => setSide("buy")}
            >
              Buy
            </Button>
            <Button
              variant={side === "sell" ? "default" : "outline"}
              className={` cursor-pointer text-black hover:bg-red-600 ${
                side === "sell" ? "bg-red-500 text-white" : ""
              }`}
              onClick={() => setSide("sell")}
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
            min={1}
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
            disabled={loading}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          {editingEnabled ? (
            <Button
              onClick={handleEdit}
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? "Editing..." : "Edit Signal"}
            </Button>
          ) : (
            <Button
              onClick={handleAddSignal}
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? "Adding..." : "Create Signal"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminSignalPage() {
  const [open, setOpen] = useState(false);

  // --- State Management ---
  const [signalid, setSignalId] = useState<string>("");
  const [type, setType] = useState<"spot" | "futures">("spot");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [leverage, setLeverage] = useState<number>(1);
  const [pair, setPair] = useState("");
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [exitPrice, setExitPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [edited, setEdited] = useState(false); // Unused in modal but kept for context
  const [editedAt, setEditedAt] = useState<string>(""); // Unused in modal but kept for context
  const [createdAt, setCreatedAt] = useState<string | Timestamp>(""); // Unused in modal but kept for context
  const [win_count, setWinCount] = useState<number>(0); // Unused in modal but kept for context
  const [loss_count, setLossCount] = useState<number>(0); // Unused in modal but kept for context
  const [status, setStatus] = useState<string>(""); // Unused in modal but kept for context
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [pageloading, setPageLoading] = useState(false);
  const [activateEnable, setActivateEnable] = useState<boolean>(false); // Unused in modal but kept for context
  const [showSignalFormModal, setShowSignalFormModal] = useState(false); // Unused in modal but kept for context

  const [signals, setSignals] = useState<SignalModel[]>([]);

  function openEditModal(signal: SignalModel) {
    setOpen(true);
    setSignalId(signal.signal_id);
    setEditingEnabled(true);
    setEntryPrice(signal.entryPrice);
    setExitPrice(signal.exitPrice);
    setStopLoss(signal.stopLoss);
    setType(signal.type);
    setSide(signal.side);
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
    setShowSignalFormModal(true);
  }, []);

  // --- Helper Function to Clear Form Data ---
  const ClearFormData = useCallback(() => {
    setType("spot");
    setSide("buy");
    setPair("");
    setLeverage(1);
    setEntryPrice(0);
    setExitPrice(0);
    setStopLoss(0);
    setSignalId("");
    setEditingEnabled(false);
  }, []);

  const fetchSignals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signals`
      );
      const data = res.data;
      setSignals(data.data);
      console.log("Fetched signals:", data.data);
    } catch (err) {
      setLoading(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, [pageloading]);

  // 1. Handle Add Signal
  const handleAddSignal = useCallback(async () => {
    setLoading(true);

    const Data: SignalModel = {
      type,
      side,
      pair,
      leverage,
      entryPrice,
      exitPrice,
      stopLoss,
      signal_id: crypto.randomUUID(),
      edited: false,
      editedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      win_count: 0,
      loss_count: 0,
      status: "Active",
    };

    try {
      const response = await fetch("/api/admin/addsignal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: Data }),
      });

      if (response.ok) {
        console.log("Signal added successfully");
      }

      // Success cleanup
      ClearFormData();
      setOpen(false);
      setPageLoading((prev) => !prev);
    } catch (error) {
      console.error("Error adding signal:", error);
    } finally {
      setLoading(false);
    }
  }, [
    type,
    side,
    pair,
    leverage,
    entryPrice,
    exitPrice,
    stopLoss,
    ClearFormData,
    setPageLoading,
  ]);

  const ChangeStatus = useCallback(async () => {
    setLoading(true);

    const Data = {
      signal_id: signalid,
      status: status,
    };

    try {
      const response = await axios.patch(
        "/api/admin/changesignalstatus",
        Data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("Status updated:", response.data.message);
      } else {
        console.error("Error:", response.data.message);
      }

      setStatus("");
      setPageLoading((prev) => !prev);
      setActivateEnable(false);
    } catch (error) {
      console.error("Error changing status:", error);
      setActivateEnable(false);
      setPageLoading((prev) => !prev);
    } finally {
      setLoading(false);
    }
  }, [signalid, status]);

  // 2. Handle Edit Signal
  const handleEdit = useCallback(async () => {
    setLoading(true);
    const Data: SignalModel = {
      type,
      side,
      pair,
      leverage,
      entryPrice,
      exitPrice,
      stopLoss,
      signal_id: signalid, // Use existing signal ID
      edited: true,
      editedAt: new Date().toISOString(),
      createdAt: createdAt,
      win_count: win_count,
      loss_count: loss_count,
      status: (status as "Active" | "Deactivate" | undefined) || "Active",
    };

    try {
      const response = await axios("/api/admin/editsignal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        data: { data: Data },
      });

      if (response.status === 200) {
        console.log("Signal Edited successfully");
      }

      // Success cleanup
      ClearFormData();
      setOpen(false);
      setPageLoading((prev) => !prev);
    } catch (error) {
      console.error("Error editing signal:", error);
    } finally {
      setLoading(false);
    }
  }, [
    type,
    side,
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
    setLoading(true);

    try {
      const response = await axios.delete(`/api/admin/deletesignal`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: { signal_id: signal_id },
      });

      if (response.data.success) {
        console.log("Signal deleted:", response.data.message);
      } else {
        console.error("Error:", response.data.message);
      }

      setPageLoading((prev) => !prev);
      setShowSignalFormModal(false);
    } catch (error) {
      console.error("Error deleting signal:", error);
      setShowSignalFormModal(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {/* 1. FIXED ADD SIGNAL BUTTON */}
      <div className="fixed top-20 right-6 z-10 md:top-8 md:right-8">
        <button
          onClick={() => {
            ClearFormData(); // Reset form when opening for a new signal
            setEditingEnabled(false);
            setOpen(true);
          }}
          className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-xl shadow-green-500/50 hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-green-500/50"
        >
          <FiPlus size={20} />
          Add Signal
        </button>
      </div>

      {/* 2. SIGNAL FORM MODAL */}
      <SignalFormModal
        isOpen={open}
        setOpen={setOpen}
        editingEnabled={editingEnabled}
        loading={loading}
        // State props
        type={type}
        setType={setType}
        side={side}
        setSide={setSide}
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
        // Action props
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
        loading={loading}
        setOpen={setOpen}
      />

      <SignalDeleteModel
        loading={loading}
        setLoading={setLoading}
        handleSignalDelete={() => handlesignalDelete(signalid)}
        showSignalFormModal={showSignalFormModal}
        setShowSignalFormModal={setShowSignalFormModal}
        signal_id={signalid}
      />

      {/* Main Content */}
      <div className="flex flex-col items-center w-full mt-5 gap-4 py-4">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-600 text-lg animate-pulse">
            Loading signals...
          </div>
        )}

        {/* Empty State */}
        {!loading && signals.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center text-gray-500 text-lg">
            No signals available. Click{" "}
            <span className="font-semibold">"Add Signal"</span> to create one.
          </div>
        )}

        {/* Signals List */}
        {!loading && signals.length > 0 && (
          <div className="flex flex-col w-full gap-3">
            {signals.map((signal: SignalModel, index: number) => (
              <SignalCard
                key={signal.signal_id || index}
                signal={signal}
                onEdit={() => {
                  openEditModal(signal);
                }}
                onActivity={() => {
                  StatusModel(signal);
                }}
                onDelete={() => {
                  DeleteSignalCardModel(signal.signal_id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
