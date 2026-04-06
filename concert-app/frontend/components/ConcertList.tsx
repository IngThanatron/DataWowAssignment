"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import ConcertCard from "./ConcertCard";

const CURRENT_USER_ID = 1;

export default function ConcertList() {
  const [concerts, setConcerts] = useState<any[]>([]);
  const [myReservations, setMyReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [concertsData, reservationsData] = await Promise.all([
        api.getConcerts(),
        api.getMyReservations(CURRENT_USER_ID),
      ]);
      setConcerts(concertsData);
      setMyReservations(reservationsData);
    } catch (err) {
      setError("Failed to load concerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getMyReservation = (concertId: number) => {
    return myReservations.find(
      (r) => r.concertId === concertId && r.status === "ACTIVE",
    );
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <div className="space-y-4 max-w-4xl">
      {concerts.map((concert) => (
        <ConcertCard
          key={concert.id}
          concert={concert}
          reservation={getMyReservation(concert.id)}
          userId={CURRENT_USER_ID}
          onUpdate={fetchData}
        />
      ))}
    </div>
  );
}
