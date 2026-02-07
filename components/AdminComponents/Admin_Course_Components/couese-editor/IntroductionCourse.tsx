"use client";

import { MainCollection } from "@/types/collection_models";
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  Video,
  FileText,
  Calendar,
  Hash,
} from "lucide-react"; // standardizing on your lucide-react choice

interface IntroductionCourseProps {
  data: MainCollection[];
  onEdit: (collection: MainCollection) => void;
  onDelete: (collectionId: string, title: string) => void;
}

const IntroductionCourse = ({
  data,
  onEdit,
  onDelete,
}: IntroductionCourseProps) => {
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

  const toggleCollection = (id: string) => {
    setActiveCollectionId(activeCollectionId === id ? null : id);
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300">
      {/* Header Area */}
      <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-3 text-gray-900 dark:text-white">
          <span className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">📚</span>
          Main Introduction Courses
        </h2>
      </div>

      <div className="p-3 sm:p-6 space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-12 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              No Introduction Courses Found.
            </p>
          </div>
        ) : (
          data.map((collection) => {
            const isOpen = activeCollectionId === collection.collection_id;

            return (
              <div
                key={collection.collection_id}
                className={`group rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? "bg-blue-50/30 dark:bg-blue-900/10 border-blue-400 dark:border-blue-500/50 shadow-lg shadow-blue-500/5"
                    : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
                }`}
              >
                {/* Expandable Header */}
                <div
                  className="p-4 sm:p-5 cursor-pointer"
                  onClick={() => toggleCollection(collection.collection_id)}
                >
                  <div className="flex flex-col md:flex-row gap-4 lg:items-center">
                    
                    {/* Thumbnail & Identity */}
                    <div className="flex items-start gap-4 flex-grow min-w-0">
                      {collection.thumbnail_image && (
                        <div className="relative shrink-0">
                          <img
                            src={collection.thumbnail_image}
                            alt={collection.title || "Course"}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-sm ring-2 ring-gray-100 dark:ring-gray-700"
                          />
                          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-lg uppercase">
                            {collection.collection_type}
                          </div>
                        </div>
                      )}

                      <div className="min-w-0 flex-grow">
                        <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {collection.title || "Untitled Course"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 max-w-2xl">
                          {collection.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1.5">
                        <button
                          className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-all active:scale-95 shadow-sm"
                          title="Edit Course"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(collection);
                          }}
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 transition-all active:scale-95 shadow-sm"
                          title="Delete Course"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(collection.collection_id, collection.title || "this course");
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className={`p-2 rounded-xl transition-all duration-300 ${isOpen ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Panel */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-5 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 space-y-6">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <Hash className="text-gray-400" size={18} />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Reference ID</p>
                          <p className="text-xs font-mono text-gray-700 dark:text-gray-300 truncate mt-1">{collection.collection_id}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <Calendar className="text-gray-400" size={18} />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Created On</p>
                          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                             {new Date(collection.created_date.toString()).toLocaleDateString('en-US', { dateStyle: 'long' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Resources Footer */}
                    <div className="flex flex-wrap gap-4">
                      {collection.video_link && (
                        <a
                          href={collection.video_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                        >
                          <Video size={16} />
                          Watch Video
                        </a>
                      )}

                      {collection.pdf_link && (
                        <a
                          href={collection.pdf_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-bold hover:bg-green-600 hover:text-white transition-all active:scale-95"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FileText size={16} />
                          View PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default IntroductionCourse;