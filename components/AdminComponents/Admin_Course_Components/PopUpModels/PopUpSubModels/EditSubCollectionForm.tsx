"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Film,
  FileText,
  Type,
  X,
  Pencil,
  Loader2,
  Coins,
  DollarSign,
} from "lucide-react";
import { SubCollection } from "@/types/collection_models";
import axios from "axios";

const COLLECTION_TYPES = [{ value: "Sub", label: "Sub Course" }];
const CURRENCY_OPTIONS = [
  { value: "LKR", label: "LKR" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

interface EditSubFormProps {
  initialData: SubCollection;
  onEditSubmitSuccess?: () => void;
  onClose?: () => void;
}

const EditSubCollectionForm = ({
  initialData,
  onEditSubmitSuccess,
  onClose,
}: EditSubFormProps) => {
  const [formData, setFormData] = useState<SubCollection>({ ...initialData });
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    typeof initialData.thumbnail_image === "string"
      ? initialData.thumbnail_image
      : ""
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail_image: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const nativeFormData = new FormData();
    nativeFormData.append("collection_id", formData.collection_id);
    nativeFormData.append("collection_type", formData.collection_type);
    nativeFormData.append("currency", formData.currency || "USD");
    nativeFormData.append("description", formData.description);
    nativeFormData.append("intro_video_link", formData.intro_video_link || "");
    nativeFormData.append("main_pdf_link", formData.main_pdf_link || "");
    nativeFormData.append("price", formData.price?.toString() || "0");
    nativeFormData.append("title", formData.title);

    console.log("Form Data to be submitted:", formData);

    if (formData.thumbnail_image instanceof File) {
      nativeFormData.append("thumbnail_image", formData.thumbnail_image);
    }

    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/ServicesSubCollections/EditeSubCollection`,
        nativeFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        onEditSubmitSuccess?.();
        onClose?.();
      }
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full px-3 py-1.5  text-sm text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition";
  const labelClasses =
    "text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <h2 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Pencil className="w-4 h-4 text-blue-500" /> Edit Sub Collection
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 space-y-3 max-h-[75vh] overflow-y-auto"
      >
        {/* Title */}
        <div className="space-y-1">
          <label className={labelClasses}>
            <BookOpen className="w-3 h-3" /> Title
          </label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className={labelClasses}>
            <FileText className="w-3 h-3" /> Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            className={`${inputClasses} resize-none`}
          />
        </div>

        {/* Price & Currency Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className={labelClasses}>
              <DollarSign className="w-3 h-3" /> Price
            </label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>
              <Coins className="w-3 h-3" /> Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className={`${inputClasses} cursor-pointer`}
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className={labelClasses}>
              <Film className="w-3 h-3" /> Video Link
            </label>
            <input
              name="intro_video_link"
              type="url"
              value={formData.intro_video_link}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClasses}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>
              <FileText className="w-3 h-3" /> PDF Link
            </label>
            <input
              name="main_pdf_link"
              type="url"
              value={formData.main_pdf_link}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClasses}
            />
          </div>
        </div>

        {/* Type (Disabled) */}
        <div className="space-y-1">
          <label className={labelClasses}>
            <Type className="w-3 h-3" /> Type
          </label>
          <select
            disabled
            className={`${inputClasses} bg-gray-100 cursor-not-allowed appearance-none`}
          >
            <option>Sub Course</option>
          </select>
        </div>

        {/* Thumbnail Section */}
        <div className="space-y-2 p-2 border border-dashed border-gray-300 rounded-lg bg-gray-50/30">
          <label className={labelClasses}>
            <Film className="w-3 h-3" /> Thumbnail
          </label>
          <div className="flex items-center gap-3">
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                className="w-10 h-10 rounded object-cover border border-gray-200"
                alt="Preview"
              />
            )}
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="text-[10px] text-black"
            />
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/80 border-t flex gap-2">
        <button
          onClick={onClose}
          type="button"
          className="flex-1 cursor-pointer py-2 text-xs font-bold text-gray-600 bg-gray-200 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 cursor-pointer py-2 text-xs font-bold text-white bg-blue-600 rounded-lg shadow-md flex items-center justify-center gap-2 transition"
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Pencil className="w-3 h-3" />
          )}
          {isLoading ? "Saving..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default EditSubCollectionForm;
