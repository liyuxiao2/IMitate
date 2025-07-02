"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { User, Menu } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./button";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.access_token) {
          // Get user profile data
          const { data: profileData } = await supabase
            .from("users")
            .select("profile_picture_url")
            .eq("id", session.user.id)
            .single();

          if (profileData?.profile_picture_url) {
            setProfilePictureUrl(profileData.profile_picture_url);
          }
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
  }, []);

  return (
    <div className={`bg-mcmaster-maroon px-8 py-4 flex items-center ${onMobileMenuToggle ? 'justify-between' : 'justify-end'}`}>
      {/* Hamburger Menu Button - Only visible on mobile when onMobileMenuToggle is provided */}
      {onMobileMenuToggle && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="md:hidden text-white hover:bg-white/20"
        >
          <Menu className="w-10 h-10 text-white" />
        </Button>
      )}

      {/* Spacer for desktop - keeps profile on the right when hamburger is present */}
      {onMobileMenuToggle && <div className="hidden md:block" />}

      {/* Profile Avatar */}
      <Link href="/Profile">
        <Avatar className="w-10 h-10 cursor-pointer hover:scale-105 transition-transform">
          <AvatarImage src={profilePictureUrl || undefined} />
          <AvatarFallback className="bg-gray-300 text-gray-600">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}
