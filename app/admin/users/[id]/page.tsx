"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { UserModel } from "@/types/user_models";
import {
  ChevronLeft,
  ExternalLink,
  CreditCard,
  User as UserIcon,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);

  // States for the Activation Logic
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [feeType, setFeeType] = useState<"course" | "signal">("signal");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(
          `/api/admin/getUserById?uid=${params.id}`
        );
        if (response.data.success) {
          setUser(response.data.user);
          setSelectedPlan(response.data.user.plan || "free");
        }
      } catch (err) {
        console.error("Error fetching user");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [params.id]);

  const handleUpdatePlan = async () => {
    setIsUpdating(true);
    try {
      const response = await axios.post("/api/admin/updateUserPlan", {
        uid: params.id,
        plan: selectedPlan,
        feeType,
        courseName: feeType === "course" ? selectedCourse : null,
      });
      if (response.data.success) alert("User Plan Updated Successfully!");
    } catch (err) {
      alert("Failed to update plan");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-500 font-black tracking-widest uppercase text-xs">
        Loading Profile...
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-rose-500">
        User Not Found
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-gray-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/admin/users")}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-xs font-black uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Back to Directory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
                <div className="flex items-center gap-5 min-w-0 w-full">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-2xl font-black shrink-0">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1
                      className="text-2xl font-black tracking-tighter uppercase truncate"
                      title={user.username || "Guest"}
                    >
                      {user.username || "Guest"}
                    </h1>
                    <p
                      className="text-gray-500 text-sm font-medium truncate hover:text-gray-300 transition-colors cursor-help"
                      title={user.email}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-t border-white/5">
                <div className="space-y-1 min-w-0">
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                    User UID
                  </p>
                  <p className="text-xs font-mono text-gray-400 truncate bg-white/5 px-2 py-1 rounded-md border border-white/5">
                    {user.uid}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                    Joined On
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <Calendar size={12} className="text-gray-600" />
                    {user.createdAt
                      ? new Date(user.createdAt.toString()).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/20">
              <ShieldCheck size={32} className="mb-4 opacity-50" />
              <h2 className="text-xl font-black uppercase tracking-tighter leading-tight">
                Admin
                <br />
                Authorization
              </h2>
              <p className="text-blue-200 text-xs mt-2 font-medium">
                Review payment and update access tier.
              </p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-6">
              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-3 ml-1">
                  Fee Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFeeType("signal")}
                    className={`py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border ${
                      feeType === "signal"
                        ? "bg-white text-black border-white"
                        : "border-white/10 text-gray-500 hover:border-white/30"
                    }`}
                  >
                    Signals Fee
                  </button>
                  <button
                    onClick={() => setFeeType("course")}
                    className={`py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border ${
                      feeType === "course"
                        ? "bg-white text-black border-white"
                        : "border-white/10 text-gray-500 hover:border-white/30"
                    }`}
                  >
                    Course Fee
                  </button>
                </div>
              </div>

              {feeType === "course" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-3 ml-1">
                    Select Course
                  </label>
                  <select
                    className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-blue-500"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="">Select Course...</option>
                    <option value="crypto_pro">Crypto Mastery Pro</option>
                    <option value="forex_intro">Forex Introduction</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-3 ml-1">
                  Target Plan
                </label>
                <select
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-emerald-500/50"
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="free">Free Tier</option>
                  <option value="pro">Pro Membership</option>
                </select>
              </div>

              <button
                onClick={handleUpdatePlan}
                disabled={isUpdating}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isUpdating ? "Updating..." : "Activate Access"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
