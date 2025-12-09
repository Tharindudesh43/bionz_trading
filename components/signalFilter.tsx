"use client";

import { useState } from "react";

export default function SignalFilter({ onFilter }: { onFilter: (date: string) => void }) {
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <div className="w-full flex items-center justify-between bg-white shadow p-3 rounded-lg mb-3">
      <div className="flex items-center gap-2">
        <label className="text-gray-600 text-sm font-medium">Filter by Date:</label>

        <input
          type="date"
          className="border rounded-md px-2 py-1 text-sm outline-none"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 transition"
        onClick={() => onFilter(selectedDate)}
      >
        Apply
      </button>
    </div>
  );
}
