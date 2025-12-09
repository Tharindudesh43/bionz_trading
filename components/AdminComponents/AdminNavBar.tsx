"use client";

import React, { useState } from "react";

const pages = [
  { id: "signal", label: "Signal" },
  { id: "home", label: "Home" },
  { id: "analyze", label: "Analyze" },
  { id: "profile", label: "Profile Settings" },
];

export default function AdminNavBar({
  onPageChange,
}: {
  onPageChange: (pageId: string) => void;
}) {
  const [activePage, setActivePage] = useState("analyze");

  const handleClick = (pageId: string) => {
    setActivePage(pageId);
    onPageChange(pageId); // ⬅⬅ trigger parent page change
  };

  return (
    <nav className="fixed top-16 w-full bg-gray-900 text-white shadow-md z-40">
      <ul className="flex justify-center items-center gap-2 p-2 max-md:flex-col max-md:gap-1">
        {pages.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => handleClick(p.id)}
              className={`p-2 text-sm rounded transition ${
                activePage === p.id ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
            >
              {p.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
