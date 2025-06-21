"use client"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Dumbbell, Users, History } from "lucide-react"
import Link from "next/link"

interface LeaderboardUser {
  rank: number;
  username: string;
  points: number;
}

export default function SocialScreen() {
  // TODO: Add hook to fetch top 3 users from leaderboard API
  // const { data: topUsers, loading: topUsersLoading } = useTopUsers()
  const topUsers: LeaderboardUser[] = []

  // TODO: Add hook to fetch leaderboard data from API
  // const { data: leaderboardUsers, loading: leaderboardLoading } = useLeaderboard()
  const leaderboardUsers: LeaderboardUser[] = []

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <div className="w-64 bg-[#7A003C] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link href="/">
            <img src="/IMlogo.png" alt="IMitate Logo" className="h-8 w-auto" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-2">
            <Link href="/chat">
              <div className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer">
                <Dumbbell className="w-5 h-5" />
                <span>Practice</span>
              </div>
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/20 text-white rounded-lg">
              <Users className="w-5 h-5" />
              <span>Social</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer">
              <History className="w-5 h-5" />
              <span>History</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#7A003C] px-8 py-4 flex justify-end">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-gray-300 text-gray-600">
              <Users className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {/* Title and Search */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-6xl font-bold text-mcmaster-maroon mb-2">Social</h1>
              <p className="text-xl text-gray-600">Monthly Leaderboard (May 2025)</p>
            </div>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
              <Input
                placeholder="Search Name..."
                className="bg-mcmaster-maroon border-mcmaster-maroon text-white placeholder:text-white/70 pl-10 rounded-full"
                // TODO: Add onChange handler to filter leaderboard data
              />
            </div>
          </div>

          {/* Top 3 Users */}
          <div className="flex gap-6 mb-8">
            {topUsers.length > 0 ? (
              topUsers.map((user) => (
                <div
                  key={user.rank}
                  className="bg-mcmaster-maroon text-white px-8 py-4 rounded-full flex items-center gap-4 min-w-fit"
                >
                  <span className="text-4xl font-bold">{user.rank}</span>
                  <div>
                    <div className="font-semibold text-lg">{user.username}</div>
                    <div className="text-white/80 italic">{user.points.toLocaleString()} Points</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">No top users data available</div>
            )}
          </div>

          {/* Leaderboard Table */}
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 px-6 py-3 text-gray-600 font-medium">
              <div>Username</div>
              <div className="text-center">Rank</div>
              <div className="text-right">Total Points</div>
            </div>

            {/* Leaderboard Rows */}
            {leaderboardUsers.length > 0 ? (
              leaderboardUsers.map((user) => (
                <div key={user.rank} className="bg-gray-300 rounded-full px-6 py-4 grid grid-cols-3 gap-4 items-center">
                  <div className="text-gray-700">{user.username}</div>
                  <div className="text-center text-gray-700">{user.rank}</div>
                  <div className="text-right text-gray-500 italic">{user.points.toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 italic">No leaderboard data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

