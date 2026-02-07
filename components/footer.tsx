"use client";

import Image from "next/image";
import SocialImage from "@/assets/social-media.png";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

// --- Animated Mobile App Image Component ---
// Added Framer Motion to the image component for a subtle spin/zoom effect
const MobileAppImageExtraSmall = () => {
    return (
        <motion.div
            className="relative mx-auto w-full max-w-[12rem] sm:max-w-xs lg:max-w-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
        >
            <div className="aspect-square bg-neutral-900 rounded-full flex items-center justify-center p-4 shadow-xl shadow-purple-900/50">
                <Image
                    src={SocialImage}
                    alt="Mobile App"
                    className="w-full h-auto rounded-lg" 
                    priority
                />
            </div>
        </motion.div>
    );
};

// --- Framer Motion Variants ---

// Container for staggered text and list
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Stagger items by 0.1s
            delayChildren: 0.2,
        },
    },
};

// Item variant for list items and paragraphs
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 100 },
    },
};


export default function FooterCompact() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 }); // Trigger animation when 30% of section is visible

    return (
        <footer ref={ref} className="w-full bg-black text-white border-t border-gray-800">
            <section className="container mx-auto px-4 md:px-8 xl:px-20 py-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    
                    {/* LEFT: Mobile App Image (Animated) */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-start order-2 lg:order-1">
                        <MobileAppImageExtraSmall />
                    </div>
                    
                    {/* RIGHT: Text Content & Features (Staggered Animation) */}
                    <motion.div 
                        className="w-full lg:w-1/2 order-1 lg:order-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        {/* Title */}
                        <motion.h2 
                            className="text-2xl sm:text-3xl font-extrabold mb-3 text-green-400"
                            variants={itemVariants}
                        >
                            Bionz Trading
                        </motion.h2>
                        
                        {/* Description */}
                        <motion.p 
                            className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed"
                            variants={itemVariants}
                        >
                            Bionz Signal App helps you trade smarter with accurate crypto
                            signals, real-time news, tips videos, a profit
                            calculator, and a personalized trading plan based on your
                            starting capital.
                        </motion.p>

                        {/* Feature List */}
                        <motion.ul 
                            className="text-sm sm:text-base space-y-2 list-none"
                            variants={containerVariants}
                        >
                            {[
                                "Real Time News",
                                "Spot And Future Trading Signals",
                                "Profit/Loss Calculator",
                                "Trading Plan For You",
                                "Manage Your Loss And Profit",
                            ].map((item, index) => (
                                <motion.li
                                    key={index}
                                    className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-green-400 before:font-extrabold"
                                    variants={itemVariants}
                                >
                                    {item}
                                </motion.li>
                            ))}
                        </motion.ul>

                        {/* App Download Buttons */}
                        <motion.div 
                            className="flex space-x-3 sm:space-x-4 mt-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-transform hover:scale-105"
                            >
                                <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                    alt="Get it on Google Play"
                                    width={150} 
                                    height={50} 
                                    className="h-8 sm:h-10 w-auto" 
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
                                    width={150} 
                                    height={50}
                                    className="h-8 sm:h-10 w-auto" 
                                />
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </footer>
    );
}