"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import ConfirmModal from "../ConfirmModal";
import { Button } from "../Button";

interface Props {
  concert: any;
  onUpdate: () => void;
}

export default function AdminConcertCard({ concert, onUpdate }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const availableSeats = concert.totalSeats - concert._count.reservations;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.deleteConcert(concert.id);
      setShowModal(false);
      onUpdate();
      //toaster
    } catch (err) {
      //toaster
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          <Button bgColor="red" onClick={() => setShowModal(true)}>
            🗑 Delete
          </Button>
        </div>
      </div>

      {showModal && (
        <ConfirmModal
          title="Are you sure to delete?"
          message={concert.name}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
          loading={loading}
        />
      )}
    </>
  );
}
