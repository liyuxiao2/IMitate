"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import Header from "./header";
import { supabase } from "@/lib/supabaseClient";

interface LeaderboardUser {
  username: string;
  total_score: number;
  profile_picture_url?: string;
}

export default function SocialScreen() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch the latest leaderboard data
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("username, total_score, profile_picture_url")
          .order("total_score", { ascending: false });

        if (error) {
          throw error;
        }
        if (data) {
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    // Perform the initial fetch and set loading state
    const init = async () => {
      setLoading(true);
      await fetchLeaderboard();
      setLoading(false);
    };

    init();

    // Subscribe to realtime updates on the 'users' table
    const channel = supabase
      .channel("public:users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          console.log("Change received!", payload);
          fetchLeaderboard(); // Refetch data when a change occurs
        },
      )
      .subscribe();

    // Cleanup subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading Leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <Header />

      {/* Content Area */}
      <div className="flex-1 p-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold text-[#5d002e] mb-2">Social</h1>
          <p className="text-xl text-gray-600 mb-12">
            Monthly Global Leaderboard
          </p>

          {/* Top 3 Users */}
          <div className="flex justify-center items-end gap-8 mb-16 h-80">
            {/* 2nd Place */}
            {top3.length > 1 && (
              <div className="flex flex-col items-center justify-center text-center">
                <Avatar className="w-32 h-32 border-8 border-gray-400">
                  <AvatarImage src={top3[1].profile_picture_url} />
                  <AvatarFallback>
                    <User className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 bg-[#7a003c] text-white rounded-full px-6 py-3">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold">2</span>
                    <div>
                      <div className="font-semibold text-lg">
                        {top3[1].username}
                      </div>
                      <div className="text-white/80 italic">
                        {top3[1].total_score.toLocaleString()} Points
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* 1st Place */}
            {top3.length > 0 && (
              <div className="text-center">
                <Avatar className="w-40 h-40 border-8 border-yellow-400">
                  <AvatarImage src={top3[0].profile_picture_url} />
                  <AvatarFallback>
                    <User className="w-20 h-20" />
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 bg-[#7a003c] text-white rounded-full px-6 py-3">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold">1</span>
                    <div>
                      <div className="font-semibold text-xl">
                        {top3[0].username}
                      </div>
                      <div className="text-white/80 italic">
                        {top3[0].total_score.toLocaleString()} Points
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* 3rd Place */}
            {top3.length > 2 && (
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-32 h-32 border-8 border-yellow-600">
                  <AvatarImage src={top3[2].profile_picture_url} />
                  <AvatarFallback>
                    <User className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 bg-[#7a003c] text-white rounded-full px-6 py-3">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold">3</span>
                    <div>
                      <div className="font-semibold text-lg">
                        {top3[2].username}
                      </div>
                      <div className="text-white/80 italic">
                        {top3[2].total_score.toLocaleString()} Points
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard Table */}
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 px-6 py-3 text-gray-600 font-medium text-lg">
              <div>User</div>
              <div className="text-center">Rank</div>
              <div className="text-right">Total Points</div>
            </div>

            {/* Leaderboard Rows */}
            {rest.map((user, index) => (
              <div
                key={user.username}
                className="bg-gray-300 rounded-full px-6 py-4 grid grid-cols-3 gap-4 items-center"
              >
                <div className="text-gray-800 font-medium flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.profile_picture_url} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  {user.username}
                </div>
                <div className="text-center text-gray-700 font-semibold">
                  {index + 4}
                </div>
                <div className="text-right text-gray-600 italic">
                  {user.total_score.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
