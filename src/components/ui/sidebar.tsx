"use client";

import Link from "next/link";
import Image from "next/image";
import { Dumbbell, Users, History } from "lucide-react";

interface SidebarProps {
  activePage?: "Practice" | "Social" | "History";
}

export default function Sidebar({ activePage }: SidebarProps) {
  const navItems = [
    { name: "Practice", href: "/chat", icon: Dumbbell },
    { name: "Social", href: "/Career", icon: Users },
    { name: "History", href: "/History", icon: History },
  ];

  return (
    <div className="w-64 bg-mcmaster-maroon text-white flex-col shrink-0 hidden md:flex">
      {/* Logo */}
      <div className="p-6">
        <Link href="/">
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
            <Link href={item.href} key={item.name}>
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
  );
}
