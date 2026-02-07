"use client";

import { clearUser } from "@/src/store/userSlice";
import axios from "axios";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiBarChart2,
  FiBookOpen,
  FiSettings,
  FiMenu,
  FiX,
  FiUser,
  FiGitPullRequest,
} from "react-icons/fi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { useDispatch } from "react-redux";

const SIDEBAR_BG = "bg-gray-900 border-r border-gray-800";
const ACTIVE_LINK_STYLE = "bg-blue-600 text-white shadow-lg shadow-blue-500/50";
const INACTIVE_LINK_STYLE = "text-gray-400 hover:bg-gray-800 hover:text-white";

const AdminTitle = ({ isOpen }: { isOpen: boolean }) => (
  <span
    className={`text-xl font-black text-blue-500 transition-all duration-300 ${
      isOpen ? "opacity-100 block" : "opacity-0 hidden"
    }`}
  >
    BIONZ
  </span>
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const links = [
    { name: "Signals", href: "/admin/signals", icon: <FiBarChart2 /> },
    {
      name: "Analyzes",
      href: "/admin/analyzes",
      icon: <HiOutlineDocumentReport />,
    },
    { name: "User Management", href: "/admin/users", icon: <FiUser /> },
    { name: "Courses", href: "/admin/courses", icon: <FiBookOpen /> },
    { name: "Payments", href: "/admin/payments", icon: <FiGitPullRequest /> },
  ];

  useEffect(() => {
    const handleResize = () => {
      const isMd = window.innerWidth >= 768;
      setIsLargeScreen(isMd);
      setIsSidebarOpen(isMd);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/sign-out").then(() => {
        dispatch(clearUser());
        router.push("/authentication");
        router.refresh();
      });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleLinkClick = () => {
    if (!isLargeScreen) setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-sans">
      {!isLargeScreen && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out flex flex-col ${SIDEBAR_BG}
          ${
            isLargeScreen
              ? isSidebarOpen
                ? "w-64"
                : "w-20"
              : isSidebarOpen
              ? "w-72"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800">
          <AdminTitle isOpen={isSidebarOpen || !isLargeScreen} />

          <button
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isLargeScreen ? <FiMenu size={20} /> : <FiX size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-4 py-3 px-3 rounded-xl text-sm font-semibold transition-all duration-200 group
                  ${isActive ? ACTIVE_LINK_STYLE : INACTIVE_LINK_STYLE}
                  ${!isSidebarOpen && isLargeScreen ? "justify-center" : ""}
                `}
              >
                <span className="text-xl shrink-0">{link.icon}</span>
                <span
                  className={`transition-all duration-300 whitespace-nowrap overflow-hidden
                  ${
                    isLargeScreen
                      ? isSidebarOpen
                        ? "opacity-100 w-auto"
                        : "opacity-0 w-0"
                      : "opacity-100 w-auto"
                  }
                `}
                >
                  {link.name}
                </span>

                {!isSidebarOpen && isLargeScreen && (
                  <div className="absolute left-20 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    {link.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 eborder-t border-gray-800 space-y-4">
          <div
            className={`flex items-center gap-3 ${
              !isSidebarOpen && isLargeScreen ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center font-bold text-xs text-white">
              A
            </div>
            {(isSidebarOpen || !isLargeScreen) && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">Admin User</p>
                <p className="text-[10px] text-gray-500 truncate">
                  bionztrading.com
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`cursor-pointer flex items-center gap-4 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 group border border-transparent
              ${
                !isSidebarOpen && isLargeScreen
                  ? "justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                  : "px-3 text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20"
              }
            `}
          >
            <span className="text-xl shrink-0">
              <LogOut className="" />
            </span>

            {(isSidebarOpen || !isLargeScreen) && (
              <span className="whitespace-nowrap">Logout</span>
            )}

            {!isSidebarOpen && isLargeScreen && (
              <div className="absolute left-20 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out
        ${isLargeScreen ? (isSidebarOpen ? "pl-64" : "pl-20") : "pl-0"}
      `}
      >
        <header className="sticky top-0 h-16 bg-gray-900/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 md:hidden z-30">
          <button
            className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FiMenu size={22} />
          </button>
          <span className="text-sm font-bold tracking-widest text-blue-500 uppercase">
            Bionz Admin
          </span>
        </header>

        <main className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
