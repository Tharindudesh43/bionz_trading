"use client"; // Required for using React Hooks (useState, createContext) in Next.js App Router

import React, { createContext, useContext, useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from "@/src/store/userSlice";
import { AppDispatch } from '@/src/store/store';

// --- SVG Icons (Inline replacements for external icon libraries) ---
// Menu Icon for opening the sidebar
const MenuIcon = ({ size = 24, color = "currentColor", stroke = 1.5 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-menu-2"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth={stroke}
    stroke={color}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 6l16 0" />
    <path d="M4 12l16 0" />
    <path d="M4 18l16 0" />
  </svg>
);

// Close Icon for closing the sidebar
const CloseIcon = ({ size = 24, color = "currentColor", stroke = 1.5 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-x"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth={stroke}
    stroke={color}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </svg>
);


// --- 1. Sidebar Context ---
type SidebarContextType = { isOpen: boolean; toggleSidebar: () => void };
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
// --- 2. Sidebar Provider (State Management) ---
const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // On desktop (md: and up), the sidebar is always visible, so isOpen state primarily controls mobile overlay.
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// --- 3. Sidebar Trigger (Mobile-Only Button) ---
const SidebarTrigger = () => {
  const { toggleSidebar, isOpen } = useSidebar();
  
  return (
    // md:hidden: This hides the button on desktop/medium screens and up.
    <button
      onClick={toggleSidebar}
      className="fixed bottom-4 left-4 z-50 p-2 rounded-full bg-gray-900 text-white shadow-lg 
                 hover:bg-gray-700 transition duration-300 md:hidden"
      aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
    >
      {/* Icon switches between close (X) and menu icon */}
      {isOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
    </button>
  );
};

// --- 4. App Sidebar (Dual-Mode Panel with Internal Scrolling) ---
const AppSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  
  // Create a dummy list of 20 items to demonstrate scrolling
  const navItems = Array.from({ length: 5 }, (_, i) => ({
    name: `Course ${i + 1}`,
    key: `course-${i + 1}`
  }));

  return (
    <>
      {/* Mobile Overlay: Darkens the screen when sidebar is open on mobile only */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />
      
      {/* Sidebar Panel */}
      <aside
        className={`
          // Common styles for both modes
          w-64 h-screen bg-gray-100 shadow-2xl z-40 fixe transition-all duration-300 ease-in-out
          overflow-y-auto // KEY FIX: Allows the content inside to scroll if it exceeds screen height
          
          // Mobile Mode (Default/Small Screens): Fixed position, slides in/out
          fixed top-0 left-0 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          
          // Desktop Mode (md: and up): Static column, no translation needed
          md:relative md:translate-x-0 md:flex-shrink-0
        `}
      >
        <div className="p-6">
          <h2 className="text-2xl font-extrabold text-indigo-600 mb-6">App Dashboard</h2>
          <nav className="space-y-3">
            {navItems.map((item) => (
              <a 
                key={item.key} 
                href="#" 
                className="flex items-center p-3 text-gray-700 font-medium hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition duration-150"
                onClick={toggleSidebar} // Close sidebar on mobile after selection
              >
                {/* Placeholder for icons */}
                <span className="w-5 h-5 mr-3 bg-indigo-300/50 rounded-sm"></span>
                {item.name}
              </a>
            ))}
          </nav>
          
          {/* Add extra padding at the bottom to ensure the last link is clearly visible when scrolled */}
          <div className="h-10"></div>
        </div>
      </aside>
    </>
  );
};

// --- 5. Main Courses Component ---
export default function Courses() {

  //  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   // Set current page to "dashboard" when this page mounts
  //   dispatch(setCurrentPage("dashboard"));
  // }, []);



  return (
    <div className="flex flex-row min bg-white overflow-hidden">
      <SidebarProvider>
        {/* The Trigger button (mobile only) */}
        <SidebarTrigger />
        
        {/* The Sidebar panel (Folded on desktop, Unfolded/Overlay on mobile) */}
        <AppSidebar />
        
        {/* Main Content Area: Takes up remaining space */}
        <main className="flex flex-row h-screen w-screen bg-white overflow-auto">
          <div className="h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl md:text-7xl font-extrabold text-amber-600 mb-6 tracking-tight">
              Courses Content
            </h1>
            <p className="text-xl text-gray-700 max-w-lg">
              On desktop, the sidebar is **always visible (folded)** and is internally scrollable. On mobile, the sidebar is hidden until you click the top-left button.
            </p>
            {/* Added extra content to demonstrate main content scrolling */}
            <div className="mt-12 space-y-4 text-left w-full max-w-lg">
              <h2 className="text-3xl font-bold text-gray-800">Long Scrolling Area Check</h2>
              <p>This main content area can scroll independently of the sidebar. Try scrolling down to see the footer content.</p>
              {Array.from({ length: 50 }, (_, i) => (
                <p key={i} className="text-sm text-gray-500">Main Content Placeholder Line {i + 1}</p>
              ))}
              <div className="text-center py-10 text-gray-400">--- End of Scrollable Content ---</div>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}