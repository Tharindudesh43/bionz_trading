"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Film, FileText, Type, X, Pencil } from "lucide-react";
import { MainCollection } from "@/types/collection_models";
import axios from "axios";

// Assuming types from your context
interface FormData {
  title: string;
  description: string;
  collection_type: string;
  thumbnail_image: File | string;
  video_link: string;
  pdf_link: string;
  collection_id?: string;
  created_date?: String | null;
}

const COLLECTION_TYPES = [{ value: "Main", label: "Main Course" }];

const EditMainCollectionForm = ({
  initialData,
  onEditSubmitSuccess,
  onClose,
}: {
  initialData: MainCollection;
  onEditSubmitSuccess?: () => void;
  onClose?: () => void;
}) => {
  const [formData, setFormData] = useState<MainCollection>({
    title: initialData.title || "",
    description: initialData.description || "",
    collection_type: initialData.collection_type || COLLECTION_TYPES[0].value,
    thumbnail_image: initialData.thumbnail_image || "",
    video_link: initialData.video_link || "",
    pdf_link: initialData.pdf_link || "",
    collection_id: initialData.collection_id,
    created_date: initialData.created_date.toString() || "",
    thumbnail_image_path: initialData.thumbnail_image_path || null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    initialData.thumbnail_image.toString() || ""
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail_image: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        thumbnail_image: initialData.thumbnail_image || "",
      }));
      setThumbnailPreview(initialData.thumbnail_image.toString() || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);
    try {
      setIsLoading(true);
      // NOTE: Ensure your backend handles the mixed FormData structure correctly
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/ServicesMainCollections/EditeMainCollection`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        // Only set success state if the request was truly successful
        onEditSubmitSuccess && onEditSubmitSuccess();
        onClose && onClose();
      } else {
        // Handle API success: false case
        alert("Update failed, but server responded. Check data.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during update.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedFileNameOrUrl =
    formData.thumbnail_image instanceof File
      ? formData.thumbnail_image.name
      : typeof formData.thumbnail_image === "string"
      ? formData.thumbnail_image.substring(
          formData.thumbnail_image.lastIndexOf("/") + 1
        )
      : "No file selected";

  return (
    // Outer container: Reduced padding from p-6 to p-4
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 relative">
      
      {/* Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          // Smaller close button
          className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Title: Reduced text size from text-2xl to text-xl and mb-6 to mb-4 */}
      <h2 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400 flex items-center">
        <Pencil className="w-4 h-4 mr-2" />
        Edit Main Collection
      </h2>

      <form onSubmit={handleSubmit} className="space-y-2"> {/* Reduced space-y-5 to space-y-4 */}
        
        {/* Title Input */}
        <div className="space-y-1">
          {/* Label: Reduced text size from text-sm to text-xs */}
          <label
            htmlFor="title"
            className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            {/* Reduced icon size from w-4 h-4 to w-3 h-3 */}
            <BookOpen className="w-3 h-3 mr-2" /> Course Title
          </label>
          {/* Input: Reduced padding from p-3 to p-2 */}
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="e.g., Introduction to Bionz Trading"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-1">
          <label
            htmlFor="description"
            className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            <FileText className="w-3 h-3 mr-2" /> Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={2} // Reduced rows
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition resize-none"
            placeholder="A brief summary of the course content."
          />
        </div>

        {/* Collection Type Dropdown */}
        <div className="space-y-1">
          <label
            htmlFor="collection_type"
            className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            <Type className="w-3 h-3 mr-2" /> Collection Type
          </label>
          <select
            id="collection_type"
            name="collection_type"
            value={formData.collection_type}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 appearance-none transition"
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
            className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            <Film className="w-3 h-3 mr-2" /> Update Thumbnail Image
          </label>

          {thumbnailPreview && (
            <div className="flex items-center space-x-2 mb-2"> {/* Reduced space-x-3 to space-x-2 */}
              <img
                src={thumbnailPreview}
                alt="Current Thumbnail"
                // Reduced image size from w-20 h-20 to w-16 h-16
                className="w-16 h-16 object-cover rounded-md border border-gray-300 dark:border-gray-600"
              />
              {/* Reduced text size for filename info */}
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Current/New File:
                <span className="font-semibold text-gray-700 dark:text-gray-200 ml-1">
                  {selectedFileNameOrUrl}
                </span>
                <br />
                <span className="text-xs italic">
                  (Upload new file to replace)
                </span>
              </p>
            </div>
          )}

          {/* File Input: Reduced padding from p-3 to p-2 */}
          <input
            id="thumbnail_image"
            name="thumbnail_image"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            required={false}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white file:mr-3 file:py-1 file:px-3
                       file:rounded-full file:border-0 file:text-xs file:font-semibold
                       file:bg-blue-100 dark:file:bg-blue-800 file:text-blue-700 dark:file:text-blue-200 hover:file:bg-blue-200 dark:hover:file:bg-blue-700 transition"
          />
        </div>

        {/* Video Link URL */}
        <div className="space-y-1">
          <label
            htmlFor="video_link"
            className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            <Film className="w-3 h-3 mr-2" /> Introduction Video Link (URL)
          </label>
          <input
            id="video_link"
            name="video_link"
            type="url"
            value={formData.video_link}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        {/* PDF Link URL (Optional) */}
        <div className="space-y-1">
          <label
            htmlFor="pdf_link"
            className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            <FileText className="w-3 h-3 mr-2" /> PDF Document Link (Optional URL)
          </label>
          <input
            id="pdf_link"
            name="pdf_link"
            type="url"
            value={formData.pdf_link}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="https://example.com/course_notes.pdf"
          />
        </div>

        {/* Buttons (Update and Cancel) */}
        <div className="pt-2 space-y-2">
            <button
                type="submit"
                disabled={isLoading}
                // Reduced vertical padding from py-3 to py-2
                className="w-full cursor-pointer flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200 disabled:bg-green-400 disabled:cursor-not-allowed shadow-md text-sm"
            >
                {isLoading ? (
                    <svg
                        className="animate-spin h-4 w-4 mr-2 text-white"
                        viewBox="0 0 24 24"
                    >
                        {/* Spinner size adjusted */}
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    // Reduced icon size from w-5 h-5 to w-4 h-4
                    <Pencil className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Updating Collection..." : "Update Collection"}
            </button>

            <button
                disabled={isLoading}
                type="button"
                onClick={() => {
                    onClose && onClose();
                }}
                // Reduced vertical padding from py-3 to py-2
                className="w-full cursor-pointer flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition duration-200 shadow-md text-sm"
            >
                Cancel
            </button>
        </div>
      </form>
    </div>
  );
};

export default EditMainCollectionForm;