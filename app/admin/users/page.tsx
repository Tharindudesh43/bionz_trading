"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { UserModel } from "@/types/user_models";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  ChevronRight,
  AtSign,
  ChevronLeft,
  Layers,
} from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [emailSearch, setEmailSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/getUsers");
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error("Fetch Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 1. Filter by Email
  const filteredUsers = users.filter(
    (user) =>
      user.role !== "admin" &&
      user.email?.toLowerCase().includes(emailSearch.toLowerCase())
  );

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Search */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2 flex items-center gap-3">
              <span className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                <Shield size={24} />
              </span>
              User Directory
            </h1>
            <div className="relative max-w-md mt-6 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                <AtSign size={18} />
              </div>
              <input
                type="email"
                placeholder="Search Email..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-sm"
                value={emailSearch}
                onChange={(e) => {
                  setEmailSearch(e.target.value);
                  setCurrentPage(1); 
                }}
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
            <Layers size={14} className="text-gray-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Total: {filteredUsers.length} Users
            </span>
          </div>
        </div>

        {/* User List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center animate-pulse text-xs font-black uppercase tracking-[0.3em] text-gray-600">
              Loading Database...
            </div>
          ) : (
            <>
              {currentUsers.map((user) => (
                <Link
                  href={`/admin/users/${user.uid}`}
                  key={user.uid}
                  className="group bg-black/40 hover:bg-white/[0.03] border border-white/10 rounded-2xl p-4 transition-all block shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                        {user.username?.charAt(0).toUpperCase() || (
                          <User size={18} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm truncate uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                          {user.username || "Guest User"}
                        </h3>
                        <p className="text-[11px] text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* <div className="flex items-center gap-6">
                      <div className="hidden sm:block text-right">
                        <p className="text-[9px] font-black text-gray-600 uppercase mb-0.5">
                          Plan Status
                        </p>
                        <span
                          className={`text-[10px] font-bold ${
                            user.plan === "pro"
                              ? "text-emerald-500"
                              : "text-gray-400"
                          }`}
                        >
                          {user.plan?.toUpperCase() || "FREE"}
                        </span>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-gray-700 group-hover:text-blue-500 transition-colors"
                      />
                    </div> */}
                  </div>
                </Link>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-blue-600 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex items-center gap-1 mx-4">
                    <span className="text-sm font-black text-blue-500">
                      {currentPage}
                    </span>
                    <span className="text-sm font-bold text-gray-600">/</span>
                    <span className="text-sm font-bold text-gray-600">
                      {totalPages}
                    </span>
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-blue-600 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
