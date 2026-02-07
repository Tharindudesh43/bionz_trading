"use client";

import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
// import { useSearchParams } from "next/navigation";

type CourseItem = {
  collection_id: string;
  title: string;
  price?: number;
};

export default function Payments({ uid, email }: { uid: string; email: string }) {
  const [selectedOption, setSelectedOption] = useState<
    "pro" | "course" | "book"
  >("pro");

  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  // const searchParams = useSearchParams();
  const [slipFile, setSlipFile] = React.useState<File | null>(null);
  const [slipPreview, setSlipPreview] = React.useState<string>("");
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [note, setNote] = React.useState("");
  const [paymentLoading, setPaymentLoading] = React.useState<any>(null);
  const [bookShippingAddress, setBookShippingAddress] = React.useState("");
  const [bookname, setBookname] = React.useState("");

  // const uid = searchParams.get("uid");
  // const email = searchParams.get("email");

  const selectedCourse = useMemo(
    () => courses.find((c) => c.collection_id === selectedCourseId),
    [courses, selectedCourseId],
  );

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);

        const res = await axios.get("/api/getCourses");
        const json = res.data;

        if (res.status !== 200 || !json?.success) {
          throw new Error(json?.message || "Failed to fetch courses");
        }

        const list: CourseItem[] = (json.data || []).map((c: any) => ({
          id: c.id,
          title: c.title ?? "Untitled Course",
          price: c.price ?? 0,
          currency: c.currency ?? "",
          collection_id: c.collection_id ?? c.id,
        }));

        setCourses(list);

        if (list.length > 0) setSelectedCourseId(list[0].collection_id);
        else setSelectedCourseId("");
      } catch (e) {
        console.error("Failed to load courses:", e);
        setCourses([]);
        setSelectedCourseId("");
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleContinue = async () => {
    console.log("Continuing with option:", selectedOption);
    setPaymentLoading(true);
    if (!slipFile) {
      alert("Please upload a payment slip.");
      setPaymentLoading(false);
      return;
    } else {
      try {
        if (selectedOption === "course") {
          const formData = new FormData();
          formData.append("uid", uid || "");
          formData.append("email", email || "");
          formData.append("selectedOption", "course");
          formData.append("selectedCourseId", selectedCourseId);
          if (slipFile) formData.append("slipFile", slipFile);
          formData.append("note", note);

          const res = await axios.post("/api/addpayment", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (res.status == 400 || res.data.message == "Image is required") {
            throw new Error(res.data?.message || "Image is required");
          } else if (res.status === 200 && res.data?.success) {
            setPaymentLoading(false);
          }
        } else if (selectedOption === "pro") {
          const formData = new FormData();
          formData.append("uid", uid || "");
          formData.append("email", email || "");
          formData.append("selectedOption", "pro");
          if (slipFile) formData.append("slipFile", slipFile);
          formData.append("note", note);
          const res = await axios.post("/api/addpayment", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (res.status !== 200 || !res.data?.success) {
            throw new Error(res.data?.message || "Payment initiation failed");
          } else if (res.status === 200 && res.data?.success) {
            setPaymentLoading(false);
          }
        } else if (selectedOption === "book") {
          const formData = new FormData();
          formData.append("uid", uid || "");
          formData.append("email", email || "");
          formData.append("selectedOption", "book");
          if (slipFile) formData.append("slipFile", slipFile);
          formData.append("note", note);
          formData.append("bookShippingAddress", bookShippingAddress);
          formData.append("bookname", bookname);
          const res = await axios.post("/api/addpayment", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (res.status !== 200 || !res.data?.success) {
            throw new Error(res.data?.message || "Payment initiation failed");
          } else if (res.status === 200 && res.data?.success) {
            setPaymentLoading(false);
          }
        }
      } catch (err) {
        console.error("Payment error:", err);
      } finally {
        setPaymentLoading(false);
      }
    }
  };

  const onSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      alert("Only image files are allowed!");
      e.target.value = "";
      return;
    }

    setSlipFile(f);
    setSlipPreview(URL.createObjectURL(f));
  };

  if (!uid || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-lg font-semibold text-gray-900">Access Denied</p>
          <p className="mt-2 text-sm text-gray-600">
            Payment page link is invalid. Please open the correct link from the
            app.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-white px-4 py-23 text-gray-900 dark:bg-gray-900 dark:text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h4 className="text-3xl font-bold sm:text-4xl">Payments</h4>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            Choose what you want to activate:{" "}
            <span className="font-semibold">Signal Pro Plan</span> or a{" "}
            <span className="font-semibold">Course</span>.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Option 1: Signal Pro */}
          <button
            type="button"
            onClick={() => setSelectedOption("pro")}
            className={[
              "text-left rounded-3xl border p-5 shadow-sm transition hover:shadow-md",
              selectedOption === "pro"
                ? "border-emerald-300 bg-gradient-to-r from-white via-emerald-50 to-emerald-100 dark:from-gray-900 dark:via-emerald-950/30 dark:to-emerald-950/50"
                : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300"></p>
                <h3 className="mt-1 text-xl font-bold">Signal Pro Plan</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Unlock all trading signals, view full history, and remove
                  locked/blur cards.
                </p>

                <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Access all signals (no limits)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Full performance & outcomes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Priority updates
                  </li>
                </ul>
              </div>

              <div
                className={[
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  selectedOption === "pro"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
                ].join(" ")}
              >
                {selectedOption === "pro" ? "Selected" : "Select"}
              </div>
            </div>
          </button>

          {/* Option 2: Books Buy */}
          <button
            type="button"
            onClick={() => setSelectedOption("book")}
            className={[
              "text-left rounded-3xl border p-5 shadow-sm transition hover:shadow-md",
              selectedOption === "book"
                ? "border-red-300 bg-gradient-to-r from-white via-red-50 to-red-100 dark:from-gray-900 dark:via-red-950/30 dark:to-red-950/50"
                : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-red-700 dark:text-red-300"></p>
                <h3 className="mt-1 text-xl font-bold">Buy a Book</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Choose a book and we will deliver it to your home address
                  after payment confirmation.
                </p>

                <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Delivered to your home address
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    You will receive delivery updates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Payment verification before shipping
                  </li>
                </ul>
              </div>

              <div
                className={[
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  selectedOption === "book"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
                ].join(" ")}
              >
                {selectedOption === "book" ? "Selected" : "Select"}
              </div>
            </div>
          </button>

          {/* Option 3: Course */}
          <button
            type="button"
            onClick={() => setSelectedOption("course")}
            className={[
              "text-left rounded-3xl border p-5 shadow-sm transition hover:shadow-md",
              selectedOption === "course"
                ? "border-indigo-300 bg-gradient-to-r from-white via-indigo-50 to-indigo-100 dark:from-gray-900 dark:via-indigo-950/30 dark:to-indigo-950/50"
                : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-full">
                <h3 className="mt-1 text-xl font-bold">Course</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Pick a course and continue to payment.
                </p>

                {/* Course selector */}
                <div className="mt-4">
                  <label className="mb-2 block text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Select Course
                  </label>

                  {coursesLoading ? (
                    <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                      Loading courses...
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                      No courses found.
                    </div>
                  ) : (
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900"
                    >
                      {courses.map((c) => (
                        <option key={c.collection_id} value={c.collection_id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Small preview */}
                  {selectedCourse && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">
                      Selected:{" "}
                      <span className="font-semibold">
                        {selectedCourse.title}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div
                className={[
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  selectedOption === "course"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
                ].join(" ")}
              >
                {selectedOption === "course" ? "Selected" : "Select"}
              </div>
            </div>
          </button>
        </div>
        {/* ✅ Payment slip upload box */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Attach Payment Slip
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
            Upload your bank slip / screenshot (JPG, PNG, PDF).
          </p>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={onSlipChange}
                className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 ring-1 ring-gray-100 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
              />

              {selectedOption == "book" ? (
                <div>
                  <input
                    type="text"
                    value={bookShippingAddress}
                    onChange={(e) => setBookShippingAddress(e.target.value)}
                    placeholder="Shipping address"
                    className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950"
                  />
                  <input
                    type="text"
                    value={bookname}
                    onChange={(e) => setBookname(e.target.value)}
                    placeholder="Book name"
                    className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950"
                  />
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Optional note (transaction id, bank name, etc.)"
                    className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950"
                    rows={3}
                  />
                </div>
              ) : (
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional note (transaction id, bank name, etc.)"
                  className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950"
                  rows={3}
                />
              )}

              {uploading ? (
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-2 rounded-full bg-gray-900 dark:bg-white"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {progress}% uploading...
                  </p>
                </div>
              ) : null}
            </div>

            {/* Preview */}
            <div className="w-full sm:w-64">
              <div className="overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                {slipPreview ? (
                  <img
                    src={slipPreview}
                    alt="Slip preview"
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center text-xs text-gray-500">
                    {slipFile?.type === "application/pdf"
                      ? "PDF attached ✅"
                      : "No preview"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Continue button */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700 sm:flex-row">
          <p className="text-sm text-gray-600 dark:text-gray-200">
            {selectedOption === "pro"
              ? "You selected Signal Pro Plan."
              : "You selected Course payment."}
          </p>

          <button
            onClick={handleContinue}
            disabled={paymentLoading}
            className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 sm:w-auto"
          >
            {paymentLoading ? "Processing..." : "Continue to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
