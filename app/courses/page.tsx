import Image from "next/image";
// NOTE: Ensure your asset path is correct:
import dummyThumbnail from "@/assets/social-media.png"; 

// --- Dummy Data ---
const dummyCourses = [
  {
    id: 1,
    title: "How Buy Bitcoin with Binance",
    description: "Learn With Bionz offers comprehensive crypto trading education for beginners to advanced traders. Learn trading strategies, market analysis, risk management, and technical analysis in Sinhala to trade smarter.ARTICLE-0app-3",
    duration: "4 hours ago",
    date: "2025.11.23",
    image: dummyThumbnail,
  },
  {
    id: 2,
    title: "Understanding Crypto Signals & Risk Management",
    description: "Master techniques for utilizing spot and futures signals for maximum profit.",
    duration: "2 hours ago",
    date: "2025.11.23",
    image: dummyThumbnail,
  },
  {
    id: 3,
    title: "DeFi and Staking Strategies 2024",
    description: "A deep dive into Decentralized Finance (DeFi) and passive income strategies.",
    duration: "3 hours ago",
    date: "2025.11.23",
    image: dummyThumbnail,
  },
  {
    id: 4,
    title: "Technical Analysis for Day Traders",
    description: "Understand candlestick patterns and chart reading essential for trading success.",
    duration: "1 hour ago",
    date: "2025.11.23",
    image: dummyThumbnail,
  },
  {
    id: 5,
    title: "Wallet Management and Security Tips",
    description: "Essential tips to secure your crypto assets and manage your wallets effectively.",
    duration: "5 hours ago",
    date: "2025.11.23",
    image: dummyThumbnail,
  },
];

// --- Sub-Component for Small Cards ---
const SmallVideoCard = ({ course }: { course: typeof dummyCourses[0] }) => (
  <div className="flex bg-white rounded-lg p-3 shadow-md gap-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
    {/* Small Thumbnail (1:1 aspect ratio) */}
    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
      <Image
        src={course.image}
        alt={course.title}
        layout="fill"
        objectFit="cover"
        className="opacity-90"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2-9l7 4-7 4V10zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      </div>
    </div>
    
    {/* Title and Info */}
    <div className="flex flex-col justify-between py-0.5 w-full">
      <p className="text-gray-900 text-sm font-semibold leading-tight line-clamp-2">
        {course.title}
      </p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{course.date}</span>
        {/* Dummy interaction icons */}
        <div className="flex space-x-2">
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            <span className="text-xs">15</span>
          </span>
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h-2m2 0h2m-4 0v2m0 0v2m0-4h4m-4 0v4m4-4v4m-4 0h4m-4 0v4m4-4v4M6 16v-4m0 0H2m4 0h4m-4 0v4m0 0H2"/></svg>
            <span className="text-xs">45</span>
          </span>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Course Component ---
export default function Courses() {
  const mainCourse = dummyCourses[0];
  const smallCoursesTop = dummyCourses.slice(1, 3);
  const smallCoursesBottom = dummyCourses.slice(3, 5);

  return (
    <div className="bg-gray-100 py-16 mt-5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        {/* <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Our Trading Courses
        </h2>
        <p className="text-xl font-extrabold text-amber-600 mb-12">
          tex tett 4xl 5xil fom extrabld test tradin ourses 30
        </p> */}

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Small Video Cards */}
          <div className="lg:w-1/3 flex flex-col space-y-4 order-2 lg:order-1">
            
            {/* Top Group of Small Cards */}
            <div className="bg-white rounded-xl shadow-lg p-3 space-y-3">
              {smallCoursesTop.map((course) => (
                <SmallVideoCard key={course.id} course={course} />
              ))}
            </div>

            {/* Bottom Group of Small Cards */}
            <div className="bg-white rounded-xl shadow-lg p-3 space-y-3">
              {smallCoursesBottom.map((course) => (
                <SmallVideoCard key={course.id} course={course} />
              ))}
            </div>
            
          </div>
          
          {/* Right Side: Large Featured Video Card */}
          <div className="lg:w-2/3 bg-white rounded-xl shadow-2xl p-4 order-1 lg:order-2">
            
            <div className="flex flex-col xl:flex-row gap-4">
              
              {/* Large Video Player Placeholder */}
              <div className="relative aspect-video w-full xl:w-2/3 flex-shrink-0 rounded-lg overflow-hidden bg-black">
                <Image
                  src={mainCourse.image}
                  alt={mainCourse.title}
                  layout="fill"
                  objectFit="cover"
                  className="opacity-70"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2-9l7 4-7 4V10zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  {/* Dummy progress bar at the bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-500/50">
                    <div className="w-1/3 h-full bg-red-600"></div>
                  </div>
                  <span className="absolute bottom-2 left-2 text-white text-xs">2:38 / 8:46</span>
                  <span className="absolute bottom-2 right-2 text-white text-xs">{mainCourse.date}</span>
                </div>
              </div>
              
              {/* Large Card Details */}
              <div className="flex flex-col justify-between py-2 xl:w-1/3 w-full">
                <div className="flex justify-end text-sm text-gray-500 mb-2">
                    {mainCourse.duration}
                </div>
                <h3 className="text-xl font-bold mb-3">
                  <span className="text-amber-600">{mainCourse.title.split(' ')[0]}</span>
                  {mainCourse.title.substring(mainCourse.title.split(' ')[0].length)}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-5">
                  {mainCourse.description}
                </p>
                
                {/* Interaction Buttons (Comments/Likes) */}
                <div className="flex space-x-3 text-sm mt-auto">
                    {/* Comment */}
                    <div className="flex items-center text-gray-500 hover:text-blue-500 cursor-pointer">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                        Comment
                    </div>
                    {/* Like */}
                    <div className="flex items-center text-gray-500 hover:text-blue-500 cursor-pointer">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h-2m2 0h2m-4 0v2m0 0v2m0-4h4m-4 0v4m4-4v4m-4 0h4m-4 0v4m4-4v4M6 16v-4m0 0H2m4 0h4m-4 0v4m0 0H2"/></svg>
                        Like
                    </div>
                </div>

                {/* Dummy Action Buttons */}
                <div className="flex space-x-3 mt-4">
                    <button className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold">
                        Comment
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold space-x-1">
                        Like
                    </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}