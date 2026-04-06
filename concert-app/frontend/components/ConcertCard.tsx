"use client";

import { useState } from "react";
import { api } from "../lib/api";

interface Props {
  concert: any;
  reservation: any;
  userId: number;
  onUpdate: () => void;
}

export default function ConcertCard({
  concert,
  reservation,
  userId,
  onUpdate,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableSeats = concert.totalSeats - concert._count.reservations;
  const isFull = availableSeats <= 0;

  const handleReserve = async () => {
    setLoading(true);
    setError("");
    try {
      await api.createReservation({ userId, concertId: concert.id });
      onUpdate();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    setError("");
    try {
      await api.cancelReservation(reservation.id);
      onUpdate();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

        {reservation ? (
          <button
            onClick={handleCancel}
            disabled={loading}
            className="bg-red-400 hover:bg-red-500 text-white px-8 py-2 rounded text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? "Cancelling..." : "Cancel"}
          </button>
        ) : isFull ? (
          <button
            disabled
            className="bg-gray-200 text-gray-400 px-8 py-2 rounded text-sm font-medium cursor-not-allowed"
          >
            Sold Out
          </button>
        ) : (
          <button
            onClick={handleReserve}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? "Reserving..." : "Reserve"}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
    </div>
  );
}
