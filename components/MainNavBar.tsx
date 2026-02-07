"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LargeNavbarIcon from "@/src/NavbarIcon(Large).png";
import SmallNavbarIcon from "@/src/NavbarIcon(Small).png";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, setUser } from "@/src/store/userSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Menu, X, User2Icon } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "MarketCap", href: "/marketcap" },
  { name: "News", href: "/news" },
  { name: "Tips", href: "/tips" },
  { name: "Signals", href: "/signals" },
  { name: "Analyze", href: "/analyze" },
  { name: "Books", href: "/books" },
];

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentUser, loading } = useSelector((state: any) => state.user);

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      
      console.log("Auth API Response:", data);

      if (data.loggedIn && data.user) {
        dispatch(setUser(data.user));
      } else {
        dispatch(clearUser());
      }
    } catch (error) {
      console.error("Auth Watcher Error:", error);
      dispatch(clearUser());
    }
  };
  checkAuth();
}, [dispatch]);

  const bgColor = "bg-neutral-800";
  const linkStyle =
    "text-sm text-white relative transition-all duration-300 hover:text-gray-300 hover:scale-[1.06]";

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

  return (
    <nav
      className={`fixed top-0 w-full ${bgColor} z-50 border-b border-gray-700 shadow-lg`}
    >
      <div className="container px-3 py-3 mx-auto sm:px-3 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex">
            <Image
              className="w-12 h-13 text-white lg:hidden"
              src={SmallNavbarIcon}
              alt="Logo"
              priority
            />
            <Image
              src={LargeNavbarIcon}
              className="w-24 h-6 sm:w-28 sm:h-7 object-contain hidden lg:block"
              alt="Logo"
              priority
            />
          </div>

          <div className="hidden space-x-6 sm:flex sm:items-center m-4">
            {navItems.map((item) => (
              <a key={item.name} href={item.href} className={linkStyle}>
                {item.name}
              </a>
            ))}
            {currentUser?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-1 text-sm text-blue-400 font-bold hover:scale-[1.06] transition-all"
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth Section (Modern Look) */}
          <div className="hidden sm:block min-w-[120px]">
            {loading ? (
              <div className="flex items-center justify-end gap-3">
                <div className="flex flex-col items-end">
                  <div className="h-2 w-16 bg-gray-700 animate-pulse rounded mb-1"></div>
                  <div className="h-3 w-20 bg-gray-600 animate-pulse rounded"></div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gray-700 animate-pulse flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            ) : currentUser ? (
              <div className="flex items-center gap-4">
                {/* <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter leading-none">
                    Welcome back,
                  </span>
                  <span className="text-sm text-white font-bold leading-tight">
                    {currentUser.username || currentUser.email?.split("@")[0]}
                  </span>
                </div> */}
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-inner">
                  <span className="text-neutral-800 font-black text-sm uppercase">
                    {currentUser.username?.[0] || currentUser.email?.[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 text-xs text-red-500 border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg shadow-red-900/20 active:scale-95 cursor-pointer"
                >
                  <LogOut
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            ) : (
              <Link
                href="/authentication"
                className="text-sm font-bold text-white bg-blue-600 px-6 py-2.5 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white rounded-md"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`sm:hidden transition-all duration-500 ease-in-out overflow-hidden ${bgColor} ${
          isOpen
            ? "max-h-[500px] opacity-100 py-3 border-t border-gray-700"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-4 space-y-1">
          {/* Mobile User Info */}
          {currentUser && (
            <div className="py-1 border-b border-gray-700/50 mb-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                Logged in as
              </p>
              <p className="text-white font-bold">
                {currentUser.username || currentUser.email}
              </p>
            </div>
          )}

          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block py-2 text-base font-medium text-white hover:text-gray-300 transition-all"
            >
              {item.name}
            </a>
          ))}

          {currentUser?.role === "admin" && (
            <Link
              href="/admin"
              className="block py-2 text-base font-bold text-blue-400"
            >
              Admin Panel
            </Link>
          )}

          <div className="pt-4 pb-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-6 h-6 mb-2"></div>
                <p className="text-gray-500 font-bold uppercase tracking-tighter text-xs">
                  Syncing Permissions...
                </p>
              </div>
            ) : (
              !loading &&
              (currentUser ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 cursor-pointer bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 rounded-xl transition-all font-bold"
                >
                  <LogOut size={18} /> Logout
                </button>
              ) : (
                <Link
                  href="/authentication"
                  className="block w-full py-3 text-center text-white bg-blue-600 rounded-xl font-bold"
                >
                  Sign in
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
