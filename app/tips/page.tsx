import Image, { StaticImageData } from "next/image";
import dummyThumbnail from "@/assets/social-media.png"; // Replace with your image
import { Button } from "@/components/ui/button";
import { AiFillAccountBook, AiFillLike, AiOutlineComment } from "react-icons/ai";

interface Course {
  id?: number;
  title: string;
  description: string;
  duration: string;
  date: string;
  image: StaticImageData | string;
}

// --- Single Video Card Component ---
const VideoCourseCard = ({ course }: { course: Course }) => {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      
      {/* Left: Video Thumbnail */}
      <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
        <Image
          src={course.image}
          alt={course.title}
          layout="fill"
          objectFit="cover"
          className="opacity-90"
        />
        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-white/90"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2-9l7 4-7 4V10zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </div>
        {/* Date */}
        <p className="text-gray-600 text-xs mt-2 text-center font-medium">
          {course.date}
        </p>
      </div>

      {/* Right: Details */}
      <div className="flex flex-col justify-between p-4 sm:p-5 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-snug">
            {course.title}
          </h3>
          <p className="text-gray-500 text-sm ml-2">{course.duration}</p>
        </div>
        <p className="text-gray-600 text-sm mt-2 mb-4 line-clamp-3">
          {course.description}
        </p>

        {/* Interaction Buttons */}
        <div className="flex space-x-6 mt-auto">
          {/* Comment */}
          <div className="flex flex-col items-center font-bold text-gray-500 hover:text-blue-600 cursor-pointer transition-colors text-xs">
             <Button >
              <AiOutlineComment size={10} />
           </Button>
            Comment
          </div>

          {/* Like */}
          <div className="flex flex-col items-center font-bold text-gray-500 hover:text-blue-600 cursor-pointer transition-colors text-xs">
           <Button >
              <AiFillLike size={10} />
           </Button>
            Like
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Example Usage Component ---
const dummyCourses: Course[] = [
  {
    id: 1,
    title: "How Buy Bitcoin with Binance",
    description:
      "Learn With Bionz offers comprehensive crypto trading education for beginners to advanced traders. Learn trading strategies, market analysis, risk management, and technical analysis in Sinhala.",
    duration: "4 hours Ago",
    date: "2025.11.23",
    image: dummyThumbnail,
  },
  {
    id: 2,
    title: "Understanding Crypto Signals & Risk Management",
    description:
      "Master techniques for utilizing spot and futures signals for maximum profit and risk management.",
    duration: "2 hours Ago",
    date: "2025.11.23",
    image: dummyThumbnail,
  },
  {
    id: 3,
    title: "DeFi and Staking Strategies 2024",
    description:
      "A deep dive into Decentralized Finance (DeFi), yield farming, staking, and passive income strategies.",
    duration: "3 hours Ago",
    date: "2025.11.23",
    image: dummyThumbnail,
  },
];

export default function CoursesList() {
  return (
    <section className="bg-gray-100 py-12 mt-15">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-10 text-center">
          Trading Tips
        </h2>

        <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
          Explore our curated video courses designed to enhance your trading skills
          and knowledge. From beginner guides to advanced strategies, our expert-led
          content covers everything you need to succeed in the world of trading.
        </p>
        <div className="space-y-6">
          {dummyCourses.map((course) => (
            <VideoCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
