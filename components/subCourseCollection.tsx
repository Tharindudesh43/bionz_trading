"use client";

import React, { useState } from "react";
import {
  PlayCircle,
  Download,
  Lock,
  ChevronDown,
  ShoppingCart,
} from "lucide-react";
import { SubCollection } from "@/types/collection_models";
import { useSelector } from "react-redux";

interface CoursePageProps {
  courseData: SubCollection;
  isPurchased: boolean;
  isLoggedIn: boolean;
}

export default function CourseDetail({
  courseData,
  isPurchased,
  isLoggedIn,
}: CoursePageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const canAccessSubContent = isLoggedIn && isPurchased;
  const { currentUser, loading } = useSelector((state: any | null) => state.user);

  return (
    <div className="bg-white text-black font-sans relative">
      
      {/* --- PRICE & BUY NOW SECTION (Responsive Positioning) --- */}
      {!canAccessSubContent && (
        <div className="md:absolute top-8 right-8 flex flex-col items-center gap-1 z-10 pt-6 md:pt-0">
          <span className="text-gray-700 font-bold text-lg">
            {courseData.currency || "RS."}{courseData.price || "6500"}/=
          </span>
          <button 
          onClick={()=>{  window.location.href = "/payments?uid=" + (currentUser?.uid || "") + "&email=" + (currentUser?.email || ""); }}
          className="cursor-pointer flex items-center bg-white border border-gray-200 rounded-full shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-2 px-3">
              <ShoppingCart size={18} className="text-white" />
            </div>
            <span className="px-4 py-1 text-black font-black text-sm uppercase tracking-tighter">
              BUY NOW
            </span>
          </button>
        </div>
      )}

      {/* --- 1. INTRO HEADER --- */}
      <section className="max-w-4xl mx-auto px-6 pt-10 md:pt-16 pb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
          {courseData.title}
        </h1>
        <p className="text-gray-600 text-xs md:text-base leading-relaxed">
          {courseData.description}
        </p>
      </section>

      {/* --- 2. MAIN INTRO VIDEO --- */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mb-16">
        <div
          className="relative aspect-video bg-black rounded-sm overflow-hidden shadow-xl group cursor-pointer w-full"
          onClick={() =>
            courseData.intro_video_link &&
            window.open(courseData.intro_video_link, "_blank")
          }
        >
          <img
            src={typeof courseData.thumbnail_image === "string" ? courseData.thumbnail_image : ""}
            className="w-full h-full object-cover opacity-80"
            alt="Intro"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="w-12 h-12 md:w-16 md:h-16 text-white/90 group-hover:scale-110 transition-transform" />
          </div>
          <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-blue-600 text-[8px] md:text-[10px] text-white px-2 md:px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            Intro Part
          </div>
        </div>

        <div className="flex flex-col justify-center h-full space-y-4 md:space-y-6 text-center lg:text-left">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase">Start Learning Now</h2>
          <div className="flex flex-col items-center lg:items-start gap-4">
            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Download Full Syllabus</p>
            <button
              onClick={() => courseData.main_pdf_link && window.open(courseData.main_pdf_link, "_blank")}
              className="flex items-center gap-3 bg-red-700 hover:bg-red-800 text-white px-6 md:px-8 py-3 rounded-full font-bold text-xs md:text-sm shadow-lg transition-all active:scale-95"
            >
              Course Curriculum <Download size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* --- 3. LESSONS SECTION --- */}
      <section className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4 mb-8">
          <h3 className="text-sm md:text-lg font-black uppercase tracking-tighter text-gray-400">
            Lessons & Sub-parts
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group rounded-full bg-gray-100 p-2 flex items-center justify-center transition-all duration-300 hover:bg-gray-200"
          >
            <div 
              className={`transform transition-transform duration-500 ease-in-out ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
            >
              <ChevronDown 
                size={20} 
                className="text-blue-600" 
              />
            </div>
          </button>
        </div>

        {/* --- ANIMATED LESSON LIST --- */}
        <div 
          className={`grid transition-all duration-700 ease-in-out ${
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-100"
          }`}
        >
          <div className="overflow-hidden space-y-10 md:space-y-12">
            {(isExpanded ? courseData.sub_contents : courseData.sub_contents.slice(0, 1)).map((sub, index) => (
              <div 
                key={sub.content_id} 
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {/* Lesson Thumbnail */}
                <div className="lg:col-span-5 relative aspect-video bg-gray-100 rounded-sm overflow-hidden group w-full">
                  <img
                    src={typeof sub.thumbnail_image === "string" ? sub.thumbnail_image : ""}
                    className={`w-full h-full object-cover ${!canAccessSubContent ? "blur-md grayscale opacity-40" : ""}`}
                    alt={sub.title}
                  />
                  {!canAccessSubContent ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                      <Lock className="text-white mb-2 w-6 h-6 md:w-8 md:h-8" />
                      <span className="text-[8px] md:text-[10px] font-black uppercase text-white tracking-widest">Content Locked</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                      <PlayCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  )}
                </div>

                {/* Lesson Info */}
                <div className="lg:col-span-7 flex flex-col items-start text-left px-2 md:px-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={`text-xl md:text-2xl font-bold ${!canAccessSubContent ? "text-gray-400" : "text-gray-900"}`}>
                      {sub.title}
                    </h4>
                    {!canAccessSubContent && <Lock size={18} className="text-black" strokeWidth={3} />}
                  </div>
                  <p className="text-gray-800 text-xs md:text-[14px] font-medium mb-3">
                    Part {String(index + 1).padStart(2, "0")}
                  </p>

                  <div className="flex flex-col items-start w-full">
                    <p className="text-gray-500 text-xs md:text-[13px] leading-relaxed mb-6 max-w-xl">
                      {sub.description}
                    </p>
                    
                    {canAccessSubContent ? (
                      <div className="flex flex-col items-start gap-2 w-full">
                        <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase">Download References</span>
                        <button
                          onClick={() => sub.pdf_link && window.open(sub.pdf_link, "_blank")}
                          className="h-[38px] md:h-[40px] w-full md:w-auto px-8 md:px-10 flex items-center justify-center bg-gradient-to-b from-[#c62828] to-[#8e0000] text-white text-[11px] font-bold uppercase rounded-full shadow-[0_4px_0_#6a0000] active:shadow-none active:translate-y-[2px] transition-all cursor-pointer"
                        >
                          Download PDF
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic text-xs md:text-sm">Purchase this course to unlock detailed descriptions and resources for this lesson.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}