"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="w-48 min-h-screen bg-white flex flex-col justify-between py-8 px-6 border-r border-gray-200 shrink-0">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-black">User</h2>
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <span>↻</span> Switch to Admin
        </button>
      </div>
      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">
        <span>→</span> Logout
      </button>
    </div>
  );
}
