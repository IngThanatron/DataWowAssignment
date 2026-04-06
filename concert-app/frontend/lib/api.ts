const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  // Concerts
  getConcerts: async () => {
    const res = await fetch(`${API_URL}/concerts`);
    if (!res.ok) throw new Error("Failed to fetch concerts");
    return res.json();
  },

  getConcert: async (id: number) => {
    const res = await fetch(`${API_URL}/concerts/${id}`);
    if (!res.ok) throw new Error("Failed to fetch concert");
    return res.json();
  },

  createConcert: async (data: {
    name: string;
    description: string;
    totalSeats: number;
  }) => {
    const res = await fetch(`${API_URL}/concerts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create concert");
    return res.json();
  },

  deleteConcert: async (id: number) => {
    const res = await fetch(`${API_URL}/concerts/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete concert");
    return res.json();
  },

  // Users
  getUsers: async () => {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  createUser: async (data: { name: string; email: string }) => {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },

  // Reservations
  getReservations: async () => {
    const res = await fetch(`${API_URL}/reservations`);
    if (!res.ok) throw new Error("Failed to fetch reservations");
    return res.json();
  },

  getMyReservations: async (userId: number) => {
    const res = await fetch(`${API_URL}/reservations/my?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch reservations");
    return res.json();
  },

  createReservation: async (data: { userId: number; concertId: number }) => {
    const res = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
    return res.json();
  },

  cancelReservation: async (id: number) => {
    const res = await fetch(`${API_URL}/reservations/${id}/cancel`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to cancel reservation");
    return res.json();
  },
};
