""

import Image from "next/image";
import { Timestamp } from "firebase/firestore";
import { FaInfoCircle } from "react-icons/fa";
import React, { useEffect } from "react";
import AnalyzePopUP from "@/components/analyze_popup";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiFillLike } from 'react-icons/ai';
import { AiFillDislike } from 'react-icons/ai';
import { AiOutlineComment } from 'react-icons/ai';
dayjs.extend(relativeTime);

interface AnalyzeProps {
  analyze_id: string;
  analyze_image: string;
  created_date: string | Timestamp;
  analyze_description: string;
  pair: string;
  type?: "spot" | "futures";
}

export default function AnalyzeCard(props: AnalyzeProps) {
  const [isOpenDescription, setIsOpenDescription] = React.useState<boolean>(false);

  const toggleDescription = async () => {
    setIsOpenDescription(!isOpenDescription);
    console.log("Toggled description modal:", !isOpenDescription);
  }

  const [timeAgo, setTimeAgo] = React.useState<string>('');

   const createdDate = React.useMemo(() => {
    if (typeof props.created_date === 'string') {
      return new Date(props.created_date);
    }
    // if it's a Timestamp-like object from Firebase
    if (props.created_date && typeof props.created_date === 'object' && 'seconds' in props.created_date) {
      const seconds = (props.created_date as Timestamp).seconds || 0;
      const nanoseconds = (props.created_date as Timestamp).nanoseconds || 0;
      return new Date(seconds * 1000 + nanoseconds / 1000000);
    }
    // Fallback: attempt to coerce to Date
    return new Date(String(props.created_date));
  }, [props.created_date]);

  useEffect(() => {
    setTimeAgo(dayjs(createdDate).fromNow());
  }, [createdDate]);

  return (
  <>
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-r from-white via-blue-100 to-gray-100 rounded-2xl shadow-md p-4 md:p-6 border border-gray-200">
 <div className="flex items-center w-full justify-between mb-3">
  {/* Left: Pair */}
  <div className="text-left">
    <h2 className="text-lg font-semibold text-gray-800">{props.pair}</h2>
  </div>

  {/* Center: Type */}
  <div className="text-center flex-1">
    <h2 className="text-lg font-semibold text-gray-800">{props.type == "spot" ? "Spot" : "Futures"}</h2>
  </div>

  {/* Right: Info Icon + Time */}
  <div className="flex flex-col items-end text-right gap-1">
    <div className="flex items-center gap-2">
      <FaInfoCircle
        className="cursor-pointer m-1 text-blue-600 hover:text-blue-800"
        onClick={toggleDescription}
      />
      <p className="text-xs text-gray-500">{dayjs(createdDate).fromNow()}</p>
    </div>
    <p className="text-xs text-gray-400">{dayjs(createdDate).format("MMMM D, YYYY h:mm A")}</p>
  </div>
</div>


     

        {/* Image */}
        <div className="w-full h-auto rounded-xl overflow-hidden border-2 border-gray-300">
          <Image
            src={props.analyze_image || ""}
            alt="Trading chart"
            width={900}
            height={500}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 mt-3">
          <button className="text-blue-600 hover:text-blue-800 text-xl cursor-pointer">
            <AiFillLike />
          </button>
          <button className="text-red-500 hover:text-red-700 text-xl cursor-pointer">
            <AiFillDislike />
          </button>
          <button className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer">
            <AiOutlineComment />
          </button>
        </div>
      </div>

      {/* Description Popup */}
      <AnalyzePopUP isOpen={isOpenDescription} onClose={toggleDescription} title="Description">
        {props.analyze_description}
      </AnalyzePopUP>
  </>  
  );
}
