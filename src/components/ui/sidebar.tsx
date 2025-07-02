"use client";

import Link from "next/link";
import Image from "next/image";
import { Dumbbell, Users, History } from "lucide-react";
import { Button } from "./button";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from "react";

interface SidebarProps {
  activePage?: "Practice" | "Social" | "History";
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ activePage, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Practice", href: "/chat", icon: Dumbbell },
    { name: "Social", href: "/Social", icon: Users },
    { name: "History", href: "/History", icon: History },
  ];



  // Handle click outside to close mobile sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        onMobileClose
      ) {
        onMobileClose();
      }
    };

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when mobile sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen, onMobileClose]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          w-64 bg-mcmaster-maroon text-white flex-col shrink-0 
          ${/* Desktop - always visible */ ''}
          md:flex 
          ${/* Mobile - hidden by default */ ''}
          ${isMobileOpen ? 'flex' : 'hidden'} 
          ${/* Mobile - fixed position overlay */ ''}
          md:relative fixed inset-y-0 left-0 z-50
        `}
      >
        {/* Logo */}
        <div className="p-6">
          <Link href="/Home" onClick={onMobileClose}>
            <Image
              src="/IMlogo.png"
              alt="IMitate Logo"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link href={item.href} key={item.name} onClick={onMobileClose}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${
                    activePage === item.name
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </nav>

        
      </div>
    </>
  );
}
