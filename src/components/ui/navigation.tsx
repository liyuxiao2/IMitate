"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import { Button } from "./button";
import { User, MessageCircle } from "lucide-react";

interface NavigationProps {
  user?: {
    username: string;
    email: string;
    rank: number;
    avgScore: number;
    streak: number;
  };
}

export default function Navigation({ user }: NavigationProps) {
  const [panelOpen, setPanelOpen] = useState(false);

  const navItems = ["Home", "Career", "Friends"];

  const router = useRouter();

  const handleRedirect = (name: string) => {
    router.push("/" + name);
  };
  return (
    <header className="p-4 flex justify-between items-center">
      <Link href="/" className="flex items-center space-x-2">
        <MessageCircle className="h-8 w-8 text-white" />
        <span className="text-2xl font-bold text-white">IMitate</span>
      </Link>
      <nav className="flex items-center space-x-4">
        <Link href="/chat">
          <Button variant="ghost" className="text-white hover:bg-white/20">
            Chat
          </Button>
        </Link>
        <Link href="/auth">
          <Button variant="ghost" className="text-white hover:bg-white/20">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
      </nav>
    </header>
  );
}
