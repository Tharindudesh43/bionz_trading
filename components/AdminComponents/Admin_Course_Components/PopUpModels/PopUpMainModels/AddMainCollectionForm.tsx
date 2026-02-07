"use client";

import React, { useState } from "react";
import { Plus, BookOpen, Film, FileText, Type, X } from "lucide-react"; // Added X for close icon
import { MainCollection } from "@/types/collection_models";
import axios from "axios";
// import { MainCollection } from "@/types/collection_models"; // Assuming this import works

interface FormData {
  title: string;
  description: string;
  collection_type: string;
  thumbnail_image: File | string;
  video_link: string;
  pdf_link: string;
  collection_id?: string;
  created_date?: Date;
}

// Define possible collection types for the dropdown
const COLLECTION_TYPES = [{ value: "Main", label: "Main Course" }];

const AddMainCollectionForm = ({
  onSubmitSuccess,
  onClose,
}: {
  onSubmitSuccess?: () => void;
  onClose?: () => void;
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    collection_type: COLLECTION_TYPES[0].value,
    thumbnail_image: "",
    video_link: "",
    pdf_link: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Handler for all non-file inputs (text, textarea, select)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for the file input (thumbnail_image)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail_image: file }));
    } else {
      setFormData((prev) => ({ ...prev, thumbnail_image: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `/api/admin/ServicesMainCollections/AddMainCollection`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setIsLoading(false);
        onClose && onClose();
        onSubmitSuccess && onSubmitSuccess();
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err); 
    } finally {
      setIsLoading(false);
    }
  };

  const selectedFileName =
    formData.thumbnail_image instanceof File
      ? formData.thumbnail_image.name
      : "";

  return (
    // REDUCED: p-6 -> p-4
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 relative">
      {/* Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* REDUCED: text-2xl -> text-xl, mb-6 -> mb-4 */}
      <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400 flex items-center">
        <Plus className="w-5 h-5 mr-2" />
        Add New Main Collection
      </h2>

      {/* REDUCED: space-y-5 -> space-y-3 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Title */}
        <div className="space-y-1">
          <label
            htmlFor="title"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            <BookOpen className="w-4 h-4 mr-2" /> Course Title
          </label>
          {/* REDUCED: p-3 -> p-2 */}
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="e.g., Introduction to Bionz Trading"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" /> Description
          </label>
          {/* REDUCED: p-3 -> p-2 */}
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={2} // Reduced rows
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition resize-none"
            placeholder="A brief summary of the course content."
          />
        </div>

        {/* Collection Type (Dropdown) */}
        <div className="space-y-1">
          <label
            htmlFor="collection_type"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            <Type className="w-4 h-4 mr-2" /> Collection Type
          </label>
          {/* REDUCED: p-3 -> p-2 */}
          <select
            id="collection_type"
            name="collection_type"
            value={formData.collection_type}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 appearance-none transition"
          >
            {COLLECTION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Thumbnail Image File Input */}
        <div className="space-y-1">
          <label
            htmlFor="thumbnail_image"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            <Film className="w-4 h-4 mr-2" /> Select Thumbnail Image
          </label>
          {/* REDUCED: p-3 -> p-2, smaller file button */}
          <input
            id="thumbnail_image"
            name="thumbnail_image"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-xs text-gray-900 dark:text-white 
                       file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-100 dark:file:bg-blue-800 file:text-blue-700 dark:file:text-blue-200 hover:file:bg-blue-200 dark:hover:file:bg-blue-700 transition"
          />
          {selectedFileName && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Selected:{" "}
              <span className="font-semibold">{selectedFileName}</span>
            </p>
          )}
        </div>

        {/* Video Link URL */}
        <div className="space-y-1">
          <label
            htmlFor="video_link"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            <Film className="w-4 h-4 mr-2" /> Intro Video Link (URL)
          </label>
          {/* REDUCED: p-3 -> p-2 */}
          <input
            id="video_link"
            name="video_link"
            type="url"
            value={formData.video_link}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        {/* PDF Link URL (Optional) */}
        <div className="space-y-1">
          <label
            htmlFor="pdf_link"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" /> PDF Link (Optional)
          </label>
          {/* REDUCED: p-3 -> p-2 */}
          <input
            id="pdf_link"
            name="pdf_link"
            type="url"
            value={formData.pdf_link}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="https://example.com/course_notes.pdf"
          />
        </div>

        {/* Submit Button */}
        {/* REDUCED: py-3 -> py-2 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-lg mt-4"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4 mr-3 text-white" // Reduced spinner size
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <Plus className="w-4 h-4 mr-2" /> // Reduced icon size
          )}
          {isLoading ? "Adding Collection..." : "Add Collection"}
        </button>

        {/* Close Button - Integrated into button layout */}
        {/* REDUCED: py-3 -> py-2, Added margin-top to separate from submit */}
        {onClose && (
          <button
            type="button" // Important: change to type="button" to prevent form submission
            onClick={onClose}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-200 shadow-lg"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default AddMainCollectionForm;
