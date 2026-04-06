"use client";

import { useEffect } from "react";

interface Props {
  message?: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    message && (
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
          type === "success" ? "bg-emerald-500" : "bg-red-500"
        }`}
      >
        <span>{type === "success" ? "✓" : "✕"}</span>
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
          ✕
        </button>
      </div>
    )
  );
}
