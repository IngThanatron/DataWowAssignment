"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import { Button } from "../Button";

interface Props {
  onSuccess: () => void;
}

export default function CreateConcertForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    totalSeats: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.totalSeats) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      await api.createConcert({
        name: form.name,
        description: form.description,
        totalSeats: Number(form.totalSeats),
      });
      setForm({ name: "", description: "", totalSeats: "" });
      toast.success("Concert created!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to create concert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Create New Concert
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Concert Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="Enter concert name"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="Enter description"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Total Seats
          </label>
          <input
            type="number"
            value={form.totalSeats}
            onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="Enter total seats"
            min={1}
          />
        </div>
<Button onClick={handleSubmit} disabled={loading} bgColor="blue">
          {loading ? "Creating..." : "Create Concert"}
        </Button>
      </div>
    </div>
  );
}
