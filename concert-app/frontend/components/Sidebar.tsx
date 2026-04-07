"use client";

import { useRouter } from "next/navigation";
import cn from "classnames";

interface Props {
  role: "user" | "admin";
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Sidebar({ role, activeTab, onTabChange }: Props) {
  const router = useRouter();

  const isAdmin = role === "admin";

  const adminTabs = [
    { key: "overview", label: "Home", icon: "⌂" },
    { key: "history", label: "History", icon: "◷" },
    { key: "switch", label: "Switch to Admin", icon: "↻" },
  ];

  const userTabs = [{ key: "switch", label: "Switch to Admin", icon: "↻" }];

  // const tabButton = (tabKey: string, label: string, icon: string) => (
  //   <button
  //     onClick={() => onTabChange?.(tabKey)}
  //     className={`flex items-center gap-3 w-full px-3 py-2 rounded text-sm text-left transition-colors ${
  //       activeTab === tabKey
  //         ? "bg-gray-700 text-white"
  //         : isAdmin
  //           ? "text-gray-400 hover:text-white"
  //           : "text-gray-600 hover:text-black"
  //     }`}
  //   >
  //     <span>{icon}</span> {label}
  //   </button>
  // );

  const switchRole = () => {
    if (isAdmin) {
      router.push("/");
    } else {
      router.push("/admin");
    }
  };

  // const tab = () => {
  //   <button
  //     onClick={() => onTabChange?.("overview")}
  //     className={`flex items-center gap-3 w-full px-3 py-2 rounded text-sm text-left transition-colors ${
  //       activeTab === "overview" || activeTab === "create"
  //         ? "bg-gray-700 text-white"
  //         : "text-gray-400 hover:text-white"
  //     }`}
  //   >
  //     <span>⌂</span> Home
  //   </button>;
  // };

  return (
    <div
      className={cn(
        "w-fit md:w-48 h-dvh sticky top-0 flex flex-col justify-between py-8 px-2 shrink-0",
        {
          "bg-gray-900 border-0": isAdmin,
          "bg-white border-r border-gray-200": !isAdmin,
        },
      )}
    >
      <div className="space-y-6">
        <h2
          className={`text-2xl font-bold text-center md:text-left ${isAdmin ? "text-white" : "text-black"}`}
        >
          <span className="hidden md:inline">{isAdmin ? "Admin" : "User"}</span>
          <span className="md:hidden">{isAdmin ? "A" : "U"}</span>
        </h2>

        <nav className="flex flex-col space-y-2">
          {(isAdmin ? adminTabs : userTabs).map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                tab.key === "switch" ? switchRole() : onTabChange?.(tab.key)
              }
              className={cn(
                "flex items-center justify-center md:justify-start w-full px-3 py-2 rounded text-sm text-left transition-colors cursor-pointer",
                {
                  "bg-gray-700 text-white": activeTab === tab.key,
                  "text-gray-400 hover:text-white":
                    isAdmin && activeTab !== tab.key,
                  "text-gray-600 hover:text-black":
                    !isAdmin && activeTab !== tab.key,
                },
              )}
            >
              <span>{tab.icon}</span>{" "}
              <span className="hidden md:inline pl-2">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <button
        className={cn(
          "flex items-center gap-3 w-full px-3 py-2 rounded text-sm text-left transition-colors cursor-pointer",
          {
            "text-gray-400 hover:text-white": isAdmin,
            "text-gray-600 hover:text-black": !isAdmin,
          },
        )}
      >
        <span>→</span>
        <span className="hidden md:inline">Logout</span>
      </button>
    </div>
  );
}
