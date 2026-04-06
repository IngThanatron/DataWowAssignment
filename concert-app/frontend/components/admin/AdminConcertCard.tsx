"use client";

import { useState } from "react";
import { api } from "../../lib/api";

interface Props {
  concert: any;
  onUpdate: () => void;
}

export default function AdminConcertCard({ concert, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${concert.name}"?`)) return;
    setLoading(true);
    try {
      await api.deleteConcert(concert.id);
      onUpdate();
    } catch (err) {
      alert("Failed to delete concert");
    } finally {
      setLoading(false);
    }
  };

  const availableSeats = concert.totalSeats - concert._count.reservations;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-blue-500">{concert.name}</h2>
      <hr className="my-4 border-gray-200" />
      <p className="text-gray-700 text-sm leading-relaxed">
        {concert.description}
      </p>
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{availableSeats.toLocaleString()}</span>
        </div>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="flex items-center gap-2 bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded text-sm font-medium disabled:opacity-50 transition-colors"
        >
          🗑 {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
