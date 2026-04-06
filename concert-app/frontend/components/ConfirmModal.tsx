"use client";

import { useEffect } from "react";

interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}: Props) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    // Backdrop — click outside to close
    <div
      className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center"
      onClick={onCancel}
    >
      {/* Modal — stop click from bubbling to backdrop */}
      <div
        className="bg-white rounded-xl p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-4 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-xl font-bold">
          ✕
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-gray-600 text-sm mt-1">{message}</p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
