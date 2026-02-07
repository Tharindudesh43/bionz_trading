"use client";

import React, { useState } from "react";
import { GripVertical, Eye, Trash2, Edit, Video, FileText } from "lucide-react";
import { subContentType } from "@/types/collection_models";
import { AiOutlineFundView } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import EditLessonForm from "../PopUpModels/PopUpSubModels/LessonModels/EditLessonForm";
import DeleteLessonConfirmation from "../PopUpModels/PopUpSubModels/LessonModels/DeleteLessonForm";

const SubCollectionManager = ({
  sub,
  parent_collection_id,
  onEditLessonSuccess,
  onDeleteLessonSuccess,
}: {
  sub: subContentType;
  parent_collection_id: string;
  onEditLessonSuccess?: () => void;
  onDeleteLessonSuccess?: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [conenetID, setConenetID] = useState<string>("");

  // Helper to format the Firebase Timestamp date
  const formatDate = (date: any) => {
    // Check if the object has a toDate method (as Firebase Timestamps do)
    if (date && typeof date.toDate === "function") {
      return date.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    // Fallback if the date is not a valid Timestamp object or is just a string
    return date
      ? new Date(date.toString()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";
  };

  return (
    <>
      {/* Sub Collection Row (Lesson Item) */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm text-gray-800 dark:text-white transition duration-200 hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-600">
        {/* Lesson Title and Drag Handle (Left Side) */}
        <div className="flex items-center space-x-3 flex-grow min-w-0">
          {/* Drag Handle */}
          <GripVertical className="w-5 h-5 text-gray-400 cursor-grab hover:text-gray-500 transition flex-shrink-0" />

          {/* Lesson Title - Clickable Area */}
          <div
            className="font-medium text-base truncate cursor-pointer"
            onClick={() => setIsModalOpen(true)}
            // Tooltip title shows the full title
            title={sub.title}
          >
            {sub.title}
          </div>
        </div>

        {/* Actions (Right Side) */}
        <div className="flex items-center space-x-2 text-sm flex-shrink-0">
          {/* View/Open Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 cursor-pointer   rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-150 shadow-md"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsEditing(true);
            }}
            className="p-2 rounded-full cursor-pointer bg-yellow-500 text-white hover:bg-yellow-600 transition duration-150 shadow-md"
            title="Edit Lesson"
          >
            <Edit className="w-4 h-4" />
          </button>

          {/* Delete Button (Placeholder action) */}
          <button
            // Add placeholder onClick for deleting
            onClick={() => {
              setIsDeleting(true);
              setConenetID(sub.content_id);
            }}
            className="p-2 rounded-full cursor-pointer bg-red-600 text-white hover:bg-red-700 transition duration-150 shadow-md"
            title="Delete Lesson"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal - View/Edit Details */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Modal Container - Reduced to max-w-lg */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-800">
            {/* Header: Compact & Clean */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white truncate pr-4">
                {sub.title}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-5">
              {/* Thumbnail: Uses Aspect Ratio to save space */}
              {sub.thumbnail_image && (
                <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <img
                    src={sub.thumbnail_image}
                    alt={sub.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Stats Row: Content ID & Date */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    Content ID
                  </span>
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-300 truncate block">
                    {sub.content_id.slice(0, 8)}...
                  </span>
                </div>
                <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    Created
                  </span>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {formatDate(sub.created_date)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-5 px-1">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">
                  Description
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {sub.description || "No description provided."}
                </p>
              </div>

              {(sub.video_link || sub.pdf_link) && (
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-tight px-1">
                    Resources
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sub.video_link && (
                      <a
                        href={sub.video_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px]"
                      >
                        <Button className="w-full cursor-pointer justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs h-9 rounded-lg">
                          <Video size={14} /> View Video
                        </Button>
                      </a>
                    )}
                    {sub.pdf_link && (
                      <a
                        href={sub.pdf_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px]"
                      >
                        <Button className="w-full cursor-pointer justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-xs h-9 rounded-lg">
                          <FileText size={14} /> View PDF
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                className="px-5 rounded-full bg-emerald-100 cursor-pointer py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto 
                                   animate-in fade-in zoom-in-95 duration-300"
          >
            <EditLessonForm
              initialData={sub}
              onEditSubmitSuccess={() => {
                onEditLessonSuccess && onEditLessonSuccess();
              }}
              onClose={() => setIsEditing(false)}
              parent_collection_id={parent_collection_id}
            />
          </div>
        </div>
      )}

      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto 
                                   animate-in fade-in zoom-in-95 duration-300"
          >
            <DeleteLessonConfirmation
            onClose={()=>{
              setIsDeleting(false)
            }}
            onDeleteSuccess={()=>{
              onDeleteLessonSuccess && onDeleteLessonSuccess()
            }}
            ParentCollectionID={parent_collection_id} 
            ContentID={conenetID}/>
          </div>
        </div>
      )}
    </>
  );
};

export default SubCollectionManager;
