"use client"

import React from 'react';
import Image from 'next/image';
import CandleImage from '@/assets/candle_landing.png';
import { motion } from 'framer-motion';

const marketData = [
    { symbol: 'BNB', price: '$2.73' },
    { symbol: 'XRP', price: '$1.67' },
    { symbol: 'AVX', price: '$12.2' },
    { symbol: 'ADA', price: '$12.4' },
    { symbol: 'BTC', price: '$123,456.98' },
    { symbol: 'NPB', price: '$123' },
    { symbol: 'MAC', price: '$124' },
    { symbol: 'SOL', price: '$150.00' },
    { symbol: 'ETH', price: '$4,500.21' },
    { symbol: 'BNB', price: '$2.73' },
    { symbol: 'XRP', price: '$1.67' },
    { symbol: 'AVX', price: '$12.2' },
    { symbol: 'ADA', price: '$12.4' },
    { symbol: 'BTC', price: '$123,456.98' },
    { symbol: 'NPB', price: '$123' },
    { symbol: 'MAC', price: '$124' },
    { symbol: 'SOL', price: '$150.00' },
    { symbol: 'ETH', price: '$4,500.21' },
];

// Framer Motion Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 100 },
    },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, rotate: -5 },
    visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { type: "spring" as const, stiffness: 50, damping: 10, delay: 0.5 },
    },
};


const CryptoCandlesImage = () => (
    <motion.div
        className="w-full max-w-[450px] lg:max-w-[550px] flex justify-center lg:justify-end"
        variants={imageVariants}
        initial="hidden"
        whileInView="visible" 
        viewport={{ once: true, amount: 0.5 }}
    >
        <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-900 rounded-lg shadow-2xl shadow-green-900/40 flex items-center justify-center text-center text-gray-500 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-color-green-900)_0%,_transparent_70%)] opacity-30"></div>
            <Image 
                src={CandleImage} 
                alt="Candlestick chart" 
                className="w-full h-auto object-cover opacity-90 transition-opacity duration-500 relative z-10" 
                priority={true} 
            />
        </div>
    </motion.div>
);

const LandingBody = () => {
    return (
        <div className="bg-black text-white min-h-screen">
            
            {/* 1. HERO SECTION (Main Header & Candles Image) */}
            <section className="container mx-auto px-6 md:px-8 xl:px-20 py-16 sm:py-24 lg:py-32 pt-28 relative overflow-hidden"> 
                {/* Background Flare */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl opacity-30 animate-blob"></div>

                <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 z-10 relative">
                    
                    {/* LEFT: Text Content with Stagger Animation */}
                    <motion.div 
                        className="w-full lg:w-1/2 pt-8 lg:pt-0"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.p variants={itemVariants} className="text-green-500 text-sm font-semibold mb-4 tracking-widest uppercase">
                            Best Crypto Signals & Learning Place
                        </motion.p>
                        
                        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                            Welcome To <span className="text-green-400">Bionz Trading</span>
                        </motion.h1>
                        
                        <motion.p variants={itemVariants} className="text-gray-300 mb-8 text-base sm:text-lg leading-relaxed max-w-xl">
                            Over 10,000+ trader trust Bionz Trading worldwide. From complete beginners to advanced professionals, thousands of traders rely on Bionz for accurate guidance, education, and reliable trading insights.
                        </motion.p>

                        <motion.p variants={itemVariants} className="text-base sm:text-lg font-bold text-white transition-colors duration-300 hover:text-green-400 cursor-default">
                            Join us today and become a part of the Bionz trading community.
                        </motion.p>
                    </motion.div>

                    {/* RIGHT: Animated Candles Image Component */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <CryptoCandlesImage />
                    </div>
                </div>
            </section>
        
            {/* 2. MARKET TICKER SECTION (Infinite Scroll) */}
            <section className="py-4 bg-neutral-900 border-y border-gray-700 relative overflow-hidden">
                {/* Visual Fades */}
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-neutral-900 to-transparent z-20"></div>
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-neutral-900 to-transparent z-20"></div>

                <div className="container mx-auto px-4">
                    {/* Ticker Container - key component for infinite scroll */}
                    <div className="flex space-x-6 sm:space-x-10 py-1 animate-ticker custom-scrollbar-hide w-max">
                        {/* Render market data twice to ensure a smooth loop point */}
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