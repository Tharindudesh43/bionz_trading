"use client";

import { SubCollection, subContentType } from "@/types/collection_models";
import React, { useState } from "react";
import SubCollectionManager from "./SubCollectionManager";
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Plus,
  Tag,
  Pencil,
  Trash2,
  FileText,
  Video,
} from "lucide-react";

const CollectionManager = ({
  collection,
  onEdit,
  onDelete,
  onAddNewLesson,
  onEditLessonSuccess,
  onDeleteLessonSuccess,
}: {
  collection: SubCollection;
  onEdit?: (collection: SubCollection) => void;
  onDelete?: (id: string) => void;
  onAddNewLesson?: (id: string) => void;
  onEditLessonSuccess?: () => void;
  onDeleteLessonSuccess?: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleCollection = () => {
    setIsExpanded(!isExpanded);
  };

  const Icon = isExpanded ? ChevronUp : ChevronDown;

  const hasPricing =
    collection.price !== undefined &&
    collection.price !== null &&
    collection.currency;

  const formatPrice = (price: number, currency: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(price);
    } catch (e) {
      return `${price} ${currency.toUpperCase()}`;
    }
  };

  return (
    <div className="bg-gray-800 dark:bg-white p-3 sm:p-5 shadow-xl rounded-2xl border border-gray-700 dark:border-gray-200 h-full flex flex-col transition-all duration-300 hover:shadow-blue-500/20 group">
      
      {/* Header: Responsive layout for title and actions */}
      <div
        className="flex justify-between items-start sm:items-center cursor-pointer border-b border-gray-700 dark:border-gray-200 pb-3 sm:pb-4"
        onClick={toggleCollection}
      >
        <div className="flex items-start sm:items-center space-x-3 flex-grow min-w-0">
          <div className="p-2 bg-blue-500/10 dark:bg-blue-50 rounded-lg shrink-0">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 dark:text-blue-600" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center min-w-0 gap-1 sm:gap-4">
            <h3 className="text-lg sm:text-xl font-bold text-white dark:text-gray-800 truncate leading-tight">
              {collection.title}
            </h3>

            {/* Quick Actions: Larger tap targets for mobile */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                className="p-2 sm:p-1.5 rounded-full text-yellow-500 hover:bg-yellow-900/40 dark:hover:bg-yellow-100 transition-colors active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit && onEdit(collection);
                }}
              >
                <Pencil className="w-4 h-4" />
              </button>

              <button
                className="p-2 sm:p-1.5 rounded-full text-red-500 hover:bg-red-900/40 dark:hover:bg-red-100 transition-colors active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(collection.collection_id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <Icon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ml-2 mt-1 sm:mt-0 ${isExpanded ? 'rotate-0' : ''}`} />
      </div>

      {/* Description and Info */}
      <div className="mt-4 text-sm space-y-4 flex-grow">
        <p className="text-gray-400 dark:text-gray-600 line-clamp-2 leading-relaxed">
          {collection.description}
        </p>

        {/* Lesson Badge & Price */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center text-blue-400 dark:text-blue-600 font-bold bg-blue-500/10 dark:bg-blue-50 px-2.5 py-1 rounded-full text-xs">
            <Tag className="w-3.5 h-3.5 mr-1.5" />
            {collection.sub_contents.length} {collection.sub_contents.length === 1 ? "Lesson" : "Lessons"}
          </div>
          
          {hasPricing && (
            <div className="text-green-400 dark:text-green-600 font-bold text-sm">
              <span className="text-[10px] text-gray-500 mr-1 uppercase tracking-wider">Price:</span>
              {formatPrice(collection.price!, collection.currency!)}
            </div>
          )}
        </div>

        {/* Links: Column on mobile, row on desktop */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 pt-1">
          {collection.intro_video_link && (
            <a
              href={collection.intro_video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-medium text-blue-400 dark:text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Video size={14} className="shrink-0" />
              <span className="truncate">Intro Video</span>
            </a>
          )}

          {collection.main_pdf_link && (
            <a
              href={collection.main_pdf_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-medium text-green-400 dark:text-green-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <FileText size={14} className="shrink-0" />
              <span className="truncate">Course PDF</span>
            </a>
          )}
        </div>
      </div>

      {/* Expandable Content Area: SCROLLABLE FIX */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[500px] opacity-100 mt-5" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-900/50 dark:bg-gray-50 rounded-xl border border-gray-700/50 dark:border-gray-200 flex flex-col h-full max-h-[450px]">
          
          {/* Sticky Header inside expansion */}
          <div className="p-3 border-b border-gray-700/50 dark:border-gray-200 sticky top-0 bg-gray-900 dark:bg-gray-50 rounded-t-xl z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddNewLesson && onAddNewLesson(collection.collection_id);
              }}
              className="flex items-center justify-center w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition active:scale-[0.98] shadow-lg shadow-blue-900/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Lesson
            </button>
          </div>

          {/* Scrollable Lesson List */}
          <div className="overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {collection.sub_contents.length > 0 ? (
              collection.sub_contents.map((sub: subContentType) => (
                <SubCollectionManager
                  onEditLessonSuccess={onEditLessonSuccess}
                  onDeleteLessonSuccess={onDeleteLessonSuccess}
                  parent_collection_id={collection.collection_id}
                  key={sub.content_id}
                  sub={sub}
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-widest italic">No lessons yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionManager;