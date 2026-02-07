"use client";

import React, { useEffect, useMemo, useState } from "react";
import AnalyzeCard from "@/components/analyze_card";
import { AnalyzeModel } from "@/types/analyze_model";

const ITEMS_PER_PAGE = 10;

type FilterType = "ALL" | "SPOT" | "FUTURES";

export default function Analyze() {
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [loading, setLoading] = useState(true);
  const [analyzes, setAnalyzes] = useState<AnalyzeModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/GetaAnalyzeData");
        const data = await response.json();

        if (data?.success) {
          setAnalyzes(data.data || []);
        } else {
          setAnalyzes([]);
        }
      } catch (error) {
        console.error("Error fetching analyzes:", error);
        setAnalyzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAnalyzes = useMemo(() => {
    if (filter === "ALL") return analyzes;
    if (filter === "SPOT") return analyzes.filter((a) => a.type === "spot");
    return analyzes.filter((a) => a.type === "futures");
  }, [analyzes, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAnalyzes.length / ITEMS_PER_PAGE),
  );

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAnalyzes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAnalyzes, currentPage]);

  const goTo = (p: number) =>
    setCurrentPage(Math.min(Math.max(1, p), totalPages));

  const FilterBar = () => (
    <div className="flex w-full items-center justify-end gap-2 px-4 py-3 mt-20 md:px-8">
      <button
        onClick={() => setFilter("ALL")}
        className={[
          "rounded-full px-4 py-2 text-sm font-semibold transition",
          filter === "ALL"
            ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
            : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50",
        ].join(" ")}
      >
        All
      </button>

      <button
        onClick={() => setFilter("SPOT")}
        className={[
          "rounded-full px-4 py-2 text-sm font-semibold transition",
          filter === "SPOT"
            ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
            : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50",
        ].join(" ")}
      >
        Spot
      </button>

      <button
        onClick={() => setFilter("FUTURES")}
        className={[
          "rounded-full px-4 py-2 text-sm font-semibold transition",
          filter === "FUTURES"
            ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
            : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50",
        ].join(" ")}
      >
        Futures
      </button>
    </div>
  );

  const Pagination = () =>
    totalPages > 1 ? (
      <div className="mt-6 flex flex-col items-center justify-between gap-3 px-4 sm:flex-row md:px-8">
        <p className="text-sm text-gray-500">
          Page{" "}
          <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
          <span className="font-semibold text-gray-900">{totalPages}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            {Array.from({ length: totalPages })
              .slice(0, 8)
              .map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => goTo(pageNum)}
                    className={[
                      "h-9 w-9 rounded-xl text-sm font-semibold ring-1 transition",
                      currentPage === pageNum
                        ? "bg-gray-900 text-white ring-gray-900"
                        : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {pageNum}
                  </button>
                );
              })}
            {totalPages > 8 ? (
              <span className="px-2 text-gray-400">…</span>
            ) : null}
          </div>

          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-white">
      <FilterBar />

      <div className="w-full px-4 pb-10 md:px-8">
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-500">Loading analyzes...</p>
            </div>
          ) : filteredAnalyzes.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-500">No analyzes found.</p>
            </div>
          ) : (
            currentItems.map((analyze) => (
              <div key={analyze.analyze_id} className="bg-white">
                <AnalyzeCard {...analyze} />
              </div>
            ))
          )}
        </div>
        <Pagination />
      </div>
    </div>
  );
}
