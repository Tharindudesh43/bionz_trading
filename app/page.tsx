
"use client"

import React from 'react';
import Image from 'next/image';
import CandleImage from '@/assets/candle_landing.png';
import SocialImage from '@/assets/social-media.png';

// --- Placeholder for the Candle Image Import (Assumed to be correct) ---
// import CandleImage from '@/assets/candle_landing.png'; 

// --- Data for the Market Ticker ---
const marketData = [
    { symbol: 'BNB', price: '$2.73' },
    { symbol: 'Xrp', price: '$1.67' },
    { symbol: 'AVX', price: '$12.2' },
    { symbol: 'ADA', price: '$12.4' },
    { symbol: 'BTC', price: '$123456.98' },
    { symbol: 'NPB', price: '$123' },
    { symbol: 'MAC', price: '$124' },
    { symbol: 'ADA', price: '$12.4' },
    { symbol: 'BTC', price: '$123456.98' },
    { symbol: 'NPB', price: '$123' },
    { symbol: 'MAC', price: '$124' },
];

// --- Optimized Crypto Candles Image Component ---
const CryptoCandlesImage = () => (
    // Responsive width scaling with max-width to control size on huge screens
    <div className="w-full max-w-[450px] lg:max-w-[550px] flex justify-center lg:justify-end">
        {/* Replace with your actual Next.js Image component setup */}
        <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-900 rounded-lg shadow-2xl shadow-green-900/40 flex items-center justify-center text-center text-gray-500">
            <Image src={CandleImage} alt="Candlestick chart" className="w-full h-auto" priority={true} />
        </div>
        {/* <Image src={CandleImage} alt="Candlestick chart" className="w-full h-auto" priority={true} /> */}
    </div>
);

// --- Optimized Mobile App Image Component (Visual Depth) ---
const MobileAppImage = () => (
    // Max width set for image container
    <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="aspect-square bg-neutral-900 rounded-full flex items-center justify-center p-8 shadow-2xl shadow-purple-900/50">
            <Image src={SocialImage} alt="Mobile App" className="w-full h-auto rounded-2xl" priority={true} />
            {/* <div className="w-3/4 h-3/4 bg-gray-800 rounded-2xl flex items-center justify-center border-4 border-gray-700">
                <Image src={SocialImage} alt="Mobile App" className="w-full h-auto rounded-2xl" priority={true} />
            </div> */}
        </div>
        
    </div>
);

// --- Main Landing Body Component ---
export const LandingBody = () => {
    return (
        // Removed `mt-5` from here. The padding should be handled by the Layout or the first section's top padding.
        <div className="bg-black text-white min">
            
            {/* 1. HERO SECTION (Text and Candles) */}
            <section className="container mx-auto px-6 md:px-8 xl:px-20 py-16 sm:py-24 lg:py-32 pt-28"> 
                {/* pt-28 (appx pt-16 + a large gap) ensures content is below the NavBar */}
                
                <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
                    
                    {/* Left Text Content */}
                    <div className="w-full lg:w-1/2 pt-8 lg:pt-0">
                        <p className="text-green-500 text-sm font-semibold mb-4 tracking-widest uppercase">Best Crypto Signals & Learning Place</p>
                        
                        {/* Responsive Heading Size and Weight for a modern look */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                            Welcome To <span className="text-green-400">Bionz Trading</span>
                        </h1>
                        
                        {/* Responsive Paragraph Size */}
                        <p className="text-gray-300 mb-8 text-base sm:text-lg leading-relaxed max-w-xl">
                            Over 10,000+ trader trust Bionz Trading worldwide. From complete beginners to advanced professionals, thousands of traders rely on Bionz for accurate guidance, education, and reliable trading insights.
                        </p>
                        <p className="text-base sm:text-lg font-bold text-white transition-colors duration-300 hover:text-green-400 cursor-default">
                            Join us today and become a part of the Bionz trading community.
                        </p>
                    </div>

                    {/* Right Candlestick Chart */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <CryptoCandlesImage />
                    </div>
                </div>
            </section>
        
            {/* 2. MARKET TICKER SECTION (Optimized for Horizontal Scroll) */}
            <section className="py-4 bg-neutral-900 border-y border-gray-700 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-neutral-900 to-transparent z-20"></div>
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-neutral-900 to-transparent z-20"></div>

                <div className="container mx-auto px-4">
                    {/* Added hidden scrollbar classes and ensured a wide, non-wrapping container */}
                    <div className="flex space-x-6 sm:space-x-10 py-1 overflow-x-scroll custom-scrollbar-hide">
                        {marketData.map((item, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 flex space-x-2 text-base sm:text-lg font-mono py-1 items-center"
                            >
                                <span className="font-bold text-gray-300">{item.symbol}</span>
                                <span className="text-green-400 font-medium">{item.price}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingBody;