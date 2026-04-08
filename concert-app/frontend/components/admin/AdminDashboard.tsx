"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import StatCard from "./StatCard";
import AdminConcertCard from "./AdminConcertCard";
import CreateConcertForm from "./CreateConcertForm";
import Sidebar from "../Sidebar";

export default function AdminDashboard() {
  const [concerts, setConcerts] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [concertsData, reservationsData] = await Promise.all([
        api.getConcerts(),
        api.getReservations(),
      ]);
      setConcerts(concertsData);
      setReservations(reservationsData);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalSeats = concerts.reduce((sum, c) => sum + c.totalSeats, 0);
  const totalReserved = reservations.filter(
    (r) => r.status === "ACTIVE",
  ).length;
  const totalCancelled = reservations.filter(
    (r) => r.status === "CANCELLED",
  ).length;

  const hometab = [
    { label: "Overview", value: "overview" },
    { label: "Create", value: "create" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role="admin" activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 p-10">
        {/* Stat Cards */}
        <div className="flex flex-col sm:flex-row  gap-4 mb-8">
          <StatCard
            icon="👤"
            label="Total of seats"
            value={totalSeats}
            color="blue"
          />
          <StatCard
            icon="🎫"
            label="Reserve"
            value={totalReserved}
            color="green"
          />
          <StatCard
            icon="✕"
            label="Cancel"
            value={totalCancelled}
            color="red"
          />
        </div>

        {/* Tabs */}
        {activeTab !== "history" && (
          <div className="flex gap-6 border-b border-gray-300 mb-6">
            {hometab.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`pb-2 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab.value
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : activeTab === "overview" ? (
          <div className="space-y-4">
            {concerts.map((concert) => (
              <AdminConcertCard
                key={concert.id}
                concert={concert}
                onUpdate={fetchData}
              />
            ))}
          </div>
        ) : activeTab === "create" ? (
          <CreateConcertForm
            onSuccess={() => {
              fetchData();
              setActiveTab("overview");
            }}
          />
        ) : activeTab === "history" ? (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Reservation History
            </h3>
            {reservations.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{r.concert?.name}</p>
                  <p className="text-sm text-gray-500">
                    {r.user?.name} — {r.user?.email}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    r.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
