"use client";

import { useState } from "react";
import { api } from "../lib/api";
import { Button } from "./Button";

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

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-6">
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
          <Button onClick={handleCancel} disabled={loading} bgColor="red">
            {loading ? "Cancelling..." : "Cancel"}
          </Button>
        ) : isFull ? (
          <Button disabled bgColor="gray">
            Sold Out
          </Button>
        ) : (
          <Button onClick={handleReserve} disabled={loading} bgColor="blue">
            {loading ? "Reserving..." : "Reserve"}
          </Button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
    </div>
  );
}
