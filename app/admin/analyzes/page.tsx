"use client";

import { SnackbarProvider, useSnackbar } from "notistack";
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
import {
  AiFillCloseCircle,
  AiFillDelete,
  AiFillEdit,
  AiOutlineDelete,
  AiOutlineImport,
} from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
dayjs.extend(relativeTime);

interface AnalyzeFormModalProps {
  isOpen: boolean;
  editingEnabled: boolean;
  loading: boolean;
  type: "spot" | "futures";
  pair: string;
  description: string;
  imageFile: File | null;

  //Setters
  setOpen: (open: boolean) => void;
  setType: (val: "spot" | "futures") => void;
  setPair: (val: string) => void;
  setDescription: (val: string) => void;
  setImageFile: (val: File | null) => void;
  handleCancel: () => void;
  handleAddAnalyze: () => Promise<void>;
  handleEditAnalyze: () => Promise<void>;
  handleDeleteAnalyze: () => Promise<void>;
}

const AnalyzeAddFormModal: React.FC<AnalyzeFormModalProps> = ({
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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {editingEnabled ? "Edit Analysis" : "Add Analysis"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details for your market signal.
          </p>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Market Type
            </label>
            <RadioGroup
              value={type}
              onValueChange={(val: string) =>
                setType(val as "spot" | "futures")
              }
              className="flex text-gray-900 gap-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
            >
              <div className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem
                  value="spot"
                  id="spot"
                  className="border-gray-400"
                />
                <label
                  htmlFor="spot"
                  className="text-sm font-medium cursor-pointer dark:text-white"
                >
                  Spot
                </label>
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem
                  value="futures"
                  id="futures"
                  className="border-gray-400"
                />
                <label
                  htmlFor="futures"
                  className="text-sm font-medium cursor-pointer dark:text-white"
                >
                  Futures
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Trading Pair
            </label>
            <Input
              className="h-12 text-gray-600 rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              placeholder="e.g. BTC/USDT"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Analysis Description
            </label>
            <Textarea
              className="rounded-xl border-gray-200 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your technical thoughts..."
              rows={4}
            />
          </div>

          <div className="space-y-3 text-gray-400">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Chart Image
            </label>

            {!imageFile ? (
              <div className="relative group">
                <Input
                  className="h-auto p-4 cursor-pointer border-dashed border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-800/30"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                  }}
                />
              </div>
            ) : (
              <div className="relative inline-block group">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  className="w-full max-h-48 md:w-32 md:h-32 rounded-xl object-cover border-2 border-blue-500 shadow-md"
                />
                <button
                  onClick={() => setImageFile(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-transform active:scale-90"
                >
                  <AiFillDelete size={16} />
                </button>
              </div>
            )}

            {editingEnabled && !imageFile && (
              <p className="text-xs text-blue-500 font-medium italic">
                * Keeping current image unless new file is selected.
              </p>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
            {editingEnabled ? (
              <Button
                onClick={handleDeleteAnalyze}
                disabled={loading}
                variant="destructive"
                className="w-full sm:w-auto rounded-xl px-6 font-bold"
              >
                Delete
              </Button>
            ) : (
              <div className="hidden sm:block" />
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={handleCancel}
                disabled={loading}
                variant="outline"
                className="w-full cursor-pointer sm:w-auto rounded-xl px-6 border-gray-300 dark:text-white text-gray-900 font-semibold"
              >
                Cancel
              </Button>

              <Button
                onClick={editingEnabled ? handleEditAnalyze : handleAddAnalyze}
                disabled={loading}
                className={`w-full cursor-pointer sm:w-auto rounded-xl px-8 font-bold text-white shadow-lg transition-all active:scale-95 ${
                  editingEnabled
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : editingEnabled ? (
                  "Save Changes"
                ) : (
                  "Create Analysis"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AnalyzeDeleteProps {
  loading: boolean;
  isOpen: boolean;
  setLoading: (isLoading: boolean) => void;
  setOpen: (isOpen: boolean) => void;
  handleDeleteAnalyze: () => void;
}

const AnalyzeDelete: React.FC<AnalyzeDeleteProps> = ({
  loading,
  isOpen,
  setOpen,
  handleDeleteAnalyze,
}) => {
  const closeModal = () => setOpen(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center  justify-center bg-black/50"
      onClick={closeModal}
    >
      <div
        className="relative w-full max-w-md mx-auto rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <AiFillCloseCircle className="w-6 h-6" />
        </button>

        <div className="p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AiOutlineDelete className="h-6 cursor-pointer w-6 text-red-600" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Delete Analysis
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Are you sure you want to delete this analysis? All data will be
            removed.
            <strong> This action cannot be undone.</strong>
          </p>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <Button
            type="button"
            disabled={loading}
            onClick={closeModal}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={loading}
            onClick={handleDeleteAnalyze}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface AnalyzeEditModalProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  loading: boolean;
  type: string;
  setType: (type: "spot" | "futures") => void;
  pair: string;
  setPair: (pair: string) => void;
  description: string;
  setDescription: (description: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  existingImageUrl: string | File | null;
  status: string;
  setstatus: (status: string) => void;
  handleEditAnalyze: () => void;
  handleClearEditFormData: () => void;
}

const AnalyzeEditModal: React.FC<AnalyzeEditModalProps> = ({
  isOpen,
  setOpen,
  status,
  setstatus,
  loading,
  type,
  setType,
  pair,
  setPair,
  description,
  setDescription,
  imageFile,
  setImageFile,
  existingImageUrl, // New prop for showing the current image
  handleEditAnalyze,
  handleClearEditFormData,
}) => {
  const closeModal = () => {
    setOpen(false);
    handleClearEditFormData();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-xl font-semibold mb-5 text-black">Edit Analysis</h2>

        <div className="space-y-4">
          <div className="bg-gray-600 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Status</h3>
            <select
              value={status}
              onChange={(e) => setstatus(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white text-sm focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-gray-700 block mb-1">Type</label>
            <RadioGroup
              value={type}
              onValueChange={(val: string) =>
                setType(val as "spot" | "futures")
              }
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

          <div>
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

          <div>
            <label className="font-medium text-gray-700 block mb-1">
              Description
            </label>
            <Textarea
              className="text-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter detailed analysis description"
              rows={4}
            />
          </div>

          <div className="mb-6">
            <label className="font-medium text-gray-700 block mb-2">
              Chart Image
            </label>

            <div className="flex flex-col gap-3">
              {!imageFile && (
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImageFile(file);
                    }}
                    className="
      mt-2 block w-full cursor-pointer rounded-lg border border-gray-300 
      bg-white px-4 py-2 text-sm text-gray-700 shadow-sm
      file:mr-4 file:rounded-md file:border-0 
      file:bg-blue-600 file:px-4 file:py-2 file:text-white 
      file:font-medium file:cursor-pointer 
      hover:file:bg-blue-700 
      transition
    "
                  />
                </label>
              )}

              {imageFile && typeof imageFile !== "string" && (
                <div className="flex items-end gap-3">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    className="w-24 p-2 h-24 rounded-lg border object-cover shadow-sm"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setImageFile(null)}
                    className="cursor-pointer hover:bg-red-400"
                  >
                    <AiFillDelete className="mr-1 h-4 w-4" /> Remove New Image
                  </Button>
                </div>
              )}

              {!imageFile && existingImageUrl && (
                <div>
                  <p className="text-sm text-gray-500">Current Image:</p>
                  <img
                    src={
                      typeof existingImageUrl === "string"
                        ? existingImageUrl
                        : URL.createObjectURL(existingImageUrl)
                    }
                    className="w-24 h-24 rounded-lg border object-cover shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-2 border-t pt-4 mt-6">
          <div className="flex justify-end gap-2 ml-auto">
            <Button
              onClick={closeModal}
              disabled={loading}
              variant="outline"
              className="cursor-pointer text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>

            <Button
              onClick={handleEditAnalyze}
              disabled={loading}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AnalyzePage() {
  //Edit Analyze States
  const [editAnalyzeImageFile, setEditAnalyzeImageFile] = useState<File | null>(
    null
  );
  const [editExistingImageUrl, setEditExistingImageUrl] = useState<string>("");
  const [editAnalyzeId, setEditAnalyzeId] = useState<string>("");
  const [editAnalyzeDesciption, setEditAnalyzeDescription] =
    useState<string>("");
  const [editAnalyzePair, setEditAnalyzePair] = useState<string>("");
  const [editAnalyzeType, setEditAnalyzeType] = useState<string>("");
  const [editingEnabled, setEditingEnabled] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [editAnalyzeStatus, setEditAnalyzeStatus] = useState<string>("");

  //Add Analyze States
  const [pair, setPair] = useState<string>("");
  const [type, setType] = useState<"spot" | "futures">("spot");
  const [analyzeDescription, setAnalyzeDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [addLoading, setAddLoading] = useState<boolean>(false);

  //Delete Analyze States
  const [deleteAnalyzeId, setDeleteAnalyzeId] = useState<string>("");
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deletingEnabled, setDeletingEnabled] = useState<boolean>(false);

  // Main States
  const [analyzes, setAnalyzes] = useState<AnalyzeModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpenDescription, setIsOpenDescription] = React.useState(false);

  // Modals States
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const toggleDescription = () => {
    setIsOpenDescription(!isOpenDescription);
  };

  const DescriptionSet = ({ Description }: { Description: string }) => {
    toggleDescription();
    setAnalyzeDescription(Description);
  };

  const fetchanalyze = async ({
    page = 1,
    clear = false,
    iffilterclicked = false
  }
  ) => {
    if (iffilterclicked == true && (dateFilter.start === "" || dateFilter.end === "")) {
      enqueueSnackbar("Select both start and end dates!", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    setLoading(true);
    if (clear) {
      setDateFilter({ start: "", end: "" });
    }
    const dateParams =
      dateFilter.start && dateFilter.end
        ? `&startDate=${dateFilter.start}&endDate=${dateFilter.end}`
        : "";
    try {
      const res = await axios.get(
        clear
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/getAnalyzeBydate?page=${page}&limit=${limit}`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/getAnalyzeBydate?page=${page}&limit=${limit}${dateParams}`
      );
      setAnalyzes(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchanalyze({ page: 1, clear: false, iffilterclicked: false });
  }, []);

  const handleCancel = () => {
    setType("spot");
    setPair("");
    setEditingEnabled(false);
    setFormModalOpen(false);
  };

  const handleAddAnalyze = async () => {
    if (
      analyzeDescription.trim() === "" ||
      pair.trim() === "" ||
      !imageFile ||
      type.trim() === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      setAddLoading(true);
      const formData = new FormData();
      formData.append("analyze_id", crypto.randomUUID());
      formData.append("analyze_description", analyzeDescription);
      formData.append("created_date", new Date().toISOString());
      formData.append("edited", "false");
      formData.append("pair", pair);
      formData.append("status", "Active");
      formData.append("type", type);
      formData.append("edited_date", new Date().toISOString());

      if (imageFile) {
        formData.append("analyze_image", imageFile);
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/addAnalyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        fetchanalyze({ page: 1, clear: false, iffilterclicked: false });
        setAddLoading(false);
        setFormModalOpen(false);
        clearFormData();
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const handleEditDataInsert = async (analyze: AnalyzeModel) => {
    setEditAnalyzeDescription(analyze.analyze_description);
    setEditAnalyzePair(analyze.pair);
    setEditAnalyzeId(analyze.analyze_id);
    setEditAnalyzeType(analyze.type?.toString() || "");
    setEditExistingImageUrl(
      typeof analyze.analyze_image === "string" ? analyze.analyze_image : ""
    );
    setEditModalOpen(true);
    setEditAnalyzeStatus(analyze.status);
  };

  const handleDeleteDataInsert = async (analyze: AnalyzeModel) => {
    setDeleteAnalyzeId(analyze.analyze_id);
    setDeleteModalOpen(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditAnalyze = async () => {
    try {
      setEditLoading(true);
      const formData = new FormData();
      formData.append("edit_analyze_id", editAnalyzeId);
      formData.append("edit_analyze_description", editAnalyzeDesciption);
      formData.append("edit_analyze_pair", editAnalyzePair);
      formData.append("edit_analyze_type", editAnalyzeType);
      formData.append("edit_analyze_status", editAnalyzeStatus);

      if (editAnalyzeImageFile) {
        formData.append("edit_analyze_image", editAnalyzeImageFile);
      } else {
        formData.append("edit_analyze_image", "");
      }

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/editAnalyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        fetchanalyze({ page: 1, clear: false, iffilterclicked: false });
        setEditLoading(false);
        setEditModalOpen(false);
        clearEditFormData();
      }
    } catch (err) {
      setEditLoading(false);
      console.error(err);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeletingEnabled(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/deleteAnalyze`,
        { data: { analyze_id: deleteAnalyzeId } }
      );

      if (res.data.success) {
        fetchanalyze({ page: 1, clear: false, iffilterclicked: false });
        setDeleteModalOpen(false);
        setDeleteLoading(false);
        setDeletingEnabled(false);
        clearEditFormData();
      }
    } catch (err) {
      setDeleteLoading(false);
      setDeletingEnabled(false);
      console.log("Error deleting analyze:", err);
      console.error(err);
    }
  };

  const clearFormData = () => {
    setType("spot");
    setPair("");
    setImageFile(null);
    setAnalyzeDescription("");
  };

  const clearEditFormData = () => {
    setEditAnalyzeDescription("");
    setEditAnalyzePair("");
    setEditAnalyzeType("");
    setEditAnalyzeImageFile(null);
    setEditExistingImageUrl("");
    setEditAnalyzeStatus("");
    setEditAnalyzeId("");
  };

  return (
    <>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-xl">
          <div className="w-full">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Market Analysis
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Managing{" "}
              <span className="text-green-500 font-semibold">
                {analyzes.length || 0}
              </span>{" "}
              technical posts
            </p>
          </div>

          <button
            onClick={() => {
              clearFormData();
              setFormModalOpen(true);
              setEditingEnabled(false);
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all active:scale-95"
          >
            <FiPlus size={20} />
            Add
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <div className="flex items-center gap-2">
            <input
              type="date"
              name="start"
              value={dateFilter.start}
              onChange={handleDateChange}
              className="bg-gray-800 text-white text-xs p-2 rounded-lg border border-gray-700 outline-none focus:border-blue-500"
            />
            <span className="text-gray-500 text-xs">to</span>
            <input
              type="date"
              name="end"
              value={dateFilter.end}
              onChange={handleDateChange}
              className="bg-gray-800 text-white text-xs p-2 rounded-lg border border-gray-700 outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => fetchanalyze({ page: 1, clear: false, iffilterclicked: true })}
            className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Filter
          </button>

          {(dateFilter.start || dateFilter.end) && (
            <button
              onClick={() => {
                setDateFilter({ start: "", end: "" });
                setTimeout(() => fetchanalyze({ page: 1, clear: true, iffilterclicked: false }), 1000);
              }}
              className="px-3 py-2 bg-gray-600 text-white text-xs font-bold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-800/50 border-b border-gray-800 text-gray-400 text-[11px] uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-5">Pair & Type</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Timeline</th>
                  <th className="px-6 py-5">Preview</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  analyzes.map((analyze, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white">
                            {analyze.pair}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase ${
                              analyze.type === "spot"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {analyze.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                            analyze.status === "Active"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {analyze.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] text-gray-500">
                          {dayjs(analyze.created_date.toString()).format(
                            "MMM DD, YYYY"
                          )}
                          {analyze.edited && (
                            <div className="flex items-center gap-2 text-blue-400/80">
                              <span className="text-blue-400/80">
                                {`Edited : ${dayjs(
                                  analyze.edited_date.toString()
                                ).fromNow()}`}
                              </span>
                            </div>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-12 h-10 relative rounded-lg overflow-hidden border border-gray-700">
                          <Image
                            src={analyze.analyze_image || "/placeholder.png"}
                            alt="Chart"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              DescriptionSet({
                                Description: analyze.analyze_description,
                              })
                            }
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"
                          >
                            <FaInfoCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleEditDataInsert(analyze)}
                            className="p-2 text-gray-400 hover:text-white rounded-lg"
                          >
                            <AiFillEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteDataInsert(analyze)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                          >
                            <AiFillDelete size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-gray-800">
            {loading ? (
              <div className="p-10 text-center text-gray-500">Loading...</div>
            ) : (
              analyzes.map((analyze, index) => (
                <div key={index} className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-16 h-12 relative rounded-lg overflow-hidden border border-gray-700 shrink-0">
                        <Image
                          src={analyze.analyze_image || "/placeholder.png"}
                          alt="Chart"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-white">
                          {analyze.pair}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            analyze.type === "spot"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {analyze.type} •{" "}
                          {dayjs(analyze.created_date.toString()).format(
                            "DD MMM"
                          )}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        analyze.status === "Active"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {analyze.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-gray-800/30 p-2 rounded-xl">
                    <button
                      onClick={() =>
                        DescriptionSet({
                          Description: analyze.analyze_description,
                        })
                      }
                      className="flex items-center gap-2 text-xs text-blue-400 px-2"
                    >
                      <FaInfoCircle /> Details
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditDataInsert(analyze)}
                        className="p-2 text-gray-400"
                      >
                        <AiFillEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteDataInsert(analyze)}
                        className="p-2 text-red-400"
                      >
                        <AiFillDelete size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 md:px-6 md:py-4 bg-gray-900 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xs text-gray-500 order-2 md:order-1">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex w-full md:w-auto gap-2 order-1 md:order-2">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => fetchanalyze({ page: currentPage - 1, clear: false, iffilterclicked: false })}
                className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-gray-400 border border-gray-700 rounded-xl disabled:opacity-30"
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages || loading}
                onClick={() => fetchanalyze({ page: currentPage + 1, clear: false, iffilterclicked: false })}
                className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-gray-400 border border-gray-700 rounded-xl disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <AnalyzePopUP
          isOpen={isOpenDescription}
          onClose={toggleDescription}
          title="Description"
        >
          {analyzeDescription}
        </AnalyzePopUP>

        <AnalyzeAddFormModal
          imageFile={imageFile}
          setImageFile={setImageFile}
          description={analyzeDescription}
          setDescription={setAnalyzeDescription}
          handleEditAnalyze={handleEditAnalyze}
          handleDeleteAnalyze={handleDelete}
          isOpen={isFormModalOpen}
          setOpen={setFormModalOpen}
          editingEnabled={editingEnabled}
          loading={addLoading}
          type={type}
          pair={pair}
          setType={setType}
          setPair={setPair}
          handleCancel={handleCancel}
          handleAddAnalyze={handleAddAnalyze}
        />

        <AnalyzeDelete
          loading={deleteLoading}
          isOpen={isDeleteModalOpen}
          setOpen={setDeleteModalOpen}
          setLoading={setDeleteLoading}
          handleDeleteAnalyze={handleDelete}
        />

        <AnalyzeEditModal
          status={editAnalyzeStatus}
          setstatus={setEditAnalyzeStatus}
          handleClearEditFormData={clearEditFormData}
          description={editAnalyzeDesciption}
          setDescription={setEditAnalyzeDescription}
          existingImageUrl={editExistingImageUrl}
          imageFile={editAnalyzeImageFile}
          setImageFile={setEditAnalyzeImageFile}
          isOpen={isEditModalOpen}
          setOpen={setEditModalOpen}
          loading={editLoading}
          type={editAnalyzeType}
          pair={editAnalyzePair}
          setType={setEditAnalyzeType}
          setPair={setEditAnalyzePair}
          handleEditAnalyze={handleEditAnalyze}
        />
      </div>
    </>
  );
}
