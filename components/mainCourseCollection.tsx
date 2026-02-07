"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LargeNavbarIcon from "@/src/NavbarIcon(Large).png";
import SmallNavbarIcon from "@/src/NavbarIcon(Small).png";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, setUser } from "@/src/store/userSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  User2Icon,
  ShoppingCart,
  Download,
  PlayCircle,
} from "lucide-react";

interface MainCourseCollectionProps {
  title: string;
  description: string;
  thumbnailimage: string;
  videoUrl: string;
  pdfUrl: string;
  createDate: string;
}

export const MainCourseCollection = (props: MainCourseCollectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <>
      <div className="bg-white text-black border-b border-gray-100">
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            {props.title}
          </h1>
          <div className="space-y-4 text-gray-700 leading-relaxed max-w-4xl mx-auto text-sm md:text-base">
            <p>{props.description}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pb-12">
          <div 
          onClick={()=>{
            window.open(props.videoUrl, "_blank", "noopener,noreferrer");
          }}
          className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden shadow-2xl group cursor-pointer">
            <img
              src={props.thumbnailimage}
              alt="Video Thumbnail"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-white transition-all scale-100 group-hover:scale-110" />
            </div>

            <div className="absolute bottom-0 w-full h-1.5 bg-neutral-700">
              <div className="w-1/3 h-full bg-red-600"></div>
            </div>

            <div className="absolute bottom-0 w-full h-1.5 bg-white/20 backdrop-blur-sm z-20">
              <div className="w-1/3 h-full bg-red-600 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg shadow-red-500/50" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Learn with Bionz</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Comprehensive crypto trading education in Sinhala to trade smarter
              and confidently.
            </p>

            <div className="space-y-4">
              <p className="text-xs font-bold uppercase text-gray-400 tracking-widest">
                Read Course Content And Details
              </p>
              <button
                onClick={() => {
                  window.open(props.pdfUrl, "_blank", "noopener,noreferrer");
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Download Now! <Download size={18} />
              </button>
              <p className="text-orange-600 font-serif italic text-lg">
                Chart Pattern Mastery Book Free With Course
              </p>
            </div>
          </div>
        </section>

        {/* <section className="max-w-6xl mx-auto px-6 py-8 flex flex-col items-end gap-1 border-t border-gray-50"> */}
        {/* <p className="text-sm font-medium text-gray-400 line-through">RS. 8500/=</p>
        <p className="text-2xl font-black text-neutral-900">RS. 6500/=</p> */}
        {/* <button className="flex items-center gap-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3 rounded-full font-black uppercase tracking-tighter shadow-lg hover:shadow-orange-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
            <div className="bg-white/20 p-1 rounded-full">
              <ShoppingCart size={18} />
            </div>
            BUY NOW
          </button>
        </section> */}
      </div>
    </>
  );
};

export default MainCourseCollection;
