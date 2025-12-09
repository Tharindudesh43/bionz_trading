"use client";

import Image from "next/image";
import { Timestamp } from "firebase/firestore";
import { FaInfoCircle } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiFillLike, AiFillDislike, AiOutlineComment,AiFillEdit, AiFillEye, } from "react-icons/ai";
import React, { useEffect } from "react";
import AnalyzePopUP from "@/components/analyze_popup";
import { AnalyzeModel } from "@/types/analyze_model";

dayjs.extend(relativeTime);

export default function AdminAnalyzeRow(props: AnalyzeModel) {
  const [isOpenDescription, setIsOpenDescription] = React.useState(false);
  const [timeAgo, setTimeAgo] = React.useState<string>("");

  const toggleDescription = () => {
    setIsOpenDescription(!isOpenDescription);
  };

  const createdDate = React.useMemo(() => {
    if (typeof props.created_date === "string") {
      return new Date(props.created_date);
    }
    if (props.created_date && typeof props.created_date === "object" && "seconds" in props.created_date) {
      return new Date(props.created_date.seconds * 1000);
    }
    return new Date();
  }, [props.created_date]);

  useEffect(() => {
    setTimeAgo(dayjs(createdDate).fromNow());
  }, [createdDate]);

  return (
    <>
      <tr className="border-b border-gray-300 hover:bg-gray-100 transition items-center justify-center">
        {/* Pair */}
        <td className="px-4 py-3 font-semibold text-gray-800">
          {props.pair}
        </td>

        {/* Type */}
        <td className="px-4 py-3 text-gray-700">
          {props.type === "spot" ? "Spot" : "Futures"}
        </td>

        {/* Image Preview */}
        <td className="px-4 py-3">
          <div className="w-24 h-14 overflow-hidden rounded-md border">
            <Image
              src={props.analyze_image.toString() || ""}
              alt="analysis"
              width={96}
              height={56}
              className="object-cover w-full h-full"
            />
          </div>
        </td>

        {/* Time Ago */}
        <td className="px-4 py-3 text-sm text-gray-500">{timeAgo}</td>

        {/* Full Date */}
        <td className="px-4 py-3 text-sm text-gray-500">
          {dayjs(createdDate).format("MMMM D, YYYY h:mm A")}
        </td>

        {/* Description Popup */}
        <td className="px-4 py-3 text-center items-center justify-center">
          <FaInfoCircle
            className="text-blue-600 hover:text-blue-800 text-lg cursor-pointer"
            onClick={toggleDescription}
          />
        </td>

        {/* Actions */}
        <td className="px-4 py-3 flex gap-3 text-xl justify-center">
          <button className="text-blue-600 hover:text-blue-800">
            <AiFillEdit />
          </button>
          <button className="text-red-500 hover:text-red-700">
            <AiFillEye />
          </button>
        </td>
      </tr>

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
