"use client";
import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
};

export default function AnalyzePopUP({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 shadow-lg animate-fadeIn">
        <h2 className="text-lg font-semibold mb-3 text-black">{title}</h2>
        <div className="mb-4  text-black">{children}</div>

        <button
          onClick={onClose}
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
