import React from "react";
import { Sidebar } from "@/components/app/Sidebar";
import { DemoBar } from "@/components/app/DemoBar";
import { ChatWidget } from "@/components/app/ChatWidget";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#13231C] font-plus flex p-3 sm:p-4 lg:p-6 gap-6">
      {/* Canonical Sidebar from Sidebar_component.html */}
      <Sidebar />

      {/* Main Responsive Canvas */}
      <div className="flex-1 min-w-0 flex flex-col pb-20 lg:pb-6">
        <main className="flex-1 w-full max-w-[1240px]">
          {children}
        </main>
      </div>

      {/* Interactive Overlays */}
      <DemoBar />
      <ChatWidget />
    </div>
  );
}
