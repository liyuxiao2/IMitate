"use client";

import { useState } from "react";
import SocialScreen from "@/components/ui/social-screen";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";

export default function Page() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar 
        activePage="Social" 
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileSidebarClose}
      />
      <div className="flex-1 flex flex-col">
        <Header onMobileMenuToggle={handleMobileMenuToggle} />
        <SocialScreen />
      </div>
    </div>
  );
}
