"use client";
import { useSelector } from "react-redux";
import {
  Loader2,
} from "lucide-react";
import MainCourseCollection from "@/components/mainCourseCollection";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseDetail from "@/components/subCourseCollection";
import { MainCollection, SubCollection } from "@/types/collection_models";


export default function CourseGrid() {
  const [mainCourseCollectionloading, setMainCourseCollectionloading] =
    React.useState(false);
  const [otherCollectionloading, setOtherCollectionloading] =
    React.useState(false);
  const [mainCourseCollection, setMainCourseCollection] = useState<MainCollection[]>([]);
  const [otherCollection, setOtherCollection] = useState<SubCollection[]>([]);

  // Get Auth state from Redux
  const { currentUser, loading } = useSelector((state: any | null | undefined) => state.user);

  useEffect(() => {
    const loadMainCourseCollection = async () => {
      try {
        setMainCourseCollectionloading(true);
        const res = await axios.get("/api/getmainCourseCollection");

        if (res.data.success === true) {
          setMainCourseCollection(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setMainCourseCollectionloading(false);
      }
    };
    const loadSubCourseCollection = async () => {
      try {
        setOtherCollectionloading(true);
        const res = await axios.get("/api/getsubCourses");

        if (res.data.success === true) {
          setOtherCollection(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setOtherCollectionloading(false);
      }
    };
    loadSubCourseCollection();
    loadMainCourseCollection();
  }, []);

  const getAccessStatus = (courseId: string) => {
    if (!currentUser) return "LOCKED_LOGIN";
    if (currentUser.role === "admin") return "OPEN";
    if (currentUser.courseplan === "pro") {
      const hasCourse = currentUser.courses?.some(
        (c: any) => c.courseId === courseId
      );
      return hasCourse ? "OPEN" : "LOCKED_BUY";
    }
    return "LOCKED_UPGRADE";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-3" size={40} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
          Syncing Permissions...
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <section className="w-full">
        {mainCourseCollectionloading ? (
          <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-16 animate-pulse">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="h-10 bg-gray-200 rounded-md w-3/4 md:w-1/2 mb-4" />
              <div className="h-4 bg-gray-100 rounded-md w-full md:w-2/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded-md w-1/2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="relative aspect-video bg-gray-200 rounded-sm shadow-sm" />
              <div className="flex flex-col justify-center h-full space-y-6">
                <div className="h-8 bg-gray-200 rounded-md w-1/2" />
                <div className="space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-12 bg-gray-200 rounded-full w-56" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <MainCourseCollection
            title={mainCourseCollection[0]?.title || "Featured Course"}
            description={
              mainCourseCollection[0]?.description ||
              "Unlock your potential with Bionz's comprehensive crypto trading courses."
            }
            thumbnailimage={
              typeof mainCourseCollection[0]?.thumbnail_image === "string"
                ? mainCourseCollection[0].thumbnail_image
                : "https://images.pexels.com/photos/35551077/pexels-photo-35551077.jpeg"
            }
            videoUrl={mainCourseCollection[0]?.video_link || ""}
            pdfUrl={mainCourseCollection[0]?.pdf_link || ""}
            createDate={
              typeof mainCourseCollection[0]?.created_date === "string"
                ? mainCourseCollection[0].created_date
                : (mainCourseCollection[0]?.created_date as any)?.toDate?.().toISOString() || ""
            }
          />
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 border-l-4 border-blue-600 pl-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">
            Advanced Modules
          </h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Continue your learning journey
          </p>
        </div>

        <div className="flex flex-col gap-20">
          {otherCollectionloading
            ? [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-pulse border-b border-gray-100 pb-20"
                >
                  <div className="lg:col-span-5 aspect-video bg-gray-200 rounded-sm" />
                  <div className="lg:col-span-7 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="space-y-2 pt-4">
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                    <div className="pt-6">
                      <div className="h-10 bg-gray-200 rounded-full w-40" />
                    </div>
                  </div>
                </div>
              ))
            : otherCollection.map((course: any) => {
                const status = getAccessStatus(course.collection_id);
                const isPurchased = status === "OPEN";
                const isLoggedIn = status !== "LOCKED_LOGIN";

                return (
                  <div
                    key={course.id}
                    className="relative border-b border-gray-100 pb-5 last:border-0"
                  >
                    <CourseDetail
                      courseData={course}
                      isPurchased={isPurchased}
                      isLoggedIn={isLoggedIn}
                    />
                  </div>
                );
              })}
        </div>
      </section>
    </div>
  );
}
