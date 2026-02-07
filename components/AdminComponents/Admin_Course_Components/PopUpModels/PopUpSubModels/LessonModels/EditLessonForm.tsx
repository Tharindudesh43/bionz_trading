"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Film,
  FileText,
  X,
  Pencil,
  Loader2,
  Hash,
  Layers,
} from "lucide-react";
import { subContentType } from "@/types/collection_models";
import axios from "axios";
import { AiFillIdcard } from "react-icons/ai";

interface EditLessonFormProps {
  parent_collection_id: string;
  initialData: subContentType;
  onEditSubmitSuccess?: () => void;
  onClose?: () => void;
}

const EditLessonForm = ({
  parent_collection_id,
  initialData,
  onEditSubmitSuccess,
  onClose,
}: EditLessonFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    video_link: initialData?.video_link || "",
    pdf_link: initialData?.pdf_link || "",
    thumbnail_image: null as File | null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    typeof initialData?.thumbnail_image === "string"
      ? initialData.thumbnail_image
      : ""
  );

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
    if (formData.thumbnail_image instanceof File) {
      formData.thumbnail_image = formData.thumbnail_image;
    }

    try {
      const res = await axios.patch(
        `/api/admin/ServicesSubCollections/EditLesson`,
        {
          formData: formData,
          parent_collection_id: parent_collection_id,
          content_id: initialData?.content_id,
        },
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
    "w-full px-3 py-2 text-sm text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition dark:bg-gray-900 dark:border-gray-700 dark:text-white";
  const labelClasses =
    "text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-1";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md w-full mx-auto flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 shrink-0">
        <h2 className="text-sm font-black text-gray-800 dark:text-white flex items-center gap-2 uppercase tracking-tighter">
          <Pencil className="w-4 h-4 text-blue-600" /> Update Lesson
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="px-5 py-3 flex gap-2 border-b border-gray-50 dark:border-gray-700 shrink-0">
        <div className="flex-1 bg-gray-100 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-2 rounded-lg">
          <span className="flex items-center gap-1 text-[9px] font-bold text-blue-500 uppercase">
            <Layers size={10} /> Parent ID
          </span>
          <code className="text-[10px] font-mono text-blue-700 dark:text-blue-300 block truncate">
            {parent_collection_id}
          </code>
          <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 uppercase">
            <AiFillIdcard size={10} /> Lesson ID
          </span>
          <code className="text-[10px] font-mono text-amber-700 dark:text-amber-300 block truncate">
            {initialData?.content_id}
          </code>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
        style={{ scrollbarWidth: "thin" }}
      >
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 10px;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #334155;
          }
        `}</style>

        <div>
          <label className={labelClasses}>
            <BookOpen size={12} /> Lesson Title
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

        <div>
          <label className={labelClasses}>
            <FileText size={12} /> Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClasses}>
              <Film size={12} /> Video URL
            </label>
            <input
              name="video_link"
              type="url"
              value={formData.video_link}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>
              <FileText size={12} /> PDF Link (Optional)
            </label>
            <input
              name="pdf_link"
              type="url"
              value={formData.pdf_link}
              onChange={handleChange}
              placeholder="Resource link"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50">
          <label className={labelClasses}>
            <Film size={12} /> Cover Thumbnail
          </label>
          <div className="flex items-center gap-4">
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                className="w-16 h-10 rounded object-cover border shadow-sm"
                alt="Preview"
              />
            )}
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="text-[10px] file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
          </div>
        </div>
        <div className="h-2"></div>
      </form>

      <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t flex gap-3 shrink-0">
        <button
          onClick={onClose}
          type="button"
          className="cursor-pointer flex-1 py-2 text-xs font-bold bg-gray-200 dark:bg-gray-700 rounded-xl text-gray-500 hover:text-gray-700  active:scale-95 transition"
        >
          Discard
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-[1] py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="cursor-pointer w-3 h-3 animate-spin" />
          ) : (
            <Pencil className="w-3 h-3" />
          )}
          {isLoading ? "Saving..." : "Update Lesson"}
        </button>
      </div>
    </div>
  );
};

export default EditLessonForm;
