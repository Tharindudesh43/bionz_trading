"use client";

import React, { useState } from "react";
import {
  Plus,
  BookOpen,
  Film,
  FileText,
  Type,
  X,
  Loader2,
  DollarSign,
  Coins,
} from "lucide-react";
import axios from "axios";
import { collection } from "firebase/firestore";

const COLLECTION_TYPES = [{ value: "Sub", label: "Sub Course" }];
// Added Currency Options
const CURRENCY_OPTIONS = [
  { value: "LKR", label: "LKR" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

const AddSubCollectionForm = ({
  onSubmitSuccess,
  onClose,
}: {
  onSubmitSuccess?: () => void;
  onClose?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    collection_type: "Sub",
    thumbnail_image: null as File | null,
    video_link: "",
    main_pdf_link: "",
    price: 0,
    currency: "USD",
  });

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

    try {
      const res = await axios.post(
        `/api/admin/ServicesSubCollections/AddSubCollection`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        onSubmitSuccess?.();
        onClose?.();
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred while adding the collection.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none transition";
  const labelBase =
    "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-1";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md w-full mx-auto relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Sub Collection
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 space-y-3 max-h-[80vh] overflow-y-auto"
      >
        {/* Course Title */}
        <div>
          <label className={labelBase}>
            <BookOpen className="w-3 h-3" /> Course Title
          </label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className={inputBase}
            placeholder="e.g. Advanced Crypto Trading"
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelBase}>
            <FileText className="w-3 h-3" /> Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={2}
            className={`${inputBase} resize-none`}
            placeholder="Briefly describe this module..."
          />
        </div>

        {/* Pricing & Currency Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelBase}>
              <DollarSign className="w-3 h-3" /> Price
            </label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className={inputBase}
            />
          </div>

          <div>
            <label className={labelBase}>
              <Coins className="w-3 h-3" /> Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className={inputBase}
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Collection Type - Full Width */}
        <div>
          <label className={labelBase}>
            <Type className="w-3 h-3" /> Collection Type
          </label>
          <select
            name="collection_type"
            value={formData.collection_type}
            onChange={handleChange}
            disabled={true}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 text-sm text-black focus:ring-0 outline-none transition cursor-not-allowed appearance-none"
          >
            {COLLECTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Thumbnail Upload with Preview */}
        <div className="p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50/50">
          <label className={labelBase}>
            <Film className="w-3 h-3" /> Thumbnail Image
          </label>
          <div className="flex items-center gap-3">
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                className="w-12 h-12 rounded object-cover border border-gray-200"
                alt="Preview"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="text-[10px] text-black file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
            />
          </div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <div>
            <label className={labelBase}>
              <Film className="w-3 h-3" /> Intro Video Link
            </label>
            <input
              name="video_link"
              type="url"
              value={formData.video_link}
              onChange={handleChange}
              className={inputBase}
              placeholder="YouTube/Vimeo URL"
            />
          </div>
          <div>
            <label className={labelBase}>
              <FileText className="w-3 h-3" /> PDF Link
            </label>
            <input
              name="main_pdf_link"
              type="url"
              value={formData.main_pdf_link}
              onChange={handleChange}
              className={inputBase}
              placeholder="Resource PDF URL"
            />
          </div>
        </div>
      </form>

      {/* Footer Actions */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 text-xs bg-gray-200 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-md flex items-center justify-center gap-2 transition"
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
          {isLoading ? "Saving..." : "Add Collection"}
        </button>
      </div>
    </div>
  );
};

export default AddSubCollectionForm;
