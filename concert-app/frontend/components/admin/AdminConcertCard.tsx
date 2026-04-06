"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import ConfirmModal from "../ConfirmModal";
import Toast from "../Toast";

interface Props {
  concert: any;
  onUpdate: () => void;
}

export default function AdminConcertCard({ concert, onUpdate }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const availableSeats = concert.totalSeats - concert._count.reservations;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.deleteConcert(concert.id);
      setShowModal(false);
      setToast({
        message: `"${concert.name}" deleted successfully`,
        type: "success",
      });
      onUpdate();
    } catch (err) {
      setToast({ message: "Failed to delete concert", type: "error" });
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
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded text-sm font-medium transition-colors"
          >
            🗑 Delete
          </button>
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

      {true && (
        <Toast
          message={toast && toast.message}
          type={toast && toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
