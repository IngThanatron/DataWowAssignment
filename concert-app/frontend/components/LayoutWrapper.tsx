"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Sidebar from "./Sidebar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Toaster position="bottom-right" />
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster position="bottom-right" />
      <Sidebar role="user" />
      <div className="flex-1 p-10">{children}</div>
    </div>
  );
}
