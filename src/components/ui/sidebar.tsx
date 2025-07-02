"use client";

import Link from "next/link";
import Image from "next/image";
import { Dumbbell, Users, History } from "lucide-react";
import { Button } from "./button";
import { supabase } from "@/lib/supabaseClient";

import { useRouter } from 'next/navigation'

interface SidebarProps {
  activePage?: "Practice" | "Social" | "History";
}

export default function Sidebar({ activePage }: SidebarProps) {
  const router =  useRouter();

  const navItems = [
    { name: "Practice", href: "/chat", icon: Dumbbell },
    { name: "Social", href: "/Social", icon: Users },
    { name: "History", href: "/History", icon: History },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: 'local' });
    router.push('/')
  }

  return (
    <div className="w-64 bg-mcmaster-maroon text-white flex-col shrink-0 hidden md:flex">
      {/* Logo */}
      <div className="p-6">
        <Link href="/Home">
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

      {/* Logout */}
      <div className="p-1">
        <Button className="bg-[#5d002e] w-20 h-10 font-bold" variant={"destructive"} onClick={handleLogout}> Logout </Button>
      </div>
    </div>
  );
}
