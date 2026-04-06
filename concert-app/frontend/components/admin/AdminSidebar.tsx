"use client";

import { useRouter } from "next/navigation";

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: Props) {
  const router = useRouter();

  return (
    <div className="w-48 min-h-screen bg-gray-900 flex flex-col justify-between py-8 px-6 shrink-0">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Admin</h2>
        <nav className="space-y-1">
          <button
            onClick={() => onTabChange("overview")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded text-sm text-left transition-colors ${
              activeTab === "overview" || activeTab === "create"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>⌂</span> Home
          </button>
          <button
            onClick={() => onTabChange("history")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded text-sm text-left transition-colors ${
              activeTab === "history"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>◷</span> History
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3 w-full px-3 py-2 rounded text-sm text-left text-gray-400 hover:text-white transition-colors"
          >
            <span>↻</span> Switch to user
          </button>
        </nav>
      </div>
      <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <span>→</span> Logout
      </button>
    </div>
  );
}
