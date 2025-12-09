"use client";

import Image from "next/image";
import SocialImage from "@/assets/social-media.png";

const MobileAppImageExtraSmall = () => (
  <div className="relative mx-auto w-full max-w-[12rem] sm:max-w-xs lg:max-w-sm">
    <div className="aspect-square bg-neutral-900 rounded-full flex items-center justify-center p-4 shadow-lg shadow-purple-900/30">
      <Image
        src={SocialImage}
        alt="Mobile App"
        className="w-full h-auto rounded-lg" // Reduced border radius
        priority
      />
    </div>
  </div>
);
export default function FooterCompact() {
  return (
    // Reduced vertical padding from py-16 to py-10
    <footer className="w-full bg-black text-white border-t border-gray-800">
      <section className="container mx-auto px-4 md:px-8 xl:px-20 py-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Mobile Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start order-2 lg:order-1">
            <MobileAppImageExtraSmall />
          </div>
          {/* Right Feature Content */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            {/* Reduced heading size */}
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Bionz Trading
            </h2>
            {/* Reduced paragraph size */}
            <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
              Bionz Signal App helps you trade smarter with accurate crypto
              signals, real-time news, tips videos, a profit
              calculator, and a personalized trading plan based on your
              starting capital.
            </p>

            {/* Feature List */}
            <ul className="text-sm sm:text-base space-y-2 list-none">
              {[
                "Real Time News",
                "Spot And Future Trading Signals",
                "Profit/Loss Calculator",
                "Trading Plan For You",
                "Manage Your Loss And Profit",
              ].map((item, index) => (
                <li
                  key={index}
                  // Adjusted list item padding slightly
                  className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-green-400"
                >
                  {item}
                </li>
              ))}
            </ul>

            {/* Download Buttons */}
            <div className="flex space-x-3 sm:space-x-4 mt-6">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  width={150} // Slightly smaller base width
                  height={50} // Slightly smaller base height
                  className="h-8 sm:h-10 w-auto" // Reduced height class
                />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  width={150} // Slightly smaller base width
                  height={50} // Slightly smaller base height
                  className="h-8 sm:h-10 w-auto" // Reduced height class
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
