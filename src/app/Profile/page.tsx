'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Edit } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";

import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    full_name: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) return;

      const res = await fetch("http://localhost:8000/getProfile", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const user = await res.json();
      console.log("Fetched user from backend:", user);

      // Now call Supabase to get the full profile from `users` table
      const { data: profileData } = await supabase
        .from("users")
        .select("full_name, username, email")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 flex">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl font-bold text-mcmaster-maroon mb-16">
              Profile
            </h1>

            <div className="grid grid-cols-3 gap-x-24 items-start">
              {/* Form Section */}
              <div className="col-span-2 space-y-12">
                {/* Display Name */}
                <div className="space-y-3">
                  <Label className="text-xl font-medium text-mcmaster-maroon">
                    Display Name
                  </Label>
                  <div className="relative">
                    <Input
                      defaultValue={profile.username}
                      className="bg-gray-300 border-0 text-gray-800 text-xl py-4 pr-14 rounded-full w-full"
                      readOnly
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 h-10 w-10"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-3">
                  <Label className="text-xl font-medium text-mcmaster-maroon">
                    Username
                  </Label>
                  <div className="relative">
                    <Input
                      value={profile.full_name}
                      className="bg-gray-300 border-0 text-gray-800 text-xl py-4 pr-14 rounded-full w-full"
                      readOnly
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 h-10 w-10"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <Label className="text-xl font-medium text-mcmaster-maroon">
                    E-Mail
                  </Label>
                  <div className="relative">
                    <Input
                      value={profile.email}
                      className="bg-gray-300 border-0 text-gray-800 text-xl py-4 pr-14 rounded-full w-full"
                      readOnly
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 h-10 w-10"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Profile Picture Section */}
              <div className="col-span-1 flex flex-col items-center justify-start space-y-8 pt-4">
                <div className="relative">
                  <div className="w-60 h-60 rounded-full border-8 border-mcmaster-maroon bg-gray-300 flex items-center justify-center overflow-hidden">
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="bg-gray-400 text-gray-600">
                        <User className="w-28 h-28" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <Button className="bg-mcmaster-maroon hover:bg-mcmaster-light text-white px-10 py-4 rounded-full text-lg font-semibold">
                  CHANGE PHOTO
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
