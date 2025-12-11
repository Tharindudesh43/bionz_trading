"use client";

import AnalyzeCard from "@/components/analyze_card";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import React, { use } from "react";
import { useEffect } from "react";
import AnalyzePopUP from "@/components/analyze_popup";

interface AnalyzeProps {
  analyze_id: string;
  analyze_image: string;
  created_date: string;
  analyze_description: string;
  pair: string;
  type?: "spot" | "futures";
}

const itemsPerPage = 10;

export default function Analyze() {
  const [filter, setFilter] = React.useState<string>("ALL");
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [analyzes, setAnalyzes] = React.useState<AnalyzeProps[]>([]);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredAnalyzes = analyzes.filter(
    (analyze) => filter === "ALL" || analyze.type === filter.toLowerCase()
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAnalyzes.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredAnalyzes.length / itemsPerPage);

  const clickresponse = async (filter: string) => {
    setLoading(true);
    setFilter(filter);
  };

  async function fetchAnalyzes() {
    try {
      setLoading(true); // <-- Keep: Starts loading state before fetch
      const response = await fetch("/api/analyze");
      const data = await response.json();

      console.log("Fetched analyzes data:", data);
      if (data.success) {
        setAnalyzes(data.data);
      }
      setLoading(false); // <-- Ends loading state on success
    } catch (error) {
      console.error("Error fetching analyzes:", error);
      setLoading(false); // <-- Ends loading state on error
    }
  };

  useEffect(() => {
    fetchAnalyzes();
  }, [loading]);

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full flex justify-end items-center gap-4 px-4 py-3 md:px-8">
        <button
          onClick={() => clickresponse("ALL")}
          className={`px-3 py-1.5 ${
            filter === "ALL" ? "text-amber-700" : "text-black"
          } hover:text-amber-700 rounded-full text-sm font-medium transition-shadow cursor-pointer`}
        >
          ALL
        </button>

        <button
          onClick={() => clickresponse("Spot")}
          className={`px-3 py-1.5 ${
            filter === "Spot" ? "text-amber-700" : "text-black"
          } hover:text-amber-700 rounded-full text-sm font-medium transition-shadow cursor-pointer`}
        >
          Spot
        </button>

        <button
          onClick={() => clickresponse("Futures")}
          className={`px-3 py-1.5 ${
            filter === "Futures" ? "text-amber-700" : "text-black"
          } hover:text-amber-700 rounded-full text-sm font-medium transition-shadow cursor-pointer`}
        >
          Futures
        </button>
      </div>

      <div className="p-4 w-full gap-6">
        {/* Example Analyze Card */}
        <div className="  overflow-hidden  transition-shadow duration-300">
          {loading == true && analyzes.length === 0 ? (
            <div className="flex items-center justify-center h-screen">
              <p className="text-gray-500 text-center">Loading analyzes...</p>
            </div>
          ) : analyzes.length === 0 && loading == false ? (
            <div className="flex items-center justify-center h-screen">
              <p className="text-gray-500 text-center">No analyzes found.</p>
            </div>
          ) : currentItems.length > 0 ? (
            currentItems.map((analyze) => (
              <div key={analyze.analyze_id} className="bg-white p-4 mb-4">
                <AnalyzeCard {...analyze} />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500 text-center">No analyzes found.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex gap-2 justify-center mt-4">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
