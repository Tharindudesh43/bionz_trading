"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { FaInfoCircle } from "react-icons/fa";
import AnalyzePopUP from "@/components/analyze_popup";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiFillLike, AiFillDislike, AiOutlineComment } from "react-icons/ai";

dayjs.extend(relativeTime);

export interface AnalyzeModel {
  analyze_id: string;
  analyze_image: string;
  created_date: string | Timestamp | any;
  analyze_description: string;
  pair: string;
  type: "spot" | "futures";
  status: "Active" | "Inactive";
  edited_date: string | Timestamp | any;
  edited?: boolean;
}

const toDate = (value: string | Timestamp) => {
  if (typeof value === "string") return new Date(value);
  if (value && typeof value === "object" && "seconds" in value) {
    const seconds = (value as Timestamp).seconds || 0;
    const nanos = (value as Timestamp).nanoseconds || 0;
    return new Date(seconds * 1000 + nanos / 1_000_000);
  }
  return new Date(String(value));
};

const toDateFromAny = (value: any) => {
  if (!value) return null;

  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const sec = value.seconds ?? value._seconds;
  const nano = value.nanoseconds ?? value._nanoseconds ?? 0;

  if (typeof sec === "number") {
    return new Date(sec * 1000 + nano / 1_000_000);
  }

  return null;
};

const formatYYYYMMDD_colon = (value: any) => {
  const d = toDateFromAny(value);
  if (!d) return "--";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}:${m}:${day}`; // ✅ 2023:10:12
};

export default function AnalyzeCard(props: AnalyzeModel) {
  const [isOpenDescription, setIsOpenDescription] = React.useState(false);
  const toggleDescription = () => setIsOpenDescription((p) => !p);

  const createdDate = React.useMemo(
    () => toDate(props.created_date),
    [props.created_date],
  );
  const editedDate = React.useMemo(
    () => toDate(props.edited_date),
    [props.edited_date],
  );

  const [timeAgo, setTimeAgo] = React.useState("");
  const [editedAgo, setEditedAgo] = React.useState("");

  useEffect(() => {
    console.log("Calculating time ago for:", createdDate, editedDate);
    setTimeAgo(dayjs(createdDate).fromNow());
    setEditedAgo(dayjs(editedDate).fromNow());
  }, [createdDate, editedDate]);

  const isInactive = props.status === "Inactive";

  return (
    <>
      <div
        className={[
          "w-full max-w-3xl mx-auto rounded-3xl p-4 md:p-6 shadow-sm ring-1",
          isInactive
            ? "bg-gradient-to-r from-white via-gray-40 to-gray-300 ring-gray-300"
            : "bg-gradient-to-r from-white via-blue-40 to-indigo-50 ring-blue-100",
        ].join(" ")}
      >
        {/* Top Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {/* Left */}
          <div className="flex items-start gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {props.pair}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {/* Type */}
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                  {props.type === "spot" ? "Spot" : "Futures"}
                </span>

                {/* Status */}
                <span
                  className={[
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    isInactive
                      ? "bg-red-100 text-red-600"
                      : "bg-emerald-100 text-emerald-700",
                  ].join(" ")}
                >
                  {props.status}
                </span>

                {/* Edited badge */}
                {props.edited ? (
                  <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                    Edited
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right: Info + dates */}
          <div className="flex items-start justify-between gap-3 sm:flex-col sm:items-end sm:text-right">
            <button
              type="button"
              onClick={toggleDescription}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            >
              <FaInfoCircle className="text-blue-600" />
              Info
            </button>

            <div className="text-xs text-gray-500">
              <p>
                Created:{" "}
                <span className="font-semibold text-gray-800">{timeAgo}</span>
              </p>
              <p className="text-[11px] text-gray-400">
                {formatYYYYMMDD_colon(props.created_date)}
              </p>

              {props.edited ? (
                <p className="mt-1">
                  Edited:{" "}
                  <span className="font-semibold text-gray-800">
                    {editedAgo}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <Image
            src={props.analyze_image || ""}
            alt="Trading chart"
            width={1200}
            height={700}
            className="h-auto w-full object-cover"
          />
        </div>

        {/* Footer actions */}
        {/* <div className="mt-4 flex items-center justify-end gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50">
            <AiFillLike className="text-blue-600" /> Like
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50">
            <AiFillDislike className="text-red-500" /> Dislike
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800">
            <AiOutlineComment /> Comment
          </button>
        </div> */}
      </div>

      {/* Description Popup */}
      <AnalyzePopUP
        isOpen={isOpenDescription}
        onClose={toggleDescription}
        title="Description"
      >
        {props.analyze_description}
      </AnalyzePopUP>
    </>
  );
}
