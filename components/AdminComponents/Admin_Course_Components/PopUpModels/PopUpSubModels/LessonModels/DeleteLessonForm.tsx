"use client";

import React, { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import axios from "axios";

interface DeleteLessonConfirmationProps {
  ParentCollectionID: String;
  ContentID: String;
  onDeleteSuccess?: () => void;
  onClose?: () => void;
}

const DeleteLessonConfirmation = ({
  ParentCollectionID,
  ContentID,
  onDeleteSuccess,
  onClose,
}: DeleteLessonConfirmationProps) => {
  const parent_collection_id = ParentCollectionID;
  const content_id = ContentID;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!parent_collection_id) {
      setError("Error: Sub Collection ID is missing.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.delete(
        `/api/admin/ServicesSubCollections/DeleteLesson`,
        {
          data: {
            parent_collection_id: parent_collection_id,
            content_id: content_id,
          },
        }
      );
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to delete lesson.");
      }
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Deletion Error:", err);
      setError(
        `Failed to delete the lesson: ${
          err instanceof Error ? err.message : "Unknown error."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-red-300 dark:border-red-700 relative">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label="Close"
          disabled={isLoading}
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <h2 className="text-2xl font-bold mb-6 text-red-600 dark:text-red-400 flex items-center">
        <Trash2 className="w-6 h-6 mr-3" />
        Confirm Lesson Deletion
      </h2>

      <div className="space-y-4 mb-6">
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 rounded-md flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold mb-1">
              DANGER: Irreversible Action
            </h3>
            <p className="text-sm">
              Deleting this Main Collection is permanent. This action will also
              automatically and permanently delete all associated
              Sub-Collections and Parts (lessons, videos, PDFs) linked to it.
            </p>
            <p className="text-sm mt-1 font-bold">
              Please ensure you have backed up any necessary data before
              proceeding.
            </p>
          </div>
        </div>

        {error && (
          <p className="text-sm text-white p-3 bg-red-500 rounded-md">
            {error}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="w-full cursor-pointer flex items-center justify-center px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200 disabled:bg-red-400 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
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
            <Trash2 className="w-5 h-5 mr-2" />
          )}
          {isLoading ? "Deleting Lesson..." : "Yes, Delete Permanently"}
        </button>

        <button
          disabled={isLoading}
          type="button"
          onClick={onClose}
          className="w-full flex cursor-pointer items-center justify-center px-4 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-200 shadow-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteLessonConfirmation;
