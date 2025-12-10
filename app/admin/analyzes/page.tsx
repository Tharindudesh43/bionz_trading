"use client";

import { AnalyzeModel } from "@/types/analyze_model";
import { useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AnalyzePopUP from "@/components/analyze_popup";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
dayjs.extend(relativeTime);

interface AnalyzeFormModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  editingEnabled: boolean;
  loading: boolean;
  // State values
  type: "spot" | "futures";
  pair: string;
  description: string; // New
  imageFile: File | null; // New state for image file object
  // Setters
  setType: (val: "spot" | "futures") => void;
  setPair: (val: string) => void;
  setDescription: (val: string) => void; // New
  setImageFile: (val: File | null) => void; // New
  // Handlers
  handleCancel: () => void;
  handleAddAnalyze: () => Promise<void>; // Renamed from handleAddSignal
  handleEditAnalyze: () => Promise<void>; // Renamed from handleEdit
  handleDeleteAnalyze: () => Promise<void>; // New
}

const AnalyzeFormModal: React.FC<AnalyzeFormModalProps> = ({
  isOpen,
  setOpen,
  editingEnabled,
  loading,
  type,
  setType,
  pair,
  setPair,
  description,
  setDescription,
  imageFile,
  setImageFile,
  handleCancel,
  handleAddAnalyze,
  handleEditAnalyze,
  handleDeleteAnalyze,
}) => {
  if (!isOpen) return null;

  // Check if a Type has been selected (for rendering 'Pair' conditionally, if needed)
  const isTypeSelected = type === "spot" || type === "futures";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* 1. Modal Title */}
        <h2 className="text-xl font-semibold mb-5 text-black">
          {editingEnabled ? "Edit Analysis" : "Add Analysis"}
        </h2>

        {/* 2. Type (Spot/Futures Radio Buttons) */}
        <div className="mb-4">
          <label className="font-medium text-gray-700 block mb-1">Type</label>
          <RadioGroup
            value={type}
            onValueChange={(val: string) => setType(val as "spot" | "futures")}
            className="flex gap-4"
          >
            {/* Spot Option */}
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
            {/* Futures Option */}
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

        {/* 3. Pair Input */}
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

        {/* 4. Description Input (Using Textarea) */}
        <div className="mb-4">
          <label className="font-medium text-gray-700 block mb-1">
            Description
          </label>
          <Textarea
            className="text-black"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Enter detailed analysis description"
            rows={4}
          />
        </div>

        {/* 5. Image Upload Input */}
        <div className="mb-6">
          <label className="font-medium text-gray-700 block mb-2">
            Upload Chart Image
          </label>

          {/* File Picker Box */}
          <div className="w-50 cursor-pointer">
            {imageFile == null ? (
              <Input
                className="
        text-gray-700
        file:text-white
        file:bg-gray-600
        file:hover:bg-gray-700
        file:border-none
        file:rounded-md
        file:px-3
        file:py-1.5
        bg-gray-100
        rounded-md
        p-1
        cursor-pointer
      "
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                }}
              />
            ) : null}
          </div>

          {/* Preview */}
          {imageFile && (
            <>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                className="w-24 h-24 rounded-lg border mt-3 object-cover shadow-sm"
              />
              <Button
                variant="destructive"
                size="sm"
                className="mt-2  hover:bg-red-400 cursor-pointer"
                onClick={() => setImageFile(null)}
              >
                <AiFillDelete className="m-" />
              </Button>
            </>
          )}

          {/* Existing image text */}
          {editingEnabled && !imageFile && (
            <p className="text-sm text-gray-500 mt-2">
              Current image is loaded from the database.
            </p>
          )}
        </div>

        {/* 6. Action Buttons */}
        <div className="flex justify-between gap-2 border-t pt-4">
          {/* Left side: Delete Button (Only visible during Edit) */}
          {editingEnabled && (
            <Button
              onClick={handleDeleteAnalyze}
              disabled={loading}
              variant="destructive" // Red style for destructive action
              className="cursor-pointer bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          )}

          {/* Right side: Cancel, Review, and Create/Edit */}
          <div className="flex justify-end gap-2 ml-auto">
            <Button
              onClick={handleCancel}
              disabled={loading}
              variant="outline"
              className="cursor-pointer text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>

            {editingEnabled ? (
              <Button
                onClick={handleEditAnalyze}
                disabled={loading}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Editing..." : "Edit Analysis"}
              </Button>
            ) : (
              <Button
                onClick={handleAddAnalyze}
                disabled={loading}
                className="cursor-pointer bg-green-600 hover:bg-green-700"
              >
                {loading ? "Adding..." : "Create Analysis"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AnalyzePage() {
  const [analyzes, setAnalyzes] = useState<AnalyzeModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpenDescription, setIsOpenDescription] = React.useState(false);

  const [analyzeDescription, setAnalyzeDescription] = useState<string>("");

  const toggleDescription = () => {
    setIsOpenDescription(!isOpenDescription);
  };

  const DescriptionSet = ({ Description }: { Description: string }) => {
    toggleDescription();
    setAnalyzeDescription(Description);
  };

  const fetchanalyze = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/getAnalyzeBydate`
      );
      const data = res.data;
      setAnalyzes(data.data);
      console.log("Fetched analyze:", data.data);
    } catch (err) {
      setLoading(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchanalyze();
  }, []);

  const [pair, setPair] = useState<string>("");
  const [type, setType] = useState<"spot" | "futures">("spot");
  const [side, setSide] = useState<"buy" | "futures">("buy");
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [exitPrice, setExitPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [isFormModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [editingEnabled, setEditingEnabled] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleCancel = () => {
    // Clear all form data
    setType("spot");
    setPair("");
    setSide("buy");
    setEntryPrice(0);
    setExitPrice(0);
    setStopLoss(0);
    setEditingEnabled(false);
    setFormModalOpen(false);
  };

  const handleAddAnalyze = async () => {
    setLoading(true);
    try {
      const Data: AnalyzeModel = {
        analyze_id: crypto.randomUUID(),
        analyze_description: analyzeDescription,
        created_date: new Date().toISOString(),
        edited: false,
        analyze_image: "",
        edited_date: new Date().toISOString(),
        pair: pair,
        status: "active",
        type: type,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/addAnalyze`,
        Data
      );

      if (res.data.success) {
        fetchanalyze();
        setLoading(false);
        setFormModalOpen(false);
        clearFormData();
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const handleEditAnalyze = async () => {
    setLoading(true);
  };

  const handleDelete = async () => {
    setLoading(true);
  };

  const clearFormData = () => {
    setType("spot");
    setPair("");
    setSide("buy");
    setEntryPrice(0);
    setExitPrice(0);
    setStopLoss(0);
    setImageFile(null);
    setAnalyzeDescription("");
  };

  return (
    <>
      <div className="fixed top-20 right-6 z-10 md:top-8 md:right-8">
        <button
          onClick={() => {
            clearFormData();
            setFormModalOpen(true);
            setEditingEnabled(false);
          }}
          className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-xl shadow-green-500/50 hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-green-500/50"
        >
          <FiPlus size={20} />
          Add Analyze
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow mt-15 bg-white">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200 text-black sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Pair</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Created Date</th>
              <th className="px-4 py-3">Last Edit Date</th>
              <th className="px-4 py-3">Info</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center px-4 py-6 text-gray-500">
                  Loading analyzes...
                </td>
              </tr>
            ) : analyzes.length == 0 ? (
              <tr>
                <td colSpan={9} className="text-center px-4 py-6 text-gray-500">
                  No analyzes found.
                </td>
              </tr>
            ) : (
              analyzes.map((analyze) => (
                <tr
                  key={analyze.analyze_id}
                  className="border-b hover:bg-gray-50 text-black  font-semibold"
                >
                  <td className="px-4 py-3 text-center">
                    {/* Conditional Badge */}
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${
              analyze.status === "active"
                ? "bg-green-100 text-green-800" // Green for Active
                : analyze.status === "inactive"
                ? "bg-red-100 text-red-800" // Red for Inactive
                : "bg-gray-100 text-gray-800" // Default/Other status
            }
        `}
                    >
                      {analyze.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    {analyze.pair}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {analyze.type === "spot" ? (
                      <span className="text-green-600">SPOT</span>
                    ) : analyze.type === "futures" ? (
                      <span className="text-red-600">FUTURES</span>
                    ) : (
                      <span>{analyze.type}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Image
                      src={
                        typeof analyze.analyze_image === "string"
                          ? analyze.analyze_image
                          : ""
                      }
                      alt="Trading chart"
                      width={50}
                      height={50}
                      className="w-full h-auto object-cover rounded-lg border-2 border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {analyze.created_date
                      ? new Date(
                          analyze.created_date.toString()
                        ).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true, // Use 12-hour format (AM/PM)
                        })
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {analyze.edited === false
                      ? "Not Edited"
                      : // Inner Ternary: Safely format and display the edited_date
                      analyze.edited_date // Check if the edited date string exists
                      ? new Date(analyze.edited_date.toString()).toLocaleString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center items-center justify-center">
                    <FaInfoCircle
                      className="text-blue-600 hover:text-blue-800 text-lg cursor-pointer"
                      onClick={() =>
                        DescriptionSet({
                          Description: analyze.analyze_description,
                        })
                      }
                    ></FaInfoCircle>
                  </td>
                  <td className="px-4 py-3 text-center items-center">
                    <div className="flex gap-2 justify-center">
                      {/* Edit Button */}
                      <button
                        className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                        onClick={() => {}} // Assuming onEdit is passed as a prop
                        title="Edit Analysis"
                      >
                        <AiFillEdit className="w-5 h-5" />
                      </button>

                      {/* View/Action Button */}
                      <button
                        className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-100 transition-colors duration-200"
                        onClick={() => {}} // Assuming onView is passed as a prop
                        title="View Details"
                      >
                        <AiFillDelete className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <AnalyzePopUP
          isOpen={isOpenDescription}
          onClose={toggleDescription}
          title="Description"
        >
          {analyzeDescription}
        </AnalyzePopUP>
        <AnalyzeFormModal
          imageFile={imageFile}
          setImageFile={setImageFile}
          description={analyzeDescription}
          setDescription={setAnalyzeDescription}
          handleEditAnalyze={handleEditAnalyze}
          handleDeleteAnalyze={handleDelete}
          isOpen={isFormModalOpen}
          setOpen={setFormModalOpen}
          editingEnabled={editingEnabled}
          loading={loading}
          type={type}
          pair={pair}
          setType={setType}
          setPair={setPair}
          handleCancel={handleCancel}
          handleAddAnalyze={handleAddAnalyze}
        />
      </div>
    </>
  );
}
