"use client";

import React, { useState } from "react";
import {
  Plus,
  BookOpen,
  Film,
  FileText,
  X,
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import axios from "axios";

interface AddSubContentFormProps {
  collectionId: string;
  onSubmitSuccess?: () => void;
  onClose?: () => void;
}

const AddNewLessonForm = ({
  collectionId,
  onSubmitSuccess,
  onClose,
}: AddSubContentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    parent_collection_id: collectionId,
    title: "",
    description: "",
    video_link: "",
    pdf_link: "",
    thumbnail_image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/ServicesSubCollections/AddLesson`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        onSubmitSuccess?.();
        onClose?.();
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to add content.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    "w-full p-2 border border-gray-300 rounded-lg bg-white text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none transition";
  const labelBase =
    "text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-1";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md w-full mx-auto relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50">
        <h2 className="text-sm font-bold text-blue-600 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Lesson Content
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full transition"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {" "}
          Parent Collection ID
        </label>
        <input
          type="text"
          value={collectionId}
          disabled
          className={`${inputBase} bg-gray-100 cursor-not-allowed border-0`}
        />

        <div>
          <label className={labelBase}>
            <BookOpen className="w-3 h-3" /> Content Title
          </label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className={inputBase}
            placeholder="e.g. 01. Introduction to Technical Analysis"
          />
        </div>

        <div>
          <label className={labelBase}>
            <FileText className="w-3 h-3" /> Short Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={2}
            className={`${inputBase} resize-none`}
            placeholder="What will students learn in this video?"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelBase}>
              <Film className="w-3 h-3" /> Video URL
            </label>
            <input
              name="video_link"
              type="url"
              value={formData.video_link}
              onChange={handleChange}
              required
              className={inputBase}
              placeholder="Vimeo/YouTube"
            />
          </div>
          <div>
            <label className={labelBase}>
              <LinkIcon className="w-3 h-3" /> PDF (Optional)
            </label>
            <input
              name="pdf_link"
              type="url"
              value={formData.pdf_link}
              onChange={handleChange}
              className={inputBase}
              placeholder="Drive/S3 Link"
            />
          </div>
        </div>

        <div className="p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
          <label className={labelBase}>
            <ImageIcon className="w-3 h-3" /> Lesson Thumbnail
          </label>
          <div className="flex items-center gap-4">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                className="w-16 h-10 rounded object-cover border"
                alt="preview"
              />
            ) : (
              <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="text-[10px] text-black file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 cursor-pointer px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow-md flex items-center justify-center gap-2 transition"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
            {isLoading ? "Uploading..." : "Add Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewLessonForm;
