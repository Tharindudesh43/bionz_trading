"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiHome, FiBarChart2, FiSettings, FiMenu, FiX, FiUser } from "react-icons/fi"; // Added FiX for close icon
import { HiOutlineDocumentReport } from "react-icons/hi";

// Tailwind classes for the sidebar background and link colors
const SIDEBAR_BG = "bg-gray-900 border-r border-gray-800";
const ACTIVE_LINK_STYLE = "bg-blue-600 text-white shadow-lg shadow-blue-500/50";
const INACTIVE_LINK_STYLE = "text-gray-400 hover:bg-gray-800 hover:text-white";

// Helper component for the Admin Logo/Title
const AdminTitle = ({ isOpen }: { isOpen: boolean }) => (
  <span 
    className={`text-2xl font-extrabold text-blue-400 transition-all duration-300 overflow-hidden whitespace-nowrap 
    ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
  >
    Bionz Admin
  </span>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // On large screens (md), the sidebar is initially open (true).
  // On small screens (default), the sidebar is initially closed (false) to act as a drawer.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const links = [
    { name: "Home", href: "/admin", icon: <FiHome /> },
    { name: "Signals", href: "/admin/signals", icon: <FiBarChart2 /> },
    { name: "Analyzes", href: "/admin/analyzes", icon: <HiOutlineDocumentReport /> },
    { name: "User Management", href: "/admin/users", icon: <FiUser /> },
    { name: "Settings", href: "/admin/settings", icon: <FiSettings /> },
  ];

  // Logic to handle screen size change (for desktop vs mobile behavior)
  useEffect(() => {
    const handleResize = () => {
      const isMd = window.innerWidth >= 768;
      setIsLargeScreen(isMd);
      // If resizing to a large screen, always open the sidebar
      if (isMd) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to close sidebar on link click (important for mobile drawer)
  const handleLinkClick = () => {
    if (!isLargeScreen) {
        setIsSidebarOpen(false);
    }
  };

  const sidebarWidth = isLargeScreen ? (isSidebarOpen ? "w-64" : "w-20") : "w-64";
  const mainContentMl = isLargeScreen ? (isSidebarOpen ? "ml-64" : "ml-20") : "ml-0";
  const drawerTransform = isSidebarOpen && !isLargeScreen ? "translate-x-0" : "-translate-x-full";

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">

      {/* --- Mobile Drawer Overlay (Only visible on small screens when open) --- */}
      {isSidebarOpen && !isLargeScreen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- Sidebar / Drawer --- */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 flex flex-col 
          ${SIDEBAR_BG} ${sidebarWidth} ${!isLargeScreen ? drawerTransform : ''}`}
      >
        
        {/* Header and Toggle Button */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-800">
          <AdminTitle isOpen={isSidebarOpen} />
          
          {/* Toggle button for desktop (to minimize) */}
          {isLargeScreen && (
            <button
              className="p-1 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FiMenu size={24} />
            </button>
          )}

          {/* Close button for mobile (to close drawer) */}
          {!isLargeScreen && (
            <button
              className="p-1 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiX size={24} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-6 space-y-2">
          {links.map((link) => {
            const active = pathname === link.href;
            const style = active ? ACTIVE_LINK_STYLE : INACTIVE_LINK_STYLE;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-4 py-3 px-4 mx-3 rounded-lg text-sm font-medium transition-all duration-200 
                  ${style} ${!isSidebarOpen && isLargeScreen ? "justify-center" : ""}`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className={`transition-opacity duration-300 whitespace-nowrap overflow-hidden 
                  ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0"}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>
        
        {/* Footer Placeholder for extra space/info */}
        <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-600">
            {isSidebarOpen ? '© Bionz 2025' : '...'}
        </div>
      </aside>

      {/* --- Main content area --- */}
      <main
        className={`flex-1 transition-all duration-300 min-h-screen ${mainContentMl}`}
      >
        {/* Top Header/Navbar for mobile screen (containing the menu button) */}
        <header className={`sticky top-0 h-16 ${SIDEBAR_BG} border-b border-gray-800 flex items-center p-4 md:hidden z-10`}>
             <button
                className="text-gray-400 hover:text-white"
                onClick={() => setIsSidebarOpen(true)}
            >
                <FiMenu size={24} />
            </button>
            <span className="ml-4 text-lg font-semibold text-white">Dashboard</span>
        </header>

        {/* Content Wrapper */}
        <div className="p-4 sm:p-6 md:p-8 ">
            {children}
        </div>
      </main>
    </div>
  );
}